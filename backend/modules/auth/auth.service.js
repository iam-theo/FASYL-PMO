const { PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const {hasPassword, comparePassword} = require('../../utils/password');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../../utils/jwt');

exports.login = async({email, password}) => {
    const user = await prisma.user.findUnique({where: {email}});
    if(!user) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };
    });
    
    return {accessToken, refreshToken};
};

exports.refresh = async(token) => {
    if(!token) throw new Error("No token");

    const stored = await prisma.refreshToken.findUnique({
        where: {token}
    });

    if(!stored) throw new Error("Invalid token");

    const decoded = verifyRefreshToken(token);

    const newAccessToken = generateAccessToken({
        id: decoded.id,
        role: decoded.role
    });

    return({accessToken: newAccessToken});
}

exports.logout = async(token) => {
    await prisma.refreshToken.delete({
        where: {token}
    });

    return {message: "Logged Out"};
}