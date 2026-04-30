import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { hashPassword, comparePassword } from '../../utils/password.js';

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '../../utils/jwt.js';

export const login = async({email, password}) => {
    const user = await prisma.user.findUnique({where: {email}});
    if(!user) throw new Error("Invalid credentials");

    const validPassword = await comparePassword(password, user.password);
    if(!validPassword) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.upsert({
        where: {
            userId: user.id
        },
        update: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        create: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
});
    
    return {accessToken, refreshToken};
};

export const refresh = async(token) => {
    if(!token) throw new Error("No token");

    const stored = await prisma.refreshToken.findUnique({
        where: {token}
    });

    if(!stored) throw new Error("Invalid token");

    const decoded = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({
        where: {id: decoded.id}
    })

    if(!user) throw new Error("User not found");

    const newAccessToken = generateAccessToken(user);

    return({accessToken: newAccessToken});
};

export const logout = async(token) => {
    await prisma.refreshToken.deleteMany({
        where: {token}
    });

    return {message: "Logged Out"};
};