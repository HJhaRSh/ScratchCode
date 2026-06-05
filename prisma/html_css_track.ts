import { LessonType } from '@prisma/client';

export const htmlCssTrackData = {
  title: 'HTML & CSS Mastery',
  slug: 'html-css',
  description: 'Master the building blocks of the web. Learn to structure content with HTML and style it beautifully with CSS. From basics to advanced responsive layouts.',
  icon: '🌐',
  color_hex: '#E34F26',
  total_units: 9,
  total_lessons: 47,
  is_published: true
};

export const htmlCssUnits = [
  // ─────────────────────────────────────────────
  // UNIT 1 — HTML Foundations
  // ─────────────────────────────────────────────
  {
    unit_number: 1,
    title: 'HTML Foundations',
    description: 'Learn the core structure of web pages and essential HTML tags.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'What is HTML?',
        type: LessonType.CONCEPT,
        duration_minutes: 5,
        xp_reward: 10,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'paragraph', text: 'HTML (HyperText Markup Language) is the skeleton of every web page. It tells the browser what content to display — headings, paragraphs, images, links, and more.' },
            { type: 'heading', text: 'How HTML works' },
            { type: 'paragraph', text: 'HTML uses tags — keywords wrapped in angle brackets. Most tags come in pairs: an opening tag and a closing tag.' },
            { type: 'code_block', language: 'html', code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p>This is my first paragraph.</p>\n  </body>\n</html>' },
            { type: 'heading', text: 'Anatomy of an HTML tag' },
            { type: 'list', items: ['<h1> — Opening tag', 'Hello, World! — Content', '</h1> — Closing tag'] },
            { type: 'callout', variant: 'info', text: 'The <!DOCTYPE html> declaration at the top tells the browser this is an HTML5 document. Always include it!' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <!-- Write your HTML here -->\n    \n  </body>\n</html>',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Headings & Paragraphs',
        type: LessonType.EXERCISE,
        duration_minutes: 8,
        xp_reward: 20,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Heading Tags' },
            { type: 'paragraph', text: 'HTML has 6 levels of headings, from h1 (largest/most important) to h6 (smallest). Use only one h1 per page — it tells search engines what the page is about.' },
            { type: 'code_block', language: 'html', code: '<h1>Main Title</h1>\n<h2>Section Title</h2>\n<h3>Sub-section</h3>\n<h4>Smaller heading</h4>' },
            { type: 'heading', text: 'Paragraph Tag' },
            { type: 'code_block', language: 'html', code: '<p>This is a paragraph. Browsers add spacing above and below paragraphs automatically.</p>\n\n<p>This is a second paragraph on a new line.</p>' },
            { type: 'heading', text: 'Line Break & Horizontal Rule' },
            { type: 'code_block', language: 'html', code: '<p>Line one<br>Line two (same paragraph, new line)</p>\n<hr> <!-- Horizontal divider line -->' },
            { type: 'callout', variant: 'warning', text: 'Never use headings just to make text bigger! Use them to represent document structure. For size, use CSS.' }
          ]
        },
        starter_code: '<!-- Create a page about your favourite topic -->\n<h1><!-- Main title here --></h1>\n\n<h2>Why I love it</h2>\n<p><!-- Write a paragraph --></p>\n\n<h2>Top 3 facts</h2>\n<p><!-- Another paragraph --></p>',
        test_cases_json: [
          { type: 'dom_exists', selector: 'h1', hint: 'Add an h1 tag' },
          { type: 'dom_exists', selector: 'h2', hint: 'Add at least one h2 tag' },
          { type: 'dom_exists', selector: 'p', hint: 'Add at least one paragraph' }
        ]
      },
      {
        lesson_number: 3,
        title: 'Links & Images',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Hyperlinks — the <a> tag' },
            { type: 'code_block', language: 'html', code: '<!-- Basic link -->\n<a href="https://google.com">Visit Google</a>\n\n<!-- Opens in new tab -->\n<a href="https://google.com" target="_blank">Open in new tab</a>\n\n<!-- Link to another page in your site -->\n<a href="about.html">About</a>\n\n<!-- Email link -->\n<a href="mailto:hello@example.com">Email us</a>' },
            { type: 'heading', text: 'Images — the <img> tag' },
            { type: 'code_block', language: 'html', code: '<!-- Basic image -->\n<img src="photo.jpg" alt="A description of the image">\n\n<!-- Image with width -->\n<img src="logo.png" alt="Company logo" width="200">\n\n<!-- Image from the web -->\n<img src="https://picsum.photos/400/200" alt="Random photo">' },
            { type: 'callout', variant: 'warning', text: 'Always add the alt attribute to images! It describes the image to screen readers and displays if the image fails to load.' },
            { type: 'callout', variant: 'tip', text: 'The <img> tag is self-closing — it has no closing tag. Same for <br>, <hr>, and <input>.' }
          ]
        },
        starter_code: '<!-- Create a simple webpage about a travel destination -->\n<h1>My Dream Destination</h1>\n\n<!-- Add an image of the place -->\n\n<!-- Add a paragraph describing it -->\n<p></p>\n\n<!-- Add a link to learn more -->\n<a href="">Learn more</a>',
        test_cases_json: [
          { type: 'dom_exists', selector: 'img', hint: 'Add an img tag with a src attribute' },
          { type: 'dom_exists', selector: 'a', hint: 'Add a link with an href attribute' }
        ]
      },
      {
        lesson_number: 4,
        title: 'Lists & Tables',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Unordered Lists (bullets)' },
            { type: 'code_block', language: 'html', code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>' },
            { type: 'heading', text: 'Ordered Lists (numbers)' },
            { type: 'code_block', language: 'html', code: '<ol>\n  <li>Learn HTML</li>\n  <li>Learn CSS</li>\n  <li>Build your first website</li>\n</ol>' },
            { type: 'heading', text: 'Tables' },
            { type: 'code_block', language: 'html', code: '<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Age</th>\n      <th>City</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Harsh</td>\n      <td>21</td>\n      <td>Mumbai</td>\n    </tr>\n    <tr>\n      <td>Priya</td>\n      <td>20</td>\n      <td>Delhi</td>\n    </tr>\n  </tbody>\n</table>' },
            { type: 'callout', variant: 'info', text: 'Use tables for tabular data (like spreadsheets), not for layout. Layout is what CSS Flexbox and Grid are for.' }
          ]
        },
        starter_code: '<!-- Your skills page -->\n<h1>My Skills</h1>\n\n<h2>Technical Skills</h2>\n<ul>\n  <!-- Add 3-5 skills -->\n</ul>\n\n<h2>Learning Roadmap</h2>\n<ol>\n  <!-- Add your learning steps in order -->\n</ol>\n\n<h2>My Projects</h2>\n<table>\n  <thead>\n    <tr><th>Project</th><th>Technology</th><th>Status</th></tr>\n  </thead>\n  <tbody>\n    <!-- Add 2 rows -->\n  </tbody>\n</table>',
        test_cases_json: [
          { type: 'dom_exists', selector: 'ul', hint: 'Add an unordered list' },
          { type: 'dom_exists', selector: 'ol', hint: 'Add an ordered list' },
          { type: 'dom_exists', selector: 'table', hint: 'Add a table' }
        ]
      },
      {
        lesson_number: 5,
        title: 'HTML Forms',
        type: LessonType.EXERCISE,
        duration_minutes: 12,
        xp_reward: 25,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Forms collect user input' },
            { type: 'code_block', language: 'html', code: '<form>\n  <!-- Text input -->\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" placeholder="Enter your name">\n  \n  <!-- Email -->\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email">\n  \n  <!-- Password -->\n  <input type="password" name="password" placeholder="Password">\n  \n  <!-- Dropdown -->\n  <select name="city">\n    <option value="mumbai">Mumbai</option>\n    <option value="delhi">Delhi</option>\n  </select>\n  \n  <!-- Radio buttons -->\n  <input type="radio" name="gender" value="male"> Male\n  <input type="radio" name="gender" value="female"> Female\n  \n  <!-- Checkbox -->\n  <input type="checkbox" name="agree"> I agree to terms\n  \n  <!-- Textarea -->\n  <textarea name="message" rows="4">Your message here</textarea>\n  \n  <!-- Submit -->\n  <button type="submit">Submit</button>\n</form>' },
            { type: 'callout', variant: 'tip', text: 'Always link a <label> to its input using the "for" attribute matching the input\'s "id". This improves accessibility.' }
          ]
        },
        starter_code: '<!-- Build a contact form -->\n<h1>Contact Us</h1>\n<form>\n  <!-- Name field -->\n  \n  <!-- Email field -->\n  \n  <!-- Message textarea -->\n  \n  <!-- Submit button -->\n  \n</form>',
        test_cases_json: [
          { type: 'dom_exists', selector: 'form', hint: 'Add a form element' },
          { type: 'dom_exists', selector: 'input', hint: 'Add at least one input' },
          { type: 'dom_exists', selector: 'button', hint: 'Add a submit button' }
        ]
      },
      {
        lesson_number: 6,
        title: 'Semantic HTML5',
        type: LessonType.CONCEPT,
        duration_minutes: 8,
        xp_reward: 10,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Why Semantic HTML?' },
            { type: 'paragraph', text: 'Semantic tags describe the meaning of content, not just its appearance. This helps search engines, screen readers, and other developers understand your page.' },
            { type: 'code_block', language: 'html', code: '<!-- Non-semantic (avoid this) -->\n<div id="header">...</div>\n<div id="nav">...</div>\n<div id="content">...</div>\n<div id="footer">...</div>\n\n<!-- Semantic HTML5 (use this) -->\n<header>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>My Article</h1>\n    <p>Content here...</p>\n  </article>\n  <aside>\n    <h2>Related</h2>\n  </aside>\n</main>\n<footer>\n  <p>© 2026 My Website</p>\n</footer>' },
            { type: 'list', items: ['<header> — top section of a page or section', '<nav> — navigation links', '<main> — primary content (only one per page!)', '<article> — self-contained content piece', '<section> — thematic grouping', '<aside> — sidebar or related content', '<footer> — bottom section'] },
            { type: 'callout', variant: 'tip', text: 'Search engines like Google give higher rankings to pages with proper semantic HTML. It also makes your code much easier to maintain.' }
          ]
        },
        starter_code: '<!-- Rebuild this div-soup with semantic tags -->\n<div id="header">\n  <div id="nav">\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n  </div>\n</div>\n<div id="main">\n  <div class="article">\n    <h1>Blog Post Title</h1>\n    <p>Post content here...</p>\n  </div>\n</div>\n<div id="footer">\n  <p>Footer content</p>\n</div>',
        test_cases_json: []
      },
      {
        lesson_number: 7,
        title: 'Project: Personal Bio Page',
        type: LessonType.PROJECT,
        duration_minutes: 20,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a complete personal bio page using proper semantic HTML. Use all the tags you have learned to create a professional-looking page structure.' },
            { type: 'list', items: ['Use <header>, <main>, <footer> structure', 'Include your name as an <h1> and a profile description', 'Add a skills section using <ul>', 'Add a projects section with at least one project in a <table>', 'Include a contact form with name, email, and message fields', 'Add at least one image and two navigation links'] },
            { type: 'callout', variant: 'tip', text: 'Focus on structure, not style — CSS comes later! Make sure your HTML is clean and semantic.' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Bio Page</title>\n</head>\n<body>\n\n  <header>\n    <nav>\n      <!-- Navigation links -->\n    </nav>\n  </header>\n\n  <main>\n    <section id="about">\n      <!-- Your name, photo, and bio -->\n    </section>\n\n    <section id="skills">\n      <h2>My Skills</h2>\n      <!-- Unordered list -->\n    </section>\n\n    <section id="projects">\n      <h2>My Projects</h2>\n      <!-- Table with project details -->\n    </section>\n\n    <section id="contact">\n      <h2>Contact Me</h2>\n      <!-- Contact form -->\n    </section>\n  </main>\n\n  <footer>\n    <!-- Footer content -->\n  </footer>\n\n</body>\n</html>',
        test_cases_json: [
          { type: 'dom_exists', selector: 'header', hint: 'Add a header element' },
          { type: 'dom_exists', selector: 'main', hint: 'Add a main element' },
          { type: 'dom_exists', selector: 'footer', hint: 'Add a footer element' },
          { type: 'dom_exists', selector: 'h1', hint: 'Add an h1 with your name' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 2 — CSS Basics
  // ─────────────────────────────────────────────
  {
    unit_number: 2,
    title: 'CSS Basics',
    description: 'Learn how to style HTML with colors, fonts, and spacing.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'How CSS Works',
        type: LessonType.CONCEPT,
        duration_minutes: 7,
        xp_reward: 10,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Three Ways to Add CSS' },
            { type: 'code_block', language: 'html', code: '<!-- 1. Inline styles (avoid for most cases) -->\n<p style="color: red;">Red text</p>\n\n<!-- 2. Internal stylesheet (in the <head>) -->\n<style>\n  p { color: blue; }\n</style>\n\n<!-- 3. External stylesheet (best practice) -->\n<link rel="stylesheet" href="styles.css">' },
            { type: 'heading', text: 'CSS Syntax' },
            { type: 'code_block', language: 'css', code: '/* selector { property: value; } */\n\nh1 {\n  color: steelblue;\n  font-size: 32px;\n  font-weight: bold;\n}\n\np {\n  color: #333333;\n  line-height: 1.6;\n}' },
            { type: 'heading', text: 'Selectors' },
            { type: 'code_block', language: 'css', code: '/* Element selector */\np { color: black; }\n\n/* Class selector */\n.highlight { background: yellow; }\n\n/* ID selector */\n#header { font-size: 24px; }\n\n/* Multiple selectors */\nh1, h2, h3 { font-family: sans-serif; }\n\n/* Descendant selector */\nnav a { text-decoration: none; }' },
            { type: 'callout', variant: 'tip', text: 'Use classes for styles you will reuse, IDs for unique elements. Classes are prefixed with . and IDs with # in CSS.' }
          ]
        },
        starter_code: '/* Style the body and headings */\nbody {\n\n}\n\nh1 {\n\n}\n\np {\n\n}',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Colors & Backgrounds',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Color Values' },
            { type: 'code_block', language: 'css', code: '.example {\n  /* Named colors */\n  color: steelblue;\n  \n  /* Hex codes */\n  color: #3490dc;\n  \n  /* RGB */\n  color: rgb(52, 144, 220);\n  \n  /* RGBA (with opacity) */\n  color: rgba(52, 144, 220, 0.8);\n  \n  /* HSL (hue, saturation, lightness) */\n  color: hsl(207, 70%, 53%);\n}' },
            { type: 'heading', text: 'Backgrounds' },
            { type: 'code_block', language: 'css', code: 'body {\n  background-color: #f8fafc;\n}\n\n.card {\n  /* Solid color */\n  background-color: white;\n  \n  /* Linear gradient */\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  \n  /* Image */\n  background-image: url("hero.jpg");\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}' },
            { type: 'callout', variant: 'tip', text: 'Use HSL colors for easier theming. Keeping the same hue and varying lightness gives you a perfect color palette (e.g., light, medium, dark variants).' }
          ]
        },
        starter_code: '/* Style these elements with colors */\nbody {\n  background-color: /* light grey */;\n}\n\nh1 {\n  color: /* a nice blue */;\n}\n\n.card {\n  background: /* a gradient */;\n}',
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Typography & Fonts',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Font Properties' },
            { type: 'code_block', language: 'css', code: 'body {\n  font-family: \'Inter\', sans-serif;\n  font-size: 16px;\n  font-weight: 400;       /* 100-900 */\n  font-style: italic;\n  line-height: 1.6;       /* spacing between lines */\n  letter-spacing: 0.5px;  /* spacing between characters */\n}\n\nh1 {\n  font-size: 3rem;        /* rem = relative to root font size */\n  font-weight: 700;\n  text-transform: uppercase;\n  text-align: center;\n}' },
            { type: 'heading', text: 'Google Fonts' },
            { type: 'code_block', language: 'html', code: '<!-- In your HTML <head> -->\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">' },
            { type: 'code_block', language: 'css', code: '/* Then use it in CSS */\nbody {\n  font-family: \'Inter\', sans-serif;\n}' },
            { type: 'callout', variant: 'tip', text: 'Prefer rem over px for font sizes — it respects the user\'s browser font size setting. 1rem = 16px by default.' }
          ]
        },
        starter_code: '/* Style the typography for a blog post */\nbody {\n  font-family: \'Georgia\', serif;\n  /* Set a comfortable base size and line height */\n}\n\nh1 {\n  /* Make the title large and bold */\n}\n\np {\n  /* Make text readable */\n}\n\n.caption {\n  /* Small, grey, italic text */\n}',
        test_cases_json: []
      },
      {
        lesson_number: 4,
        title: 'Project: Styled Blog Post',
        type: LessonType.PROJECT,
        duration_minutes: 20,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Create a beautifully styled blog post page that combines your HTML and CSS skills. The post should have a header, a featured image, the article body, and a footer.' },
            { type: 'list', items: ['Body: light grey background, comfortable font', 'Header: dark background, white text, centered nav', 'Article: white card, centered, max-width 700px, box-shadow', 'H1: large and bold', 'Paragraphs: readable font size (18px), line-height 1.8', 'Footer: dark background, white text, centered'] },
            { type: 'callout', variant: 'tip', text: 'Use a <style> tag inside your HTML file to include CSS for this project. Or create a separate styles.css file and link it.' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Blog Post</title>\n  <style>\n    /* Your CSS here */\n  </style>\n</head>\n<body>\n\n  <header>\n    <nav>\n      <a href="/">Home</a>\n      <a href="/blog">Blog</a>\n    </nav>\n  </header>\n\n  <main>\n    <article>\n      <h1>The Future of Web Development</h1>\n      <p class="meta">By Harsh Jain · June 2026</p>\n      <img src="https://picsum.photos/700/300" alt="Article image">\n      <p>Write your article content here...</p>\n      <p>More paragraphs...</p>\n    </article>\n  </main>\n\n  <footer>\n    <p>© 2026 My Blog</p>\n  </footer>\n\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 3 — The Box Model
  // ─────────────────────────────────────────────
  {
    unit_number: 3,
    title: 'The Box Model',
    description: 'Understand margin, border, padding, and how every element is a box.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Padding, Margin & Border',
        type: LessonType.CONCEPT,
        duration_minutes: 8,
        xp_reward: 10,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Every element is a box' },
            { type: 'paragraph', text: 'The CSS Box Model describes the space around every HTML element. From inside out: Content → Padding → Border → Margin.' },
            { type: 'code_block', language: 'css', code: '.box {\n  /* CONTENT */\n  width: 200px;\n  height: 100px;\n  \n  /* PADDING — space inside the border */\n  padding: 20px;              /* all sides */\n  padding: 10px 20px;         /* top/bottom  left/right */\n  padding: 10px 20px 15px 5px; /* top right bottom left */\n  \n  /* BORDER */\n  border: 2px solid #333;\n  border-radius: 8px;         /* rounded corners */\n  \n  /* MARGIN — space outside the border */\n  margin: 20px;               /* all sides */\n  margin: 0 auto;             /* center horizontally */\n}' },
            { type: 'heading', text: 'box-sizing: border-box' },
            { type: 'code_block', language: 'css', code: '/* By default, padding ADDS to the width */\n/* width: 200px + padding: 20px = 240px total */\n\n/* With border-box, padding is INCLUDED in the width */\n* {\n  box-sizing: border-box; /* Add this to every project! */\n}' },
            { type: 'callout', variant: 'warning', text: 'Always add box-sizing: border-box to your projects. Without it, padding will make elements unexpectedly wider than you intended.' }
          ]
        },
        starter_code: '/* Apply box-sizing globally */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n.card {\n  width: 300px;\n  /* Add padding, border, and margin */\n  \n}',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Display & Positioning',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Display Property' },
            { type: 'code_block', language: 'css', code: '.element {\n  display: block;        /* full width, new line */\n  display: inline;       /* flows with text, no width/height */\n  display: inline-block; /* like inline but accepts w/h */\n  display: none;         /* hides the element completely */\n  display: flex;         /* flexbox container */\n  display: grid;         /* grid container */\n}' },
            { type: 'heading', text: 'Position Property' },
            { type: 'code_block', language: 'css', code: '.element {\n  position: static;    /* default — normal document flow */\n  position: relative;  /* offset from its normal position */\n  position: absolute;  /* positioned relative to nearest non-static ancestor */\n  position: fixed;     /* fixed to the viewport (stays on scroll) */\n  position: sticky;    /* stays visible when scrolling past it */\n}\n\n/* Use top/right/bottom/left with positioned elements */\n.tooltip {\n  position: absolute;\n  top: -30px;\n  left: 50%;\n}' },
            { type: 'callout', variant: 'info', text: 'An element with position: absolute is positioned relative to the nearest parent with position: relative (or the page if none exists).' }
          ]
        },
        starter_code: '/* Create a card with a badge in the top-right corner */\n.card {\n  position: relative;\n  width: 300px;\n  padding: 20px;\n  border: 1px solid #ddd;\n  border-radius: 12px;\n}\n\n.badge {\n  /* Position this absolutely in the card\'s top-right */\n  \n}',
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Project: Card Component',
        type: LessonType.PROJECT,
        duration_minutes: 20,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a beautiful product card component using everything you have learned about the box model.' },
            { type: 'list', items: ['Card: white background, border-radius 16px, box-shadow, padding 24px', 'Image: full width, border-radius on top corners', 'Badge: position absolute, top-right corner, colorful', 'Title: bold, large', 'Description: grey text', 'Price: large, colored', 'Button: full width, colored background, white text, border-radius, hover effect'] }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Product Card</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body {\n      min-height: 100vh;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background: #f0f4ff;\n      font-family: sans-serif;\n    }\n    /* Style the card below */\n  </style>\n</head>\n<body>\n  <div class="card">\n    <span class="badge">NEW</span>\n    <img src="https://picsum.photos/300/200" alt="Product">\n    <div class="card-body">\n      <h2>Product Name</h2>\n      <p>A short description of this amazing product.</p>\n      <p class="price">$29.99</p>\n      <button>Add to Cart</button>\n    </div>\n  </div>\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 4 — Flexbox Layouts
  // ─────────────────────────────────────────────
  {
    unit_number: 4,
    title: 'Flexbox Layouts',
    description: 'Master 1D layouts with CSS Flexbox for navbars, cards, and centering.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Flexbox Fundamentals',
        type: LessonType.CONCEPT,
        duration_minutes: 10,
        xp_reward: 10,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Container vs Items' },
            { type: 'paragraph', text: 'Flexbox has two players: the flex container (parent) and flex items (children). You apply flex properties to the container, and they control how the children are arranged.' },
            { type: 'code_block', language: 'css', code: '.container {\n  display: flex;\n  \n  /* Direction */\n  flex-direction: row;          /* default: left to right */\n  flex-direction: column;       /* top to bottom */\n  flex-direction: row-reverse;  /* right to left */\n  \n  /* Alignment on main axis */\n  justify-content: flex-start;   /* pack at start */\n  justify-content: flex-end;     /* pack at end */\n  justify-content: center;       /* center items */\n  justify-content: space-between;/* even gaps between */\n  justify-content: space-around; /* even gaps around */\n  \n  /* Alignment on cross axis */\n  align-items: flex-start;\n  align-items: center;           /* vertically center */\n  align-items: stretch;          /* default: fill height */\n  \n  /* Wrapping */\n  flex-wrap: wrap;               /* items wrap to next line */\n  gap: 16px;                     /* gap between items */\n}' },
            { type: 'heading', text: 'Flex Item Properties' },
            { type: 'code_block', language: 'css', code: '.item {\n  flex: 1;          /* grow to fill available space */\n  flex: 0 0 200px;  /* fixed 200px, no grow/shrink */\n  align-self: center; /* override container\'s align-items */\n}' },
            { type: 'callout', variant: 'tip', text: 'The single most powerful flexbox trick: display: flex; align-items: center; justify-content: center; — this perfectly centers anything!' }
          ]
        },
        starter_code: '/* Center the box both horizontally and vertically */\n.container {\n  width: 100vw;\n  height: 100vh;\n  /* Make it a flex container and center the child */\n}\n\n.box {\n  width: 200px;\n  height: 200px;\n  background: steelblue;\n}',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Building a Navbar',
        type: LessonType.EXERCISE,
        duration_minutes: 12,
        xp_reward: 25,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Navbars are a classic Flexbox use case' },
            { type: 'code_block', language: 'html', code: '<nav class="navbar">\n  <a href="/" class="logo">MySite</a>\n  <ul class="nav-links">\n    <li><a href="/">Home</a></li>\n    <li><a href="/about">About</a></li>\n    <li><a href="/work">Work</a></li>\n    <li><a href="/contact">Contact</a></li>\n  </ul>\n  <button class="cta">Get Started</button>\n</nav>' },
            { type: 'code_block', language: 'css', code: '.navbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 32px;\n  background: #1e293b;\n}\n\n.logo {\n  color: white;\n  font-weight: bold;\n  font-size: 1.25rem;\n  text-decoration: none;\n}\n\n.nav-links {\n  display: flex;\n  list-style: none;\n  gap: 24px;\n}\n\n.nav-links a {\n  color: #94a3b8;\n  text-decoration: none;\n  transition: color 0.2s;\n}\n\n.nav-links a:hover {\n  color: white;\n}' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Navbar</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    /* Style your navbar here */\n  </style>\n</head>\n<body>\n  <nav class="navbar">\n    <a href="/" class="logo">🚀 MySite</a>\n    <ul class="nav-links">\n      <li><a href="/">Home</a></li>\n      <li><a href="/about">About</a></li>\n      <li><a href="/projects">Projects</a></li>\n      <li><a href="/contact">Contact</a></li>\n    </ul>\n    <button class="cta-btn">Hire Me</button>\n  </nav>\n</body>\n</html>',
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Card Grid with Flexbox',
        type: LessonType.EXERCISE,
        duration_minutes: 12,
        xp_reward: 25,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Responsive Card Grid' },
            { type: 'code_block', language: 'css', code: '.card-grid {\n  display: flex;\n  flex-wrap: wrap;  /* wrap to next row */\n  gap: 24px;\n  padding: 40px;\n}\n\n.card {\n  flex: 1 1 300px;  /* grow, shrink, min 300px wide */\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.1);\n}' },
            { type: 'callout', variant: 'tip', text: 'flex: 1 1 300px is shorthand for flex-grow: 1; flex-shrink: 1; flex-basis: 300px. This makes cards flexible but never smaller than 300px.' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Card Grid</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body { background: #f1f5f9; font-family: sans-serif; }\n    /* Create a responsive card grid */\n  </style>\n</head>\n<body>\n  <div class="card-grid">\n    <div class="card">\n      <h3>Frontend Development</h3>\n      <p>HTML, CSS, JavaScript, React</p>\n    </div>\n    <div class="card">\n      <h3>Backend Development</h3>\n      <p>Python, Node.js, Databases</p>\n    </div>\n    <div class="card">\n      <h3>UI/UX Design</h3>\n      <p>Figma, Design Systems, UX Research</p>\n    </div>\n    <div class="card">\n      <h3>DevOps</h3>\n      <p>Docker, CI/CD, Cloud Deployment</p>\n    </div>\n  </div>\n</body>\n</html>',
        test_cases_json: []
      },
      {
        lesson_number: 4,
        title: 'Project: Landing Page Hero',
        type: LessonType.PROJECT,
        duration_minutes: 25,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a full hero section for a landing page using Flexbox. It should include a navbar and a two-column hero layout (text on left, image on right).' },
            { type: 'list', items: ['Navbar: logo left, links center, CTA button right', 'Hero: two columns side by side (50/50)', 'Left column: headline, subtext, two buttons', 'Right column: centered image or illustration', 'Overall: dark or gradient background, white text', 'Make it look like a real SaaS landing page'] }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Landing Page</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body { font-family: sans-serif; background: #0f172a; color: white; }\n    /* Add your Flexbox styles here */\n  </style>\n</head>\n<body>\n\n  <nav class="navbar">\n    <!-- Navbar content -->\n  </nav>\n\n  <section class="hero">\n    <div class="hero-text">\n      <h1>Build Faster.<br>Ship Smarter.</h1>\n      <p>The platform that helps developers build and deploy at the speed of thought.</p>\n      <div class="cta-buttons">\n        <button class="primary-btn">Get Started Free</button>\n        <button class="secondary-btn">Watch Demo</button>\n      </div>\n    </div>\n    <div class="hero-image">\n      <img src="https://picsum.photos/500/400" alt="Hero illustration">\n    </div>\n  </section>\n\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 5 — CSS Grid
  // ─────────────────────────────────────────────
  {
    unit_number: 5,
    title: 'CSS Grid',
    description: 'Create complex 2D layouts with CSS Grid.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'CSS Grid Fundamentals',
        type: LessonType.CONCEPT,
        duration_minutes: 10,
        xp_reward: 10,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Grid vs Flexbox' },
            { type: 'paragraph', text: 'Flexbox is 1D (works in one direction — row OR column). Grid is 2D (works in both rows AND columns simultaneously). Use Flexbox for components, Grid for page layouts.' },
            { type: 'code_block', language: 'css', code: '.container {\n  display: grid;\n  \n  /* Define columns */\n  grid-template-columns: 200px 1fr 200px;  /* fixed, flexible, fixed */\n  grid-template-columns: repeat(3, 1fr);   /* three equal columns */\n  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* responsive! */\n  \n  /* Define rows */\n  grid-template-rows: auto 1fr auto;  /* header, content, footer */\n  \n  /* Gap between cells */\n  gap: 24px;\n  column-gap: 24px;\n  row-gap: 16px;\n}' },
            { type: 'heading', text: 'Placing Items' },
            { type: 'code_block', language: 'css', code: '.item {\n  /* Span multiple columns */\n  grid-column: span 2;\n  \n  /* Span from line 1 to line 3 */\n  grid-column: 1 / 3;\n  \n  /* Span all columns */\n  grid-column: 1 / -1;\n  \n  /* Span rows */\n  grid-row: span 2;\n}' },
            { type: 'callout', variant: 'tip', text: 'repeat(auto-fill, minmax(250px, 1fr)) creates a fully responsive grid that automatically adjusts the number of columns based on screen width — no media queries needed!' }
          ]
        },
        starter_code: '/* Create a 3-column photo grid */\n.photo-grid {\n  display: grid;\n  /* Define 3 equal columns with a gap */\n}\n\n.photo-grid .featured {\n  /* Make this span 2 columns and 2 rows */\n}',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Page Layout with Grid',
        type: LessonType.EXERCISE,
        duration_minutes: 12,
        xp_reward: 25,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Classic Holy Grail Layout' },
            { type: 'code_block', language: 'css', code: '.page {\n  display: grid;\n  grid-template-areas:\n    "header header header"\n    "sidebar content aside"\n    "footer footer footer";\n  grid-template-columns: 200px 1fr 200px;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n  gap: 16px;\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.content { grid-area: content; }\n.aside   { grid-area: aside; }\n.footer  { grid-area: footer; }' },
            { type: 'callout', variant: 'info', text: 'grid-template-areas lets you name regions of the grid and place elements by name — making complex layouts incredibly readable.' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Grid Layout</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body { font-family: sans-serif; min-height: 100vh; }\n    \n    /* Build the page layout with grid-template-areas */\n    .page { }\n    .header { background: #1e293b; color: white; padding: 20px; }\n    .sidebar { background: #e2e8f0; padding: 20px; }\n    .content { background: white; padding: 20px; }\n    .aside { background: #e2e8f0; padding: 20px; }\n    .footer { background: #1e293b; color: white; padding: 20px; }\n  </style>\n</head>\n<body>\n  <div class="page">\n    <header class="header">Header</header>\n    <aside class="sidebar">Sidebar</aside>\n    <main class="content">Main Content</main>\n    <aside class="aside">Right Panel</aside>\n    <footer class="footer">Footer</footer>\n  </div>\n</body>\n</html>',
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Project: Portfolio Gallery',
        type: LessonType.PROJECT,
        duration_minutes: 25,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a responsive portfolio gallery using CSS Grid. Some items should span multiple columns or rows to create a masonry-like layout.' },
            { type: 'list', items: ['Grid with auto-fill columns (min 250px each)', '6 portfolio cards with images', 'First card: spans 2 columns and 2 rows (featured)', 'Cards: project title overlay on hover', 'Smooth hover transitions', 'Dark background for contrast'] }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Portfolio Gallery</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body { background: #0f172a; font-family: sans-serif; padding: 40px; }\n    /* Build your grid gallery here */\n  </style>\n</head>\n<body>\n  <h1 style="color:white; text-align:center; margin-bottom:40px;">My Portfolio</h1>\n  <div class="gallery">\n    <div class="card featured">\n      <img src="https://picsum.photos/600/400?random=1" alt="Project 1">\n      <div class="overlay"><h3>Featured Project</h3></div>\n    </div>\n    <div class="card">\n      <img src="https://picsum.photos/300/200?random=2" alt="Project 2">\n      <div class="overlay"><h3>Project 2</h3></div>\n    </div>\n    <div class="card">\n      <img src="https://picsum.photos/300/200?random=3" alt="Project 3">\n      <div class="overlay"><h3>Project 3</h3></div>\n    </div>\n    <div class="card">\n      <img src="https://picsum.photos/300/200?random=4" alt="Project 4">\n      <div class="overlay"><h3>Project 4</h3></div>\n    </div>\n    <div class="card">\n      <img src="https://picsum.photos/300/200?random=5" alt="Project 5">\n      <div class="overlay"><h3>Project 5</h3></div>\n    </div>\n    <div class="card">\n      <img src="https://picsum.photos/300/200?random=6" alt="Project 6">\n      <div class="overlay"><h3>Project 6</h3></div>\n    </div>\n  </div>\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 6 — CSS Animations & Transitions
  // ─────────────────────────────────────────────
  {
    unit_number: 6,
    title: 'CSS Animations & Transitions',
    description: 'Bring pages to life with smooth transitions and keyframe animations.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Transitions',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'CSS Transitions' },
            { type: 'paragraph', text: 'Transitions smoothly animate a property change — like a hover effect. You define what property to animate, the duration, and the easing function.' },
            { type: 'code_block', language: 'css', code: '.button {\n  background: #3b82f6;\n  color: white;\n  padding: 12px 24px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  \n  /* Transition syntax: property duration easing delay */\n  transition: background 0.3s ease;\n  transition: all 0.3s ease;          /* all properties */\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.button:hover {\n  background: #2563eb;\n  transform: translateY(-2px);          /* move up 2px */\n  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);\n}' },
            { type: 'heading', text: 'Transform Property' },
            { type: 'code_block', language: 'css', code: '.element {\n  transform: translateX(50px);    /* move right 50px */\n  transform: translateY(-20px);   /* move up 20px */\n  transform: scale(1.1);          /* 10% bigger */\n  transform: rotate(45deg);       /* rotate 45° */\n  transform: skewX(10deg);        /* skew */\n  \n  /* Combine transforms */\n  transform: translateY(-4px) scale(1.02);\n}' },
            { type: 'callout', variant: 'tip', text: 'Animate only transform and opacity for the best performance. These properties can be hardware-accelerated by the browser.' }
          ]
        },
        starter_code: '/* Create hover effects for these cards */\n.card {\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n  /* Add a transition */\n}\n\n.card:hover {\n  /* Add a lift effect */\n}',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Keyframe Animations',
        type: LessonType.EXERCISE,
        duration_minutes: 12,
        xp_reward: 25,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: '@keyframes — Define Animation Steps' },
            { type: 'code_block', language: 'css', code: '/* Define the animation */\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes pulse {\n  0%   { transform: scale(1); }\n  50%  { transform: scale(1.05); }\n  100% { transform: scale(1); }\n}\n\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n/* Apply the animation */\n.element {\n  animation: fadeIn 0.5s ease forwards;\n  /* name | duration | easing | fill-mode */\n  \n  animation: pulse 2s ease infinite;       /* repeats forever */\n  animation: spin 1s linear infinite;      /* loading spinner */\n  \n  animation-delay: 0.3s;                   /* start after 0.3s */\n  animation-direction: alternate;           /* goes back and forth */\n}' },
            { type: 'callout', variant: 'tip', text: 'Use animation-fill-mode: forwards to keep the element in its final animated state after the animation ends.' }
          ]
        },
        starter_code: '/* Create these animations */\n\n/* 1. Fade in from bottom */\n@keyframes fadeInUp {\n  /* Define keyframes */\n}\n\n/* 2. Bouncing dot loader */\n@keyframes bounce {\n  /* Define keyframes */\n}\n\n.page-title {\n  animation: /* apply fadeInUp */;\n}\n\n.loader-dot {\n  animation: /* apply bounce */;\n}',
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Project: Animated Landing Section',
        type: LessonType.PROJECT,
        duration_minutes: 25,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build an animated hero section that makes a great first impression. Use transitions and keyframe animations to bring it to life.' },
            { type: 'list', items: ['Hero fades in on page load (fadeInUp animation)', 'Title has a gradient text effect', 'CTA button has a pulse animation', 'Navigation links have underline slide-in hover effect', 'A floating badge animation (up and down)', 'At least 3 different animations used'] }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Animated Hero</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body {\n      font-family: \'Segoe UI\', sans-serif;\n      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);\n      color: white;\n      min-height: 100vh;\n      overflow: hidden;\n    }\n    \n    /* Define your keyframe animations here */\n    \n    \n    /* Style and animate the elements */\n  </style>\n</head>\n<body>\n  <nav class="navbar">\n    <a href="#" class="logo">⚡ Spark</a>\n    <ul>\n      <li><a href="#">Home</a></li>\n      <li><a href="#">About</a></li>\n      <li><a href="#">Work</a></li>\n    </ul>\n  </nav>\n  \n  <section class="hero">\n    <span class="badge">🚀 Now in Beta</span>\n    <h1>Design. Build.<br><span class="gradient-text">Ship Faster.</span></h1>\n    <p>The all-in-one platform for modern developers.</p>\n    <button class="cta-btn">Get Started Free →</button>\n  </section>\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 7 — Responsive Design
  // ─────────────────────────────────────────────
  {
    unit_number: 7,
    title: 'Responsive Design',
    description: 'Make your websites look great on every screen size with media queries.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Media Queries',
        type: LessonType.CONCEPT,
        duration_minutes: 10,
        xp_reward: 10,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Mobile First Approach' },
            { type: 'paragraph', text: 'Write CSS for mobile first, then use media queries to add styles for larger screens. This is the modern best practice.' },
            { type: 'code_block', language: 'css', code: '/* Mobile styles (default) */\n.container {\n  flex-direction: column;\n  padding: 16px;\n}\n\n/* Tablet and above */\n@media (min-width: 768px) {\n  .container {\n    flex-direction: row;\n    padding: 32px;\n  }\n}\n\n/* Desktop and above */\n@media (min-width: 1024px) {\n  .container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 48px;\n  }\n}\n\n/* Common breakpoints */\n/* sm: 640px  md: 768px  lg: 1024px  xl: 1280px */' },
            { type: 'heading', text: 'Viewport Meta Tag' },
            { type: 'code_block', language: 'html', code: '<!-- ALWAYS include this in your <head>! -->\n<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
            { type: 'callout', variant: 'warning', text: 'Without the viewport meta tag, mobile browsers will zoom out to show the desktop version of your site, breaking all your responsive styles.' }
          ]
        },
        starter_code: '/* Make this layout responsive */\n.cards {\n  display: flex;\n  /* On mobile: stack vertically */\n  /* On tablet (768px+): 2 columns */\n  /* On desktop (1024px+): 3 columns */\n}\n\n.card {\n  background: white;\n  border-radius: 12px;\n  padding: 20px;\n}',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Responsive Images & Units',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Responsive Units' },
            { type: 'code_block', language: 'css', code: '/* Relative units */\n.element {\n  font-size: 1rem;    /* = 16px (root font size) */\n  font-size: 1.5em;   /* = 1.5x parent font size */\n  width: 50%;         /* 50% of parent width */\n  padding: 5vw;       /* 5% of viewport width */\n  height: 100vh;      /* 100% of viewport height */\n  width: clamp(200px, 50%, 600px); /* min, preferred, max */\n}\n\n/* Responsive images */\nimg {\n  max-width: 100%;\n  height: auto;       /* maintains aspect ratio */\n}' },
            { type: 'heading', text: 'Fluid Typography' },
            { type: 'code_block', language: 'css', code: 'h1 {\n  /* Scales between 24px and 64px based on screen width */\n  font-size: clamp(1.5rem, 5vw, 4rem);\n}' },
            { type: 'callout', variant: 'tip', text: 'Use clamp() for fluid typography that automatically scales with the viewport — no media queries needed! clamp(min, preferred, max).' }
          ]
        },
        starter_code: '/* Fix these to be fully responsive */\n.hero {\n  height: 100vh;\n  padding: /* use vw units */;\n}\n\n.hero h1 {\n  font-size: /* use clamp() */;\n}\n\n.hero img {\n  /* Make image responsive */\n}',
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Project: Fully Responsive Landing Page',
        type: LessonType.PROJECT,
        duration_minutes: 30,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a fully responsive landing page that looks great on mobile (360px), tablet (768px), and desktop (1440px).' },
            { type: 'list', items: ['Mobile: single column, stacked navigation (hamburger optional)', 'Tablet: 2-column feature cards', 'Desktop: 3-column feature cards, full navbar', 'Fluid typography with clamp()', 'Responsive images with max-width: 100%', 'No horizontal scrollbar on any screen size'] }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Responsive Landing Page</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body { font-family: sans-serif; }\n    \n    /* Mobile first styles */\n    \n    /* Tablet (768px+) */\n    @media (min-width: 768px) {}\n    \n    /* Desktop (1024px+) */\n    @media (min-width: 1024px) {}\n  </style>\n</head>\n<body>\n  <nav class="navbar">\n    <a class="logo" href="#">⚡ Product</a>\n    <ul class="nav-links">\n      <li><a href="#">Features</a></li>\n      <li><a href="#">Pricing</a></li>\n      <li><a href="#">About</a></li>\n    </ul>\n    <a href="#" class="cta-btn">Sign Up</a>\n  </nav>\n  \n  <section class="hero">\n    <h1>The platform for<br>modern teams</h1>\n    <p>Collaborate, build, and ship 10x faster.</p>\n    <a href="#" class="primary-btn">Start for Free</a>\n  </section>\n  \n  <section class="features">\n    <div class="feature-card">\n      <span class="icon">⚡</span>\n      <h3>Blazing Fast</h3>\n      <p>Performance optimized for speed.</p>\n    </div>\n    <div class="feature-card">\n      <span class="icon">🔒</span>\n      <h3>Secure</h3>\n      <p>Enterprise-grade security built in.</p>\n    </div>\n    <div class="feature-card">\n      <span class="icon">🌍</span>\n      <h3>Global Scale</h3>\n      <p>Deploy anywhere in the world.</p>\n    </div>\n  </section>\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 8 — CSS Variables & Advanced Techniques
  // ─────────────────────────────────────────────
  {
    unit_number: 8,
    title: 'CSS Variables & Advanced Techniques',
    description: 'Level up with CSS custom properties, pseudo-elements, and modern selectors.',
    xp_reward: 100,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'CSS Custom Properties (Variables)',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'CSS Variables — Define Once, Use Everywhere' },
            { type: 'code_block', language: 'css', code: '/* Define variables on :root (global scope) */\n:root {\n  --color-primary: #3b82f6;\n  --color-primary-hover: #2563eb;\n  --color-bg: #0f172a;\n  --color-text: #f8fafc;\n  --color-muted: #94a3b8;\n  \n  --font-size-base: 16px;\n  --font-size-lg: 1.125rem;\n  --font-size-xl: 1.25rem;\n  \n  --radius-sm: 6px;\n  --radius-md: 12px;\n  --radius-lg: 20px;\n  \n  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);\n  --shadow-md: 0 4px 20px rgba(0,0,0,0.15);\n  \n  --transition: all 0.2s ease;\n}\n\n/* Use them with var() */\n.button {\n  background: var(--color-primary);\n  border-radius: var(--radius-md);\n  box-shadow: var(--shadow-sm);\n  transition: var(--transition);\n}\n\n.button:hover {\n  background: var(--color-primary-hover);\n}' },
            { type: 'heading', text: 'Dark Mode with Variables' },
            { type: 'code_block', language: 'css', code: ':root {\n  --bg: #ffffff;\n  --text: #0f172a;\n}\n\n[data-theme="dark"] {\n  --bg: #0f172a;\n  --text: #f8fafc;\n}\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n}' },
            { type: 'callout', variant: 'tip', text: 'Defining all your design tokens (colors, spacing, fonts) as CSS variables makes theming and maintenance much easier. Change one variable to update the whole site.' }
          ]
        },
        starter_code: '/* Build a design system using CSS variables */\n:root {\n  /* Define your color palette */\n  /* Define spacing scale */\n  /* Define border radii */\n  /* Define shadows */\n}\n\n/* Then use them to style these components */\n.btn-primary {}\n.btn-secondary {}\n.card {}\n.badge {}',
        test_cases_json: []
      },
      {
        lesson_number: 2,
        title: 'Pseudo-classes & Pseudo-elements',
        type: LessonType.EXERCISE,
        duration_minutes: 10,
        xp_reward: 20,
        language: 'css',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Pseudo-classes (state selectors)' },
            { type: 'code_block', language: 'css', code: 'a:hover { color: blue; }         /* when hovered */\nbutton:focus { outline: 2px solid blue; } /* keyboard focus */\ninput:disabled { opacity: 0.5; }  /* disabled state */\ninput:checked { accent-color: blue; } /* checkbox/radio checked */\n\n/* Structural pseudo-classes */\nli:first-child { font-weight: bold; }  /* first list item */\nli:last-child { border-bottom: none; }  /* last list item */\nli:nth-child(odd) { background: #f9f9f9; } /* zebra striping */\n\n/* Not selector */\nbutton:not(.primary) { background: white; }' },
            { type: 'heading', text: 'Pseudo-elements (virtual elements)' },
            { type: 'code_block', language: 'css', code: '.card::before {\n  content: "";\n  position: absolute;\n  top: 0; left: 0;\n  width: 100%; height: 4px;\n  background: var(--color-primary);\n  border-radius: 4px 4px 0 0;\n}\n\nh2::after {\n  content: "";\n  display: block;\n  width: 40px; height: 3px;\n  background: #3b82f6;\n  margin-top: 8px;\n}\n\np::first-line { font-weight: bold; }\np::selection { background: #3b82f6; color: white; }' }
          ]
        },
        starter_code: '/* Style this navigation using pseudo-classes */\nnav a {\n  color: #64748b;\n  text-decoration: none;\n  padding: 8px 0;\n  position: relative;\n}\n\n/* Slide-in underline on hover using ::after */\nnav a::after {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  /* Animate width from 0 to 100% on hover */\n}\n\nnav a:hover::after {}\n\n/* Zebra stripe a table */\ntr:nth-child(even) {}',
        test_cases_json: []
      },
      {
        lesson_number: 3,
        title: 'Project: Dark Mode Toggle',
        type: LessonType.PROJECT,
        duration_minutes: 25,
        xp_reward: 50,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a web page with a working dark mode toggle using CSS variables and a tiny bit of JavaScript to toggle a class.' },
            { type: 'list', items: ['Define all colors as CSS variables', 'Light mode: clean white/grey design', 'Dark mode: dark slate/navy design', 'Toggle button changes all colors instantly', 'Smooth transition between modes (0.3s ease)', 'Remember preference using localStorage'] },
            { type: 'callout', variant: 'tip', text: 'Toggle a class on <body> (e.g., .dark) and redefine CSS variables inside .dark. Everything updates automatically!' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Dark Mode</title>\n  <style>\n    :root {\n      --bg: #f8fafc;\n      --bg-card: #ffffff;\n      --text: #0f172a;\n      --text-muted: #64748b;\n      --border: #e2e8f0;\n      --primary: #3b82f6;\n    }\n    body.dark {\n      /* Redefine variables for dark mode */\n    }\n    * { box-sizing: border-box; margin: 0; padding: 0; transition: background 0.3s ease, color 0.3s ease; }\n    body { background: var(--bg); color: var(--text); font-family: sans-serif; padding: 40px; }\n    /* Style the rest here */\n  </style>\n</head>\n<body>\n  <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">\n    <h1>My App</h1>\n    <button id="theme-toggle" onclick="toggleTheme()">🌙 Dark Mode</button>\n  </header>\n  \n  <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:24px;">\n    <div class="card">\n      <h3>Card One</h3>\n      <p>Some content here that changes with the theme.</p>\n    </div>\n    <div class="card">\n      <h3>Card Two</h3>\n      <p>Another card with themed colors.</p>\n    </div>\n    <div class="card">\n      <h3>Card Three</h3>\n      <p>The theme changes everything smoothly.</p>\n    </div>\n  </div>\n\n  <script>\n    function toggleTheme() {\n      document.body.classList.toggle(\'dark\');\n      const isDark = document.body.classList.contains(\'dark\');\n      document.getElementById(\'theme-toggle\').textContent = isDark ? \'☀️ Light Mode\' : \'🌙 Dark Mode\';\n      localStorage.setItem(\'theme\', isDark ? \'dark\' : \'light\');\n    }\n    // Load saved preference\n    if (localStorage.getItem(\'theme\') === \'dark\') {\n      document.body.classList.add(\'dark\');\n    }\n  </script>\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  },

  // ─────────────────────────────────────────────
  // UNIT 9 — Final Track Project
  // ─────────────────────────────────────────────
  {
    unit_number: 9,
    title: 'Final Project: Portfolio Website',
    description: 'Build a complete, responsive, animated personal portfolio website.',
    xp_reward: 150,
    is_published: true,
    lessons: [
      {
        lesson_number: 1,
        title: 'Final Project: Personal Portfolio',
        type: LessonType.PROJECT,
        duration_minutes: 60,
        xp_reward: 100,
        language: 'html',
        is_published: true,
        content_json: {
          sections: [
            { type: 'heading', text: 'Project Brief' },
            { type: 'paragraph', text: 'Build a complete, production-quality personal portfolio website combining everything you have learned: HTML semantics, CSS Grid, Flexbox, animations, responsive design, and CSS variables.' },
            { type: 'heading', text: 'Required Sections' },
            { type: 'list', items: ['Navbar: fixed, transparent on top, solid on scroll (JS), with your name/logo and nav links', 'Hero: fullscreen, animated intro text, CTA buttons, scroll indicator', 'About: two-column layout with your photo and bio', 'Skills: grid of skill cards with icons', 'Projects: CSS Grid gallery with hover overlay', 'Contact: a styled contact form', 'Footer: social links'] },
            { type: 'heading', text: 'Technical Requirements' },
            { type: 'list', items: ['Use CSS variables for your design system', 'Fully responsive (mobile, tablet, desktop)', 'At least 3 CSS animations', 'Smooth scroll behavior', 'Semantic HTML5 structure'] },
            { type: 'callout', variant: 'tip', text: 'This is your showcase project! Make it yours — customize colors, fonts, and content to reflect your personal brand.' }
          ]
        },
        starter_code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Your Name | Portfolio</title>\n  <style>\n    /* === DESIGN SYSTEM === */\n    :root {\n      --primary: #6366f1;\n      --primary-dark: #4f46e5;\n      --bg: #0f172a;\n      --bg-card: #1e293b;\n      --text: #f8fafc;\n      --text-muted: #94a3b8;\n      --border: rgba(255,255,255,0.1);\n      --gradient: linear-gradient(135deg, #6366f1, #8b5cf6);\n      --radius: 16px;\n      --shadow: 0 20px 60px rgba(0,0,0,0.3);\n      --transition: all 0.3s ease;\n    }\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    html { scroll-behavior: smooth; }\n    body {\n      font-family: \'Segoe UI\', sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      line-height: 1.6;\n    }\n    \n    /* === BUILD YOUR PORTFOLIO HERE === */\n  </style>\n</head>\n<body>\n\n  <!-- NAVBAR -->\n  <nav class="navbar">\n    <a href="#" class="logo">Your Name</a>\n    <ul class="nav-links">\n      <li><a href="#about">About</a></li>\n      <li><a href="#skills">Skills</a></li>\n      <li><a href="#projects">Projects</a></li>\n      <li><a href="#contact">Contact</a></li>\n    </ul>\n  </nav>\n\n  <!-- HERO -->\n  <section id="hero" class="hero">\n    <div class="hero-content">\n      <p class="hero-greeting">Hello, I\'m</p>\n      <h1 class="hero-name">Your Name</h1>\n      <p class="hero-role">Frontend Developer & UI Designer</p>\n      <div class="hero-buttons">\n        <a href="#projects" class="btn-primary">View My Work</a>\n        <a href="#contact" class="btn-secondary">Hire Me</a>\n      </div>\n    </div>\n  </section>\n\n  <!-- ABOUT -->\n  <section id="about" class="section">\n    <h2 class="section-title">About Me</h2>\n    <!-- Two column layout: photo + bio -->\n  </section>\n\n  <!-- SKILLS -->\n  <section id="skills" class="section">\n    <h2 class="section-title">My Skills</h2>\n    <!-- Grid of skill cards -->\n  </section>\n\n  <!-- PROJECTS -->\n  <section id="projects" class="section">\n    <h2 class="section-title">My Projects</h2>\n    <!-- CSS Grid gallery -->\n  </section>\n\n  <!-- CONTACT -->\n  <section id="contact" class="section">\n    <h2 class="section-title">Get In Touch</h2>\n    <form class="contact-form">\n      <input type="text" placeholder="Your Name" required>\n      <input type="email" placeholder="Your Email" required>\n      <textarea placeholder="Your Message" rows="5" required></textarea>\n      <button type="submit">Send Message</button>\n    </form>\n  </section>\n\n  <!-- FOOTER -->\n  <footer>\n    <p>© 2026 Your Name. Built with HTML & CSS.</p>\n  </footer>\n\n</body>\n</html>',
        test_cases_json: []
      }
    ]
  }
];
