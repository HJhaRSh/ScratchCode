import { LessonType } from '@prisma/client';

export const cTrackData = {
  slug: 'c-programming',
  title: 'C Programming',
  description: 'Master the language that powers operating systems, embedded systems, and everything under the hood. Start from zero and build up to pointers, file handling, and dynamic memory.',
  icon: '⚙️',
  color_hex: '#A8B9CC',
  total_units: 9,
  total_lessons: 42,
  is_published: true,
};

export const cUnits = [
  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 1 — Getting Started with C
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 1,
    title: 'Getting Started with C',
    description: 'Learn what C is, how it works, and write your first programs.',
    xp_reward: 95,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'What is C & How It Works',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is C?' },
            { type: 'paragraph', text: 'C is one of the oldest and most powerful programming languages, created in 1972 by Dennis Ritchie at Bell Labs. It is the foundation of most modern languages — Python, Java, and even parts of Windows and Linux are written in C.' },
            { type: 'heading', text: 'Why Learn C?' },
            { type: 'list', items: ['Teaches how computers actually work at a low level', 'Used in operating systems, embedded systems, game engines', 'Makes you a stronger programmer in every other language', 'Fastest language for system-level programming', 'Required for competitive programming and interviews'] },
            { type: 'heading', text: 'How C Code Runs' },
            { type: 'list', items: ['You write code in a .c file', 'The GCC compiler checks syntax and translates to machine code', 'The .exe/.out file runs directly on the CPU', 'Unlike Python, C is compiled — not interpreted line by line'] },
            { type: 'code_block', language: 'c', code: '// Your first C program\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
            { type: 'heading', text: 'Setting Up' },
            { type: 'list', items: ['Install VS Code from code.visualstudio.com', 'Install MinGW (Windows) or GCC (Mac/Linux)', 'Add C:/MinGW/bin to system PATH', 'Install C/C++ extension in VS Code', 'Compile: gcc filename.c -o output', 'Run: ./output (Mac/Linux) or output.exe (Windows)'] },
            { type: 'callout', variant: 'info', text: 'Every C program must have a main() function. Execution always starts from main(). The #include <stdio.h> line gives you access to printf and scanf.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    // Write your printf statements here\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'learning C' }, { type: 'output_contains', value: "Let's go" }]
      },
      {
        lesson_number: 2,
        title: 'Variables & Data Types',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Variable?' },
            { type: 'paragraph', text: 'A variable is a named container in memory that stores data. In C you must declare the type of data BEFORE using a variable — unlike Python or JavaScript.' },
            { type: 'heading', text: "C's Core Data Types" },
            { type: 'code_block', language: 'c', code: 'int age = 21;          // whole numbers\nfloat gpa = 8.5;       // decimal numbers (less precise)\ndouble pi = 3.14159;   // decimal numbers (more precise)\nchar grade = \'A\';      // single character (use single quotes)\n\n// C has NO boolean type built-in\n// Use int: 0 = false, 1 = true\nint isStudent = 1;' },
            { type: 'heading', text: 'Memory Sizes' },
            { type: 'list', items: ['char — 1 byte (stores one character)', 'int — 4 bytes (stores whole numbers)', 'float — 4 bytes (6-7 decimal digits precision)', 'double — 8 bytes (15 decimal digits precision)'] },
            { type: 'heading', text: 'Variable Naming Rules' },
            { type: 'list', items: ['Must start with a letter or underscore _', 'Can contain letters, digits, underscores', 'Case-sensitive: age and Age are different variables', 'Cannot use keywords like int, float, return as names', 'No spaces or special characters except underscore'] },
            { type: 'code_block', language: 'c', code: '// Valid names\nint age;\nfloat gross_salary;\nchar _initial;\n\n// Invalid names\n// int 2age;    // starts with digit\n// float my-val; // hyphen not allowed\n// char float;   // float is a keyword' },
            { type: 'callout', variant: 'warning', text: 'In C, using a variable before declaring it causes a compile error. Always declare variables at the top of the function before using them.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    // Declare and assign variables\n    \n    // Print all four\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '1001' }, { type: 'output_contains', value: '78.5' }, { type: 'output_contains', value: 'B' }]
      },
      {
        lesson_number: 3,
        title: 'printf & Format Specifiers',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'printf — Printing Output' },
            { type: 'code_block', language: 'c', code: '#include <stdio.h>\n\nint main() {\n    int age = 21;\n    float gpa = 8.5;\n    char grade = \'A\';\n    double pi = 3.14159265;\n\n    printf("Age: %d\\n", age);       // %d for int\n    printf("GPA: %f\\n", gpa);       // %f for float\n    printf("Grade: %c\\n", grade);   // %c for char\n    printf("Pi: %lf\\n", pi);        // %lf for double\n\n    // Multiple values in one printf\n    printf("%s is %d years old\\n", "Harsh", age);\n\n    // Formatted decimal places\n    printf("GPA: %.2f\\n", gpa);     // 2 decimal places\n    printf("Pi: %.4lf\\n", pi);      // 4 decimal places\n    return 0;\n}' },
            { type: 'heading', text: 'Escape Sequences' },
            { type: 'code_block', language: 'c', code: 'printf("Line 1\\nLine 2");  // \\n = new line\nprintf("Col1\\tCol2");    // \\t = tab\nprintf("Say \\"Hi\\"");    // \\" = double quote\nprintf("Back\\\\slash");   // \\\\ = backslash' },
            { type: 'callout', variant: 'warning', text: 'The format specifier must match the variable type. Using %d for a float prints garbage. This is one of the most common beginner mistakes in C.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    char item[] = "Notebook";\n    int qty = 5;\n    float price = 25.0;\n    float total = qty * price;\n\n    // Print formatted receipt\n    printf("========================\\n");\n    printf("ITEM\\t\\tQTY\\tPRICE\\tTOTAL\\n");\n    printf("========================\\n");\n    // Print item row here\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Notebook' }, { type: 'output_contains', value: '125' }, { type: 'output_contains', value: '25.00' }]
      },
      {
        lesson_number: 4,
        title: 'Constants & Comments',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Constants in C' },
            { type: 'code_block', language: 'c', code: '// Method 1: #define (preprocessor constant)\n#define PI 3.14159\n#define MAX_SIZE 100\n#define GREETING "Hello"\n\n// Method 2: const keyword\nconst int DAYS_IN_WEEK = 7;\nconst float TAX_RATE = 0.18;\n\n// Usage\nfloat area = PI * 5 * 5;\nprintf("Area: %.2f\\n", area);' },
            { type: 'heading', text: 'Comments' },
            { type: 'code_block', language: 'c', code: '// Single-line comment — use for brief notes\n\n/*\n   Multi-line comment\n   Use for longer explanations\n   or temporarily disabling code\n*/\n\n#include <stdio.h>\nint main() {\n    int age = 21; // stores user age\n    /* TODO: add input later */\n    printf("%d\\n", age);\n    return 0;\n}' },
            { type: 'callout', variant: 'tip', text: '#define constants have no type and no memory. They are replaced by the preprocessor before compilation. Prefer const variables for type safety in modern C.' },
          ]
        },
      },
      {
        lesson_number: 5,
        title: 'Project: Personal Info Card',
        type: LessonType.PROJECT,
        duration_minutes: 15,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: "Build a C program that declares variables for a person's info and prints a formatted info card using printf." },
            { type: 'code_block', language: 'c', code: '// Expected Output:\n// ==========================\n// PERSONAL INFO CARD\n// ==========================\n// Name    : Harsh Jain\n// Age     : 21\n// GPA     : 8.50\n// Grade   : A\n// City    : Mumbai\n// Status  : C Programmer Level 1\n// ==========================' },
            { type: 'callout', variant: 'tip', text: 'Use %.2f for GPA to show 2 decimal places. Use a char array for name: char name[] = "Harsh Jain";' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    // Declare all variables\n    char name[] = "Harsh Jain";\n    int age = 21;\n    float gpa = 8.5;\n    char grade = \'A\';\n    char city[] = "Mumbai";\n\n    // Print the info card\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Harsh' }, { type: 'output_contains', value: '8.50' }, { type: 'output_contains', value: 'Mumbai' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 2 — Operators & Expressions
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 2,
    title: 'Operators & Expressions',
    description: 'Master arithmetic, comparison, logical, and assignment operators.',
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Arithmetic Operators',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Arithmetic Operators' },
            { type: 'code_block', language: 'c', code: 'int a = 15, b = 4;\n\nprintf("%d\\n", a + b);  // 19 addition\nprintf("%d\\n", a - b);  // 11 subtraction\nprintf("%d\\n", a * b);  // 60 multiplication\nprintf("%d\\n", a / b);  // 3  integer division (truncates!)\nprintf("%d\\n", a % b);  // 3  modulus (remainder)\n\n// Float division\nfloat result = (float)a / b;\nprintf("%.2f\\n", result); // 3.75' },
            { type: 'heading', text: 'Operator Precedence' },
            { type: 'code_block', language: 'c', code: '// Like BODMAS — * / % before + -\nint x = 2 + 3 * 4;     // 14 (not 20)\nint y = (2 + 3) * 4;   // 20 (brackets first)\nint z = 10 / 2 + 3;    // 8\nint w = 10 % 3 + 1;    // 2 (10%3=1, 1+1=2)' },
            { type: 'heading', text: 'Increment & Decrement' },
            { type: 'code_block', language: 'c', code: 'int i = 5;\nprintf("%d\\n", i++); // 5 (print THEN increment)\nprintf("%d\\n", i);   // 6\nprintf("%d\\n", ++i); // 7 (increment THEN print)\nprintf("%d\\n", i--); // 7 (print THEN decrement)\nprintf("%d\\n", i);   // 6' },
            { type: 'callout', variant: 'warning', text: 'Integer division in C truncates — it does NOT round. 7/2 = 3, not 3.5. To get 3.5, cast to float first: (float)7/2 = 3.5' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    int a = 17, b = 5;\n\n    // Print all 6 operations\n    \n    // Compound expression\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '22' }, { type: 'output_contains', value: '85' }, { type: 'output_contains', value: '3.40' }]
      },
      {
        lesson_number: 2,
        title: 'Comparison & Logical Operators',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Comparison Operators' },
            { type: 'code_block', language: 'c', code: 'int a = 10, b = 20;\n\nprintf("%d\\n", a == b); // 0 (false)\nprintf("%d\\n", a != b); // 1 (true)\nprintf("%d\\n", a < b);  // 1 (true)\nprintf("%d\\n", a > b);  // 0 (false)\nprintf("%d\\n", a <= 10);// 1 (true)\nprintf("%d\\n", a >= 15);// 0 (false)\n// C uses 1 for true, 0 for false' },
            { type: 'heading', text: 'Logical Operators' },
            { type: 'code_block', language: 'c', code: 'int age = 20;\nint hasID = 1;\n\n// && AND — both must be true\nif (age >= 18 && hasID) {\n    printf("Entry allowed\\n");\n}\n\n// || OR — at least one true\nif (age < 13 || age > 60) {\n    printf("Special discount\\n");\n}\n\n// ! NOT — flips true/false\nif (!hasID) {\n    printf("ID required\\n");\n}' },
            { type: 'heading', text: 'Assignment Operators' },
            { type: 'code_block', language: 'c', code: 'int x = 10;\nx += 5;  // x = x + 5 = 15\nx -= 3;  // x = x - 3 = 12\nx *= 2;  // x = x * 2 = 24\nx /= 4;  // x = x / 4 = 6\nx %= 4;  // x = x % 4 = 2' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    int age = 19;\n    int marks = 72;\n    int hasID = 1;\n\n    // 1. age >= 18 AND hasID\n    printf("Adult with ID: %d\\n", age >= 18 && hasID);\n\n    // 2. marks >= 60 OR age >= 21\n    \n    // 3. NOT marks < 50\n    \n    // 4. marks += 5 then *= 2\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '1' }, { type: 'output_contains', value: '154' }]
      },
      {
        lesson_number: 3,
        title: 'Type Conversion',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Implicit vs Explicit Conversion' },
            { type: 'code_block', language: 'c', code: '// Implicit (automatic)\nint a = 5;\nfloat b = a;     // int promoted to float automatically\nprintf("%f\\n", b); // 5.000000\n\n// Mixed arithmetic — int promoted to float\nfloat result = 5 + 2.5; // 7.5 (5 becomes 5.0)\n\n// Explicit casting\nfloat x = 9.99;\nint y = (int)x;   // 9 (truncation, not rounding!)\nprintf("%d\\n", y);\n\n// Fix integer division with cast\nint p = 7, q = 2;\nfloat div = (float)p / q; // 3.5\nprintf("%.1f\\n", div);' },
            { type: 'callout', variant: 'warning', text: 'Casting truncates — it does NOT round. (int)3.9 = 3, (int)-3.9 = -3. If you want rounding, use the round() function from math.h.' },
          ]
        },
      },
      {
        lesson_number: 4,
        title: 'scanf — User Input',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Reading Input with scanf' },
            { type: 'code_block', language: 'c', code: '#include <stdio.h>\n\nint main() {\n    int age;\n    float gpa;\n    char grade;\n\n    printf("Enter age: ");\n    scanf("%d", &age);    // & is address-of operator\n\n    printf("Enter GPA: ");\n    scanf("%f", &gpa);\n\n    printf("Enter grade: ");\n    scanf(" %c", &grade); // space before %c clears buffer\n\n    printf("Age: %d, GPA: %.2f, Grade: %c\\n",\n           age, gpa, grade);\n    return 0;\n}' },
            { type: 'callout', variant: 'warning', text: 'ALWAYS use & before the variable name in scanf. Without &, the program will crash or give wrong results. The & gives scanf the memory address to store the value.' },
            { type: 'heading', text: 'Reading Strings' },
            { type: 'code_block', language: 'c', code: 'char name[50]; // char array for string\nprintf("Enter name: ");\nscanf("%s", name); // no & needed for arrays!\nprintf("Hello, %s\\n", name);' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    float weight, height, bmi;\n\n    printf("Enter weight (kg): ");\n    scanf("%f", &weight);\n\n    printf("Enter height (m): ");\n    scanf("%f", &height);\n\n    // Calculate BMI\n    \n    // Print result\n    \n    // Print category\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '22.86' }, { type: 'output_contains', value: 'Normal' }]
      },
      {
        lesson_number: 5,
        title: 'Project: Simple Calculator',
        type: LessonType.PROJECT,
        duration_minutes: 20,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a calculator that reads two numbers and an operator from the user and performs the correct operation.' },
            { type: 'code_block', language: 'c', code: '// Expected Output:\n// Enter first number: 15\n// Enter operator (+, -, *, /, %): *\n// Enter second number: 4\n// Result: 15 * 4 = 60' },
            { type: 'callout', variant: 'tip', text: 'Use char op to read the operator. Use if-else chain to check which operation to perform. Handle division by zero.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    float a, b, result;\n    char op;\n\n    printf("Enter first number: ");\n    scanf("%f", &a);\n\n    printf("Enter operator (+, -, *, /, %%): ");\n    scanf(" %c", &op);\n\n    printf("Enter second number: ");\n    scanf("%f", &b);\n\n    // Perform operation based on op\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Result' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 3 — Control Flow
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 3,
    title: 'Control Flow',
    description: 'Control program execution with conditionals, switches, and loops.',
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'if / else if / else',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Decision Making in C' },
            { type: 'code_block', language: 'c', code: 'int marks = 85;\n\nif (marks >= 90) {\n    printf("Grade: A+\\n");\n} else if (marks >= 80) {\n    printf("Grade: A\\n");\n} else if (marks >= 70) {\n    printf("Grade: B\\n");\n} else if (marks >= 60) {\n    printf("Grade: C\\n");\n} else {\n    printf("Grade: F\\n");\n}' },
            { type: 'heading', text: 'Nested if' },
            { type: 'code_block', language: 'c', code: 'int age = 20;\nint hasVoterID = 1;\n\nif (age >= 18) {\n    if (hasVoterID) {\n        printf("Can vote\\n");\n    } else {\n        printf("Need Voter ID\\n");\n    }\n} else {\n    printf("Too young to vote\\n");\n}' },
            { type: 'callout', variant: 'warning', text: 'Always use curly braces {} even for single statements in if/else. Without braces, only the next line is part of the block — a common source of bugs.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    int marks;\n    int isScience = 1;\n\n    printf("Enter marks: ");\n    scanf("%d", &marks);\n\n    // Grade check\n    \n    // Scholarship check\n    \n    // Repeat check\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Grade' }]
      },
      {
        lesson_number: 2,
        title: 'Switch Statement',
        type: LessonType.EXERCISE,
        duration_minutes: 7,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Switch — Multiple Fixed Choices' },
            { type: 'code_block', language: 'c', code: 'int day = 3;\n\nswitch (day) {\n    case 1: printf("Monday\\n");    break;\n    case 2: printf("Tuesday\\n");   break;\n    case 3: printf("Wednesday\\n"); break;\n    case 4: printf("Thursday\\n");  break;\n    case 5: printf("Friday\\n");    break;\n    case 6: printf("Saturday\\n");  break;\n    case 7: printf("Sunday\\n");    break;\n    default: printf("Invalid day\\n");\n}' },
            { type: 'callout', variant: 'warning', text: 'Always add break at the end of each case. Without break, execution falls through to the next case — called fall-through behaviour. This is a very common C bug.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    int choice;\n    printf("1. Area of Circle\\n");\n    printf("2. Area of Rectangle\\n");\n    printf("3. Area of Triangle\\n");\n    printf("4. Exit\\n");\n    printf("Enter choice: ");\n    scanf("%d", &choice);\n\n    switch (choice) {\n        // Add cases here\n    }\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Area' }]
      },
      {
        lesson_number: 3,
        title: 'for Loop',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'The for Loop' },
            { type: 'code_block', language: 'c', code: '// for (init; condition; update)\nfor (int i = 1; i <= 5; i++) {\n    printf("%d ", i); // 1 2 3 4 5\n}\n\n// Countdown\nfor (int i = 10; i >= 0; i -= 2) {\n    printf("%d ", i); // 10 8 6 4 2 0\n}\n\n// Nested loop — multiplication table\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        printf("%d ", i * j);\n    }\n    printf("\\n");\n}' },
            { type: 'heading', text: 'break & continue' },
            { type: 'code_block', language: 'c', code: '// break — exit loop immediately\nfor (int i = 1; i <= 10; i++) {\n    if (i == 6) break;\n    printf("%d ", i); // 1 2 3 4 5\n}\n\n// continue — skip current iteration\nfor (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) continue;\n    printf("%d ", i); // 1 3 5 7 9' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    // 1. Multiplication table of 7\n    \n    printf("\\n");\n\n    // 2. Primes from 2 to 50\n    \n    printf("\\n");\n\n    // 3. Triangle pattern\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '49' }, { type: 'output_contains', value: '47' }]
      },
      {
        lesson_number: 4,
        title: 'while & do-while',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'while Loop' },
            { type: 'code_block', language: 'c', code: 'int i = 1;\nwhile (i <= 5) {\n    printf("%d\\n", i);\n    i++; // MUST update — or infinite loop!\n}\n\n// Count digits in a number\nint n = 12345, count = 0;\nwhile (n != 0) {\n    n = n / 10;\n    count++;\n}\nprintf("Digits: %d\\n", count); // 5' },
            { type: 'heading', text: 'do-while Loop' },
            { type: 'code_block', language: 'c', code: '// Runs at LEAST once\nint attempt = 1;\ndo {\n    printf("Attempt %d\\n", attempt);\n    attempt++;\n} while (attempt <= 3);\n\n// Useful for menus (show before checking)\nint choice;\ndo {\n    printf("1. Play\\n2. Quit\\n");\n    scanf("%d", &choice);\n} while (choice != 2);' },
            { type: 'callout', variant: 'tip', text: 'Use while when you don\'t know how many iterations are needed. Use do-while when you need at least one execution, like input validation menus.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    // 1. Sum until 0\n    int num, sum = 0, count = 0;\n    printf("Enter numbers (0 to stop):\\n");\n    \n    // 2. Positive input validation\n    int positive;\n    \n    // 3. Reverse digits\n    int n = 12345;\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Sum' }, { type: 'output_contains', value: '54321' }]
      },
      {
        lesson_number: 5,
        title: 'Ternary & goto',
        type: LessonType.CONCEPT,
        duration_minutes: 6,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Ternary Operator' },
            { type: 'code_block', language: 'c', code: '// condition ? value_if_true : value_if_false\nint age = 20;\nchar *status = (age >= 18) ? "Adult" : "Minor";\nprintf("%s\\n", status); // Adult\n\nint a = 10, b = 20;\nint max = (a > b) ? a : b;\nprintf("Max: %d\\n", max); // 20' },
            { type: 'heading', text: 'goto (use sparingly)' },
            { type: 'code_block', language: 'c', code: '// goto jumps to a label — generally avoid\nint i = 1;\nstart:\n    printf("%d ", i);\n    i++;\n    if (i <= 5) goto start;\n// Output: 1 2 3 4 5\n\n// Legitimate use: error handling / cleanup\n// if (error) goto cleanup;\n// cleanup:\n//     fclose(file);' },
            { type: 'callout', variant: 'warning', text: 'Avoid goto in normal code — it makes programs hard to read and debug. The only acceptable use is for cleanup on error conditions in C, which doesn\'t have exceptions.' },
          ]
        },
      },
      {
        lesson_number: 6,
        title: 'Project: Number Guessing Game',
        type: LessonType.PROJECT,
        duration_minutes: 20,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a number guessing game. Computer picks a fixed number (42). User gets 7 attempts. Print \'Too high\', \'Too low\', or \'Correct!\'. Show remaining attempts.' },
            { type: 'code_block', language: 'c', code: '// Expected Output:\n// Welcome to Number Guessing Game!\n// I have picked a number between 1 and 100.\n// You have 7 attempts.\n// \n// Attempt 1/7 — Enter guess: 50\n// Too high! Try lower.\n// Attempt 2/7 — Enter guess: 25\n// Too low! Try higher.\n// ...\n// Correct! You found it in 5 attempts!' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    int secret = 42;\n    int guess, attempts = 7;\n\n    printf("Welcome to Number Guessing Game!\\n");\n    printf("I have picked a number between 1 and 100.\\n");\n    printf("You have %d attempts.\\n\\n", attempts);\n\n    // Game loop here\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Guessing' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 4 — Functions
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 4,
    title: 'Functions',
    description: 'Define reusable functions, understand scope, recursion, and the math library.',
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Defining & Calling Functions',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Why Functions?' },
            { type: 'paragraph', text: 'Functions let you break a large program into small, reusable blocks. Write once, call many times. Functions make code readable, testable, and maintainable.' },
            { type: 'code_block', language: 'c', code: '// Function declaration (prototype)\nvoid printHello();\n\nint main() {\n    printHello(); // call before definition\n    printHello();\n    return 0;\n}\n\n// Function definition\nvoid printHello() {\n    printf("Hello, World!\\n");\n}' },
            { type: 'heading', text: 'Functions with Parameters & Return' },
            { type: 'code_block', language: 'c', code: '// Return type  name  parameters\nint add(int a, int b) {\n    return a + b;\n}\n\nfloat area(float r) {\n    return 3.14159 * r * r;\n}\n\nint main() {\n    int sum = add(5, 3);\n    printf("Sum: %d\\n", sum); // 8\n\n    printf("Area: %.2f\\n", area(5.0)); // 78.54\n    return 0;\n}' },
            { type: 'callout', variant: 'info', text: 'In C, you must declare a function BEFORE calling it. Use a prototype at the top, or define the function above main(). This tells the compiler the function\'s signature.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\n// Function declarations\nint max(int a, int b);\nint isPrime(int n);\nfloat celsiusToFahrenheit(float c);\nvoid printStars(int n);\n\nint main() {\n    printf("Max(10,25): %d\\n", max(10, 25));\n    printf("isPrime(17): %d\\n", isPrime(17));\n    printf("100C = %.2fF\\n", celsiusToFahrenheit(100));\n    printStars(7);\n    return 0;\n}\n\n// Function definitions below\n',
        test_cases_json: [{ type: 'output_contains', value: '25' }, { type: 'output_contains', value: '212' }, { type: 'output_contains', value: '*******' }]
      },
      {
        lesson_number: 2,
        title: 'Scope & Storage Classes',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Variable Scope' },
            { type: 'code_block', language: 'c', code: 'int global = 100; // global scope — all functions\n\nvoid demo() {\n    int local = 50;   // local scope — only in demo()\n    printf("%d\\n", global); // OK\n    printf("%d\\n", local);  // OK\n}\n\nint main() {\n    printf("%d\\n", global); // OK\n    // printf("%d\\n", local); // ERROR — not in scope\n    return 0;\n}' },
            { type: 'heading', text: 'Storage Classes' },
            { type: 'code_block', language: 'c', code: '// auto — default for local variables\nauto int x = 10; // same as: int x = 10;\n\n// static — persists between function calls\nvoid counter() {\n    static int count = 0; // initialized ONCE\n    count++;\n    printf("%d\\n", count);\n}\n// counter() -> 1, counter() -> 2, counter() -> 3\n\n// register — hint to store in CPU register (fast)\nregister int i;\n\n// extern — declared in another file\nextern int globalVar;' },
            { type: 'callout', variant: 'tip', text: 'Use static local variables when you need a variable to remember its value between function calls — like a counter or accumulator inside a function.' },
          ]
        },
      },
      {
        lesson_number: 3,
        title: 'Recursion',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is Recursion?' },
            { type: 'paragraph', text: 'A recursive function calls itself. Every recursive function needs a base case (when to stop) and a recursive case (calling itself with a smaller input).' },
            { type: 'code_block', language: 'c', code: '// Factorial: n! = n * (n-1)!\nint factorial(int n) {\n    if (n == 0 || n == 1) return 1; // base case\n    return n * factorial(n - 1);    // recursive case\n}\n\n// Fibonacci: fib(n) = fib(n-1) + fib(n-2)\nint fib(int n) {\n    if (n <= 1) return n;           // base case\n    return fib(n-1) + fib(n-2);    // recursive case\n}\n\nint main() {\n    printf("%d\\n", factorial(5)); // 120\n    printf("%d\\n", fib(8));       // 21\n    return 0;\n}' },
            { type: 'callout', variant: 'warning', text: 'Without a base case, recursion continues forever causing a stack overflow. Always identify your stopping condition FIRST before writing the recursive call.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint power(int base, int exp);\nint sumDigits(int n);\nvoid printReverse(int n);\n\nint main() {\n    printf("%d\\n", power(2, 8));\n    printf("%d\\n", sumDigits(456));\n    printReverse(12345);\n    printf("\\n");\n    return 0;\n}\n\n// Definitions\n',
        test_cases_json: [{ type: 'output_contains', value: '256' }, { type: 'output_contains', value: '15' }, { type: 'output_contains', value: '54321' }]
      },
      {
        lesson_number: 4,
        title: 'Call by Value vs Call by Reference',
        type: LessonType.CONCEPT,
        duration_minutes: 8,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Call by Value' },
            { type: 'code_block', language: 'c', code: "// Changes inside function DON'T affect original\nvoid doubleIt(int x) {\n    x = x * 2;\n    printf(\"Inside: %d\\n\", x);\n}\n\nint main() {\n    int a = 5;\n    doubleIt(a);\n    printf(\"Outside: %d\\n\", a); // still 5!\n    return 0;\n}" },
            { type: 'heading', text: 'Call by Reference (using pointers)' },
            { type: 'code_block', language: 'c', code: '// Pass ADDRESS of variable using &\nvoid doubleIt(int *x) {  // *x is a pointer\n    *x = *x * 2;          // dereference to change value\n    printf("Inside: %d\\n", *x);\n}\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int a = 5;\n    doubleIt(&a);           // pass address with &\n    printf("Outside: %d\\n", a); // now 10!\n\n    int x = 3, y = 7;\n    swap(&x, &y);\n    printf("%d %d\\n", x, y); // 7 3\n    return 0;\n}' },
          ]
        },
      },
      {
        lesson_number: 5,
        title: 'Math Library Functions',
        type: LessonType.CONCEPT,
        duration_minutes: 6,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Using math.h' },
            { type: 'code_block', language: 'c', code: '#include <stdio.h>\n#include <math.h>\n\nint main() {\n    printf("%.2f\\n", sqrt(16));    // 4.00\n    printf("%.2f\\n", pow(2, 10));  // 1024.00\n    printf("%.2f\\n", fabs(-5.5));  // 5.50\n    printf("%.2f\\n", ceil(3.2));   // 4.00\n    printf("%.2f\\n", floor(3.9));  // 3.00\n    printf("%.2f\\n", round(3.5));  // 4.00\n    printf("%.4f\\n", log(2.718));  // ~1.0000\n    printf("%.4f\\n", sin(3.14159/2)); // ~1.0000\n    return 0;\n}' },
            { type: 'callout', variant: 'info', text: 'Compile with -lm flag when using math.h: gcc program.c -o program -lm' },
          ]
        },
      },
      {
        lesson_number: 6,
        title: 'Project: Scientific Calculator',
        type: LessonType.PROJECT,
        duration_minutes: 25,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a scientific calculator using functions. Each operation is its own function. Support: basic arithmetic, power, square root, factorial, and check prime.' },
            { type: 'code_block', language: 'c', code: '// Expected Output:\n// === Scientific Calculator ===\n// 1. Add    2. Subtract  3. Multiply\n// 4. Divide 5. Power     6. Square Root\n// 7. Factorial           8. Is Prime?\n// 9. Exit\n// Choice: 5\n// Base: 2\n// Exponent: 10\n// 2^10 = 1024' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <math.h>\n\n// Function declarations\nfloat add(float a, float b);\nfloat subtract(float a, float b);\nfloat multiply(float a, float b);\nfloat divide(float a, float b);\nfloat power(float base, int exp);\nfloat squareRoot(float n);\nlong long factorial(int n);\nint isPrime(int n);\nvoid printMenu();\n\nint main() {\n    int choice;\n    do {\n        printMenu();\n        printf("Choice: ");\n        scanf("%d", &choice);\n        // Handle each choice\n    } while (choice != 9);\n    return 0;\n}\n\n// Function definitions\n',
        test_cases_json: [{ type: 'output_contains', value: 'Calculator' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 5 — Arrays & Strings
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 5,
    title: 'Arrays & Strings',
    description: 'Store and manipulate collections of data using arrays and character arrays.',
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Arrays',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is an Array?' },
            { type: 'paragraph', text: 'An array stores multiple values of the same data type in contiguous memory locations. Access elements using index starting from 0.' },
            { type: 'code_block', language: 'c', code: '// Declaration and initialization\nint marks[5] = {85, 92, 78, 95, 88};\nfloat prices[3] = {9.99, 14.99, 4.99};\nchar vowels[5] = {\'a\', \'e\', \'i\', \'o\', \'u\'};\n\n// Access\nprintf("%d\\n", marks[0]); // 85\nprintf("%d\\n", marks[4]); // 88\n\n// Modify\nmarks[2] = 100;\n\n// Loop through array\nfor (int i = 0; i < 5; i++) {\n    printf("%d ", marks[i]);\n}' },
            { type: 'heading', text: 'Array Operations' },
            { type: 'code_block', language: 'c', code: 'int arr[5] = {3, 7, 1, 9, 4};\nint n = 5;\n\n// Find max\nint max = arr[0];\nfor (int i = 1; i < n; i++) {\n    if (arr[i] > max) max = arr[i];\n}\nprintf("Max: %d\\n", max); // 9\n\n// Sum and average\nint sum = 0;\nfor (int i = 0; i < n; i++) sum += arr[i];\nprintf("Avg: %.2f\\n", (float)sum/n);' },
            { type: 'callout', variant: 'warning', text: 'C does NOT check array bounds. Accessing arr[10] on a 5-element array is undefined behaviour — it may read garbage values or crash the program. Always stay within bounds.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    int marks[6] = {72, 88, 65, 95, 80, 74};\n    int n = 6;\n\n    // 1. Print all\n    \n    // 2. Max and min\n    \n    // 3. Average\n    \n    // 4. Count above 75\n    \n    // 5. Bubble sort\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '95' }, { type: 'output_contains', value: '65' }, { type: 'output_contains', value: '3' }]
      },
      {
        lesson_number: 2,
        title: '2D Arrays',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Two-Dimensional Arrays' },
            { type: 'code_block', language: 'c', code: '// 3 rows, 4 columns\nint matrix[3][4] = {\n    {1, 2, 3, 4},\n    {5, 6, 7, 8},\n    {9, 10, 11, 12}\n};\n\n// Access: matrix[row][col]\nprintf("%d\\n", matrix[1][2]); // 7\n\n// Traverse with nested loops\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++) {\n        printf("%3d ", matrix[i][j]);\n    }\n    printf("\\n");\n}' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    int A[3][3] = {{1,2,3},{4,5,6},{7,8,9}};\n    int B[3][3] = {{9,8,7},{6,5,4},{3,2,1}};\n    int C[3][3];\n\n    // 1. Print A and B\n    \n    // 2. Add A+B into C\n    \n    // 3. Diagonal sum of A\n    \n    // 4. Transpose A\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '10' }, { type: 'output_contains', value: '15' }]
      },
      {
        lesson_number: 3,
        title: 'Strings in C',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: "Strings — Character Arrays" },
            { type: 'code_block', language: 'c', code: "// String is a char array ending with '\\0'\nchar name[20] = \"Harsh Jain\";\nchar city[] = \"Mumbai\"; // size auto-calculated\n\nprintf(\"%s\\n\", name);         // Harsh Jain\nprintf(\"%d\\n\", name[0]);      // 72 (ASCII of 'H')\nprintf(\"Length: %lu\\n\", strlen(name)); // 10\n\n// Read string\nchar input[50];\nscanf(\"%s\", input);  // reads one word (stops at space)\nfgets(input, 50, stdin); // reads whole line (safer)" },
            { type: 'heading', text: 'String Functions (string.h)' },
            { type: 'code_block', language: 'c', code: '#include <string.h>\n\nchar s1[20] = "Hello";\nchar s2[] = "World";\n\nprintf("%lu\\n", strlen(s1));    // 5 — length\nstrcpy(s1, s2);               // copy s2 into s1\nstrcat(s1, " C");             // concatenate\nprintf("%d\\n", strcmp(s1,s2)); // 0=equal, +/-=diff\n\n// Convert case\n#include <ctype.h>\nchar ch = \'a\';\nprintf("%c\\n", toupper(ch)); // \'A\'' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[100];\n    printf("Enter a string: ");\n    fgets(str, 100, stdin);\n\n    // 1. Length and reverse\n    \n    // 2. Count vowels/consonants\n    \n    // 3. Palindrome check\n    \n    // 4. To uppercase manually\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Length' }, { type: 'output_contains', value: 'vowel' }]
      },
      {
        lesson_number: 4,
        title: 'Passing Arrays to Functions',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Arrays Pass by Reference Automatically' },
            { type: 'code_block', language: 'c', code: '// Arrays always pass as pointer — modifications affect original!\nvoid doubleAll(int arr[], int n) {\n    for (int i = 0; i < n; i++) {\n        arr[i] *= 2;\n    }\n}\n\nvoid printArray(int arr[], int n) {\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n}\n\nint main() {\n    int nums[5] = {1, 2, 3, 4, 5};\n    doubleAll(nums, 5);\n    printArray(nums, 5); // 2 4 6 8 10\n    return 0;\n}' },
            { type: 'callout', variant: 'info', text: 'When you pass an array to a function, C passes a pointer to the first element. The function can modify the original array — unlike passing a regular variable (call by value).' },
          ]
        },
      },
      {
        lesson_number: 5,
        title: 'Searching & Sorting',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Linear Search' },
            { type: 'code_block', language: 'c', code: 'int linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) return i; // found at index i\n    }\n    return -1; // not found\n}\n\nint pos = linearSearch(arr, 5, 42);\nif (pos != -1) printf("Found at index %d\\n", pos);\nelse printf("Not found\\n");' },
            { type: 'heading', text: 'Bubble Sort' },
            { type: 'code_block', language: 'c', code: 'void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                // swap\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n        }\n    }\n}\n\nint arr[5] = {64, 34, 25, 12, 22};\nbubbleSort(arr, 5);\n// Result: 12 22 25 34 64' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint linearSearch(int arr[], int n, int target);\nvoid bubbleSort(int arr[], int n);\nint binarySearch(int arr[], int n, int target);\nvoid printArray(int arr[], int n);\n\nint main() {\n    int arr[8] = {64,25,12,22,11,90,37,45};\n    int n = 8;\n    // Test linear search\n    \n    // Sort\n    \n    // Test binary search\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '11' }, { type: 'output_contains', value: 'Found' }]
      },
      {
        lesson_number: 6,
        title: 'Project: Student Marks System',
        type: LessonType.PROJECT,
        duration_minutes: 25,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a complete student marks management system using arrays and functions.' },
            { type: 'code_block', language: 'c', code: '// Expected:\n// Enter 5 student names and marks\n// ================================\n// STUDENT REPORT CARD\n// ================================\n// Harsh    : 87 | Grade: A  | PASS\n// Priya    : 95 | Grade: A+ | PASS\n// Rahul    : 52 | Grade: F  | FAIL\n// ...\n// Class Average: 74.4\n// Highest: Priya (95)\n// Lowest : Rahul (52)\n// Pass Rate: 80%' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <string.h>\n\n#define MAX 5\n\nchar getGrade(int marks);\nvoid printReport(char names[][20], int marks[], int n);\nfloat getAverage(int marks[], int n);\nint getMax(int marks[], int n);\nint getMin(int marks[], int n);\n\nint main() {\n    char names[MAX][20];\n    int marks[MAX];\n\n    for (int i = 0; i < MAX; i++) {\n        printf("Enter name %d: ", i+1);\n        scanf("%s", names[i]);\n        printf("Enter marks: ");\n        scanf("%d", &marks[i]);\n    }\n\n    printReport(names, marks, MAX);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Grade' }, { type: 'output_contains', value: 'Average' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 6 — Pointers
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 6,
    title: 'Pointers',
    description: 'Understand memory addresses, pointer arithmetic, and indirect memory access.',
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Introduction to Pointers',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Pointer?' },
            { type: 'paragraph', text: 'A pointer is a variable that stores the MEMORY ADDRESS of another variable. Pointers are what make C powerful — they allow direct memory access, efficient arrays, and modifying function arguments.' },
            { type: 'code_block', language: 'c', code: 'int age = 21;\nint *ptr = &age;  // ptr holds address of age\n\nprintf("%d\\n", age);    // 21  — value\nprintf("%p\\n", &age);  // 0x... — address of age\nprintf("%p\\n", ptr);   // 0x... — same address (ptr stores it)\nprintf("%d\\n", *ptr);  // 21  — dereference: value AT address\n\n// Modify via pointer\n*ptr = 25;\nprintf("%d\\n", age);   // 25 — age changed!' },
            { type: 'heading', text: 'Pointer Arithmetic' },
            { type: 'code_block', language: 'c', code: 'int arr[5] = {10, 20, 30, 40, 50};\nint *p = arr; // points to first element\n\nprintf("%d\\n", *p);      // 10\nprintf("%d\\n", *(p+1));  // 20\nprintf("%d\\n", *(p+4));  // 50\n\np++;  // move to next element\nprintf("%d\\n", *p); // 20' },
            { type: 'callout', variant: 'warning', text: 'Two most common pointer mistakes: 1) Using *ptr before assigning an address (undefined behaviour). 2) Not freeing dynamically allocated pointer memory (memory leak).' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nvoid swapPointers(int *a, int *b);\n\nint main() {\n    // 1. Basic pointer\n    int x = 10;\n    \n    // 2. Modify via pointer\n    \n    // 3. Traverse array with pointer\n    int arr[4] = {5, 10, 15, 20};\n    \n    // 4. Swap\n    int p = 3, q = 7;\n    swapPointers(&p, &q);\n    printf("%d %d\\n", p, q);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '99' }, { type: 'output_contains', value: '7 3' }]
      },
      {
        lesson_number: 2,
        title: 'Pointers & Arrays',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Array Name is a Pointer' },
            { type: 'code_block', language: 'c', code: 'int arr[5] = {10, 20, 30, 40, 50};\n\n// arr is pointer to first element\nprintf("%p\\n", arr);    // address of arr[0]\nprintf("%p\\n", &arr[0]);// same address\n\n// Both are equivalent:\n// arr[2]     == *(arr + 2)  // 30\n// &arr[2]    == arr + 2     // address of 3rd element\n\n// Pointer as function parameter\nvoid printArr(int *p, int n) {\n    for (int i = 0; i < n; i++) {\n        printf("%d ", *(p + i));\n    }\n}' },
          ]
        },
      },
      {
        lesson_number: 3,
        title: 'Pointers to Strings',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'String Pointers' },
            { type: 'code_block', language: 'c', code: '// String literal stored as const char pointer\nchar *str = "Hello, C!";\nprintf("%s\\n", str);    // Hello, C!\nprintf("%c\\n", *str);  // H\nprintf("%c\\n", str[4]); // o\n\n// Traverse string with pointer\nchar *p = str;\nwhile (*p != \'\\0\') {\n    printf("%c", *p);\n    p++;\n}\nprintf("\\n");' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint myStrlen(char *s);\nvoid myStrcpy(char *dest, char *src);\nvoid reverseStr(char *s);\nint isPalindrome(char *s);\n\nint main() {\n    char s1[] = "programming";\n    char s2[50];\n\n    printf("Length: %d\\n", myStrlen(s1));\n    myStrcpy(s2, s1);\n    printf("Copy: %s\\n", s2);\n    reverseStr(s1);\n    printf("Reversed: %s\\n", s1);\n\n    char test[] = "racecar";\n    printf("Palindrome: %d\\n", isPalindrome(test));\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '11' }, { type: 'output_contains', value: 'gnimmargorp' }, { type: 'output_contains', value: '1' }]
      },
      {
        lesson_number: 4,
        title: 'Double Pointers',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Pointer to Pointer' },
            { type: 'code_block', language: 'c', code: 'int x = 10;\nint *p = &x;    // pointer to int\nint **pp = &p;  // pointer to pointer to int\n\nprintf("%d\\n", x);    // 10\nprintf("%d\\n", *p);   // 10\nprintf("%d\\n", **pp); // 10\n\n// Modify via double pointer\n**pp = 99;\nprintf("%d\\n", x); // 99\n\n// Common use: modify pointer inside function\n// void allocate(int **ptr) {\n//     *ptr = malloc(sizeof(int) * 5);\n// }' },
            { type: 'callout', variant: 'info', text: 'Double pointers are used when you need to modify a pointer itself inside a function — like when dynamically allocating memory through a function call.' },
          ]
        },
      },
      {
        lesson_number: 5,
        title: 'Project: Array Manipulator',
        type: LessonType.PROJECT,
        duration_minutes: 20,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build an array manipulation library using pointers. All functions must use pointer notation, not array notation.' },
            { type: 'code_block', language: 'c', code: '// Functions using pointers:\n// int* findMax(int *arr, int n)     — returns pointer to max\n// int* findMin(int *arr, int n)     — returns pointer to min\n// void reverse(int *arr, int n)     — reverse in place\n// int countOccurrences(int *arr, int n, int val)' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint* findMax(int *arr, int n);\nint* findMin(int *arr, int n);\nvoid reverse(int *arr, int n);\nvoid printArr(int *arr, int n);\nint countOccurrences(int *arr, int n, int val);\n\nint main() {\n    int arr[8] = {3,7,2,7,9,1,7,4};\n    int n = 8;\n\n    printf("Max: %d\\n", *findMax(arr, n));\n    printf("Min: %d\\n", *findMin(arr, n));\n    printf("7 occurs: %d times\\n", countOccurrences(arr, n, 7));\n    reverse(arr, n);\n    printf("Reversed: ");\n    printArr(arr, n);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Max: 9' }, { type: 'output_contains', value: '3 times' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 7 — Structures & Unions
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 7,
    title: 'Structures & Unions',
    description: 'Group related data with structs and unions; use linked lists.',
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Structures',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Structure?' },
            { type: 'paragraph', text: 'A structure groups variables of DIFFERENT data types under one name. Unlike arrays (same type), structs let you represent real-world entities like a Student or Employee.' },
            { type: 'code_block', language: 'c', code: '// Define structure\nstruct Student {\n    char name[50];\n    int age;\n    float gpa;\n    char grade;\n};\n\nint main() {\n    // Declare and initialize\n    struct Student s1 = {"Harsh", 21, 8.5, \'A\'};\n    struct Student s2;\n\n    // Access members\n    printf("%s\\n", s1.name);  // Harsh\n    printf("%f\\n", s1.gpa);   // 8.500000\n\n    // Assign member by member\n    s2.age = 20;\n    strcpy(s2.name, "Priya");\n    s2.gpa = 9.1;\n    return 0;\n}' },
            { type: 'heading', text: 'typedef for Structs' },
            { type: 'code_block', language: 'c', code: "// typedef removes need to write 'struct' every time\ntypedef struct {\n    char name[50];\n    int age;\n    float gpa;\n} Student;\n\nStudent s1 = {\"Harsh\", 21, 8.5}; // no 'struct' needed" },
            { type: 'callout', variant: 'tip', text: 'Always use typedef with structs in modern C code. It makes declarations cleaner: Student s1 instead of struct Student s1.' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <string.h>\n\ntypedef struct {\n    char name[50];\n    int id;\n    float salary;\n    char department[30];\n} Employee;\n\nvoid printEmployee(Employee e);\nvoid printAll(Employee emp[], int n);\n\nint main() {\n    Employee emp[3] = {\n        {"Harsh", 101, 45000, "Engineering"},\n        {"Priya", 102, 62000, "Design"},\n        {"Rahul", 103, 38000, "Marketing"}\n    };\n    // Print all\n    \n    // Highest salary\n    \n    // 10% raise\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Harsh' }, { type: 'output_contains', value: '62000' }, { type: 'output_contains', value: '41800' }]
      },
      {
        lesson_number: 2,
        title: 'Structures & Functions',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Passing Structs to Functions' },
            { type: 'code_block', language: 'c', code: 'typedef struct {\n    float x, y;\n} Point;\n\n// Pass by value — function gets a COPY\nfloat distance(Point p1, Point p2) {\n    float dx = p1.x - p2.x;\n    float dy = p1.y - p2.y;\n    return sqrt(dx*dx + dy*dy);\n}\n\n// Pass by pointer — can modify original\nvoid scale(Point *p, float factor) {\n    p->x *= factor;  // -> for pointer to struct\n    p->y *= factor;\n}\n\nPoint p = {3.0, 4.0};\nscale(&p, 2.0);\nprintf("%.1f %.1f\\n", p.x, p.y); // 6.0 8.0' },
            { type: 'callout', variant: 'info', text: 'Use -> operator to access struct members via pointer: ptr->member is same as (*ptr).member. The arrow operator is just a shorthand.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\ntypedef struct {\n    float width;\n    float height;\n} Rectangle;\n\nfloat area(Rectangle r);\nfloat perimeter(Rectangle r);\nint isSquare(Rectangle r);\nRectangle scale(Rectangle r, float factor);\n\nint main() {\n    Rectangle r = {5.0, 3.0};\n    printf("Area: %.2f\\n", area(r));\n    printf("Perimeter: %.2f\\n", perimeter(r));\n    printf("Is Square: %d\\n", isSquare(r));\n    Rectangle r2 = scale(r, 2.0);\n    printf("Scaled: %.1f x %.1f\\n", r2.width, r2.height);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '15.00' }, { type: 'output_contains', value: '16.00' }]
      },
      {
        lesson_number: 3,
        title: 'Unions & Enums',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Unions — Shared Memory' },
            { type: 'code_block', language: 'c', code: '// Union — all members share the SAME memory location\nunion Data {\n    int i;\n    float f;\n    char str[20];\n};\n\nunion Data d;\nd.i = 10;\nprintf("Integer: %d\\n", d.i);   // 10\nd.f = 220.5;\nprintf("Float: %f\\n", d.f);     // 220.5\n// d.i is now garbage — only last assigned is valid\n\n// sizeof union = size of largest member\nprintf("%lu\\n", sizeof(union Data)); // 20 (char str size)' },
            { type: 'heading', text: 'Enums — Named Constants' },
            { type: 'code_block', language: 'c', code: 'typedef enum {\n    MONDAY = 1, TUESDAY, WEDNESDAY,\n    THURSDAY, FRIDAY, SATURDAY, SUNDAY\n} Day;\n\nDay today = WEDNESDAY;\nprintf("%d\\n", today); // 3\n\ntypedef enum { RED, GREEN, BLUE } Color;\nColor c = GREEN;\nprintf("%d\\n", c); // 1' },
            { type: 'callout', variant: 'tip', text: 'Use enums instead of magic numbers in your code. MONDAY is more readable than 1. Enums also let the compiler catch invalid values.' },
          ]
        },
      },
      {
        lesson_number: 4,
        title: 'Linked Lists Intro',
        type: LessonType.CONCEPT,
        duration_minutes: 8,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Linked List?' },
            { type: 'paragraph', text: 'A linked list is a dynamic data structure where each node contains data and a pointer to the next node. Unlike arrays, linked lists can grow and shrink at runtime.' },
            { type: 'code_block', language: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nNode* createNode(int val) {\n    Node *n = (Node*)malloc(sizeof(Node));\n    n->data = val;\n    n->next = NULL;\n    return n;\n}\n\nvoid printList(Node *head) {\n    while (head != NULL) {\n        printf("%d -> ", head->data);\n        head = head->next;\n    }\n    printf("NULL\\n");\n}\n\nint main() {\n    Node *head = createNode(1);\n    head->next = createNode(2);\n    head->next->next = createNode(3);\n    printList(head); // 1 -> 2 -> 3 -> NULL\n    return 0;\n}' },
          ]
        },
      },
      {
        lesson_number: 5,
        title: 'Project: Student Database with Structs',
        type: LessonType.PROJECT,
        duration_minutes: 25,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a student database using an array of structs. Support adding, displaying, searching by roll number, and computing class average.' },
            { type: 'code_block', language: 'c', code: '// Expected Output:\n// === Student Database ===\n// Roll  Name          Marks  Grade\n// 101   Harsh Jain    87     A\n// 102   Priya Shah    95     A+\n// 103   Rahul Gupta   52     F\n// Avg: 78.00  Topper: Priya Shah (95)' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <string.h>\n\n#define MAX 10\n\ntypedef struct {\n    int roll;\n    char name[50];\n    int marks;\n    char grade;\n} Student;\n\nvoid addStudent(Student db[], int *count, int roll, char *name, int marks);\nvoid displayAll(Student db[], int count);\nStudent* searchByRoll(Student db[], int count, int roll);\nfloat classAverage(Student db[], int count);\nStudent* findTopper(Student db[], int count);\nchar assignGrade(int marks);\n\nint main() {\n    Student db[MAX];\n    int count = 0;\n\n    addStudent(db, &count, 101, "Harsh Jain", 87);\n    addStudent(db, &count, 102, "Priya Shah", 95);\n    addStudent(db, &count, 103, "Rahul Gupta", 52);\n\n    printf("=== Student Database ===\\n");\n    displayAll(db, count);\n    printf("Avg: %.2f\\n", classAverage(db, count));\n    Student *top = findTopper(db, count);\n    printf("Topper: %s (%d)\\n", top->name, top->marks);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Harsh' }, { type: 'output_contains', value: 'Topper' }, { type: 'output_contains', value: '78' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 8 — File Handling & Dynamic Memory
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 8,
    title: 'File Handling & Dynamic Memory',
    description: 'Read and write files; allocate memory dynamically with malloc and free.',
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'File I/O in C',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Reading & Writing Files' },
            { type: 'code_block', language: 'c', code: '#include <stdio.h>\n\nint main() {\n    // Writing to a file\n    FILE *fp = fopen("notes.txt", "w");\n    if (fp == NULL) {\n        printf("Error opening file!\\n");\n        return 1;\n    }\n    fprintf(fp, "Hello, File!\\n");\n    fprintf(fp, "Line 2\\n");\n    fclose(fp);\n\n    // Reading from a file\n    fp = fopen("notes.txt", "r");\n    char line[100];\n    while (fgets(line, sizeof(line), fp)) {\n        printf("%s", line);\n    }\n    fclose(fp);\n    return 0;\n}' },
            { type: 'heading', text: 'File Modes' },
            { type: 'list', items: ['"r"  — read only (file must exist)', '"w"  — write (creates or overwrites)', '"a"  — append (creates or adds to end)', '"r+" — read and write', '"w+" — read/write (overwrites)', '"rb", "wb" — binary modes'] },
            { type: 'callout', variant: 'warning', text: 'ALWAYS check if fopen returned NULL before using the file pointer. Passing NULL to fprintf or fclose crashes your program.' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nint main() {\n    // 1. Write 3 todo items to "todo.txt"\n    FILE *fp = fopen("todo.txt", "w");\n    \n    // 2. Read and print\n    fp = fopen("todo.txt", "r");\n    \n    // 3. Append item 4\n    fp = fopen("todo.txt", "a");\n    \n    // 4. Read final\n    \n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'todo' }]
      },
      {
        lesson_number: 2,
        title: 'Dynamic Memory Allocation',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'malloc, calloc, realloc, free' },
            { type: 'code_block', language: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // malloc — allocate n bytes (uninitialised)\n    int *arr = (int*)malloc(5 * sizeof(int));\n    if (arr == NULL) { printf("Allocation failed!\\n"); return 1; }\n\n    for (int i = 0; i < 5; i++) arr[i] = (i+1) * 10;\n    for (int i = 0; i < 5; i++) printf("%d ", arr[i]); // 10 20 30 40 50\n\n    // realloc — resize\n    arr = (int*)realloc(arr, 8 * sizeof(int));\n    arr[5] = 60; arr[6] = 70; arr[7] = 80;\n\n    // calloc — allocate and zero-initialise\n    int *zeros = (int*)calloc(5, sizeof(int));\n\n    free(arr);   // ALWAYS free!\n    free(zeros);\n    return 0;\n}' },
            { type: 'callout', variant: 'warning', text: 'Every malloc/calloc/realloc must be paired with a free(). Forgetting free() causes a memory leak — your program uses more and more RAM until it crashes.' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    printf("How many numbers? ");\n    scanf("%d", &n);\n\n    // 1. Allocate array of n ints\n    int *arr = (int*)malloc(n * sizeof(int));\n    \n    // 2. Read n numbers\n    \n    // 3. Find sum, min, max\n    \n    // 4. Free memory\n    free(arr);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Sum' }]
      },
      {
        lesson_number: 3,
        title: 'Command Line Arguments',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'argc and argv' },
            { type: 'code_block', language: 'c', code: '// argc = argument count (includes program name)\n// argv = argument vector (array of strings)\nint main(int argc, char *argv[]) {\n    printf("Program: %s\\n", argv[0]);\n    printf("Arguments: %d\\n", argc - 1);\n\n    for (int i = 1; i < argc; i++) {\n        printf("Arg %d: %s\\n", i, argv[i]);\n    }\n    return 0;\n}\n\n// Run: ./program hello world 42\n// Output:\n// Program: ./program\n// Arguments: 3\n// Arg 1: hello\n// Arg 2: world\n// Arg 3: 42' },
            { type: 'callout', variant: 'tip', text: 'argv[0] is always the program name. argv[1] is the first argument. Use atoi(argv[1]) to convert a string argument to integer.' },
          ]
        },
      },
      {
        lesson_number: 4,
        title: 'Preprocessor Directives',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Common Preprocessor Directives' },
            { type: 'code_block', language: 'c', code: '// #include — import header files\n#include <stdio.h>     // standard library\n#include "myfile.h"    // user-defined header\n\n// #define — constants and macros\n#define PI 3.14159\n#define MAX(a,b) ((a)>(b)?(a):(b))  // macro function\n#define DEBUG 1\n\n// #ifdef / #ifndef — conditional compilation\n#ifdef DEBUG\n    printf("Debug mode on\\n");\n#endif\n\n#ifndef VERSION\n    #define VERSION "1.0"\n#endif\n\n// #pragma — compiler-specific instructions\n#pragma once  // header guard (modern alternative)' },
            { type: 'callout', variant: 'info', text: 'Preprocessor runs BEFORE compilation — it does text substitution. Macros are not functions: they expand inline and can have side effects if arguments have side effects.' },
          ]
        },
      },
      {
        lesson_number: 5,
        title: 'Project: File-Based Student Records',
        type: LessonType.PROJECT,
        duration_minutes: 30,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a student records manager that saves to and loads from a binary file. Use dynamic memory for the array.' },
            { type: 'code_block', language: 'c', code: '// Expected Output:\n// 1. Add student\n// 2. Display all\n// 3. Save to file\n// 4. Load from file\n// 5. Exit\n// Added: Harsh Jain (101) — 87 marks\n// Saved 3 records to students.dat\n// Loaded 3 records from students.dat' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct {\n    int roll;\n    char name[50];\n    int marks;\n} Student;\n\nvoid addStudent(Student **db, int *count, int roll, char *name, int marks);\nvoid displayAll(Student *db, int count);\nvoid saveToFile(Student *db, int count, const char *filename);\nint loadFromFile(Student **db, int *count, const char *filename);\n\nint main() {\n    Student *db = NULL;\n    int count = 0;\n    // Implement menu loop\n    printf("Student Records Manager\\n");\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Student' }]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT 9 — Advanced Topics & Capstone
  // ─────────────────────────────────────────────────────────────────────────────
  {
    unit_number: 9,
    title: 'Advanced Topics & Capstone',
    description: 'Bit manipulation, multi-file programs, and a full capstone project.',
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Bitwise Operators',
        type: LessonType.CONCEPT,
        duration_minutes: 8,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Working at the Bit Level' },
            { type: 'code_block', language: 'c', code: 'int a = 12; // 1100 in binary\nint b = 10; // 1010 in binary\n\nprintf("%d\\n", a & b);  // 8   AND:  1000\nprintf("%d\\n", a | b);  // 14  OR:   1110\nprintf("%d\\n", a ^ b);  // 6   XOR:  0110\nprintf("%d\\n", ~a);     // -13 NOT:  complement\nprintf("%d\\n", a << 1); // 24  left shift  (multiply by 2)\nprintf("%d\\n", a >> 1); // 6   right shift (divide by 2)\n\n// Check if bit n is set\nint checkBit(int num, int n) {\n    return (num >> n) & 1;\n}\n\n// Set bit n\nint setBit(int num, int n) {\n    return num | (1 << n);\n}\n\n// Clear bit n\nint clearBit(int num, int n) {\n    return num & ~(1 << n);\n}' },
            { type: 'callout', variant: 'info', text: 'Bitwise operations are extremely fast — they map to single CPU instructions. They are used in embedded systems, graphics, encryption, and performance-critical code.' },
          ]
        },
      },
      {
        lesson_number: 2,
        title: 'Multi-file Programs & Header Files',
        type: LessonType.CONCEPT,
        duration_minutes: 8,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Splitting Code Across Files' },
            { type: 'code_block', language: 'c', code: '// math_utils.h — declarations only\n#ifndef MATH_UTILS_H\n#define MATH_UTILS_H\n\nint add(int a, int b);\nint subtract(int a, int b);\nfloat power(float base, int exp);\n\n#endif\n\n// math_utils.c — definitions\n#include "math_utils.h"\n\nint add(int a, int b) { return a + b; }\nint subtract(int a, int b) { return a - b; }\n\n// main.c — usage\n#include <stdio.h>\n#include "math_utils.h"\n\nint main() {\n    printf("%d\\n", add(3, 4));\n    return 0;\n}\n\n// Compile: gcc main.c math_utils.c -o program' },
            { type: 'callout', variant: 'tip', text: 'Use #ifndef / #define / #endif guards in every header file to prevent double-inclusion. This is called an include guard.' },
          ]
        },
      },
      {
        lesson_number: 3,
        title: 'Common Algorithms in C',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 25,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Quick Sort' },
            { type: 'code_block', language: 'c', code: 'void quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        // Partition\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;\n            }\n        }\n        int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;\n        int pi = i + 1;\n\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}' },
            { type: 'heading', text: 'Binary Search (recursive)' },
            { type: 'code_block', language: 'c', code: 'int binarySearch(int arr[], int low, int high, int target) {\n    if (low > high) return -1;\n    int mid = (low + high) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] > target)\n        return binarySearch(arr, low, mid-1, target);\n    return binarySearch(arr, mid+1, high, target);\n}' },
          ]
        },
        starter_code: '#include <stdio.h>\n\nvoid quickSort(int arr[], int low, int high);\nint binarySearch(int arr[], int low, int high, int target);\nvoid printArray(int arr[], int n);\n\nint main() {\n    int arr[] = {64,34,25,12,22,11,90};\n    int n = 7;\n\n    printf("Before sort: ");\n    printArray(arr, n);\n\n    quickSort(arr, 0, n-1);\n\n    printf("After sort: ");\n    printArray(arr, n);\n\n    int idx = binarySearch(arr, 0, n-1, 25);\n    printf("Found 25 at index: %d\\n", idx);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: '11' }, { type: 'output_contains', value: 'Found 25' }]
      },
      {
        lesson_number: 4,
        title: 'Error Handling Patterns',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Error Handling in C' },
            { type: 'code_block', language: 'c', code: '#include <stdio.h>\n#include <errno.h>\n#include <string.h>\n\n// Return codes pattern\n#define SUCCESS  0\n#define ERR_NULL -1\n#define ERR_RANGE -2\n\nint divide(int a, int b, int *result) {\n    if (result == NULL) return ERR_NULL;\n    if (b == 0) return ERR_RANGE;\n    *result = a / b;\n    return SUCCESS;\n}\n\nint main() {\n    int result;\n    int status = divide(10, 2, &result);\n    if (status == SUCCESS)\n        printf("Result: %d\\n", result);\n    else\n        printf("Error code: %d\\n", status);\n\n    // errno from standard library\n    FILE *fp = fopen("nonexistent.txt", "r");\n    if (fp == NULL) {\n        printf("Error: %s\\n", strerror(errno)); // No such file\n    }\n    return 0;\n}' },
            { type: 'callout', variant: 'info', text: 'C has no exceptions — use return codes (int status) or errno. Always check the return value of system calls like fopen, malloc, scanf. Never assume success.' },
          ]
        },
      },
      {
        lesson_number: 5,
        title: 'Capstone: Mini Library Management System',
        type: LessonType.PROJECT,
        duration_minutes: 40,
        xp_reward: 50,
        language: 'c',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Capstone Project' },
            { type: 'paragraph', text: 'Build a complete library management system using all concepts you have learned: structs, dynamic memory, file I/O, functions, arrays, and string handling.' },
            { type: 'code_block', language: 'c', code: '// Features to implement:\n// 1. Add book (id, title, author, year, available)\n// 2. Display all books\n// 3. Search by title or author\n// 4. Issue book (mark unavailable)\n// 5. Return book (mark available)\n// 6. Save library to file (books.dat)\n// 7. Load library from file\n// 8. Statistics: total, available, issued count\n\n// Expected Output:\n// === Library Management System ===\n// 1. Add Book     2. Display All\n// 3. Search       4. Issue Book\n// 5. Return Book  6. Save\n// 7. Load         8. Statistics\n// 9. Exit' },
            { type: 'callout', variant: 'tip', text: 'Start with the struct definition and basic display. Then add one feature at a time. Use functions for each menu option. Test after every addition.' },
          ]
        },
        starter_code: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n#define MAX_BOOKS 100\n\ntypedef struct {\n    int id;\n    char title[100];\n    char author[60];\n    int year;\n    int available; // 1=yes, 0=no\n} Book;\n\ntypedef struct {\n    Book *books;\n    int count;\n    int capacity;\n} Library;\n\nLibrary* initLibrary(int capacity);\nvoid freeLibrary(Library *lib);\nvoid addBook(Library *lib, int id, char *title, char *author, int year);\nvoid displayAll(Library *lib);\nvoid searchBooks(Library *lib, char *query);\nint issueBook(Library *lib, int id);\nint returnBook(Library *lib, int id);\nvoid saveLibrary(Library *lib, const char *filename);\nvoid loadLibrary(Library *lib, const char *filename);\nvoid showStats(Library *lib);\nvoid printMenu();\n\nint main() {\n    Library *lib = initLibrary(MAX_BOOKS);\n    printf("=== Library Management System ===\\n");\n    // Implement menu loop\n    freeLibrary(lib);\n    return 0;\n}\n',
        test_cases_json: [{ type: 'output_contains', value: 'Library' }]
      },
    ]
  },
];
