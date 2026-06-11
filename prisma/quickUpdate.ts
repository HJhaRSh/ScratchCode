import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dailyQuests = [
  {
    dayNumber: 1,
    test_cases_json: [
      { input: "2 7 11 15\n9", expected_output: "[0,1]" },
      { input: "3 2 4\n6", expected_output: "[1,2]" },
      { input: "3 3\n6", expected_output: "[0,1]" },
      { input: "-1 -2 -3 -4 -5\n-8", expected_output: "[2,4]" },
      { input: "1000000000 1000000000\n2000000000", expected_output: "[0,1]" },
      { input: "0 4 3 0\n0", expected_output: "[0,3]" },
      { input: "-3 4 3 90\n0", expected_output: "[0,2]" },
      { input: "1 2 3 4 5 6 7 8 9 10\n19", expected_output: "[8,9]" },
      { input: "1 2 3 4 5 6 7 8 9 10\n3", expected_output: "[0,1]" },
      { input: "1 2 3 4 5 6 7 8 9 10\n11", expected_output: "[0,9]" }
    ]
  },
  {
    dayNumber: 2,
    test_cases_json: [
      { input: "()", expected_output: "true" },
      { input: "()[]{}", expected_output: "true" },
      { input: "(]", expected_output: "false" },
      { input: "([)]", expected_output: "false" },
      { input: "{[]}", expected_output: "true" },
      { input: "{", expected_output: "false" },
      { input: "}", expected_output: "false" },
      { input: "(((())))", expected_output: "true" },
      { input: "(((((((()", expected_output: "false" },
      { input: "()()()()()()", expected_output: "true" }
    ]
  },
  {
    dayNumber: 3,
    test_cases_json: Array(10).fill({ input: "1 2 4\n1 3 4", expected_output: "[1,1,2,3,4,4]" })
  },
  {
    dayNumber: 4,
    test_cases_json: Array(10).fill({ input: "-2 1 -3 4 -1 2 1 -5 4", expected_output: "6" })
  },
  {
    dayNumber: 5,
    test_cases_json: Array(10).fill({ input: "5", expected_output: "8" })
  }
];

async function main() {
  console.log('Updating first 5 quests test cases...');
  for (const quest of dailyQuests) {
    await prisma.dailyQuest.update({
      where: { dayNumber: quest.dayNumber },
      data: { test_cases_json: quest.test_cases_json }
    });
    console.log(`Updated Day ${quest.dayNumber}`);
  }
  console.log('Finished updating!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
