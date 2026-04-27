const jwt = require("jsonwebtoken");

//Generate access token after passing in user details
exports.generateAccessToken = (user) => {
    return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

//Generate refresh token after passing in user details
exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user.id},
        process.env.JWT_REFRESH_TOKEN,
        {expiresIn: '7d'}
    )
}


//Verify access token by passing in generated token
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

//verify refresh token
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};