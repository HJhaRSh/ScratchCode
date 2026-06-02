import { PrismaClient, LessonType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database tracks and badges...');
  
  // Deleting tracks will automatically cascade-delete units, lessons, progress, and hints
  await prisma.track.deleteMany({});
  await prisma.badge.deleteMany({});
  
  console.log('Seeding new badges...');
  
  const badges = [
    {
      slug: 'first-code',
      title: 'First Code',
      description: 'Completed your very first coding lesson!',
      icon_emoji: '🚀',
    },
    {
      slug: 'getting-started',
      title: 'Getting Started',
      description: 'Completed 5 lessons!',
      icon_emoji: '🌱',
    },
    {
      slug: 'project-builder',
      title: 'Project Builder',
      description: 'Completed 5 project lessons!',
      icon_emoji: '🛠️',
    },
    {
      slug: 'on-fire',
      title: 'On Fire',
      description: 'Earned a 7-day learning streak!',
      icon_emoji: '🔥',
    },
    {
      slug: 'month-warrior',
      title: 'Month Warrior',
      description: 'Earned a 30-day learning streak!',
      icon_emoji: '👑',
    },
  ];

  for (const badge of badges) {
    const createdBadge = await prisma.badge.create({ data: badge });
    console.log(`- Seeded badge: ${createdBadge.title} (${createdBadge.slug})`);
  }

  console.log('Seeding Python track and curriculum...');

  const pythonTrack = await prisma.track.create({
    data: {
      slug: 'python',
      title: 'Python 3 Track',
      description: 'Learn the most versatile programming language. Great for scripting, data analysis, and automation.',
      icon: '🐍',
      color_hex: '#3B82F6', // Blue
      total_units: 1,
      total_lessons: 5,
      is_published: true,
      units: {
        create: [
          {
            unit_number: 1,
            title: 'Getting Started',
            description: 'Set up your base knowledge and write your very first program.',
            xp_reward: 100,
            is_published: true,
            lessons: {
              create: [
                {
                  lesson_number: 1,
                  title: 'What is Python & how it runs',
                  type: LessonType.CONCEPT,
                  duration_minutes: 7,
                  xp_reward: 10,
                  language: 'python',
                  is_published: true,
                  content_json: {
                    sections: [
                      {
                        type: 'heading',
                        text: 'What is Python?',
                      },
                      {
                        type: 'paragraph',
                        text: 'Python is a high-level, interpreted programming language known for its extreme readability and simplicity. Created by Guido van Rossum and released in 1991, Python\'s clean design allows programmers to express concepts in fewer lines of code than languages like C++ or Java.',
                      },
                      {
                        type: 'heading',
                        text: 'How Python Code Runs',
                      },
                      {
                        type: 'paragraph',
                        text: 'Unlike compiled languages, where code is translated directly into machine-readable binaries beforehand, Python is an **interpreted** language. This means that a program called the **Python Interpreter** reads and runs your code line-by-line, on the fly.',
                      },
                      {
                        type: 'callout',
                        variant: 'info',
                        text: 'An interpreted language provides instant feedback, making it fantastic for learning, experimentation, and rapid development.',
                      },
                      {
                        type: 'heading',
                        text: 'The Execution Pipeline',
                      },
                      {
                        type: 'paragraph',
                        text: 'Here is a simple conceptual representation of how your code turns into output:',
                      },
                      {
                        type: 'code_block',
                        language: 'python',
                        code: '# Concept Diagram:\n[ Python Code (.py) ] ──> [ Interpreter ] ──> [ Live Output / Result ]',
                      },
                      {
                        type: 'list',
                        items: [
                          'Write code: Your Python source file consists of plain text commands.',
                          'Interpret: The interpreter reads each line from top to bottom.',
                          'Execute: The interpreter translates each line to machine instructions and displays the output.',
                        ],
                      },
                    ],
                  },
                },
                {
                  lesson_number: 2,
                  title: 'Using the browser editor',
                  type: LessonType.CONCEPT,
                  duration_minutes: 5,
                  xp_reward: 10,
                  language: 'python',
                  is_published: true,
                  content_json: {
                    sections: [
                      {
                        type: 'heading',
                        text: 'The Scratch Code Sandbox',
                      },
                      {
                        type: 'paragraph',
                        text: 'Scratch Code comes equipped with a fully interactive code editor built right into your browser. You can write, execute, and debug your Python programs instantly with zero local installations!',
                      },
                      {
                        type: 'heading',
                        text: 'How to Use the Editor',
                      },
                      {
                        type: 'paragraph',
                        text: 'The editor pane is where you write your code. Once you write your script, click the green **Run** button. This submits your code to our secure environment, executes it using a Python runner, and returns the result.',
                      },
                      {
                        type: 'callout',
                        variant: 'tip',
                        text: 'Always look at the output panel. Any printed text, return values, or syntax errors will be clearly displayed there.',
                      },
                      {
                        type: 'heading',
                        text: 'Resetting and Recovering',
                      },
                      {
                        type: 'paragraph',
                        text: 'If you want to start fresh or find yourself stuck:',
                      },
                      {
                        type: 'list',
                        items: [
                          'Use the `Reset` button to wipe your edits and restore the default starter template.',
                          'Use the `Ask AI` or `Hint` drawers to receive instant contextual guidance on code errors.',
                        ],
                      },
                    ],
                  },
                },
                {
                  lesson_number: 3,
                  title: 'Your first program: print()',
                  type: LessonType.EXERCISE,
                  duration_minutes: 8,
                  xp_reward: 25,
                  language: 'python',
                  is_published: true,
                  starter_code: '# Write your first Python program below\n',
                  solution_code: 'print("Alex")',
                  test_cases_json: [
                    {
                      type: 'output_contains',
                      value: '',
                      expected_output: '',
                    },
                  ],
                  content_json: {
                    sections: [
                      {
                        type: 'heading',
                        text: 'The print() Function',
                      },
                      {
                        type: 'paragraph',
                        text: 'In Python, the most fundamental way to display information to the screen is by using the `print()` function. It tells the computer to show whatever is inside the parentheses.',
                      },
                      {
                        type: 'heading',
                        text: 'Working with Strings',
                      },
                      {
                        type: 'paragraph',
                        text: 'To print textual messages, you must wrap your text in quotes (either double quotes `"` or single quotes `\'`). In programming, a sequence of characters inside quotes is called a **string**.',
                      },
                      {
                        type: 'code_block',
                        language: 'python',
                        code: 'print("Hello, World!")\nprint(\'Python is fun!\')',
                      },
                      {
                        type: 'callout',
                        variant: 'warning',
                        text: 'If you forget the quotation marks, like `print(Hello)`, Python will look for a variable named `Hello` and raise a `NameError`.',
                      },
                      {
                        type: 'heading',
                        text: 'Your Task',
                      },
                      {
                        type: 'paragraph',
                        text: 'Write a Python program that uses `print()` to output your name to the screen. For example, if your name is Alex, write `print("Alex")`.',
                      },
                    ],
                  },
                },
                {
                  lesson_number: 4,
                  title: 'How to read error messages',
                  type: LessonType.CONCEPT,
                  duration_minutes: 6,
                  xp_reward: 10,
                  language: 'python',
                  is_published: true,
                  content_json: {
                    sections: [
                      {
                        type: 'heading',
                        text: 'Errors Are Your Friends',
                      },
                      {
                        type: 'paragraph',
                        text: 'In programming, making errors is a natural and essential part of the process. Python is extremely helpful: when something goes wrong, it will print an error message explaining exactly **what** went wrong and **where** to look.',
                      },
                      {
                        type: 'heading',
                        text: '1. SyntaxError',
                      },
                      {
                        type: 'paragraph',
                        text: 'A `SyntaxError` happens when you write code that violates the grammatical rules of the Python language.',
                      },
                      {
                        type: 'code_block',
                        language: 'python',
                        code: '# Example of a SyntaxError:\n  File "main.py", line 1\n    print("Hello)\n                 ^\nSyntaxError: unterminated string literal (detected at line 1)',
                      },
                      {
                        type: 'paragraph',
                        text: 'Here, we forgot the closing double quote. The caret (`^`) points to the exact spot where Python got confused.',
                      },
                      {
                        type: 'callout',
                        variant: 'tip',
                        text: 'The Fix: Ensure every opening quote, parenthesis, and bracket has a matching closing counterpart!',
                      },
                      {
                        type: 'heading',
                        text: '2. NameError',
                      },
                      {
                        type: 'paragraph',
                        text: 'A `NameError` occurs when you try to use a variable or function name that has not been defined or created yet.',
                      },
                      {
                        type: 'code_block',
                        language: 'python',
                        code: '# Example of a NameError:\n  File "main.py", line 1\n    print(my_name)\nNameError: name \'my_name\' is not defined',
                      },
                      {
                        type: 'paragraph',
                        text: 'This usually happens when you make a typo in a variable name, or forget to wrap a text string in quotes (causing Python to think it is a variable).',
                      },
                      {
                        type: 'callout',
                        variant: 'info',
                        text: 'The Fix: Double check your spelling or make sure you define the variable beforehand: `my_name = "Alex"`.',
                      },
                      {
                        type: 'heading',
                        text: '3. TypeError',
                      },
                      {
                        type: 'paragraph',
                        text: 'A `TypeError` occurs when you try to perform an operation on mismatched data types that are incompatible.',
                      },
                      {
                        type: 'code_block',
                        language: 'python',
                        code: '# Example of a TypeError:\n  File "main.py", line 1\n    print("My score is: " + 100)\nTypeError: can only concatenate str (not "int") to str',
                      },
                      {
                        type: 'paragraph',
                        text: 'In Python, you cannot directly add a string and a number together. You must first convert the number to a string.',
                      },
                      {
                        type: 'callout',
                        variant: 'warning',
                        text: 'The Fix: Convert the number to a string using the `str()` function, like: `print("My score is: " + str(100))`.',
                      },
                    ],
                  },
                },
                {
                  lesson_number: 5,
                  title: 'Project: Hello World personalised',
                  type: LessonType.PROJECT,
                  duration_minutes: 10,
                  xp_reward: 50,
                  language: 'python',
                  is_published: true,
                  starter_code: '# Your personalised Hello World project\n# Print 3 lines below\n',
                  solution_code: 'print("Hello! My name is Clara.")\nprint("I love Chemistry.")\nprint("I am learning Python today!")',
                  test_cases_json: [
                    {
                      type: 'line_count',
                      min: 3,
                      expected_output: '',
                    },
                  ],
                  content_json: {
                    sections: [
                      {
                        type: 'heading',
                        text: 'Your First Mini-Project',
                      },
                      {
                        type: 'paragraph',
                        text: 'Congratulations on making it to the end of Unit 1! You\'ve learned about how Python executes code, how to use the interactive editor, how the `print()` function works, and how to troubleshoot errors. Now, let\'s put all of that knowledge into a real hands-on project.',
                      },
                      {
                        type: 'heading',
                        text: 'Project Requirements',
                      },
                      {
                        type: 'paragraph',
                        text: 'Your task is to write a script that outputs exactly 3 personalized lines to the console:',
                      },
                      {
                        type: 'list',
                        items: [
                          'A greeting line: `Hello! My name is [your name].` (replace [your name] with your own name)',
                          'Your favourite subject: `I love [subject].` (replace [subject] with a subject/hobby you love)',
                          'A motivational message: `I am learning Python today!`',
                        ],
                      },
                      {
                        type: 'heading',
                        text: 'Example Output',
                      },
                      {
                        type: 'code_block',
                        language: 'python',
                        code: 'Hello! My name is Clara.\nI love Chemistry.\nI am learning Python today!',
                      },
                      {
                        type: 'callout',
                        variant: 'tip',
                        text: 'Make sure you use three distinct `print()` function calls, each on its own line. Check your spelling and closing parentheses!',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded database successfully!');
  console.log(`Python Track: ID ${pythonTrack.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
