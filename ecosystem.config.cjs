module.exports = {
  apps: [
    {
      name: "fasyl-api",
      script: "backend/server.js",
      cwd: "/var/www/html/sflbk",
      env: {
        NODE_ENV: "production",
        PORT: 5000,

        DATABASE_URL: "postgresql://fasyl_user:password@localhost:5432/fasyl_db",

        BASE_URL: "https://sflbk.com/api",
        CLIENT_URL: "https://sflbk.com",

        JWT_SECRET: "your_super_secure_jwt_secret_here",
        JWT_REFRESH_SECRET: "your_super_secure_refresh_secret_here",
        JWT_EXPIRES_IN: "1d",
        JWT_REFRESH_EXPIRES_IN: "7d"
      }
    }
  ]
};