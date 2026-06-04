import { LessonType } from '@prisma/client';

export const javascriptTrackData = {
  slug: 'javascript',
  title: 'JavaScript Programming',
  description: "Go from zero to job-ready JavaScript — the language of the web. Build real projects, understand the browser, and write modern ES6+ code.",
  icon: '⚡',
  color_hex: '#F7DF1E',
  total_units: 9,
  total_lessons: 46,
  is_published: true,
};

export const javascriptUnits = [
  {
    unit_number: 1,
    title: "Getting Started with JavaScript",
    description: "Learn the basics of JS",
    xp_reward: 95,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "What is JavaScript & Where It Runs", type: LessonType.CONCEPT, duration_minutes: 7, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "What is JavaScript?" },
          { type: 'paragraph', text: "JavaScript is the only programming language that runs natively in every web browser. It was created in just 15 days by Brendan Eich at Netscape in 1995. Originally named Mocha, then renamed JavaScript — not because it's related to Java, but to ride Java's popularity wave." },
          { type: 'heading', text: "JavaScript vs Java" },
          { type: 'list', items: ["JavaScript runs in browsers and servers (Node.js). Java is a compiled language for enterprise apps.", "JavaScript is dynamically typed. Java is statically typed.", "JavaScript uses prototype-based OOP. Java uses class-based OOP.", "They share NO technical relationship — just a naming coincidence."] },
          { type: 'heading', text: "The ECMAScript Standard" },
          { type: 'paragraph', text: "JavaScript follows the ECMAScript (ES) specification maintained by a community. ES5 (2009) standardised the language. ES6 (2015) was a massive upgrade — adding let, const, arrow functions, classes, template literals, and much more. Modern JavaScript = ES6+." },
          { type: 'code_block', language: 'javascript', code: "// Your first JavaScript program\nconsole.log('Hello, World!');\n\n// JavaScript runs in:\n// 1. Browser (Chrome, Firefox, Safari)\n// 2. Server (Node.js)\n// 3. Mobile (React Native)\n// 4. Desktop (Electron)" },
          { type: 'heading', text: "How to Run JS" },
          { type: 'list', items: ["Browser DevTools: press F12 → Console tab → type JS directly", "VS Code + Live Server extension for HTML files", "Node.js: run .js files from terminal with: node filename.js", "Online: replit.com, codepen.io, jsfiddle.net"] },
          { type: 'callout', variant: 'info', text: "JavaScript is the ONLY language that runs natively in web browsers. HTML structures content, CSS styles it, JavaScript makes it interactive." },
          { type: 'exercise', title: "Your First JS Program", description: "Write JavaScript that logs: 'JavaScript is awesome!' to the console." }
        ]},
        starter_code: "// Write your first JavaScript program below\n",
        test_cases_json: [{ "type": "output_contains", "value": "JavaScript is awesome!" }]
      },
      {
        lesson_number: 2, title: "Variables: var, let, const", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Three Ways to Declare Variables" },
          { type: 'code_block', language: 'javascript', code: "// var — old way (ES5), avoid in modern JS\nvar name = 'Harsh';\nvar name = 'Rahul'; // redeclaration allowed — no error!\n\n// let — modern, block-scoped\nlet age = 21;\nage = 22; // reassignment OK\n// let age = 23; // ERROR: cannot redeclare\n\n// const — constant, cannot reassign\nconst PI = 3.14159;\n// PI = 3; // ERROR: Assignment to constant variable" },
          { type: 'heading', text: "Scope Differences" },
          { type: 'code_block', language: 'javascript', code: "var x = 'global';\n\nif (true) {\n  var x = 'still global'; // var ignores block scope!\n  let y = 'block only';   // let respects block scope\n  const z = 'also block'; // const respects block scope\n}\n\nconsole.log(x); // 'still global' — var leaked out!\n// console.log(y); // ReferenceError — y not accessible here" },
          { type: 'heading', text: "Temporal Dead Zone (TDZ)" },
          { type: 'code_block', language: 'javascript', code: "// var is hoisted and set to undefined\nconsole.log(a); // undefined (no error)\nvar a = 5;\n\n// let/const cause ReferenceError if accessed before declaration\n// console.log(b); // ReferenceError: Cannot access 'b' before initialization\nlet b = 10;" },
          { type: 'callout', variant: 'warning', text: "Always use const by default. Use let only when you need to reassign. Never use var in modern JavaScript." },
          { type: 'heading', text: "Quick Rule" },
          { type: 'list', items: ["const — use for everything that won't change (default choice)", "let — use when value needs to change (loop counters, running totals)", "var — avoid completely in ES6+ code"] },
          { type: 'exercise', title: "Variable Declarations", description: "Declare:\n1) a const called firstName with your name,\n2) a let called score starting at 0, then reassign it to 100,\n3) a const called isStudent set to true. Log all three values." }
        ]},
        starter_code: "// 1. const firstName\n\n// 2. let score — start at 0, then reassign to 100\n\n// 3. const isStudent\n\n// Log all three\n",
        test_cases_json: [{ "type": "output_contains", "value": "100" }, { "type": "output_contains", "value": "true" }]
      }
    ]
  },
  {
    unit_number: 2,
    title: "Control Flow",
    description: "Learn Control Flow",
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "If / Else / Else If", type: LessonType.EXERCISE, duration_minutes: 8, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Conditional Statements" },
          { type: 'code_block', language: 'javascript', code: "const score = 85;\n\nif (score >= 90) {\n  console.log('Grade: A+');\n} else if (score >= 80) {\n  console.log('Grade: A');\n} else if (score >= 70) {\n  console.log('Grade: B');\n} else if (score >= 60) {\n  console.log('Grade: C');\n} else {\n  console.log('Grade: F');\n}" },
          { type: 'heading', text: "Ternary Operator" },
          { type: 'code_block', language: 'javascript', code: "const age = 20;\nconst access = age >= 18 ? 'Allowed' : 'Denied';\nconsole.log(access);\n\nconst grade = score >= 90 ? 'A+'\n            : score >= 80 ? 'A'\n            : score >= 70 ? 'B'\n            : 'F';\nconsole.log(grade);" },
          { type: 'heading', text: "Switch Statement" },
          { type: 'code_block', language: 'javascript', code: "const day = 'Monday';\nswitch(day) {\n  case 'Monday':\n  case 'Tuesday':\n  case 'Wednesday':\n  case 'Thursday':\n  case 'Friday':\n    console.log('Weekday');\n    break;\n  case 'Saturday':\n  case 'Sunday':\n    console.log('Weekend!');\n    break;\n  default:\n    console.log('Invalid day');\n}" },
          { type: 'callout', variant: 'warning', text: "Always add break at the end of each switch case. Without it, execution falls through to the next case." },
          { type: 'exercise', title: "Grade & Season Checker", description: "1) Write if/else if: score>=90='A+', >=80='A', >=70='B', >=60='C', else 'F'. Test with score=76.\n2) Ternary: check if a number is even or odd.\n3) Switch for months 1-12 grouped into seasons: Dec-Feb=Winter, Mar-May=Spring, Jun-Aug=Summer, Sep-Nov=Autumn." }
        ]},
        starter_code: "const score = 76;\n// 1. Grade checker\n\n// 2. Even/odd ternary\nconst num = 7;\n\n// 3. Season switch\nconst month = 4;\n",
        test_cases_json: [{"type":"output_contains","value":"B"},{"type":"output_contains","value":"odd"},{"type":"output_contains","value":"Spring"}]
      },
      {
        lesson_number: 2, title: "For Loops", type: LessonType.EXERCISE, duration_minutes: 8, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "The For Loop" },
          { type: 'code_block', language: 'javascript', code: "for (let i = 0; i < 5; i++) {\n  console.log(`Step ${i}`);\n}\n\nconst fruits = ['apple','banana','mango'];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(`${i}: ${fruits[i]}`);\n}\n\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\nconst person = { name: 'Harsh', age: 21 };\nfor (const key in person) {\n  console.log(`${key}: ${person[key]}`);\n}" },
          { type: 'heading', text: "Break & Continue" },
          { type: 'code_block', language: 'javascript', code: "for (let i = 0; i < 10; i++) {\n  if (i === 5) break;\n  console.log(i);\n}\n\nfor (let i = 0; i < 10; i++) {\n  if (i % 2 === 0) continue;\n  console.log(i);\n}" },
          { type: 'exercise', title: "Loop Challenges", description: "1) Print multiplication table of 9 (9x1 to 9x10).\n2) Use for...of to print each item in ['HTML','CSS','JavaScript','React'] with its index using a counter variable.\n3) Print all numbers 1-100 divisible by both 3 and 7." }
        ]},
        starter_code: "// 1. Multiplication table of 9\n\n// 2. Tech stack with index\nconst stack = ['HTML','CSS','JavaScript','React'];\n\n// 3. Divisible by 3 AND 7\n",
        test_cases_json: [{"type":"output_contains","value":"81"},{"type":"output_contains","value":"21"}]
      },
      {
        lesson_number: 3, title: "While & Do-While", type: LessonType.EXERCISE, duration_minutes: 7, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "While Loop" },
          { type: 'code_block', language: 'javascript', code: "let count = 1;\nwhile (count <= 5) {\n  console.log(`Count: ${count}`);\n  count++;\n}\n\nlet num = 256;\nlet steps = 0;\nwhile (num > 1) {\n  num = num / 2;\n  steps++;\n}\nconsole.log(`Steps: ${steps}`);" },
          { type: 'heading', text: "Do-While Loop" },
          { type: 'code_block', language: 'javascript', code: "let attempt = 1;\ndo {\n  console.log(`Attempt ${attempt}`);\n  attempt++;\n} while (attempt <= 3);\n\nlet x = 100;\ndo {\n  console.log('Runs once even though x > 1');\n} while (x < 1);" },
          { type: 'callout', variant: 'tip', text: "Use while when iterations are unknown. Use do-while when you need at least one execution." },
          { type: 'exercise', title: "While Loop Challenges", description: "1) Start at 1, double each iteration, stop when > 1000. Log each value.\n2) Do-while: simulate dice rolls (Math.floor(Math.random()*6)+1) until you get 6. Log each roll." }
        ]},
        starter_code: "// 1. Double until > 1000\nlet val = 1;\n\n// 2. Roll until 6\nlet roll;\n",
        test_cases_json: [{"type":"output_contains","value":"1024"}]
      },
      {
        lesson_number: 4, title: "Error Handling", type: LessonType.CONCEPT, duration_minutes: 8, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "try / catch / finally" },
          { type: 'code_block', language: 'javascript', code: "try {\n  const result = JSON.parse('invalid {');\n} catch (error) {\n  console.log('Error caught:', error.message);\n} finally {\n  console.log('Always runs');\n}\n\nfunction divide(a, b) {\n  if (b === 0) throw new Error('Cannot divide by zero');\n  return a / b;\n}\n\ntry {\n  console.log(divide(10, 0));\n} catch (e) {\n  console.log(e.message);\n}" },
          { type: 'callout', variant: 'info', text: "JS error types: Error (generic), TypeError (wrong type), ReferenceError (undefined variable), SyntaxError (invalid syntax), RangeError (value out of range)." }
        ]},
      },
      {
        lesson_number: 5, title: "Project: Number Guessing Game", type: LessonType.PROJECT, duration_minutes: 20, xp_reward: 50, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build a number guessing game. Use a fixed secret number and an array of simulated guesses. After each guess print 'Too high!', 'Too low!', or 'Correct!'. Show attempt number." },
          { type: 'code_block', language: 'javascript', code: "// Expected Output:\n// \ud83c\udfae Number Guessing Game\n// Attempt 1: 50 \u2192 Too high!\n// Attempt 2: 25 \u2192 Too low!\n// Attempt 3: 37 \u2192 Too high!\n// Attempt 4: 30 \u2192 Too low!\n// Attempt 5: 42 \u2192 \ud83c\udf89 Correct! Found in 5 attempts!" }
        ]},
        starter_code: "const secret = 42;\nconst guesses = [50, 25, 37, 30, 42];\nlet found = false;\n\nconsole.log('\ud83c\udfae Number Guessing Game');\n\n// Loop through guesses\n",
        test_cases_json: [{"type":"output_contains","value":"Correct"}]
      }
    ]
  },
  {
    unit_number: 3,
    title: "Functions",
    description: "Learn Functions",
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "Function Declarations & Expressions", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Three Ways to Write Functions" },
          { type: 'code_block', language: 'javascript', code: "// 1. Declaration \u2014 hoisted\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// 2. Expression \u2014 not hoisted\nconst greetExp = function(name) {\n  return `Hello, ${name}!`;\n};\n\n// 3. Arrow \u2014 concise\nconst greetArrow = (name) => `Hello, ${name}!`;\n\nconsole.log(greet('Harsh'));\nconsole.log(greetExp('Harsh'));\nconsole.log(greetArrow('Harsh'));" },
          { type: 'heading', text: "Arrow Function Shorthand" },
          { type: 'code_block', language: 'javascript', code: "const double = n => n * 2;\nconst add = (a, b) => a + b;\nconst multiply = (a, b) => {\n  const result = a * b;\n  return result;\n};\nconsole.log(double(5));\nconsole.log(add(3, 4));\nconsole.log(multiply(3, 4));" },
          { type: 'heading', text: "Hoisting" },
          { type: 'code_block', language: 'javascript', code: "sayHi();\nfunction sayHi() { console.log('Hi!'); }\n\n// sayBye(); // TypeError\nconst sayBye = () => console.log('Bye!');\nsayBye();" },
          { type: 'callout', variant: 'warning', text: "Function expressions and arrow functions are NOT hoisted. Only function declarations are hoisted." },
          { type: 'exercise', title: "Function Converter Suite", description: "Write all 3 function types for:\n1) kmToMiles(km) \u2014 1km=0.621371 miles as declaration.\n2) celsiusToFahrenheit(c) \u2014 F=c*9/5+32 as expression.\n3) isEven(n) returns true/false as arrow. Log results." }
        ]},
        starter_code: "function kmToMiles(km) {}\n\nconst celsiusToFahrenheit = function(c) {};\n\nconst isEven = n => {};\n\nconsole.log(kmToMiles(10));\nconsole.log(celsiusToFahrenheit(100));\nconsole.log(isEven(7));\n",
        test_cases_json: [{"type":"output_contains","value":"6.21"},{"type":"output_contains","value":"212"},{"type":"output_contains","value":"false"}]
      },
      {
        lesson_number: 2, title: "Parameters, Arguments & Defaults", type: LessonType.EXERCISE, duration_minutes: 8, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Default Parameters" },
          { type: 'code_block', language: 'javascript', code: "function greet(name = 'Guest', greeting = 'Hello') {\n  return `${greeting}, ${name}!`;\n}\nconsole.log(greet());\nconsole.log(greet('Harsh'));\nconsole.log(greet('Priya', 'Hey'));" },
          { type: 'heading', text: "Rest & Spread" },
          { type: 'code_block', language: 'javascript', code: "function sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\nconsole.log(sum(1, 2, 3));\nconsole.log(sum(1, 2, 3, 4, 5));\n\nconst nums = [3, 1, 4, 1, 5, 9];\nconsole.log(Math.max(...nums));\n\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconsole.log([...arr1, ...arr2]);" },
          { type: 'exercise', title: "Flexible Functions", description: "1) createTag(tag='div', content='Hello') returns '<div>Hello</div>'.\n2) average(...nums) returns the average using rest params.\n3) mergeArrays(...arrays) merges any number of arrays using spread." }
        ]},
        starter_code: "function createTag(tag = 'div', content = 'Hello') {}\n\nconst average = (...nums) => {};\n\nconst mergeArrays = (...arrays) => {};\n\nconsole.log(createTag());\nconsole.log(createTag('h1', 'Hello World'));\nconsole.log(average(10, 20, 30, 40));\nconsole.log(mergeArrays([1,2],[3,4],[5,6]));\n",
        test_cases_json: [{"type":"output_contains","value":"<div>Hello</div>"},{"type":"output_contains","value":"25"}]
      },
      {
        lesson_number: 3, title: "Higher-Order Functions", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Functions as Values" },
          { type: 'code_block', language: 'javascript', code: "function applyTwice(fn, value) {\n  return fn(fn(value));\n}\nconst double = x => x * 2;\nconsole.log(applyTwice(double, 3)); // 12\n\nfunction multiplier(factor) {\n  return (number) => number * factor;\n}\nconst triple = multiplier(3);\nconst quadruple = multiplier(4);\nconsole.log(triple(5));\nconsole.log(quadruple(5));" },
          { type: 'heading', text: "map, filter, reduce" },
          { type: 'code_block', language: 'javascript', code: "const nums = [1,2,3,4,5,6,7,8,9,10];\n\nconst squares = nums.map(n => n ** 2);\nconsole.log(squares);\n\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log(evens);\n\nconst total = nums.reduce((acc, n) => acc + n, 0);\nconsole.log(total);\n\nconst result = nums\n  .filter(n => n % 2 === 0)\n  .map(n => n ** 2)\n  .reduce((a, n) => a + n, 0);\nconsole.log(result);" },
          { type: 'exercise', title: "Array Method Chain", description: "Given students array with name and score.\n1) filter students scoring >=70.\n2) map to get names only.\n3) reduce to find average score of ALL.\n4) Chain filter+map to get names of failing students (score<70)." }
        ]},
        starter_code: "const students = [\n  { name: 'Alice', score: 92 },\n  { name: 'Bob', score: 65 },\n  { name: 'Charlie', score: 88 },\n  { name: 'Dave', score: 45 },\n  { name: 'Eve', score: 78 }\n];\n\n// 1. Passing students\n\n// 2. Names only\n\n// 3. Average score\n\n// 4. Failing names\n",
        test_cases_json: [{"type":"output_contains","value":"Alice"},{"type":"output_contains","value":"Dave"}]
      },
      {
        lesson_number: 4, title: "Closures", type: LessonType.CONCEPT, duration_minutes: 10, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "What is a Closure?" },
          { type: 'paragraph', text: "A closure is a function that remembers variables from the scope where it was created \u2014 even after the outer function has finished executing." },
          { type: 'code_block', language: 'javascript', code: "function makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3\n\nconst counter2 = makeCounter();\nconsole.log(counter2()); // 1 \u2014 independent!" },
          { type: 'heading', text: "Practical: Discount Generator" },
          { type: 'code_block', language: 'javascript', code: "function discountMaker(discountPercent) {\n  return (price) => price - (price * discountPercent / 100);\n}\n\nconst tenOff = discountMaker(10);\nconst twentyOff = discountMaker(20);\nconst halfOff = discountMaker(50);\n\nconsole.log(tenOff(1000));\nconsole.log(twentyOff(1000));\nconsole.log(halfOff(1000));" },
          { type: 'callout', variant: 'info', text: "Closures enable: data privacy (private variables), function factories, memoization, and the module pattern. They are one of JavaScript's most powerful and unique features." }
        ]},
      },
      {
        lesson_number: 5, title: "Pure Functions & Side Effects", type: LessonType.CONCEPT, duration_minutes: 7, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Pure vs Impure" },
          { type: 'code_block', language: 'javascript', code: "// PURE \u2014 same input always gives same output\nfunction add(a, b) { return a + b; }\n\n// IMPURE \u2014 modifies external state\nlet total = 0;\nfunction addToTotal(n) {\n  total += n; // side effect\n  return total;\n}\n\n// IMPURE \u2014 depends on external state\nlet rate = 0.18;\nfunction getGST(price) {\n  return price * rate; // depends on outer rate\n}" },
          { type: 'callout', variant: 'tip', text: "Prefer pure functions. They are predictable, easy to test, and easy to debug. This is the foundation of functional programming." }
        ]},
      },
      {
        lesson_number: 6, title: "Project: Calculator with History", type: LessonType.PROJECT, duration_minutes: 20, xp_reward: 50, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build a calculator using closures. Private history array stores all operations. Support add, subtract, multiply, divide, and getHistory()." },
          { type: 'code_block', language: 'javascript', code: "// Expected Output:\n// 15\n// 10\n// 50\n// 5\n// History: ['10 + 5 = 15','15 - 5 = 10','10 * 5 = 50','50 / 10 = 5']" }
        ]},
        starter_code: "function createCalculator() {\n  const history = [];\n\n  return {\n    add(a, b) {},\n    subtract(a, b) {},\n    multiply(a, b) {},\n    divide(a, b) {},\n    getHistory() { return history; }\n  };\n}\n\nconst calc = createCalculator();\nconsole.log(calc.add(10, 5));\nconsole.log(calc.subtract(15, 5));\nconsole.log(calc.multiply(10, 5));\nconsole.log(calc.divide(50, 10));\nconsole.log('History:', calc.getHistory());\n",
        test_cases_json: [{"type":"output_contains","value":"15"},{"type":"output_contains","value":"History"}]
      }
    ]
  },
  {
    unit_number: 4,
    title: "Arrays & Array Methods",
    description: "Learn Arrays & Array Methods",
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "Array Basics", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Creating & Accessing Arrays" },
          { type: 'code_block', language: 'javascript', code: "const fruits = ['apple','banana','mango'];\nconsole.log(fruits[0]);\nconsole.log(fruits.at(-1));\nconsole.log(fruits.length);\n\nfruits[1] = 'blueberry';\nfruits.push('grape');\nfruits.pop();\nfruits.unshift('kiwi');\nfruits.shift();\nfruits.splice(1, 1, 'pear');\nconsole.log(fruits);" },
          { type: 'heading', text: "Searching" },
          { type: 'code_block', language: 'javascript', code: "const nums = [10,20,30,40,50];\nconsole.log(nums.indexOf(30));\nconsole.log(nums.includes(40));\nconsole.log(nums.find(n => n > 25));\nconsole.log(nums.findIndex(n => n > 25));" },
          { type: 'exercise', title: "Array Manager", description: "scores=[85,92,78,95,88,72].\n1) Log max and min using Math.max/min with spread.\n2) Add 100 to end, 60 to start.\n3) Remove last element.\n4) Find first score above 90.\n5) Check if 78 is in array." }
        ]},
        starter_code: "const scores = [85, 92, 78, 95, 88, 72];\n\n// 1. Max and min\n\n// 2. Add 100 to end, 60 to start\n\n// 3. Remove last\n\n// 4. First score above 90\n\n// 5. Does 78 exist?\n",
        test_cases_json: [{"type":"output_contains","value":"95"},{"type":"output_contains","value":"true"}]
      },
      {
        lesson_number: 2, title: "map, filter, reduce", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "The Three Essential Methods" },
          { type: 'code_block', language: 'javascript', code: "const prices = [100,250,75,400,150];\n\nconst withGST = prices.map(p => p * 1.18);\nconsole.log(withGST);\n\nconst affordable = prices.filter(p => p < 200);\nconsole.log(affordable);\n\nconst total = prices.reduce((sum, p) => sum + p, 0);\nconsole.log(total);\n\nconst premiumTotal = prices\n  .filter(p => p >= 200)\n  .map(p => p * 0.9)\n  .reduce((s, p) => s + p, 0);\nconsole.log(premiumTotal);" },
          { type: 'exercise', title: "E-commerce Cart", description: "cart=[{name,price,qty}...].\n1) map to add total=price*qty.\n2) filter items with total>1000.\n3) reduce for grand total.\n4) Get names of items costing more than 1000 each." }
        ]},
        starter_code: "const cart = [\n  { name: 'Laptop', price: 50000, qty: 1 },\n  { name: 'Mouse', price: 800, qty: 2 },\n  { name: 'Keyboard', price: 1500, qty: 1 },\n  { name: 'Monitor', price: 15000, qty: 1 }\n];\n\n// 1. Add total field\n\n// 2. Items with total > 1000\n\n// 3. Grand total\n\n// 4. Names of items > 1000 each\n",
        test_cases_json: [{"type":"output_contains","value":"Laptop"},{"type":"output_contains","value":"68900"}]
      },
      {
        lesson_number: 3, title: "Sorting & Searching", type: LessonType.EXERCISE, duration_minutes: 8, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Sorting Arrays" },
          { type: 'code_block', language: 'javascript', code: "const names = ['Charlie','Alice','Bob','Dave'];\nnames.sort();\nconsole.log(names);\n\nconst nums = [10,1,5,100,2];\nnums.sort((a, b) => a - b);\nconsole.log(nums);\n\nnums.sort((a, b) => b - a);\nconsole.log(nums);\n\nconst students = [{name:'Bob',score:75},{name:'Alice',score:92}];\nstudents.sort((a, b) => b.score - a.score);\nconsole.log(students.map(s => s.name));" },
          { type: 'callout', variant: 'warning', text: "Never use .sort() on numbers without a compare function! JS sorts numbers as strings by default: [1,10,100,2,5]." },
          { type: 'exercise', title: "Sorting Challenge", description: "1) Sort [3,1,4,1,5,9,2,6] ascending and descending.\n2) Sort products by price ascending.\n3) Find 2nd highest in [8,3,9,1,7,4] without sort." }
        ]},
        starter_code: "const nums = [3,1,4,1,5,9,2,6];\n\nconst products = [\n  { name: 'Laptop', price: 50000 },\n  { name: 'Mouse', price: 800 },\n  { name: 'Monitor', price: 15000 }\n];\n\nconst scores = [8,3,9,1,7,4];\n",
        test_cases_json: [{"type":"output_contains","value":"Mouse"},{"type":"output_contains","value":"8"}]
      },
      {
        lesson_number: 4, title: "Destructuring & Spread", type: LessonType.EXERCISE, duration_minutes: 8, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Array Destructuring" },
          { type: 'code_block', language: 'javascript', code: "const [first, second, ...rest] = [10,20,30,40,50];\nconsole.log(first);\nconsole.log(second);\nconsole.log(rest);\n\nlet a = 1, b = 2;\n[a, b] = [b, a];\nconsole.log(a, b);\n\nconst [,, third] = [10,20,30];\nconsole.log(third);" },
          { type: 'heading', text: "Spread & Deep Copy" },
          { type: 'code_block', language: 'javascript', code: "const original = [1,2,3];\nconst copy = [...original];\ncopy.push(4);\nconsole.log(original);\n\nconst merged = [...[1,2],...[3,4],...[5,6]];\nconsole.log(merged);\n\nconst nested = [[1,2],[3,4]];\nconst deepCopy = JSON.parse(JSON.stringify(nested));\ndeepCopy[0].push(99);\nconsole.log(nested);" },
          { type: 'exercise', title: "Destructuring Practice", description: "1) Destructure rgb=[255,128,0] into r,g,b.\n2) Write minMax(arr) returning [min,max] and destructure result.\n3) Merge two skill arrays without duplicates using spread and Set." }
        ]},
        starter_code: "const rgb = [255, 128, 0];\n// 1. Destructure\n\n// 2. minMax\nfunction minMax(arr) {}\nconst [min, max] = minMax([5,3,8,1,9,2]);\nconsole.log(min, max);\n\n// 3. Merge without duplicates\nconst a = ['JS','React','CSS'];\nconst b = ['CSS','Node','JS'];\n",
        test_cases_json: [{"type":"output_contains","value":"255"},{"type":"output_contains","value":"9"}]
      },
      {
        lesson_number: 5, title: "forEach & Iterators", type: LessonType.CONCEPT, duration_minutes: 7, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "forEach vs map + other methods" },
          { type: 'code_block', language: 'javascript', code: "const nums = [1,2,3,4,5];\n\nnums.forEach((n, index) => {\n  console.log(`[${index}] = ${n}`);\n});\n\nconsole.log(nums.some(n => n > 4));\nconsole.log(nums.every(n => n > 0));\n\nconst nested = [[1,2],[3,[4,5]]];\nconsole.log(nested.flat());\nconsole.log(nested.flat(2));" },
          { type: 'callout', variant: 'tip', text: "forEach is for side effects only \u2014 it returns undefined. Use map when you need a new transformed array." }
        ]},
      },
      {
        lesson_number: 6, title: "Project: Student Grade Book", type: LessonType.PROJECT, duration_minutes: 20, xp_reward: 50, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build a grade book using array methods only. No loops \u2014 use map, filter, reduce, sort, find." },
          { type: 'code_block', language: 'javascript', code: "// Expected Output:\n// Alice   : 92 \u2192 A+\n// Bob     : 65 \u2192 C\n// Charlie : 88 \u2192 A\n// Dave    : 45 \u2192 F\n// Eve     : 78 \u2192 B\n// Class Average: 73.6\n// Top Student: Alice (92)\n// Failing: Dave\n// Pass Rate: 80%" }
        ]},
        starter_code: "const students = [\n  { name: 'Alice', score: 92 },\n  { name: 'Bob', score: 65 },\n  { name: 'Charlie', score: 88 },\n  { name: 'Dave', score: 45 },\n  { name: 'Eve', score: 78 }\n];\n\nconst getGrade = score =>\n  score >= 90 ? 'A+' : score >= 80 ? 'A' :\n  score >= 70 ? 'B' : score >= 60 ? 'C' : 'F';\n\n// Grade report using map + forEach\n\n// Average using reduce\n\n// Top student\n\n// Failing students\n\n// Pass rate\n",
        test_cases_json: [{"type":"output_contains","value":"Alice"},{"type":"output_contains","value":"Average"}]
      }
    ]
  },
  {
    unit_number: 5,
    title: "Objects",
    description: "Learn Objects",
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "Object Basics", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Creating & Accessing Objects" },
          { type: 'code_block', language: 'javascript', code: "const person = {\n  name: 'Harsh',\n  age: 21,\n  city: 'Mumbai',\n  isStudent: true\n};\n\nconsole.log(person.name);\nconst key = 'age';\nconsole.log(person[key]);\n\nperson.email = 'harsh@dev.com';\ndelete person.isStudent;\n\nconsole.log('name' in person);\nconsole.log('phone' in person);" },
          { type: 'heading', text: "Nested Objects & Optional Chaining" },
          { type: 'code_block', language: 'javascript', code: "const user = {\n  name: 'Harsh',\n  address: {\n    city: 'Mumbai',\n    coords: { lat: 19.076, lng: 72.877 }\n  }\n};\n\nconsole.log(user.address.city);\nconsole.log(user.address.coords.lat);\nconsole.log(user.phone?.number);\nconsole.log(user.address?.coords?.lat);" },
          { type: 'exercise', title: "Object Operations", description: "Create laptop object with brand, model, price, specs (nested: ram, storage, processor).\n1) Log brand and specs.ram.\n2) Add color property.\n3) Check if 'price' and 'warranty' exist.\n4) Optional chain laptop.battery?.life." }
        ]},
        starter_code: "const laptop = {\n  brand: 'Dell',\n  model: 'XPS 15',\n  price: 85000,\n  specs: {\n    ram: '16GB',\n    storage: '512GB SSD',\n    processor: 'Intel i7'\n  }\n};\n\n// 1. Log brand and RAM\n\n// 2. Add color\n\n// 3. Check price and warranty\n\n// 4. Optional chaining\n",
        test_cases_json: [{"type":"output_contains","value":"Dell"},{"type":"output_contains","value":"16GB"}]
      },
      {
        lesson_number: 2, title: "Object Destructuring", type: LessonType.EXERCISE, duration_minutes: 8, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Destructuring Objects" },
          { type: 'code_block', language: 'javascript', code: "const user = { name:'Harsh', age:21, city:'Mumbai', role:'developer' };\n\nconst { name, age } = user;\nconsole.log(name, age);\n\nconst { name: userName, city: location } = user;\nconsole.log(userName, location);\n\nconst { role, salary = 50000 } = user;\nconsole.log(role, salary);\n\nfunction greetUser({ name, age = 18 }) {\n  console.log(`Hi ${name}, age ${age}`);\n}\ngreetUser(user);" },
          { type: 'heading', text: "Object Spread" },
          { type: 'code_block', language: 'javascript', code: "const defaults = { theme:'light', lang:'en', notifications:true };\nconst userPrefs = { theme:'dark', fontSize:16 };\n\nconst settings = { ...defaults, ...userPrefs };\nconsole.log(settings);\n\nconst original = { x:1, y:2 };\nconst clone = { ...original };\nclone.x = 99;\nconsole.log(original.x);" },
          { type: 'exercise', title: "Destructuring Practice", description: "product={id,name,price,category,inStock,specs:{ram,storage}}.\n1) Destructure name,price,inStock.\n2) Destructure specs.ram as memory.\n3) formatProduct({name,price,inStock}) logs a card.\n4) Discounted version with spread at 80% price." }
        ]},
        starter_code: "const product = {\n  id: 1, name: 'Laptop', price: 50000,\n  category: 'Electronics', inStock: true,\n  specs: { ram: '16GB', storage: '512GB' }\n};\n\n// 1.\n\n// 2.\n\n// 3.\nfunction formatProduct({ name, price, inStock }) {}\nformatProduct(product);\n\n// 4.\n",
        test_cases_json: [{"type":"output_contains","value":"Laptop"},{"type":"output_contains","value":"40000"}]
      },
      {
        lesson_number: 3, title: "Object Methods & this", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Methods & this" },
          { type: 'code_block', language: 'javascript', code: "const person = {\n  name: 'Harsh',\n  age: 21,\n  greet() {\n    console.log(`Hi, I'm ${this.name}`);\n  },\n  birthday() {\n    this.age++;\n    console.log(`Happy birthday ${this.name}! Now ${this.age}`);\n  }\n};\nperson.greet();\nperson.birthday();" },
          { type: 'heading', text: "Arrow vs Regular this" },
          { type: 'code_block', language: 'javascript', code: "const obj = {\n  name: 'Test',\n  regular() {\n    console.log(this.name); // 'Test'\n  },\n  arrow: () => {\n    console.log(this); // undefined in strict mode\n  }\n};\nobj.regular();" },
          { type: 'callout', variant: 'warning', text: "Never use arrow functions as object methods when you need 'this'. Arrow functions inherit 'this' from the outer scope, not the object." },
          { type: 'exercise', title: "Bank Account Object", description: "Build bankAccount with owner, balance=0, statement=[]. Methods: deposit(amount), withdraw(amount) \u2014 reject if insufficient, getBalance() returns formatted string. Test all." }
        ]},
        starter_code: "const bankAccount = {\n  owner: 'Harsh',\n  balance: 0,\n  statement: [],\n  deposit(amount) {},\n  withdraw(amount) {},\n  getBalance() {}\n};\n\nbankAccount.deposit(5000);\nbankAccount.deposit(3000);\nbankAccount.withdraw(2000);\nbankAccount.withdraw(9000);\nconsole.log(bankAccount.getBalance());\nconsole.log(bankAccount.statement);\n",
        test_cases_json: [{"type":"output_contains","value":"6000"},{"type":"output_contains","value":"Insufficient"}]
      },
      {
        lesson_number: 4, title: "Object.keys, values, entries", type: LessonType.CONCEPT, duration_minutes: 7, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Iterating Objects" },
          { type: 'code_block', language: 'javascript', code: "const scores = { Alice:92, Bob:65, Charlie:88, Dave:45 };\n\nconsole.log(Object.keys(scores));\nconsole.log(Object.values(scores));\nconsole.log(Object.entries(scores));\n\nconst avg = Object.values(scores).reduce((a,b) => a+b, 0) / Object.keys(scores).length;\nconsole.log(avg);\n\nfor (const [name, score] of Object.entries(scores)) {\n  console.log(`${name}: ${score}`);\n}" }
        ]},
      },
      {
        lesson_number: 5, title: "Computed Properties & Dynamic Objects", type: LessonType.CONCEPT, duration_minutes: 7, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Dynamic Property Names" },
          { type: 'code_block', language: 'javascript', code: "const field = 'name';\nconst user = {\n  [field]: 'Harsh',\n  [`${field}Upper`]: 'HARSH'\n};\nconsole.log(user.name);\nconsole.log(user.nameUpper);\n\nfunction createConfig(env) {\n  return {\n    [`${env}_URL`]: `https://${env}.api.com`,\n    [`${env}_KEY`]: Math.random().toString(36)\n  };\n}\nconsole.log(createConfig('prod'));" }
        ]},
      },
      {
        lesson_number: 6, title: "Project: Shopping Cart", type: LessonType.PROJECT, duration_minutes: 25, xp_reward: 50, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build a shopping cart using objects and arrays. add, remove, updateQty, checkout." },
          { type: 'code_block', language: 'javascript', code: "// Expected Output:\n// Added: Laptop x1 = \u20b950000\n// Added: Mouse x2 = \u20b91600\n// Updated Mouse to 3\n// Removed: Keyboard\n// Subtotal: \u20b952400\n// GST 18%: \u20b99432\n// Total: \u20b961832" }
        ]},
        starter_code: "const cart = {\n  items: [],\n  add(name, price, qty = 1) {},\n  remove(name) {},\n  updateQty(name, qty) {},\n  getTotal() {},\n  checkout() {}\n};\n\ncart.add('Laptop', 50000);\ncart.add('Mouse', 800, 2);\ncart.add('Keyboard', 1500);\ncart.updateQty('Mouse', 3);\ncart.remove('Keyboard');\ncart.checkout();\n",
        test_cases_json: [{"type":"output_contains","value":"Total"},{"type":"output_contains","value":"Laptop"}]
      }
    ]
  },
  {
    unit_number: 6,
    title: "OOP in JavaScript",
    description: "Learn OOP in JavaScript",
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "Constructor Functions & Prototypes", type: LessonType.CONCEPT, duration_minutes: 8, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Before Classes: Constructor Functions" },
          { type: 'code_block', language: 'javascript', code: "function Person(name, age) {\n  this.name = name;\n  this.age = age;\n}\n\nPerson.prototype.greet = function() {\n  return `Hi, I'm ${this.name}`;\n};\n\nconst harsh = new Person('Harsh', 21);\nconst priya = new Person('Priya', 20);\nconsole.log(harsh.greet());\nconsole.log(harsh.__proto__ === Person.prototype);" }
        ]},
      },
      {
        lesson_number: 2, title: "ES6 Classes", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "The class Keyword" },
          { type: 'code_block', language: 'javascript', code: "class Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n  speak() {\n    console.log(`${this.name} says ${this.sound}!`);\n  }\n  toString() {\n    return `Animal(${this.name})`;\n  }\n  static create(name, sound) {\n    return new Animal(name, sound);\n  }\n}\n\nconst dog = new Animal('Bruno','Woof');\ndog.speak();\nconsole.log(String(dog));" },
          { type: 'exercise', title: "Shape Classes", description: "Create Shape(color) with describe(). Circle extends Shape with area()=\u03c0r\u00b2, perimeter()=2\u03c0r. Rectangle with area()=w*h, perimeter()=2*(w+h). Static compare(s1,s2) returns shape with larger area." }
        ]},
        starter_code: "class Shape {\n  constructor(color) {}\n  describe() {}\n}\n\nclass Circle extends Shape {\n  constructor(color, radius) {}\n  area() {}\n  perimeter() {}\n}\n\nclass Rectangle extends Shape {\n  constructor(color, w, h) {}\n  area() {}\n  perimeter() {}\n  static compare(s1, s2) {}\n}\n\nconst c = new Circle('red', 5);\nconst r = new Rectangle('blue', 4, 6);\nc.describe();\nconsole.log(c.area().toFixed(2));\nconsole.log(r.perimeter());\nconsole.log(Rectangle.compare(c, r));\n",
        test_cases_json: [{"type":"output_contains","value":"78.54"},{"type":"output_contains","value":"20"}]
      },
      {
        lesson_number: 3, title: "Inheritance & super", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Extending Classes" },
          { type: 'code_block', language: 'javascript', code: "class Vehicle {\n  constructor(make, model, year) {\n    this.make = make;\n    this.model = model;\n    this.year = year;\n    this.speed = 0;\n  }\n  accelerate(amount) {\n    this.speed += amount;\n    console.log(`${this.make} at ${this.speed}km/h`);\n  }\n  toString() {\n    return `${this.year} ${this.make} ${this.model}`;\n  }\n}\n\nclass ElectricCar extends Vehicle {\n  constructor(make, model, year, range) {\n    super(make, model, year);\n    this.range = range;\n  }\n  charge() {\n    console.log(`${this.make} fully charged!`);\n  }\n  toString() {\n    return `${super.toString()} (Electric, ${this.range}km range)`;\n  }\n}\n\nconst tesla = new ElectricCar('Tesla','Model 3',2024,500);\ntesla.accelerate(60);\ntesla.charge();\nconsole.log(String(tesla));" },
          { type: 'exercise', title: "Employee Hierarchy", description: "Employee(name,salary) with work() and getInfo(). Manager extends Employee with department, teamSize, override work(). Developer extends Employee with language, override work(). Test instanceof." }
        ]},
        starter_code: "class Employee {\n  constructor(name, salary) {}\n  work() {}\n  getInfo() {}\n}\n\nclass Manager extends Employee {\n  constructor(name, salary, department, teamSize) {}\n  work() {}\n}\n\nclass Developer extends Employee {\n  constructor(name, salary, language) {}\n  work() {}\n}\n\nconst emp = new Employee('Alice', 40000);\nconst mgr = new Manager('Bob', 80000, 'Engineering', 10);\nconst dev = new Developer('Harsh', 70000, 'JavaScript');\n\nemp.work();\nmgr.work();\ndev.work();\nconsole.log(dev instanceof Employee);\n",
        test_cases_json: [{"type":"output_contains","value":"JavaScript"},{"type":"output_contains","value":"true"}]
      },
      {
        lesson_number: 4, title: "Private Fields & Getters/Setters", type: LessonType.CONCEPT, duration_minutes: 8, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Private Class Fields (#)" },
          { type: 'code_block', language: 'javascript', code: "class BankAccount {\n  #balance = 0;\n  #history = [];\n\n  constructor(owner) {\n    this.owner = owner;\n  }\n  deposit(amount) {\n    if (amount <= 0) throw new Error('Invalid amount');\n    this.#balance += amount;\n    this.#history.push(`+${amount}`);\n  }\n  get balance() {\n    return `\u20b9${this.#balance.toLocaleString()}`;\n  }\n  get history() {\n    return [...this.#history];\n  }\n}\n\nconst acc = new BankAccount('Harsh');\nacc.deposit(5000);\nconsole.log(acc.balance);\nconsole.log(acc.history);" }
        ]},
      },
      {
        lesson_number: 5, title: "Project: RPG Character System", type: LessonType.PROJECT, duration_minutes: 30, xp_reward: 50, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build an RPG character system. Characters have stats, can attack each other, gain XP, and level up." },
          { type: 'code_block', language: 'javascript', code: "// Expected Output:\n// Harsh (Warrior) HP:100 ATK:25 LVL:1\n// Priya (Mage) HP:75 ATK:40 LVL:1\n// Harsh attacks Priya for 25!\n// Priya HP: 50/75\n// Harsh gains 50 XP \u2014 Level Up! LVL:2" }
        ]},
        starter_code: "class Character {\n  #hp;\n  #maxHp;\n\n  constructor(name, type, hp, attack) {\n    this.name = name;\n    this.type = type;\n    this.#hp = hp;\n    this.#maxHp = hp;\n    this.attack = attack;\n    this.level = 1;\n    this.xp = 0;\n  }\n\n  attackTarget(target) {}\n  takeDamage(amount) {}\n  gainXP(amount) {}\n  levelUp() {}\n\n  get isAlive() { return this.#hp > 0; }\n  get status() {\n    return `${this.name} (${this.type}) HP:${this.#hp}/${this.#maxHp} ATK:${this.attack} LVL:${this.level}`;\n  }\n}\n\nconst warrior = new Character('Harsh','Warrior',100,25);\nconst mage = new Character('Priya','Mage',75,40);\nconsole.log(warrior.status);\nconsole.log(mage.status);\nwarrior.attackTarget(mage);\nwarrior.gainXP(50);\n",
        test_cases_json: [{"type":"output_contains","value":"attacks"},{"type":"output_contains","value":"HP"}]
      }
    ]
  },
  {
    unit_number: 7,
    title: "Modern JavaScript (ES6+)",
    description: "Master Modern JavaScript",
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "Template Literals & String Methods", type: LessonType.EXERCISE, duration_minutes: 8, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Template Literals" },
          { type: 'code_block', language: 'javascript', code: "const name = 'Harsh';\nconst score = 92;\n\nconst card = `\n====================\n👤 Name : ${name}\n⭐ Score: ${score}\n📊 Grade: ${score >= 90 ? 'A+' : 'B'}\n====================\n`;\nconsole.log(card);\n\nconsole.log(`${2 ** 10} = 1024`);\nconsole.log(`Sum: ${[1,2,3].reduce((a,b) => a+b)}`);" },
          { type: 'heading', text: "Useful String Methods" },
          { type: 'code_block', language: 'javascript', code: "const str = '  Hello, JavaScript World!  ';\n\nconsole.log(str.trim());\nconsole.log(str.includes('Java'));\nconsole.log(str.startsWith('  '));\nconsole.log(str.replace('World', 'Dev'));\nconsole.log(str.split(','));\nconsole.log('ha'.repeat(3));\nconsole.log('abc'.padStart(6,'0'));\nconsole.log('js'.toUpperCase());" },
          { type: 'callout', variant: 'tip', text: "Template literals support multi-line strings natively — no need for \\n. They also support any JavaScript expression inside ${}." },
          { type: 'exercise', title: "String Formatter", description: "1) Use a template literal to build an HTML card string with dynamic name and score values.\n2) Write a slugify(str) function that converts 'Hello World JS' to 'hello-world-js' using toLowerCase, trim, split, join.\n3) Write truncate(str, len) that shortens to len chars and adds '...' if longer." }
        ]},
        starter_code: "const name = 'Harsh Jain';\nconst score = 92;\n\n// 1. HTML card template literal\nconst card = ``;\nconsole.log(card);\n\n// 2. slugify\nfunction slugify(str) {}\nconsole.log(slugify('Hello World JS'));\n\n// 3. truncate\nfunction truncate(str, len) {}\nconsole.log(truncate('JavaScript is awesome', 10));\n",
        test_cases_json: [{ "type": "output_contains", "value": "hello-world-js" }, { "type": "output_contains", "value": "..." }]
      },
      {
        lesson_number: 2, title: "Optional Chaining & Nullish Coalescing", type: LessonType.CONCEPT, duration_minutes: 7, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Optional Chaining ?." },
          { type: 'code_block', language: 'javascript', code: "const user = {\n  name: 'Harsh',\n  address: { city: 'Mumbai' }\n};\n\nconsole.log(user.phone?.number);       // undefined\nconsole.log(user.address?.city);       // Mumbai\nconsole.log(user.getRole?.());         // undefined\nconsole.log(user.scores?.[0]);         // undefined" },
          { type: 'heading', text: "Nullish Coalescing ??" },
          { type: 'code_block', language: 'javascript', code: "const userScore = 0;\nconsole.log(userScore || 'No score');  // 'No score' WRONG\nconsole.log(userScore ?? 'No score');  // 0 CORRECT\n\nconst config = null;\nconst timeout = config?.timeout ?? 3000;\nconsole.log(timeout); // 3000" },
          { type: 'callout', variant: 'warning', text: "Use ?? instead of || when your value could legitimately be 0, false, or empty string. || treats all falsy values as missing, ?? only treats null and undefined as missing." }
        ]}
      },
      {
        lesson_number: 3, title: "Modules: import & export", type: LessonType.CONCEPT, duration_minutes: 8, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "ES6 Modules" },
          { type: 'code_block', language: 'javascript', code: "// math.js — named exports\nexport const add = (a, b) => a + b;\nexport const multiply = (a, b) => a * b;\nexport const PI = 3.14159;\n\n// Default export\nexport default function calculator(op, a, b) {\n  if (op === '+') return add(a, b);\n  if (op === '*') return multiply(a, b);\n}\n\n// main.js — importing\nimport calculator, { add, multiply, PI } from './math.js';\nconsole.log(add(2, 3));            // 5\nconsole.log(PI);                   // 3.14159\nconsole.log(calculator('+', 5, 3)); // 8\n\nimport * as MathUtils from './math.js';\nconsole.log(MathUtils.PI);" },
          { type: 'callout', variant: 'info', text: "Each file is its own module scope — variables declared in one file are NOT available in another unless exported. This prevents naming conflicts in large projects." }
        ]}
      },
      {
        lesson_number: 4, title: "Iterators, Generators & Symbols", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Generators" },
          { type: 'code_block', language: 'javascript', code: "// Generator function — uses function*\nfunction* countdown(start) {\n  while (start > 0) {\n    yield start;\n    start--;\n  }\n}\n\nconst gen = countdown(5);\nconsole.log(gen.next()); // { value: 5, done: false }\nconsole.log(gen.next()); // { value: 4, done: false }\n\n// for...of with generator\nfor (const n of countdown(3)) {\n  console.log(n); // 3 2 1\n}\n\n// Infinite generator\nfunction* naturals() {\n  let n = 1;\n  while (true) yield n++;\n}\n\nconst nums = naturals();\nconsole.log(nums.next().value); // 1\nconsole.log(nums.next().value); // 2" },
          { type: 'heading', text: "Symbol" },
          { type: 'code_block', language: 'javascript', code: "const id = Symbol('id');\nconst user = {\n  name: 'Harsh',\n  [id]: 12345\n};\nconsole.log(user[id]);  // 12345\nconsole.log(user.name); // Harsh\n// Symbol keys hidden from for...in and Object.keys" },
          { type: 'callout', variant: 'tip', text: "Generators are memory-efficient — they compute values lazily, one at a time. Perfect for infinite sequences or processing large datasets without loading everything into memory." },
          { type: 'exercise', title: "Generator Challenges", description: "1) Write a generator function fibonacci() that yields Fibonacci numbers infinitely. Get first 8 values using a loop.\n2) Write a generator range(start, end, step=1) that yields numbers like Python's range.\n3) Write a take(generator, n) function that returns first n values from any generator as an array." }
        ]},
        starter_code: "// 1. Infinite Fibonacci generator\nfunction* fibonacci() {}\n\n// 2. range generator\nfunction* range(start, end, step = 1) {}\n\n// 3. take helper\nfunction take(gen, n) {}\n\n// Test\nconsole.log(take(fibonacci(), 8));\nconsole.log(take(range(0, 10, 2), 5));\n",
        test_cases_json: [{ "type": "output_contains", "value": "21" }, { "type": "output_contains", "value": "0" }]
      },
      {
        lesson_number: 5, title: "Project: Utility Library", type: LessonType.PROJECT, duration_minutes: 25, xp_reward: 50, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build a utility library — a collection of reusable pure functions. This simulates how real libraries like Lodash work. Implement 6 utility functions and test them." },
          { type: 'code_block', language: 'javascript', code: "// Functions to implement:\n// chunk([1,2,3,4,5], 2)    → [[1,2],[3,4],[5]]\n// flatten([[1,2],[3,[4,5]]]) → [1,2,3,4,5]\n// unique([1,2,2,3,3,3])    → [1,2,3]\n// groupBy([6.1,4.2,6.3], Math.floor) → {4:[4.2],6:[6.1,6.3]}\n// pick({a:1,b:2,c:3},['a','c'])  → {a:1,c:3}\n// omit({a:1,b:2,c:3},['b'])      → {a:1,c:3}" },
          { type: 'callout', variant: 'tip', text: "chunk: use Array.from with Math.ceil for length. flatten: use Array.isArray recursively or .flat(Infinity). groupBy: use reduce to build object." }
        ]},
        starter_code: "const _ = {\n  chunk(arr, size) {\n    // split arr into subarrays of length size\n  },\n  flatten(arr) {\n    // deeply flatten nested arrays\n  },\n  unique(arr) {\n    // remove duplicates\n  },\n  groupBy(arr, fn) {\n    // group elements by fn(element)\n  },\n  pick(obj, keys) {\n    // return new obj with only specified keys\n  },\n  omit(obj, keys) {\n    // return new obj without specified keys\n  }\n};\n\nconsole.log(_.chunk([1,2,3,4,5], 2));\nconsole.log(_.flatten([[1,2],[3,[4,5]]]));\nconsole.log(_.unique([1,2,2,3,3,3]));\nconsole.log(_.groupBy([6.1,4.2,6.3], Math.floor));\nconsole.log(_.pick({a:1,b:2,c:3}, ['a','c']));\nconsole.log(_.omit({a:1,b:2,c:3}, ['b']));\n",
        test_cases_json: [{ "type": "output_contains", "value": "1,2" }, { "type": "output_contains", "value": "21" }]
      }
    ]
  },
  {
    unit_number: 8,
    title: "Advanced OOP & Design Patterns",
    description: "Master OOP in JS",
    xp_reward: 110,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "Abstract Classes & Interfaces (Simulated)", type: LessonType.CONCEPT, duration_minutes: 8, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Simulating Abstract Classes in JS" },
          { type: 'paragraph', text: "JavaScript doesn't have native abstract classes or interfaces like Java. We simulate them by throwing errors in base class methods that must be overridden." },
          { type: 'code_block', language: 'javascript', code: "class Shape {\n  constructor(color) {\n    if (new.target === Shape) {\n      throw new Error('Shape is abstract — cannot instantiate directly');\n    }\n    this.color = color;\n  }\n\n  // Abstract method — must be overridden\n  area() {\n    throw new Error('area() must be implemented by subclass');\n  }\n\n  perimeter() {\n    throw new Error('perimeter() must be implemented by subclass');\n  }\n\n  describe() {\n    console.log(`${this.color} shape | Area: ${this.area().toFixed(2)} | Perimeter: ${this.perimeter().toFixed(2)}`);\n  }\n}\n\nclass Circle extends Shape {\n  constructor(color, radius) {\n    super(color);\n    this.radius = radius;\n  }\n  area() { return Math.PI * this.radius ** 2; }\n  perimeter() { return 2 * Math.PI * this.radius; }\n}\n\nconst c = new Circle('red', 5);\nc.describe();\n// new Shape('blue'); // Error!" },
          { type: 'callout', variant: 'info', text: "new.target inside a constructor refers to the class being instantiated. If new.target === Shape, it means someone tried to instantiate Shape directly — we throw to prevent that." }
        ]}
      },
      {
        lesson_number: 2, title: "Mixins & Multiple Inheritance", type: LessonType.CONCEPT, duration_minutes: 7, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Mixins — Multiple Inheritance in JS" },
          { type: 'paragraph', text: "JavaScript classes can only extend one class. Mixins let you compose behaviour from multiple sources." },
          { type: 'code_block', language: 'javascript', code: "// Mixin functions\nconst Flyable = (Base) => class extends Base {\n  fly() { console.log(`${this.name} is flying!`); }\n};\n\nconst Swimmable = (Base) => class extends Base {\n  swim() { console.log(`${this.name} is swimming!`); }\n};\n\nconst Runnable = (Base) => class extends Base {\n  run() { console.log(`${this.name} is running!`); }\n};\n\n// Base class\nclass Animal {\n  constructor(name) { this.name = name; }\n}\n\n// Duck can fly AND swim AND run\nclass Duck extends Flyable(Swimmable(Runnable(Animal))) {\n  quack() { console.log('Quack!'); }\n}\n\nconst duck = new Duck('Donald');\nduck.fly();\nduck.swim();\nduck.run();\nduck.quack();" },
          { type: 'callout', variant: 'tip', text: "Mixins compose by wrapping base classes in functions. Each mixin adds its methods to the prototype chain without conflicts." }
        ]}
      },
      {
        lesson_number: 3, title: "Iterators & Custom Iterables", type: LessonType.EXERCISE, duration_minutes: 10, xp_reward: 25, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Custom Iterable Objects" },
          { type: 'code_block', language: 'javascript', code: "// Make any object work with for...of\nclass Range {\n  constructor(start, end) {\n    this.start = start;\n    this.end = end;\n  }\n\n  // Symbol.iterator makes object iterable\n  [Symbol.iterator]() {\n    let current = this.start;\n    const end = this.end;\n    return {\n      next() {\n        if (current <= end) {\n          return { value: current++, done: false };\n        }\n        return { value: undefined, done: true };\n      }\n    };\n  }\n}\n\nconst r = new Range(1, 5);\nfor (const n of r) console.log(n); // 1 2 3 4 5\nconsole.log([...r]); // [1, 2, 3, 4, 5]\nconsole.log(Array.from(r)); // [1, 2, 3, 4, 5]" },
          { type: 'callout', variant: 'info', text: "Any object with a [Symbol.iterator]() method is iterable. This is how arrays, strings, Maps, and Sets all work with for...of natively." },
          { type: 'exercise', title: "Custom Iterable Collection", description: "1) Create a LinkedList class with add(val) and [Symbol.iterator]() so it works with for...of.\n2) Create a InfiniteCounter class starting at 0 that yields next value on each iteration — use take(iter, n) to get first 5.\n3) Create a Cycle class that takes an array and iterates it in a cycle indefinitely — take first 7 values from Cycle(['red','green','blue'])." }
        ]},
        starter_code: "// 1. LinkedList\nclass LinkedList {\n  constructor() { this.head = null; }\n  add(val) {}\n  [Symbol.iterator]() {}\n}\n\n// 2. InfiniteCounter\nclass InfiniteCounter {\n  [Symbol.iterator]() {}\n}\n\n// 3. Cycle\nclass Cycle {\n  constructor(arr) { this.arr = arr; }\n  [Symbol.iterator]() {}\n}\n\nfunction take(iter, n) {\n  const result = [];\n  for (const val of iter) {\n    result.push(val);\n    if (result.length >= n) break;\n  }\n  return result;\n}\n\nconst list = new LinkedList();\nlist.add(10); list.add(20); list.add(30);\nconsole.log([...list]);\n\nconsole.log(take(new InfiniteCounter(), 5));\nconsole.log(take(new Cycle(['red','green','blue']), 7));\n",
        test_cases_json: [{ "type": "output_contains", "value": "10" }, { "type": "output_contains", "value": "red" }]
      },
      {
        lesson_number: 4, title: "Design Patterns", type: LessonType.CONCEPT, duration_minutes: 10, xp_reward: 10, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Singleton Pattern" },
          { type: 'code_block', language: 'javascript', code: "// Singleton — only ONE instance ever created\nclass Database {\n  static #instance = null;\n\n  constructor(url) {\n    if (Database.#instance) return Database.#instance;\n    this.url = url;\n    this.connected = false;\n    Database.#instance = this;\n  }\n\n  connect() {\n    this.connected = true;\n    console.log(`Connected to ${this.url}`);\n  }\n}\n\nconst db1 = new Database('mongodb://localhost');\nconst db2 = new Database('mongodb://other');\nconsole.log(db1 === db2); // true — same instance!" },
          { type: 'heading', text: "Observer Pattern" },
          { type: 'code_block', language: 'javascript', code: "class EventEmitter {\n  #listeners = {};\n\n  on(event, callback) {\n    if (!this.#listeners[event]) this.#listeners[event] = [];\n    this.#listeners[event].push(callback);\n  }\n\n  emit(event, data) {\n    this.#listeners[event]?.forEach(cb => cb(data));\n  }\n\n  off(event, callback) {\n    this.#listeners[event] = this.#listeners[event]?.filter(cb => cb !== callback);\n  }\n}\n\nconst emitter = new EventEmitter();\nemitter.on('login', user => console.log(`${user} logged in`));\nemitter.on('login', user => console.log(`Sending welcome email to ${user}`));\nemitter.emit('login', 'Harsh');" },
          { type: 'heading', text: "Factory Pattern" },
          { type: 'code_block', language: 'javascript', code: "class UserFactory {\n  static create(type, name) {\n    const roles = {\n      admin: { permissions: ['read','write','delete'], level: 3 },\n      editor: { permissions: ['read','write'], level: 2 },\n      viewer: { permissions: ['read'], level: 1 }\n    };\n    return { name, type, ...roles[type] };\n  }\n}\n\nconst admin = UserFactory.create('admin', 'Harsh');\nconst viewer = UserFactory.create('viewer', 'Priya');\nconsole.log(admin);\nconsole.log(viewer);" }
        ]}
      },
      {
        lesson_number: 5, title: "Project: Mini ORM", type: LessonType.PROJECT, duration_minutes: 30, xp_reward: 50, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build a mini in-memory ORM (Object Relational Mapper) using advanced OOP. Support create, findAll, findById, update, delete operations. Uses the Observer pattern to emit events on changes." },
          { type: 'code_block', language: 'javascript', code: "// Expected Usage:\n// const user = User.create({ name: 'Harsh', age: 21 });\n// console.log(User.findAll());\n// User.update(1, { age: 22 });\n// User.delete(1);\n// Events: 'created', 'updated', 'deleted'" }
        ]},
        starter_code: "class EventEmitter {\n  #listeners = {};\n  on(event, cb) {\n    (this.#listeners[event] ??= []).push(cb);\n  }\n  emit(event, data) {\n    this.#listeners[event]?.forEach(cb => cb(data));\n  }\n}\n\nclass Model extends EventEmitter {\n  static #store = [];\n  static #nextId = 1;\n\n  static create(data) {}\n  static findAll() {}\n  static findById(id) {}\n  static update(id, changes) {}\n  static delete(id) {}\n}\n\nclass User extends Model {\n  constructor({ name, age }) {\n    super();\n    this.name = name;\n    this.age = age;\n  }\n  toString() {\n    return `User[${this.id}]: ${this.name} (${this.age})`;\n  }\n}\n\n// Test\nUser.on('created', u => console.log('Created:', String(u)));\nUser.on('updated', u => console.log('Updated:', String(u)));\nUser.on('deleted', id => console.log('Deleted ID:', id));\n\nconst u1 = User.create({ name: 'Harsh', age: 21 });\nconst u2 = User.create({ name: 'Priya', age: 20 });\nconsole.log(User.findAll().map(String));\nUser.update(1, { age: 22 });\nUser.delete(2);\nconsole.log(User.findAll().map(String));\n",
        test_cases_json: [{ "type": "output_contains", "value": "Harsh" }, { "type": "output_contains", "value": "Created" }]
      }
    ]
  },
  {
    unit_number: 9,
    title: "Mega Projects",
    description: "Build real projects",
    xp_reward: 175,
    is_published: true,
    lessons: [
      {
        lesson_number: 1, title: "Project: Browser Chatbot with Groq API", type: LessonType.PROJECT, duration_minutes: 45, xp_reward: 75, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Project Brief" },
          { type: 'paragraph', text: "Build a fully functional browser-based chatbot using the Groq API. It maintains conversation history, supports special commands, and uses async/await for API calls. This is a real-world integration project." },
          { type: 'list', items: ["fetch() to call Groq API from the browser", "Conversation history array for multi-turn context", "Special commands: /help, /clear, /topics", "Typing animation using async generator", "Error handling with try/catch and retries"] },
          { type: 'code_block', language: 'javascript', code: "// Expected Output:\n// ╔═══════════════════════════════╗\n// ║  🤖 JS Tutor Bot              ║\n// ╚═══════════════════════════════╝\n// Commands: /help /clear /topics /exit\n// \n// You: what is a closure?\n// Bot: A closure is a function that remembers...\n// \n// You: give me an example\n// Bot: Sure! Here's a classic closure example..." },
          { type: 'callout', variant: 'tip', text: "Store GROQ_API_KEY in your .env.local as NEXT_PUBLIC_GROQ_API_KEY (prefix with NEXT_PUBLIC_ to expose to browser). For production, route through an API endpoint instead." }
        ]},
        starter_code: "const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;\nconst API_URL = 'https://api.groq.com/openai/v1/chat/completions';\n\nconst SYSTEM_PROMPT = `You are a friendly JavaScript tutor.\nYou help beginners learn JS with clear explanations and short code examples.\nKeep responses under 4 sentences unless asked for more.\nAlways use modern ES6+ JavaScript in examples.`;\n\nconst conversation = [\n  { role: 'system', content: SYSTEM_PROMPT }\n];\n\nasync function chat(userMessage) {\n  conversation.push({ role: 'user', content: userMessage });\n\n  const response = await fetch(API_URL, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': `Bearer ${GROQ_API_KEY}`\n    },\n    body: JSON.stringify({\n      model: 'llama-3.1-8b-instant',\n      messages: conversation,\n      max_tokens: 300\n    })\n  });\n\n  // Handle response and update conversation history\n}\n\nasync function* typeEffect(text, delay = 20) {\n  // Yield one character at a time with delay\n}\n\nfunction handleCommand(cmd) {\n  // Handle /help /clear /topics /exit\n}\n\nasync function main() {\n  console.log('╔═══════════════════════════════╗');\n  console.log('║  🤖 JS Tutor Bot              ║');\n  console.log('╚═══════════════════════════════╝\\n');\n\n  // Simulate conversation\n  const messages = [\n    'what is a closure?',\n    'give me a simple example',\n    '/topics'\n  ];\n\n  for (const msg of messages) {\n    console.log(`You: ${msg}`);\n    if (msg.startsWith('/')) {\n      handleCommand(msg);\n    } else {\n      const reply = await chat(msg);\n      console.log(`Bot: ${reply}\\n`);\n    }\n  }\n}\n\nmain();\n",
        test_cases_json: [{ "type": "output_contains", "value": "Bot" }]
      },
      {
        lesson_number: 2, title: "Capstone: JavaScript Quiz Engine with Leaderboard", type: LessonType.PROJECT, duration_minutes: 45, xp_reward: 100, language: 'javascript', is_published: true,
        content_json: { sections: [
          { type: 'heading', text: "Capstone Project Brief" },
          { type: 'paragraph', text: "Build a complete quiz engine with scoring, timing, XP system, and a leaderboard. Uses closures for state, Promises for async timing, and advanced array methods for leaderboard calculation. This is your JavaScript graduation project." },
          { type: 'list', items: ["Timed questions (each question has a time bonus)", "XP system (base XP + speed bonus)", "Topic tracking (which topics you got wrong)", "Leaderboard sorted by XP then time", "Streak bonus (consecutive correct answers)"] },
          { type: 'code_block', language: 'javascript', code: "// Expected Output:\n// ╔══════════════════════════════════╗\n// ║   🏆 JavaScript Quiz Engine     ║\n// ╚══════════════════════════════════╝\n// \n// Q1 [Variables]: What is the output of typeof null?\n// ✅ Correct! +10 XP +3 speed bonus (streak: 1)\n// \n// Q2 [Arrays]: Which method removes the last element?\n// ❌ Wrong! Correct answer: pop\n// \n// ╔══════════════════════════════════╗\n// ║          FINAL RESULTS           ║\n// ╠══════════════════════════════════╣\n// ║ Score    : 4/5 (80%)             ║\n// ║ XP Earned: 87                    ║\n// ║ Time     : 2.3s                  ║\n// ║ Grade    : A                     ║\n// ║ Streak   : 3                     ║\n// ║ Weak Topics: Arrays              ║\n// ╚══════════════════════════════════╝\n// \n// 🏆 LEADERBOARD\n// 1. Harsh    — 87 XP\n// 2. Alice    — 72 XP\n// 3. Bob      — 65 XP" }
        ]},
        starter_code: "const questions = [\n  { q: 'What does typeof null return?', answer: 'object', topic: 'Data Types', xp: 10 },\n  { q: 'Which array method removes the last element?', answer: 'pop', topic: 'Arrays', xp: 10 },\n  { q: 'What keyword is used for block-scoped variables?', answer: 'let', topic: 'Variables', xp: 10 },\n  { q: 'What does === check that == does not?', answer: 'type', topic: 'Operators', xp: 10 },\n  { q: 'What is a function that returns another function called?', answer: 'Higher Order Function', topic: 'Functions', xp: 10 }\n];\n\n// Simulated past leaderboard entries\nconst leaderboard = [\n  { name: 'Alice', xp: 72, time: 3.1 },\n  { name: 'Bob', xp: 65, time: 4.2 }\n];\n\nfunction createQuizEngine(questions, playerName) {\n  // Private state via closure\n  let score = 0;\n  let totalXP = 0;\n  let streak = 0;\n  let maxStreak = 0;\n  const wrongTopics = [];\n  const startTime = Date.now();\n  const results = [];\n\n  function attempt(index, userAnswer) {\n    const q = questions[index];\n    const isCorrect = userAnswer.toLowerCase().trim() ===\n                      q.answer.toLowerCase().trim();\n\n    // Calculate XP with speed bonus and streak bonus\n    // Speed bonus: +3 if answered quickly (simulate with random)\n    // Streak bonus: +2 per consecutive correct\n\n    if (isCorrect) {\n      score++;\n      streak++;\n      maxStreak = Math.max(maxStreak, streak);\n      // calculate xp + bonuses\n    } else {\n      streak = 0;\n      wrongTopics.push(q.topic);\n    }\n\n    results.push({ question: q.q, correct: isCorrect, topic: q.topic });\n    // log result with ✅ or ❌\n  }\n\n  function printReport() {\n    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);\n    const pct = Math.round((score / questions.length) * 100);\n    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'F';\n    const uniqueWeak = [...new Set(wrongTopics)];\n\n    // Print formatted results box\n    // Add player to leaderboard\n    // Sort leaderboard by XP desc, then time asc\n    // Print leaderboard\n  }\n\n  return { attempt, printReport };\n}\n\n// Simulate a quiz session\nconst quiz = createQuizEngine(questions, 'Harsh');\nconst playerAnswers = ['object', 'shift', 'let', 'type', 'Higher Order Function'];\n\nconsole.log('╔══════════════════════════════════╗');\nconsole.log('║   🏆 JavaScript Quiz Engine     ║');\nconsole.log('╚══════════════════════════════════╝\\n');\n\nplayerAnswers.forEach((ans, i) => quiz.attempt(i, ans));\nquiz.printReport();\n",
        test_cases_json: [{ "type": "output_contains", "value": "Score" }, { "type": "output_contains", "value": "LEADERBOARD" }, { "type": "output_contains", "value": "XP" }]
      }
    ]
  }
];
