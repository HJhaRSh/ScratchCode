import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    const expectedLevel = u.xp >= 5000 ? 4 : u.xp >= 2000 ? 3 : u.xp >= 500 ? 2 : 1;
    if (u.level !== expectedLevel) {
      await prisma.user.update({
        where: { id: u.id },
        data: { level: expectedLevel }
      });
      console.log(`Updated ${u.username} from level ${u.level} to level ${expectedLevel}`);
    }
  }
  console.log('Done');
}

main().catch(console.error).finally(() => prisma.$disconnect());
