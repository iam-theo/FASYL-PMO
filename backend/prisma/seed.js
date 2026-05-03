import pkg from '@prisma/client';
import bcrypt from 'bcrypt';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("123456", 10);

    await prisma.user.createMany({
        data: [
        {
            email: "admin@test.com",
            password,
            fullName: "Admin User",
            role: "ADMIN"
        }
        ]
    });

    console.log("✅ Seeded successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });