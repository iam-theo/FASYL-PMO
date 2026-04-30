import jwt from "jsonwebtoken";

//Generate access token after passing in user details
export const generateAccessToken = (user) => {
    return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

//Generate refresh token after passing in user details
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user.id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: '7d'}
    )
}


//Verify access token by passing in generated token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

//verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};