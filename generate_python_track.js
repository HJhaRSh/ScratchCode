const fs = require('fs');

const pythonTrackData = {
  title: 'Python Mastery',
  slug: 'python',
  description: 'Learn Python from absolute zero. Understand data types, control flow, functions, OOP, and build real-world applications.',
  icon: '🐍',
  color_hex: '#3776AB',
  total_units: 9,
  total_lessons: 48,
  is_published: true
};

const units = [
  {
    unit_number: 1,
    title: 'Getting Started with Python',
    description: 'What Python is, how it runs, print(), reading errors',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'What is Python & Why Learn It?',
        type: 'CONCEPT',
        duration_minutes: 7,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'paragraph', text: 'Python is one of the most beginner-friendly programming languages in the world. It reads almost like plain English, which makes it perfect for your first language.' },
            { type: 'heading', text: 'Where is Python used?' },
            { type: 'list', items: ['Artificial Intelligence & Machine Learning', 'Web Development (Instagram, YouTube use Python)', 'Data Science & Analytics', 'Automation & Scripting', 'Game Development'] },
            { type: 'heading', text: 'How Python runs your code' },
            { type: 'paragraph', text: 'Python is an interpreted language. This means your code runs line by line through a Python interpreter — unlike compiled languages (like C++) that convert the whole program first.' },
            { type: 'code_block', language: 'python', code: '# This is your first Python program\nprint(\'Hello, World!\')\n# Output: Hello, World!' },
            { type: 'callout', variant: 'info', text: 'Python was created by Guido van Rossum in 1991. The name comes from Monty Python, not the snake!' },
            { type: 'heading', text: 'Installing Python & VS Code' },
            { type: 'list', items: ['Download Python from python.org', 'Download VS Code from code.visualstudio.com', 'Install the Python extension in VS Code', 'Open terminal and type: python --version to verify'] }
          ]
        },
        starter_code: '# Print a message below\n',
        test_cases_json: [{ type: 'output_contains', value: 'Python is awesome!' }]
      },
      {
        lesson_number: 2,
        title: 'Variables & Data Types',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Variable?' },
            { type: 'paragraph', text: 'A variable is a named container that stores data in memory. Think of it like a labelled box — you put something inside and refer to it by the label.' },
            { type: 'code_block', language: 'python', code: "name = 'Harsh'\nage = 21\ngpa = 8.5\nis_student = True\nnothing = None\n\nprint(name)       # Harsh\nprint(age)        # 21\nprint(type(age))  # <class 'int'>" },
            { type: 'heading', text: "Python's Core Data Types" },
            { type: 'list', items: ["int — whole numbers: 21, -5, 1000", "float — decimals: 3.14, 8.5", "str — text: 'hello', 'Python'", "bool — True or False", "None — absence of value"] },
            { type: 'heading', text: 'Naming Rules' },
            { type: 'list', items: ["Must start with a letter or underscore", "Cannot use spaces (use snake_case: my_name)", "Cannot use reserved words like if, for, class", "Case sensitive: name and Name are different"] },
            { type: 'callout', variant: 'warning', text: "Always convert user input! input() always returns a string. Use int() or float() to convert: age = int(input('Enter age: '))" },
            { type: 'code_block', language: 'python', code: "# Common mistake\nage = input('Enter your age: ')\nprint(age + 1)  # ERROR! string + int\n\n# Fix\nage = int(input('Enter your age: '))\nprint(age + 1)  # Works!" }
          ]
        },
        starter_code: '# Create your variables below\nname = \nage = \ngpa = \nis_engineer = \n\n# Print them\n',
        test_cases_json: [{ type: 'line_count', min: 4 }]
      },
      {
        lesson_number: 3,
        title: 'Operators',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Arithmetic Operators' },
            { type: 'code_block', language: 'python', code: "a = 10\nb = 3\n\nprint(a + b)   # 13 — Addition\nprint(a - b)   # 7  — Subtraction\nprint(a * b)   # 30 — Multiplication\nprint(a / b)   # 3.33 — Division\nprint(a // b)  # 3  — Floor Division\nprint(a % b)   # 1  — Modulus (remainder)\nprint(a ** b)  # 1000 — Exponent" },
            { type: 'heading', text: 'Comparison Operators' },
            { type: 'code_block', language: 'python', code: "x = 5\nprint(x == 5)   # True\nprint(x != 3)   # True\nprint(x > 3)    # True\nprint(x < 3)    # False\nprint(x >= 5)   # True\nprint(x <= 4)   # False" },
            { type: 'heading', text: 'Logical Operators' },
            { type: 'code_block', language: 'python', code: "a = True\nb = False\nprint(a and b)  # False\nprint(a or b)   # True\nprint(not a)    # False" },
            { type: 'callout', variant: 'warning', text: "Common mistake: Using = instead of == for comparison. = assigns a value, == checks equality." },
            { type: 'heading', text: 'Assignment Operators' },
            { type: 'code_block', language: 'python', code: "x = 10\nx += 5   # x = x + 5 → 15\nx -= 3   # x = x - 3 → 12\nx *= 2   # x = x * 2 → 24" }
          ]
        },
        starter_code: 'a = 15\nb = 4\n\n# Print all 6 operations below\n',
        test_cases_json: [{ type: 'output_contains', value: '19' }, { type: 'output_contains', value: '11' }, { type: 'output_contains', value: '60' }]
      },
      {
        lesson_number: 4,
        title: 'Strings & String Manipulation',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a String?' },
            { type: 'paragraph', text: 'A string is a sequence of characters enclosed in single, double, or triple quotes. Strings are immutable — you cannot change a character directly.' },
            { type: 'code_block', language: 'python', code: "name = 'Python'\nprint(name[0])     # P — indexing\nprint(name[-1])    # n — negative index\nprint(name[0:3])   # Pyt — slicing\nprint(name[::2])   # Pto — step slicing" },
            { type: 'heading', text: 'Useful String Methods' },
            { type: 'code_block', language: 'python', code: "text = '  Hello World  '\nprint(text.upper())         # HELLO WORLD\nprint(text.lower())         # hello world\nprint(text.strip())         # Hello World (removes spaces)\nprint(text.replace('World', 'Python'))  # Hello Python\nprint(text.startswith('  Hello'))  # True\nprint(text.endswith('  '))  # True\nprint(len(text))            # 15" },
            { type: 'heading', text: 'f-Strings (Modern Formatting)' },
            { type: 'code_block', language: 'python', code: "name = 'Harsh'\nage = 21\nprint(f'My name is {name} and I am {age} years old.')" },
            { type: 'callout', variant: 'tip', text: 'Use f-strings — they are the modern, readable way to embed variables inside strings. Prefer them over + concatenation.' },
            { type: 'heading', text: 'Escape Sequences' },
            { type: 'code_block', language: 'python', code: "print('It\\'s a great day')  # It's a great day\nprint('Line1\\nLine2')       # newline\nprint('Col1\\tCol2')         # tab" }
          ]
        },
        starter_code: "name = 'python programming'\n\n# 1. Uppercase\n\n# 2. Length\n\n# 3. First 6 characters\n\n# 4. Replace\n",
        test_cases_json: [{ type: 'output_contains', value: 'PYTHON PROGRAMMING' }, { type: 'output_contains', value: '18' }, { type: 'output_contains', value: 'python' }, { type: 'output_contains', value: 'awesome programming' }]
      },
      {
        lesson_number: 5,
        title: 'Project: Personal Info Card',
        type: 'PROJECT',
        duration_minutes: 15,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'You will write a Python program that asks the user for their name, age, and favourite subject, then prints a formatted info card using f-strings.' },
            { type: 'code_block', language: 'python', code: "# Expected Output:\n# ====================\n# 👤 Name    : Harsh\n# 🎂 Age     : 21\n# 📚 Subject : Computer Science\n# 🐍 Status  : Python Learner Level 1\n# ====================" },
            { type: 'callout', variant: 'tip', text: "Use int() to convert the age input. Use f-strings for formatting. Use print('='*22) to create the divider line." }
          ]
        },
        starter_code: "# Personal Info Card Generator\n# Get user inputs\nname = input('Enter your name: ')\nage = int(input('Enter your age: '))\nsubject = input('Enter your favourite subject: ')\n\n# Print the card below\n",
        test_cases_json: [{ type: 'output_contains', value: 'Name' }, { type: 'output_contains', value: 'Age' }, { type: 'output_contains', value: 'Subject' }]
      }
    ]
  },
  {
    unit_number: 2,
    title: 'Lists, Tuples, Dictionaries & Sets',
    description: 'Learn about data structures to store multiple values.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Lists',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a List?' },
            { type: 'paragraph', text: 'A list is an ordered, mutable collection. You can store different data types in one list and change it after creation.' },
            { type: 'code_block', language: 'python', code: "marks = [85, 92, 78, 95, 88]\nprint(marks[0])     # 85\nprint(marks[-1])    # 88\nprint(marks[1:3])   # [92, 78]\n\n# Modifying\nmarks.append(100)   # Add to end\nmarks.pop()         # Remove last\nmarks.remove(78)    # Remove by value\nmarks.sort()        # Sort ascending\nmarks.reverse()     # Reverse order\nprint(len(marks))   # Length" },
            { type: 'heading', text: 'Iterating a List' },
            { type: 'code_block', language: 'python', code: "fruits = ['apple', 'banana', 'mango']\nfor fruit in fruits:\n    print(fruit)\n\n# With index\nfor i, fruit in enumerate(fruits):\n    print(f'{i}: {fruit}')" },
            { type: 'callout', variant: 'warning', text: "Lists are zero-indexed. The first element is at index 0, not 1. Accessing an index that doesn't exist raises an IndexError." }
          ]
        },
        starter_code: "marks = [72, 88, 65, 95, 80]\n\n# Highest\n\n# Lowest\n\n# Average\n\n# Sorted\n",
        test_cases_json: [{ type: 'output_contains', value: '95' }, { type: 'output_contains', value: '65' }]
      },
      {
        lesson_number: 2,
        title: 'Tuples',
        type: 'CONCEPT',
        duration_minutes: 7,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Tuple?' },
            { type: 'paragraph', text: 'A tuple is an ordered, immutable collection. Once created, you cannot add, remove, or change its elements. Use tuples for data that should not change — like coordinates, RGB values, or days of the week.' },
            { type: 'code_block', language: 'python', code: "days = ('Mon', 'Tue', 'Wed', 'Thu', 'Fri')\nprint(days[0])          # Mon\nprint(days.count('Mon'))# 1\nprint(days.index('Wed'))# 2\nprint(len(days))        # 5\n\n# Tuple unpacking\nx, y = (10, 20)\nprint(x, y)  # 10 20" },
            { type: 'callout', variant: 'info', text: "Tuples are faster than lists for read-only operations. If your data won't change, use a tuple." },
            { type: 'callout', variant: 'warning', text: "Trying to change a tuple element raises TypeError: 'tuple' object does not support item assignment." }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Dictionaries',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Dictionary?' },
            { type: 'paragraph', text: 'A dictionary stores data as key-value pairs. It is like a real dictionary — you look up a word (key) to get its meaning (value).' },
            { type: 'code_block', language: 'python', code: "student = {\n    'name': 'Harsh',\n    'age': 21,\n    'gpa': 8.5,\n    'is_student': True\n}\n\nprint(student['name'])         # Harsh\nprint(student.get('age'))      # 21\nprint(student.get('phone', 'N/A'))  # N/A (default)\n\n# Modifying\nstudent['age'] = 22\nstudent['city'] = 'Mumbai'\ndel student['is_student']\n\nprint(student.keys())   # all keys\nprint(student.values()) # all values\nprint(student.items())  # all pairs" },
            { type: 'heading', text: 'Iterating a Dictionary' },
            { type: 'code_block', language: 'python', code: "for key, value in student.items():\n    print(f'{key}: {value}')" }
          ]
        },
        starter_code: "student = {\n    'name': 'Rahul',\n    'age': 20,\n    'city': 'Mumbai',\n    'marks': [85, 90, 78]\n}\n\n# Print all key-value pairs\n\n# Add grade key\n",
        test_cases_json: [{ type: 'output_contains', value: 'name' }, { type: 'output_contains', value: 'grade' }]
      },
      {
        lesson_number: 4,
        title: 'Sets',
        type: 'CONCEPT',
        duration_minutes: 8,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Set?' },
            { type: 'paragraph', text: 'A set is an unordered collection with no duplicate elements. It is based on mathematical set theory.' },
            { type: 'code_block', language: 'python', code: "nums = {1, 2, 3, 3, 4, 4}\nprint(nums)  # {1, 2, 3, 4} — duplicates removed\n\nA = {1, 2, 3, 4}\nB = {3, 4, 5, 6}\n\nprint(A.union(B))        # {1,2,3,4,5,6}\nprint(A.intersection(B)) # {3,4}\nprint(A.difference(B))   # {1,2}\nprint(A.issubset(B))     # False\n\nA.add(10)\nA.remove(1)" },
            { type: 'callout', variant: 'tip', text: "Use sets to remove duplicates from a list: unique = list(set(my_list))" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 5,
        title: 'List Comprehensions',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a List Comprehension?' },
            { type: 'paragraph', text: 'List comprehensions let you create lists in one line. They are faster and more Pythonic than writing a for loop.' },
            { type: 'code_block', language: 'python', code: "# Traditional way\nsquares = []\nfor i in range(1, 6):\n    squares.append(i ** 2)\n\n# List comprehension\nsquares = [i ** 2 for i in range(1, 6)]\nprint(squares)  # [1, 4, 9, 16, 25]\n\n# With condition\nevens = [i for i in range(1, 11) if i % 2 == 0]\nprint(evens)  # [2, 4, 6, 8, 10]\n\n# Transform strings\nnames = ['harsh', 'rahul', 'priya']\ncaps = [name.upper() for name in names]" }
          ]
        },
        starter_code: "# 1. Cubes of 1-10\n\n# 2. Divisible by 3 and 5 (1-50)\n\n# 3. Names with more than 4 chars\nnames = ['alice', 'bob', 'charlie', 'dave']\n",
        test_cases_json: [{ type: 'output_contains', value: '1000' }, { type: 'output_contains', value: '15' }, { type: 'output_contains', value: 'alice' }]
      },
      {
        lesson_number: 6,
        title: 'Project: Student Grade Book',
        type: 'PROJECT',
        duration_minutes: 20,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a student grade book using a dictionary of lists. The program should store marks for 3 subjects, calculate each student\'s average, and print a formatted report.' },
            { type: 'code_block', language: 'python', code: "# Expected Output:\n# ================================\n# 📊 STUDENT GRADE REPORT\n# ================================\n# Harsh    | Avg: 87.3 | Grade: A\n# Rahul    | Avg: 72.0 | Grade: B\n# Priya    | Avg: 91.7 | Grade: A+\n# ================================" },
            { type: 'callout', variant: 'tip', text: "Use a dictionary where each key is a student name and value is a list of 3 marks. Loop through .items() to compute averages." }
          ]
        },
        starter_code: "students = {\n    'Harsh': [85, 92, 84],\n    'Rahul': [70, 68, 78],\n    'Priya': [95, 88, 92]\n}\n\n# Print the grade report\n# Grade logic: >=90 = A+, >=80 = A, >=70 = B, else C\n",
        test_cases_json: [{ type: 'output_contains', value: 'Harsh' }, { type: 'output_contains', value: 'Priya' }, { type: 'output_contains', value: 'Grade' }]
      }
    ]
  },
  {
    unit_number: 3,
    title: 'Control Flow: Conditionals & Loops',
    description: 'Learn how to control the flow of your program.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'If / Elif / Else',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Making Decisions in Python' },
            { type: 'code_block', language: 'python', code: "marks = 85\n\nif marks >= 90:\n    print('Grade: A+')\nelif marks >= 80:\n    print('Grade: A')\nelif marks >= 70:\n    print('Grade: B')\nelif marks >= 60:\n    print('Grade: C')\nelse:\n    print('Grade: F')" },
            { type: 'heading', text: 'Logical Operators in Conditions' },
            { type: 'code_block', language: 'python', code: "age = 20\nhas_id = True\n\nif age >= 18 and has_id:\n    print('Entry allowed')\n\nif age < 13 or age > 60:\n    print('Special discount')\n\nif not has_id:\n    print('ID required')" },
            { type: 'callout', variant: 'warning', text: "Indentation is everything in Python. Each block inside if/elif/else must be consistently indented (4 spaces recommended)." }
          ]
        },
        starter_code: "marks = int(input('Enter marks: '))\nis_science = True\n\n# Grade logic\n\n# Distinction check\n",
        test_cases_json: [{ type: 'output_contains', value: 'Grade' }]
      },
      {
        lesson_number: 2,
        title: 'While Loops',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'The While Loop' },
            { type: 'paragraph', text: 'A while loop runs as long as a condition is True. Always make sure the condition eventually becomes False — otherwise you\'ll have an infinite loop.' },
            { type: 'code_block', language: 'python', code: "count = 1\nwhile count <= 5:\n    print(f'Count: {count}')\n    count += 1  # MUST update, or infinite loop!\n\n# While with break\nwhile True:\n    answer = input('Type quit to exit: ')\n    if answer == 'quit':\n        break\n    print(f'You typed: {answer}')" },
            { type: 'callout', variant: 'warning', text: "Forgetting to update the loop variable (count += 1) causes an infinite loop. Your program will hang. Use Ctrl+C to stop it." }
          ]
        },
        starter_code: "secret = 7\nguess = 0\n\n# While loop here\n",
        test_cases_json: [{ type: 'output_contains', value: 'Found it!' }]
      },
      {
        lesson_number: 3,
        title: 'For Loops & Range',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'For Loops' },
            { type: 'code_block', language: 'python', code: "# Loop through a range\nfor i in range(1, 6):\n    print(i)  # 1 2 3 4 5\n\n# Range with step\nfor i in range(0, 20, 5):\n    print(i)  # 0 5 10 15\n\n# Loop through a list\nfruits = ['apple', 'banana', 'mango']\nfor fruit in fruits:\n    print(fruit)\n\n# Loop else (runs if loop completes without break)\nfor i in range(5):\n    print(i)\nelse:\n    print('Loop done!')" },
            { type: 'heading', text: 'Break, Continue, Pass' },
            { type: 'code_block', language: 'python', code: "# break — exit loop immediately\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)  # prints 0-4\n\n# continue — skip current iteration\nfor i in range(10):\n    if i % 2 == 0:\n        continue\n    print(i)  # prints odd numbers only\n\n# pass — placeholder, does nothing\nfor i in range(5):\n    pass  # TODO: add logic later" }
          ]
        },
        starter_code: "# 1. Triangle of stars\n\n# 2. Multiplication table of 7\n\n# 3. Prime numbers from 1-50\n",
        test_cases_json: [{ type: 'output_contains', value: '49' }, { type: 'output_contains', value: '70' }]
      },
      {
        lesson_number: 4,
        title: 'map(), filter(), reduce()',
        type: 'CONCEPT',
        duration_minutes: 8,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Functional Programming in Python' },
            { type: 'paragraph', text: 'map(), filter(), and reduce() are higher-order functions — they take another function as input and apply it to a collection.' },
            { type: 'code_block', language: 'python', code: "# map — apply function to each item\nnums = [1, 2, 3, 4, 5]\nsquares = list(map(lambda x: x**2, nums))\nprint(squares)  # [1, 4, 9, 16, 25]\n\n# filter — keep items where function returns True\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)  # [2, 4]\n\n# reduce — combine all items into one value\nfrom functools import reduce\ntotal = reduce(lambda x, y: x + y, nums)\nprint(total)  # 15" },
            { type: 'callout', variant: 'tip', text: 'These functions combined with lambda expressions are the Python way of processing collections without writing verbose for loops.' }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 5,
        title: 'Lambda Functions',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Lambda?' },
            { type: 'paragraph', text: 'A lambda is an anonymous, single-expression function. It is defined inline and doesn\'t need a def statement.' },
            { type: 'code_block', language: 'python', code: "# Regular function\ndef square(x):\n    return x ** 2\n\n# Lambda equivalent\nsquare = lambda x: x ** 2\nprint(square(5))  # 25\n\n# Multiple arguments\nadd = lambda x, y: x + y\nprint(add(3, 4))  # 7\n\n# Lambda with sorted()\nstudents = [('Harsh', 87), ('Priya', 95), ('Rahul', 72)]\nsorted_students = sorted(students, key=lambda s: s[1], reverse=True)\nprint(sorted_students)" }
          ]
        },
        starter_code: "# 1. Cube\ncube = \n\n# 2. Is even\nis_even = \n\n# 3. Celsius to Fahrenheit\nto_fahrenheit = \n\n# Test them\nprint(cube(3))\nprint(is_even(4))\nprint(to_fahrenheit(100))\n",
        test_cases_json: [{ type: 'output_contains', value: '27' }, { type: 'output_contains', value: 'True' }, { type: 'output_contains', value: '212.0' }]
      },
      {
        lesson_number: 6,
        title: 'Project: Number Guessing Game',
        type: 'PROJECT',
        duration_minutes: 20,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a complete number guessing game. The computer picks a random number between 1 and 100. The user gets 7 attempts to guess it. After each guess, print "Too high!", "Too low!", or "Correct!". Show remaining attempts.' },
            { type: 'code_block', language: 'python', code: "# Expected Output:\n# 🎮 Welcome to the Number Guessing Game!\n# I've picked a number between 1 and 100.\n# You have 7 attempts.\n# \n# Attempt 1/7 — Enter guess: 50\n# Too high! Try lower.\n# Attempt 2/7 — Enter guess: 25\n# Too low! Try higher.\n# ...\n# Correct! You got it in 5 attempts! 🎉" },
            { type: 'callout', variant: 'tip', text: "Use import random and random.randint(1, 100) to generate the secret number." }
          ]
        },
        starter_code: "import random\n\nsecret = random.randint(1, 100)\nattempts = 7\n\nprint('🎮 Welcome to the Number Guessing Game!')\nprint(f'I have picked a number between 1 and 100.')\nprint(f'You have {attempts} attempts.\\n')\n\n# Game loop here\n",
        test_cases_json: [{ type: 'output_contains', value: 'Welcome' }]
      }
    ]
  },
  {
    unit_number: 4,
    title: 'Functions & Recursion',
    description: 'Learn how to define reusable blocks of code and tackle recursion.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Defining & Calling Functions',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Function?' },
            { type: 'paragraph', text: 'A function is a reusable block of code that performs a specific task. Functions prevent repetition and make your code modular.' },
            { type: 'code_block', language: 'python', code: "# Define a function\ndef greet(name):\n    print(f'Hello, {name}!')\n\n# Call the function\ngreet('Harsh')   # Hello, Harsh!\ngreet('Priya')   # Hello, Priya!\n\n# Function with return value\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)  # 8" },
            { type: 'heading', text: 'Default Parameters & Keyword Arguments' },
            { type: 'code_block', language: 'python', code: "def greet(name, message='Good morning'):\n    print(f'{message}, {name}!')\n\ngreet('Harsh')                    # Good morning, Harsh!\ngreet('Priya', 'Good evening')    # Good evening, Priya!\ngreet(message='Hey', name='Rahul')# Hey, Rahul!" },
            { type: 'callout', variant: 'warning', text: "Parameters with default values must come after parameters without defaults. def func(a=1, b) is invalid." }
          ]
        },
        starter_code: "# Define your 3 functions\n\n\n# Test them\nprint(km_to_miles(10))\nprint(kg_to_pounds(70))\nprint(celsius_to_fahrenheit(37))\n",
        test_cases_json: [{ type: 'output_contains', value: '6.21' }, { type: 'output_contains', value: '154' }, { type: 'output_contains', value: '98.6' }]
      },
      {
        lesson_number: 2,
        title: 'Scope & Return Values',
        type: 'CONCEPT',
        duration_minutes: 7,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Local vs Global Scope' },
            { type: 'code_block', language: 'python', code: "x = 10  # Global variable\n\ndef my_func():\n    x = 20  # Local variable — different from global x\n    print(x)  # 20\n\nmy_func()\nprint(x)  # 10 — global unchanged\n\n# Using global keyword\ndef increment():\n    global x\n    x += 1\n\nincrement()\nprint(x)  # 11" },
            { type: 'callout', variant: 'warning', text: "Avoid using global variables — it makes code hard to debug. Pass values as parameters and return results instead." },
            { type: 'heading', text: 'Multiple Return Values' },
            { type: 'code_block', language: 'python', code: "def min_max(nums):\n    return min(nums), max(nums)\n\nlow, high = min_max([3, 1, 8, 5, 2])\nprint(low, high)  # 1 8" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Recursion',
        type: 'EXERCISE',
        duration_minutes: 12,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is Recursion?' },
            { type: 'paragraph', text: 'Recursion is when a function calls itself. Every recursive function needs: 1) A base case (when to stop), and 2) A recursive case (calling itself with a smaller input).' },
            { type: 'code_block', language: 'python', code: "# Factorial using recursion\n# 5! = 5 * 4 * 3 * 2 * 1 = 120\ndef factorial(n):\n    if n == 0 or n == 1:  # Base case\n        return 1\n    return n * factorial(n - 1)  # Recursive case\n\nprint(factorial(5))  # 120\nprint(factorial(0))  # 1\n\n# Fibonacci using recursion\n# 0, 1, 1, 2, 3, 5, 8, 13...\ndef fibonacci(n):\n    if n <= 1:  # Base case\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(7))  # 13" },
            { type: 'callout', variant: 'warning', text: "Without a base case, recursion runs forever and causes a RecursionError: maximum recursion depth exceeded." }
          ]
        },
        starter_code: "# 1. Power\ndef power(base, exp):\n    pass\n\n# 2. Sum of digits\ndef sum_digits(n):\n    pass\n\n# 3. Countdown\ndef countdown(n):\n    pass\n\n# Test\nprint(power(2, 8))\nprint(sum_digits(456))\ncountdown(5)\n",
        test_cases_json: [{ type: 'output_contains', value: '256' }, { type: 'output_contains', value: '15' }, { type: 'output_contains', value: 'Go!' }]
      },
      {
        lesson_number: 4,
        title: 'Decorators',
        type: 'CONCEPT',
        duration_minutes: 8,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Decorator?' },
            { type: 'paragraph', text: 'A decorator is a function that wraps another function to add extra behaviour — without modifying the original function.' },
            { type: 'code_block', language: 'python', code: "import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f'{func.__name__} took {end-start:.4f}s')\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    time.sleep(1)\n    print('Done!')\n\nslow_function()\n# Done!\n# slow_function took 1.0012s" },
            { type: 'callout', variant: 'tip', text: "The @timer syntax is shorthand for: slow_function = timer(slow_function)" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 5,
        title: 'Project: Calculator App',
        type: 'PROJECT',
        duration_minutes: 20,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: "Build a fully functional calculator that keeps running until the user types 'exit'. Support: +, -, *, /, // (floor div), % (modulus), ** (power)." },
            { type: 'code_block', language: 'python', code: "# Expected Output:\n# 🧮 Python Calculator\n# Operations: +  -  *  /  //  %  **\n# Type 'exit' to quit\n# \n# Enter first number: 15\n# Enter operator: **\n# Enter second number: 3\n# Result: 15 ** 3 = 3375\n# \n# Enter first number: exit\n# Goodbye! 👋" },
            { type: 'callout', variant: 'tip', text: "Use a dictionary to map operators to lambda functions: ops = {'+': lambda a,b: a+b, ...}. Handle ZeroDivisionError with try/except." }
          ]
        },
        starter_code: "def calculate(a, op, b):\n    ops = {\n        '+': lambda a, b: a + b,\n        # add remaining operators\n    }\n    if op not in ops:\n        return 'Invalid operator'\n    return ops[op](a, b)\n\nprint('🧮 Python Calculator')\nprint(\"Type 'exit' to quit\\n\")\n\nwhile True:\n    # Get input and call calculate()\n    pass\n",
        test_cases_json: [{ type: 'output_contains', value: 'Calculator' }]
      }
    ]
  },
  {
    unit_number: 5,
    title: 'File I/O & Exception Handling',
    description: 'Learn how to read/write files and handle runtime errors gracefully.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Reading & Writing Files',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Why File I/O?' },
            { type: 'paragraph', text: 'RAM is volatile — data is lost when the program ends. Files store data permanently on disk. Python makes file operations simple.' },
            { type: 'code_block', language: 'python', code: "# Writing to a file\nwith open('notes.txt', 'w') as f:\n    f.write('Hello, File!\\n')\n    f.write('This is line 2\\n')\n\n# Reading entire file\nwith open('notes.txt', 'r') as f:\n    content = f.read()\n    print(content)\n\n# Reading line by line\nwith open('notes.txt', 'r') as f:\n    for line in f:\n        print(line.strip())\n\n# Appending to file\nwith open('notes.txt', 'a') as f:\n    f.write('Appended line\\n')" },
            { type: 'callout', variant: 'tip', text: "Always use 'with open()' — it automatically closes the file even if an error occurs. Never rely on manually calling f.close()." },
            { type: 'callout', variant: 'info', text: "File modes: 'r' = read, 'w' = write (overwrites!), 'a' = append, 'r+' = read and write" }
          ]
        },
        starter_code: "# Step 1: Write 3 items\nwith open('todo.txt', 'w') as f:\n    pass\n\n# Step 2: Read and print\n\n# Step 3: Append item 4\n\n# Step 4: Read updated file\n",
        test_cases_json: [{ type: 'output_contains', value: 'todo' }]
      },
      {
        lesson_number: 2,
        title: 'Exception Handling',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is an Exception?' },
            { type: 'paragraph', text: 'An exception is a runtime error that crashes your program if not handled. Python provides try-except blocks to catch and handle errors gracefully.' },
            { type: 'code_block', language: 'python', code: "# Basic try-except\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print('Cannot divide by zero!')\n\n# Multiple exceptions\ntry:\n    num = int(input('Enter number: '))\n    result = 100 / num\n    print(f'Result: {result}')\nexcept ValueError:\n    print('Invalid input — enter a number!')\nexcept ZeroDivisionError:\n    print('Cannot divide by zero!')\nelse:\n    print('Success!')  # runs if no exception\nfinally:\n    print('This always runs')  # cleanup code" },
            { type: 'heading', text: 'Common Exception Types' },
            { type: 'list', items: ["ValueError — wrong data type conversion", "ZeroDivisionError — dividing by zero", "IndexError — list index out of range", "KeyError — dictionary key not found", "FileNotFoundError — file doesn't exist", "TypeError — wrong type for operation"] }
          ]
        },
        starter_code: "def safe_divide(a, b):\n    pass\n\ndef safe_open(filename):\n    pass\n\ndef safe_convert(value):\n    pass\n\n# Tests\nprint(safe_divide(10, 0))\nprint(safe_open('ghost.txt'))\nprint(safe_convert('abc'))\n",
        test_cases_json: [{ type: 'output_contains', value: 'Error' }]
      },
      {
        lesson_number: 3,
        title: 'Raising Custom Exceptions',
        type: 'CONCEPT',
        duration_minutes: 7,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Raising Exceptions' },
            { type: 'code_block', language: 'python', code: "# Raise built-in exception\ndef set_age(age):\n    if age < 0 or age > 150:\n        raise ValueError(f'Invalid age: {age}')\n    return age\n\ntry:\n    set_age(-5)\nexcept ValueError as e:\n    print(f'Error: {e}')\n\n# Custom exception class\nclass InsufficientFundsError(Exception):\n    def __init__(self, amount, balance):\n        super().__init__(f'Cannot withdraw {amount}. Balance: {balance}')\n\ndef withdraw(amount, balance):\n    if amount > balance:\n        raise InsufficientFundsError(amount, balance)\n    return balance - amount" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 4,
        title: 'Working with CSV Files',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Reading & Writing CSV' },
            { type: 'code_block', language: 'python', code: "import csv\n\n# Writing CSV\nstudents = [\n    ['Name', 'Age', 'Marks'],\n    ['Harsh', 21, 87],\n    ['Priya', 20, 95],\n    ['Rahul', 22, 72]\n]\n\nwith open('students.csv', 'w', newline='') as f:\n    writer = csv.writer(f)\n    writer.writerows(students)\n\n# Reading CSV\nwith open('students.csv', 'r') as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)\n\n# CSV as dictionary\nwith open('students.csv', 'r') as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(f\"{row['Name']}: {row['Marks']}\")" }
          ]
        },
        starter_code: "import csv\n\n# Write the CSV\ndata = [\n    ['Name', 'Maths', 'Science', 'English'],\n    # Add 4 rows\n]\n\n# Write to file\n\n# Read and calculate averages\n",
        test_cases_json: [{ type: 'output_contains', value: 'Name' }]
      },
      {
        lesson_number: 5,
        title: 'Project: To-Do List with File Persistence',
        type: 'PROJECT',
        duration_minutes: 20,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a command-line to-do list app that saves tasks to a file so they persist between runs. Support: add task, view all tasks, mark complete, delete task, exit.' },
            { type: 'code_block', language: 'python', code: "# Expected Output:\n# 📝 To-Do List App\n# 1. Add task\n# 2. View tasks\n# 3. Mark complete\n# 4. Delete task\n# 5. Exit\n# \n# Choice: 1\n# Task: Buy groceries\n# ✅ Task added!\n# \n# Choice: 2\n# [ ] 1. Buy groceries\n# [✓] 2. Submit assignment" }
          ]
        },
        starter_code: "TODO_FILE = 'tasks.txt'\n\ndef load_tasks():\n    pass\n\ndef save_tasks(tasks):\n    pass\n\ndef show_menu():\n    print('\\n📝 To-Do List App')\n    print('1. Add task')\n    print('2. View tasks')\n    print('3. Mark complete')\n    print('4. Delete task')\n    print('5. Exit')\n\n# Main loop\ntasks = load_tasks()\nwhile True:\n    show_menu()\n    choice = input('Choice: ')\n    # Handle choices\n",
        test_cases_json: [{ type: 'output_contains', value: 'To-Do' }]
      }
    ]
  },
  {
    unit_number: 6,
    title: 'Object-Oriented Programming',
    description: 'Learn how to use classes and objects.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Classes & Objects',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is OOP?' },
            { type: 'paragraph', text: 'Object-Oriented Programming organises code around objects — real-world entities that have attributes (data) and methods (behaviour).' },
            { type: 'code_block', language: 'python', code: "class Dog:\n    # Class attribute — shared by all dogs\n    species = 'Canis lupus familiaris'\n\n    # Constructor — runs when object is created\n    def __init__(self, name, age):\n        self.name = name  # Instance attribute\n        self.age = age\n\n    # Method\n    def bark(self):\n        print(f'{self.name} says: Woof!')\n\n    def __str__(self):\n        return f'Dog({self.name}, {self.age})'\n\n# Create objects\ndog1 = Dog('Bruno', 3)\ndog2 = Dog('Max', 5)\n\ndog1.bark()           # Bruno says: Woof!\nprint(dog1.name)      # Bruno\nprint(Dog.species)    # Canis lupus...\nprint(dog1)           # Dog(Bruno, 3)" },
            { type: 'callout', variant: 'info', text: "self refers to the current object instance. It must be the first parameter of every instance method." }
          ]
        },
        starter_code: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        pass\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n\n    def get_balance(self):\n        pass\n\n    def __str__(self):\n        pass\n\n# Test\nacc1 = BankAccount('Harsh', 5000)\nacc1.deposit(2000)\nacc1.withdraw(1500)\nprint(acc1)\nprint(acc1.get_balance())\n",
        test_cases_json: [{ type: 'output_contains', value: 'Harsh' }, { type: 'output_contains', value: '5500' }]
      },
      {
        lesson_number: 2,
        title: 'Inheritance',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is Inheritance?' },
            { type: 'paragraph', text: 'Inheritance lets a child class reuse and extend a parent class. This avoids code repetition and models real-world hierarchies.' },
            { type: 'code_block', language: 'python', code: "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def work(self):\n        print(f'{self.name} is working.')\n\n    def __str__(self):\n        return f'{self.name} (₹{self.salary})'\n\n# Programmer inherits from Employee\nclass Programmer(Employee):\n    def __init__(self, name, salary, language):\n        super().__init__(name, salary)  # Call parent constructor\n        self.language = language\n\n    def code(self):\n        print(f'{self.name} is coding in {self.language}.')\n\n    # Method overriding\n    def work(self):\n        print(f'{self.name} is writing {self.language} code.')\n\np = Programmer('Harsh', 80000, 'Python')\np.work()   # overridden method\np.code()\nprint(p)   # uses parent __str__" }
          ]
        },
        starter_code: "class Animal:\n    pass\n\nclass Dog(Animal):\n    pass\n\nclass Cat(Animal):\n    pass\n\nclass Bird(Animal):\n    pass\n\n# Test all\n",
        test_cases_json: [{ type: 'output_contains', value: 'says' }, { type: 'output_contains', value: 'fetch' }]
      },
      {
        lesson_number: 3,
        title: 'Encapsulation & Properties',
        type: 'CONCEPT',
        duration_minutes: 8,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Encapsulation' },
            { type: 'paragraph', text: 'Encapsulation hides internal data and exposes only what\'s necessary. In Python, use _ (protected) or __ (private) prefixes to signal restricted access.' },
            { type: 'code_block', language: 'python', code: "class Student:\n    def __init__(self, name, marks):\n        self.name = name\n        self.__marks = marks  # private\n\n    @property\n    def marks(self):\n        return self.__marks\n\n    @marks.setter\n    def marks(self, value):\n        if value < 0 or value > 100:\n            raise ValueError('Marks must be 0-100')\n        self.__marks = value\n\ns = Student('Harsh', 85)\nprint(s.marks)     # 85 — uses getter\ns.marks = 90       # uses setter\n# s.__marks = 150  # This would bypass the setter!" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 4,
        title: 'Static & Class Methods',
        type: 'CONCEPT',
        duration_minutes: 7,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Three Types of Methods' },
            { type: 'code_block', language: 'python', code: "class MathHelper:\n    pi = 3.14159\n\n    # Instance method — needs self\n    def double(self, x):\n        return x * 2\n\n    # Class method — works on the class itself\n    @classmethod\n    def get_pi(cls):\n        return cls.pi\n\n    # Static method — no self or cls needed\n    @staticmethod\n    def add(a, b):\n        return a + b\n\nprint(MathHelper.get_pi())    # 3.14159\nprint(MathHelper.add(5, 3))   # 8" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 5,
        title: 'Operator Overloading & Dunder Methods',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Dunder (Magic) Methods' },
            { type: 'paragraph', text: 'Dunder methods let you define how your objects behave with built-in operators like +, -, *, len(), str().' },
            { type: 'code_block', language: 'python', code: "class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __add__(self, other):      # v1 + v2\n        return Vector(self.x + other.x, self.y + other.y)\n\n    def __mul__(self, scalar):     # v * 3\n        return Vector(self.x * scalar, self.y * scalar)\n\n    def __len__(self):             # len(v)\n        return int((self.x**2 + self.y**2) ** 0.5)\n\n    def __str__(self):             # print(v)\n        return f'Vector({self.x}, {self.y})'\n\nv1 = Vector(2, 3)\nv2 = Vector(1, 4)\nprint(v1 + v2)    # Vector(3, 7)\nprint(v1 * 3)     # Vector(6, 9)\nprint(len(v1))    # 3" }
          ]
        },
        starter_code: "import math\n\nclass Complex:\n    def __init__(self, real, imag):\n        self.real = real\n        self.imag = imag\n\n    def __add__(self, other):\n        pass\n\n    def __sub__(self, other):\n        pass\n\n    def __mul__(self, other):\n        pass\n\n    def __str__(self):\n        pass\n\n    def __abs__(self):\n        pass\n\nc1 = Complex(3, 4)\nc2 = Complex(1, 2)\nprint(c1 + c2)\nprint(c1 - c2)\nprint(c1 * c2)\nprint(abs(c1))\n",
        test_cases_json: [{ type: 'output_contains', value: '4+6i' }, { type: 'output_contains', value: '5.0' }]
      },
      {
        lesson_number: 6,
        title: 'Project: Bank Account System',
        type: 'PROJECT',
        duration_minutes: 25,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a complete bank account management system using OOP. Create a base Account class and two child classes: SavingsAccount and CurrentAccount.' },
            { type: 'code_block', language: 'python', code: "# Expected Output:\n# Account created: Harsh (Savings)\n# Deposited ₹5000. Balance: ₹5000\n# Withdrew ₹2000. Balance: ₹3000\n# Interest added (4%): ₹120. Balance: ₹3120\n# \n# Account created: Priya (Current)\n# Deposited ₹10000. Balance: ₹10000\n# Overdraft used: ₹2000. Balance: ₹-2000" },
            { type: 'callout', variant: 'tip', text: "SavingsAccount should have an add_interest(rate) method. CurrentAccount should allow overdraft up to a limit." }
          ]
        },
        starter_code: "class Account:\n    def __init__(self, owner, acc_type):\n        self.owner = owner\n        self.acc_type = acc_type\n        self.balance = 0\n        print(f'Account created: {owner} ({acc_type})')\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n\n    def __str__(self):\n        return f'{self.owner}: ₹{self.balance}'\n\nclass SavingsAccount(Account):\n    def __init__(self, owner):\n        super().__init__(owner, 'Savings')\n\n    def add_interest(self, rate):\n        pass\n\nclass CurrentAccount(Account):\n    def __init__(self, owner, overdraft_limit=5000):\n        super().__init__(owner, 'Current')\n        self.overdraft_limit = overdraft_limit\n\n    def withdraw(self, amount):\n        pass  # allow overdraft\n\n# Test\ns = SavingsAccount('Harsh')\ns.deposit(5000)\ns.withdraw(2000)\ns.add_interest(4)\nprint(s)\n",
        test_cases_json: [{ type: 'output_contains', value: 'Harsh' }, { type: 'output_contains', value: 'Interest' }]
      }
    ]
  },
  {
    unit_number: 7,
    title: 'Modules, Packages & Modern Python',
    description: 'Learn how to use external libraries and modern Python features.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Modules & Imports',
        type: 'CONCEPT',
        duration_minutes: 8,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'What is a Module?' },
            { type: 'paragraph', text: 'A module is a Python file containing reusable code. Python has thousands of built-in and third-party modules.' },
            { type: 'code_block', language: 'python', code: "# Import entire module\nimport math\nprint(math.pi)          # 3.14159\nprint(math.sqrt(16))    # 4.0\nprint(math.ceil(3.2))   # 4\n\n# Import specific items\nfrom math import pi, sqrt\nprint(sqrt(25))         # 5.0\n\n# Import with alias\nimport datetime as dt\nnow = dt.datetime.now()\nprint(now.strftime('%d %B %Y'))  # 03 June 2026\n\n# Useful standard library modules\n# random, os, sys, json, re, collections, itertools" },
            { type: 'heading', text: 'Creating Your Own Module' },
            { type: 'code_block', language: 'python', code: "# File: myutils.py\ndef greet(name):\n    return f'Hello, {name}!'\n\ndef square(n):\n    return n ** 2\n\n# File: main.py\nimport myutils\nprint(myutils.greet('Harsh'))" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Virtual Environments & pip',
        type: 'CONCEPT',
        duration_minutes: 7,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Why Virtual Environments?' },
            { type: 'paragraph', text: 'Different projects need different versions of packages. Virtual environments create isolated spaces so packages don\'t conflict.' },
            { type: 'code_block', language: 'python', code: "# Create virtual environment\npython -m venv venv\n\n# Activate (Windows)\nvenv\\Scripts\\activate\n\n# Activate (Mac/Linux)\nsource venv/bin/activate\n\n# Install packages\npip install requests\npip install numpy pandas\n\n# Save dependencies\npip freeze > requirements.txt\n\n# Install from requirements\npip install -r requirements.txt\n\n# Deactivate\ndeactivate" },
            { type: 'callout', variant: 'tip', text: "Always create a virtual environment for every project. Add venv/ to your .gitignore so you don't push it to GitHub." }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Modern Python Features',
        type: 'CONCEPT',
        duration_minutes: 10,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Walrus Operator (:=)' },
            { type: 'code_block', language: 'python', code: "# Without walrus\ndata = get_data()\nif data:\n    process(data)\n\n# With walrus\nif data := get_data():\n    process(data)\n\n# Useful in while loops\nwhile chunk := file.read(1024):\n    process(chunk)" },
            { type: 'heading', text: 'Type Hints' },
            { type: 'code_block', language: 'python', code: "# Add type annotations to functions\ndef greet(name: str, times: int = 1) -> str:\n    return (f'Hello, {name}! ' * times).strip()\n\ndef get_average(marks: list[float]) -> float:\n    return sum(marks) / len(marks)" },
            { type: 'heading', text: 'Match-Case (Python 3.10+)' },
            { type: 'code_block', language: 'python', code: "command = 'quit'\n\nmatch command:\n    case 'quit':\n        print('Exiting...')\n    case 'help':\n        print('Showing help...')\n    case 'start' | 'run':\n        print('Starting...')\n    case _:\n        print(f'Unknown command: {command}')" },
            { type: 'heading', text: 'Multi-Context Managers' },
            { type: 'code_block', language: 'python', code: "# Open two files at once\nwith open('input.txt') as fin, open('output.txt', 'w') as fout:\n    for line in fin:\n        fout.write(line.upper())" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 4,
        title: 'JSON Handling',
        type: 'EXERCISE',
        duration_minutes: 8,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Working with JSON' },
            { type: 'code_block', language: 'python', code: "import json\n\n# Python dict → JSON string\nstudent = {'name': 'Harsh', 'age': 21, 'marks': [85, 90, 78]}\njson_str = json.dumps(student, indent=2)\nprint(json_str)\n\n# JSON string → Python dict\ndata = json.loads(json_str)\nprint(data['name'])\n\n# Write JSON to file\nwith open('student.json', 'w') as f:\n    json.dump(student, f, indent=2)\n\n# Read JSON from file\nwith open('student.json', 'r') as f:\n    loaded = json.load(f)\nprint(loaded)" }
          ]
        },
        starter_code: "import json\n\ncontacts = [\n    # Add 3 contacts\n]\n\n# Save to JSON file\n\n# Read and print\n",
        test_cases_json: [{ type: 'output_contains', value: 'Name' }]
      },
      {
        lesson_number: 5,
        title: 'Project: Weather CLI (Using requests)',
        type: 'PROJECT',
        duration_minutes: 25,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a command-line weather app using the Open-Meteo API (free, no API key needed). The user enters a city name, your app fetches real weather data and displays it.' },
            { type: 'code_block', language: 'python', code: "# Expected Output:\n# 🌤️ Weather for Mumbai\n# Temperature : 32°C\n# Feels like  : 36°C\n# Humidity    : 78%\n# Wind Speed  : 14 km/h\n# Condition   : Partly Cloudy" },
            { type: 'callout', variant: 'tip', text: "Use Open-Meteo: https://api.open-meteo.com/v1/forecast. First use geopy or a geocoding API to convert city name to lat/lon. Install: pip install requests" }
          ]
        },
        starter_code: "import requests\n\ndef get_weather(city: str) -> dict:\n    # Step 1: Get coordinates for the city\n    geo_url = f'https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1'\n    # Step 2: Use coordinates to fetch weather\n    # Return a dict with temperature, humidity, wind_speed\n    pass\n\ndef display_weather(city: str, data: dict):\n    pass\n\ncity = input('Enter city name: ')\nweather = get_weather(city)\nif weather:\n    display_weather(city, weather)\nelse:\n    print('City not found!')\n",
        test_cases_json: [{ type: 'output_contains', value: 'Temperature' }]
      }
    ]
  },
  {
    unit_number: 8,
    title: 'Advanced OOP & Design Patterns',
    description: 'Master advanced Object-Oriented concepts like abstract classes, iterators, and generators.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Abstract Classes & Interfaces',
        type: 'CONCEPT',
        duration_minutes: 8,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Abstract Classes' },
            { type: 'code_block', language: 'python', code: "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float:\n        pass\n\n    @abstractmethod\n    def perimeter(self) -> float:\n        pass\n\n    def describe(self):\n        print(f'Area: {self.area():.2f}, Perimeter: {self.perimeter():.2f}')\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n\n    def perimeter(self):\n        return 2 * 3.14159 * self.radius\n\nc = Circle(5)\nc.describe()\n# Shape()  ← TypeError: Can't instantiate abstract class" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Multiple Inheritance & MRO',
        type: 'CONCEPT',
        duration_minutes: 7,
        xp_reward: 10,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Multiple Inheritance' },
            { type: 'code_block', language: 'python', code: "class Flyable:\n    def fly(self):\n        print('Flying!')\n\nclass Swimmable:\n    def swim(self):\n        print('Swimming!')\n\nclass Duck(Flyable, Swimmable):\n    def quack(self):\n        print('Quack!')\n\nd = Duck()\nd.fly()\nd.swim()\nd.quack()\n\n# MRO — Method Resolution Order\nprint(Duck.__mro__)\n# (<class 'Duck'>, <class 'Flyable'>, <class 'Swimmable'>, ...)" }
          ]
        },
        starter_code: "",
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Iterators & Generators',
        type: 'EXERCISE',
        duration_minutes: 10,
        xp_reward: 25,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Iterators' },
            { type: 'code_block', language: 'python', code: "# Custom iterator\nclass Countdown:\n    def __init__(self, start):\n        self.current = start\n\n    def __iter__(self):\n        return self\n\n    def __next__(self):\n        if self.current <= 0:\n            raise StopIteration\n        self.current -= 1\n        return self.current + 1\n\nfor n in Countdown(5):\n    print(n)  # 5 4 3 2 1" },
            { type: 'heading', text: 'Generators (simpler iterators)' },
            { type: 'code_block', language: 'python', code: "# Generator function\ndef countdown(start):\n    while start > 0:\n        yield start\n        start -= 1\n\nfor n in countdown(5):\n    print(n)\n\n# Generator expression (like list comp but lazy)\nsquares = (x**2 for x in range(10))\nprint(next(squares))  # 0\nprint(next(squares))  # 1" },
            { type: 'callout', variant: 'tip', text: "Generators are memory-efficient — they generate values one at a time instead of storing the whole list. Use them for large datasets." }
          ]
        },
        starter_code: "def fibonacci(n):\n    pass\n\ndef infinite_evens():\n    pass\n\n# Test here",
        test_cases_json: [{ type: 'output_contains', value: '55' }]
      },
      {
        lesson_number: 4,
        title: 'Project: Custom Iterable Protocol',
        type: 'PROJECT',
        duration_minutes: 20,
        xp_reward: 50,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a custom range-like class that supports iteration and works just like Python\'s built-in range.' }
          ]
        },
        starter_code: "class MyRange:\n    pass\n",
        test_cases_json: []
      }
    ]
  },
  {
    unit_number: 9,
    title: 'Python Final Track Project',
    description: 'Combine everything you have learned into a final large-scale application.',
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Final Project: Terminal RPG Game',
        type: 'PROJECT',
        duration_minutes: 45,
        xp_reward: 150,
        language: 'python',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a text-based RPG game utilizing OOP, dictionaries, control flow, and file saving/loading.' }
          ]
        },
        starter_code: "# Start building your RPG game here\nprint('Welcome to the Dungeon!')",
        test_cases_json: []
      }
    ]
  }
];

const fileContent = `import { LessonType } from '@prisma/client';

export const pythonTrackData = ${JSON.stringify(pythonTrackData, null, 2)};

export const pythonUnits = ${JSON.stringify(units, null, 2).replace(/"(CONCEPT|EXERCISE|PROJECT)"/g, 'LessonType.$1')};
`;

fs.writeFileSync('c:/Users/hjhar/OneDrive/Desktop/ScratchCode/scratch-code/prisma/python_track.ts', fileContent);
console.log('Successfully generated prisma/python_track.ts');
