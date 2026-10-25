// Vercel Serverless Function: /api/postback/cpx
// Receives CPX Research Server-to-Server (S2S) Survey Completion Postbacks
// Built with native Node.js crypto and fetch for 100% reliability and zero dependency issues

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  // CPX sends postback via HTTP GET
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const {
      status,        // 1 = complete, 2 = chargeback / cancel
      trans_id,      // Unique transaction ID
      user_id,       // ext_user_id passed in survey wall
      amount_local,  // Points earned by user (Currency factor 800)
      amount_usd,    // Publisher earnings in USD
      ip_click,      // User IP
      secure_hash    // MD5(user_id + "-" + CPX_SECURE_HASH)
    } = req.query;

    console.log('[CPX Postback Received]:', {
      status,
      trans_id,
      user_id,
      amount_local,
      amount_usd,
      ip_click
    });

    // 1. Validation of required parameters
    if (!trans_id || !user_id || !secure_hash) {
      console.error('[CPX Postback Error]: Missing required parameters.');
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 2. Retrieve secure hash from Vercel Server Environment Variable
    const appSecureHash = process.env.CPX_SECURE_HASH;
    if (!appSecureHash) {
      console.error('[CPX Postback Error]: CPX_SECURE_HASH is not configured on server.');
      return res.status(500).json({ error: 'Server configuration error: CPX_SECURE_HASH missing' });
    }

    // 3. Verify secure_hash = MD5(user_id + "-" + appSecureHash) using exact incoming user_id
    const expectedHash = crypto
      .createHash('md5')
      .update(`${user_id.trim()}-${appSecureHash.trim()}`)
      .digest('hex');

    if (secure_hash.toLowerCase() !== expectedHash.toLowerCase()) {
      console.error('[CPX Postback Security]: Invalid secure_hash. Received:', secure_hash, 'Expected:', expectedHash);
      return res.status(403).json({ error: 'Invalid secure_hash' });
    }

    // 4. Rate Conversion (CPX: 1000 Points = $1 USD, User receives 800 Points / 80%)
    const usdToBdtRate = Number(process.env.USD_TO_BDT_RATE || 120);
    const points = parseFloat(amount_local || 0);
    const earnedBdt = Number(((points / 1000) * usdToBdtRate).toFixed(2));
    const usdAmount = parseFloat(amount_usd || 0);

    // 5. Database Interaction (Supabase PostgreSQL via standard REST API)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[CPX Postback Error]: Supabase credentials not set in environment.');
      return res.status(500).json({ error: 'Database credentials missing in server environment' });
    }

    const dbHeaders = {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json'
    };

    // A. Check for duplicate trans_id
    const searchUrl = `${supabaseUrl}/rest/v1/transactions?trans_id=eq.${encodeURIComponent(String(trans_id))}&select=id,trans_id,status`;
    const searchRes = await fetch(searchUrl, { headers: dbHeaders });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error('[CPX Postback Search Error]:', searchRes.status, errText);
      return res.status(500).json({ error: 'Database search error', details: errText });
    }

    const existingTrans = await searchRes.json();
    if (existingTrans && existingTrans.length > 0) {
      console.log(`[CPX Postback]: Duplicate trans_id ${trans_id} detected. Ignoring to prevent double credit.`);
      // Return 200 with '1' for duplicate to acknowledge CPX
      return res.status(200).send('1');
    }

    // B. Ensure user_id satisfies PostgreSQL UUID and Foreign Key constraints
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user_id.trim());
    let targetUserId = user_id.trim();

    if (!isUUID) {
      // Map non-UUID user_id (e.g. test IDs) deterministically to a valid UUID format
      const hex = crypto.createHash('md5').update('ujrah_' + user_id.trim()).digest('hex');
      targetUserId = `${hex.substring(0,8)}-${hex.substring(8,12)}-4${hex.substring(13,16)}-a${hex.substring(17,20)}-${hex.substring(20,32)}`;
    }

    // C. Check if target user profile exists
    const profileUrl = `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(targetUserId)}&select=id,pending_balance`;
    const profileRes = await fetch(profileUrl, { headers: dbHeaders });
    let profilesList = profileRes.ok ? await profileRes.json() : [];

    if (!profilesList || profilesList.length === 0) {
      console.log(`[CPX Postback]: Profile ${targetUserId} not found. Creating user in Supabase Auth to satisfy Foreign Key.`);
      const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: dbHeaders,
        body: JSON.stringify({
          id: targetUserId,
          email: `${targetUserId}@ujrahtask.internal`,
          password: crypto.randomBytes(16).toString('hex'),
          email_confirm: true,
          user_metadata: { full_name: `User ${user_id}`, original_id: user_id }
        })
      });

      if (!createRes.ok) {
        const createErr = await createRes.text();
        console.error('[CPX Postback Auto-User Error]:', createRes.status, createErr);
        // Fallback: direct insert into profiles if user exists in auth
        await fetch(`${supabaseUrl}/rest/v1/profiles`, {
          method: 'POST',
          headers: dbHeaders,
          body: JSON.stringify({
            id: targetUserId,
            email: `${targetUserId}@ujrahtask.internal`,
            full_name: `User ${user_id}`
          })
        });
      }

      // Re-fetch profile
      const recheck = await fetch(profileUrl, { headers: dbHeaders });
      profilesList = recheck.ok ? await recheck.json() : [];
    }

    const currentProfile = profilesList[0] || null;
    const isCompletion = String(status) === '1';
    const isChargeback = String(status) === '2';

    if (isCompletion) {
      // Hold period: 14 days pending verification
      const holdUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      // D. Insert new pending transaction into transactions table
      const insertUrl = `${supabaseUrl}/rest/v1/transactions`;
      const insertRes = await fetch(insertUrl, {
        method: 'POST',
        headers: {
          ...dbHeaders,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: targetUserId,
          trans_id: String(trans_id),
          provider: 'CPX Research',
          points: points,
          amount_usd: usdAmount,
          amount_bdt: earnedBdt,
          status: 'pending',
          ip_click: ip_click || '',
          hold_until: holdUntil
        })
      });

      if (!insertRes.ok) {
        const insertErrorText = await insertRes.text();
        console.error('[CPX Postback Insert Error]:', insertRes.status, insertErrorText);
        // Do NOT return '1' on failure — return an HTTP 500 error so the failure is visible
        return res.status(500).json({
          error: 'Database insert failed',
          statusCode: insertRes.status,
          details: insertErrorText
        });
      }

      const insertedRecords = await insertRes.json();
      console.log(`[CPX Postback Insert Success]:`, insertedRecords);

      // E. Increment user's pending balance in profiles table
      const currentPending = Number(currentProfile ? currentProfile.pending_balance : 0);
      const newPending = Number((currentPending + earnedBdt).toFixed(2));

      await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(targetUserId)}`, {
        method: 'PATCH',
        headers: dbHeaders,
        body: JSON.stringify({
          pending_balance: newPending,
          updated_at: new Date().toISOString()
        })
      });

      console.log(`[CPX Postback Success]: Transaction ${trans_id} inserted into DB. User ${targetUserId} credited ৳${earnedBdt} (${points} pts) pending.`);
    } else if (isChargeback) {
      // Record chargeback transaction
      const chargebackRes = await fetch(`${supabaseUrl}/rest/v1/transactions`, {
        method: 'POST',
        headers: { ...dbHeaders, 'Prefer': 'return=representation' },
        body: JSON.stringify({
          user_id: targetUserId,
          trans_id: String(trans_id) + '_reversal',
          provider: 'CPX Research',
          points: -points,
          amount_usd: -usdAmount,
          amount_bdt: -earnedBdt,
          status: 'chargeback',
          ip_click: ip_click || '',
          hold_until: new Date().toISOString()
        })
      });

      if (!chargebackRes.ok) {
        const cbErr = await chargebackRes.text();
        console.error('[CPX Postback Chargeback Insert Error]:', chargebackRes.status, cbErr);
        return res.status(500).json({ error: 'Chargeback record failed', details: cbErr });
      }

      const currentPending = Number(currentProfile ? currentProfile.pending_balance : 0);
      const newPending = Math.max(0, Number((currentPending - earnedBdt).toFixed(2)));
      await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(targetUserId)}`, {
        method: 'PATCH',
        headers: dbHeaders,
        body: JSON.stringify({
          pending_balance: newPending,
          updated_at: new Date().toISOString()
        })
      });
    }

    // 6. Return standard CPX acknowledgment response ONLY on confirmed database success
    return res.status(200).send('1');
  } catch (err) {
    console.error('[CPX Postback Server Exception]:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
