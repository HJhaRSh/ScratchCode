const fs = require('fs');
let seed = fs.readFileSync('prisma/seed.ts', 'utf8');

// The Python hardcoded text starts from "console.log('Seeding Python track...');"
// and ends before "// ----------------------------------------------------"
// followed by "// Seed HTML & CSS Track"

const newContent = `  // ----------------------------------------------------
  // Seed Python Track
  // ----------------------------------------------------
  console.log('Seeding Python track...');
  
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
`;

const startIndex = seed.indexOf("console.log('Seeding Python track...');");
const endIndex = seed.indexOf("// ----------------------------------------------------\n  // Seed HTML & CSS Track");

if (startIndex !== -1 && endIndex !== -1) {
    const originalPart = seed.substring(startIndex, endIndex);
    seed = seed.replace(originalPart, newContent + '\n  ');
}

// Add import at the top
if (!seed.includes("import { pythonTrackData")) {
    seed = seed.replace("import { htmlCssTrackData", "import { pythonTrackData, pythonUnits } from './python_track';\nimport { htmlCssTrackData");
}

fs.writeFileSync('prisma/seed.ts', seed);
console.log('seed.ts fixed!');
