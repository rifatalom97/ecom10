const jwt = require('jsonwebtoken');

function generateToken(userId, secretKey) {
  const payload = { userId };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secretKey, options);
}

module.exports = generateToken;