// Vercel Serverless Function: /api/postback/cpx
// Receives CPX Research Server-to-Server (S2S) Survey Completion Postbacks

const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // CPX sends postback via HTTP GET
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const {
      status,        // 1 = complete, 2 = chargeback / cancel
      trans_id,      // Unique transaction ID
      user_id,       // ext_user_id (User UUID)
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
      return res.status(400).send('Missing required parameters');
    }

    // 2. Retrieve secure hash from Vercel Server Environment Variable
    const appSecureHash = process.env.CPX_SECURE_HASH;
    if (!appSecureHash) {
      console.error('[CPX Postback Error]: CPX_SECURE_HASH is not configured on server.');
      return res.status(500).send('Server configuration error: CPX_SECURE_HASH missing');
    }

    // 3. Verify secure_hash = MD5(user_id + "-" + appSecureHash)
    const expectedHash = crypto
      .createHash('md5')
      .update(`${user_id}-${appSecureHash}`)
      .digest('hex');

    if (secure_hash.toLowerCase() !== expectedHash.toLowerCase()) {
      console.error('[CPX Postback Security]: Invalid secure_hash. Received:', secure_hash, 'Expected:', expectedHash);
      return res.status(403).send('Invalid secure_hash');
    }

    // 4. Rate Conversion (CPX: 1000 Points = $1 USD, User receives 800 Points / 80%)
    const usdToBdtRate = Number(process.env.USD_TO_BDT_RATE || 120);
    const points = parseFloat(amount_local || 0);
    const earnedBdt = Number(((points / 1000) * usdToBdtRate).toFixed(2));
    const usdAmount = parseFloat(amount_usd || 0);

    // 5. Database Interaction (Supabase PostgreSQL)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Check for duplicate trans_id
      const { data: existingTrans, error: searchError } = await supabase
        .from('transactions')
        .select('id, status')
        .eq('trans_id', String(trans_id))
        .single();

      if (existingTrans) {
        console.log(`[CPX Postback]: Duplicate trans_id ${trans_id} detected. Ignoring to prevent double credit.`);
        // CPX expects '1' so it doesn't repeatedly retry
        return res.status(200).send('1');
      }

      const isCompletion = String(status) === '1';
      const isChargeback = String(status) === '2';

      if (isCompletion) {
        // Hold period: 14 days pending verification
        const holdUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

        // Insert new pending transaction
        const { error: insertError } = await supabase
          .from('transactions')
          .insert({
            user_id: user_id,
            trans_id: String(trans_id),
            provider: 'CPX Research',
            points: points,
            amount_usd: usdAmount,
            amount_bdt: earnedBdt,
            status: 'pending',
            ip_click: ip_click || '',
            hold_until: holdUntil
          });

        if (insertError) {
          console.error('[CPX Postback Error]: Failed to insert transaction:', insertError);
        } else {
          // Increment user's pending balance
          const { data: profile } = await supabase
            .from('profiles')
            .select('pending_balance')
            .eq('id', user_id)
            .single();

          const currentPending = Number(profile ? profile.pending_balance : 0);
          await supabase
            .from('profiles')
            .update({
              pending_balance: Number((currentPending + earnedBdt).toFixed(2)),
              updated_at: new Date().toISOString()
            })
            .eq('id', user_id);

          console.log(`[CPX Postback Success]: User ${user_id} credited ৳${earnedBdt} (${points} pts) as Pending for 14 days.`);
        }
      } else if (isChargeback) {
        // Record chargeback and deduct pending balance if needed
        await supabase
          .from('transactions')
          .insert({
            user_id: user_id,
            trans_id: String(trans_id) + '_reversal',
            provider: 'CPX Research',
            points: -points,
            amount_usd: -usdAmount,
            amount_bdt: -earnedBdt,
            status: 'chargeback',
            ip_click: ip_click || '',
            hold_until: new Date().toISOString()
          });

        const { data: profile } = await supabase
          .from('profiles')
          .select('pending_balance')
          .eq('id', user_id)
          .single();

        if (profile) {
          const newPending = Math.max(0, Number((Number(profile.pending_balance) - earnedBdt).toFixed(2)));
          await supabase
            .from('profiles')
            .update({
              pending_balance: newPending,
              updated_at: new Date().toISOString()
            })
            .eq('id', user_id);
        }
      }
    } else {
      console.warn('[CPX Postback Note]: Hash verified successfully, but SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not yet set. Add them to Vercel environment to persist balances.');
    }

    // 6. Return standard CPX acknowledgment response
    // CPX documentation requires returning HTTP 200 with '1'
    return res.status(200).send('1');
  } catch (err) {
    console.error('[CPX Postback Server Exception]:', err);
    return res.status(500).send('Internal Server Error');
  }
};
