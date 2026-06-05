import { PrismaClient } from '@prisma/client';
import { pythonTrackData, pythonUnits } from './prisma/python_track';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Python track specifically to avoid timeouts...');
  
  await prisma.track.deleteMany({
    where: { slug: pythonTrackData.slug }
  });

  const pythonTrack = await prisma.track.create({
    data: pythonTrackData,
  });

  for (const unitData of pythonUnits) {
    const { lessons, ...unitInfo } = unitData;

    const unit = await prisma.unit.create({
      data: {
        ...unitInfo,
        track_id: pythonTrack.id,
      }
    });

    for (const lessonData of lessons) {
      await prisma.lesson.create({
        data: {
          ...lessonData,
          unit_id: unit.id,
        }
      });
    }
  }

  console.log('Seeding Badges for Python...');
  const badges = [
    { slug: 'python-first-code', title: 'Python First Script', description: 'complete first Python lesson', icon_emoji: '🐍' },
    { slug: 'python-data-types', title: 'Data Types Master', description: 'complete Variables & Data Types', icon_emoji: '📦' },
    { slug: 'python-loops-master', title: 'Loops Master', description: 'complete Control Flow: Conditionals & Loops', icon_emoji: '🔁' },
    { slug: 'python-oop-guru', title: 'OOP Guru', description: 'complete Object-Oriented Programming', icon_emoji: '🧩' },
    { slug: 'python-graduate', title: 'Python Graduate', description: 'complete Python Final Track Project', icon_emoji: '🏆' }
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
