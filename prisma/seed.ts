import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Проверяем, есть ли уже админ
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'developer@biveki.ru' },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  // Создаем первого админа
  const admin = await prisma.user.create({
    data: {
      email: 'developer@biveki.ru',
      role: UserRole.ADMIN,
      name: 'Admin',
      isActive: true,
    },
  });

  console.log('✅ Created admin user:', admin.email);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
