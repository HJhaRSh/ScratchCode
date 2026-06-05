import { PrismaClient } from '@prisma/client';
import { htmlCssTrackData, htmlCssUnits } from './prisma/html_css_track';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HTML & CSS track specifically to avoid timeouts...');
  
  await prisma.track.deleteMany({
    where: { slug: htmlCssTrackData.slug }
  });

  const htmlCssTrack = await prisma.track.create({
    data: htmlCssTrackData,
  });

  for (const unitData of htmlCssUnits) {
    const { lessons, ...unitInfo } = unitData;

    const unit = await prisma.unit.create({
      data: {
        ...unitInfo,
        track_id: htmlCssTrack.id,
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

  console.log('Seeding Badges for HTML/CSS...');
  const badges = [
    { slug: 'html-first-code', title: 'HTML First Tag', description: 'complete first HTML lesson', icon_emoji: '🌐' },
    { slug: 'css-artist', title: 'CSS Artist', description: 'complete CSS Basics', icon_emoji: '🎨' },
    { slug: 'flexbox-master', title: 'Flexbox Master', description: 'complete Flexbox Layouts', icon_emoji: '📦' },
    { slug: 'responsive-guru', title: 'Responsive Guru', description: 'complete Responsive Design', icon_emoji: '📱' },
    { slug: 'html-css-graduate', title: 'HTML/CSS Graduate', description: 'complete HTML/CSS Portfolio Project', icon_emoji: '🏆' }
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
