const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

//Hash password
exports.hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

//Verify if plaintext password is similar to hashed password
exports.comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};