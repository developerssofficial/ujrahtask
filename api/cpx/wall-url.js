// Vercel Serverless Function: /api/cpx/wall-url
// Generates the secure CPX survey wall iframe URL without exposing CPX_SECURE_HASH

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid user_id parameter. User must be authenticated.'
      });
    }

    const appSecureHash = process.env.CPX_SECURE_HASH;
    if (!appSecureHash) {
      return res.status(500).json({
        success: false,
        error: 'CPX_SECURE_HASH is not configured in Vercel environment variables.'
      });
    }

    const cpxAppId = process.env.CPX_APP_ID || '37638';

    // Generate MD5(user_id + "-" + CPX_SECURE_HASH) securely on the server
    const secureHash = crypto
      .createHash('md5')
      .update(`${user_id.trim()}-${appSecureHash.trim()}`)
      .digest('hex');

    const wallUrl = `https://offers.cpx-research.com/index.php?app_id=${encodeURIComponent(cpxAppId)}&ext_user_id=${encodeURIComponent(user_id.trim())}&secure_hash=${secureHash}`;

    return res.status(200).json({
      success: true,
      url: wallUrl,
      app_id: cpxAppId
    });
  } catch (err) {
    console.error('[CPX Wall URL Exception]:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
