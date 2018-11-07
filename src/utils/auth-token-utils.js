const jwt = require('jsonwebtoken');

const encodeToken = payload => jwt.sign(payload, 'shhhhh');

const decodeToken = token => {
  try {
    return jwt.verify(token, 'shhhhh');
  } catch(err) {
    return null;
  }
}

module.exports = { encodeToken, decodeToken };