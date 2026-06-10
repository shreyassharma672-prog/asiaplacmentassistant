export const hrQuestions = [
  {
    question: "Tell me about yourself",
    answer:
      "I am a motivated fresher with a strong foundation in programming, problem solving, and project-based learning. I have worked on practical projects that helped me apply concepts like frontend development, backend APIs, databases, and teamwork. I am now looking for an opportunity where I can learn quickly, contribute sincerely, and grow as a professional.",
    tips: [
      "Keep it under 60-90 seconds.",
      "Mention education, skills, projects, and career goal.",
      "Avoid repeating your entire resume.",
    ],
  },
  {
    question: "Why should we hire you?",
    answer:
      "You should hire me because I bring a combination of strong fundamentals, willingness to learn, and practical project experience. I can adapt quickly, work well with a team, and take ownership of assigned tasks. As a fresher, I am eager to contribute, improve continuously, and add value to the organization.",
    tips: [
      "Connect your strengths to the role.",
      "Mention learning attitude and reliability.",
      "Support your answer with project examples.",
    ],
  },
  {
    question: "What are your strengths?",
    answer:
      "My strengths are problem solving, consistency, and quick learning. I enjoy breaking a problem into smaller parts and finding a practical solution. I also stay consistent with learning and completing tasks, which helped me finish academic and personal projects on time.",
    tips: [
      "Pick 2-3 strengths only.",
      "Attach each strength to a real example.",
      "Do not sound overconfident.",
    ],
  },
  {
    question: "What are your weaknesses?",
    answer:
      "One weakness I am working on is that I sometimes spend extra time perfecting small details. I have started improving this by setting time limits, prioritizing important tasks first, and asking for feedback earlier. This helps me maintain quality without delaying delivery.",
    tips: [
      "Choose a real but manageable weakness.",
      "Show what you are doing to improve.",
      "Do not mention a weakness critical to the job.",
    ],
  },
  {
    question: "Where do you see yourself in 5 years?",
    answer:
      "In five years, I see myself as a skilled professional with strong technical expertise, real project ownership, and the ability to mentor juniors. I want to grow with the organization, contribute to meaningful products, and keep improving both technically and professionally.",
    tips: [
      "Show ambition with stability.",
      "Avoid saying you want to switch fields quickly.",
      "Mention learning, ownership, and contribution.",
    ],
  },
  {
    question: "Why do you want this job?",
    answer:
      "I want this job because it matches my skills, interests, and career goals. The role gives me a chance to apply what I have learned, work on real business problems, and grow with experienced professionals. I believe this opportunity is a strong starting point for my career.",
    tips: [
      "Connect the role to your skills.",
      "Show company and role awareness.",
      "Avoid generic answers about salary only.",
    ],
  },
  {
    question: "Tell me about your project",
    answer:
      "One of my key projects is an AI Placement Assistant where users can build resumes, check ATS scores, analyze resume quality, and prepare for interviews. I worked on the frontend using React and Tailwind, integrated backend APIs, managed user inputs, and focused on making the workflow useful and responsive.",
    tips: [
      "Explain problem, tech stack, your role, and result.",
      "Be ready for follow-up technical questions.",
      "Mention challenges and what you learned.",
    ],
  },
  {
    question: "Are you willing to relocate?",
    answer:
      "Yes, I am open to relocation if the role provides good learning and career growth opportunities. I understand that starting my career may require flexibility, and I am prepared to adapt to a new location and work environment.",
    tips: [
      "Be honest about constraints.",
      "Show flexibility if possible.",
      "Keep the answer professional and simple.",
    ],
  },
];

export const technicalCategories = {
  "Web Development": [
    {
      question: "What is the difference between frontend and backend?",
      answer:
        "Frontend is the user-facing part of an application, built with HTML, CSS, JavaScript, and frameworks like React. Backend handles server logic, databases, authentication, and APIs.",
    },
    {
      question: "What is responsive design?",
      answer:
        "Responsive design ensures a website adapts to different screen sizes using flexible layouts, media queries, and scalable spacing.",
    },
    {
      question: "What is an API?",
      answer:
        "An API is an interface that allows different software systems to communicate, usually through request and response formats like JSON.",
    },
    {
      question: "What is the difference between HTTP and HTTPS?",
      answer:
        "HTTPS is HTTP with encryption through TLS/SSL, making communication between browser and server more secure.",
    },
    {
      question: "What are semantic HTML elements?",
      answer:
        "Semantic elements like header, main, section, article, and footer describe the meaning of content and improve accessibility and SEO.",
    },
  ],
  React: [
    {
      question: "What are React components?",
      answer:
        "Components are reusable UI building blocks. They can accept props, manage state, and return JSX to describe the interface.",
    },
    {
      question: "What is state in React?",
      answer:
        "State is data managed inside a component. When state changes, React re-renders the component to update the UI.",
    },
    {
      question: "What are props?",
      answer:
        "Props are inputs passed from a parent component to a child component. They help make components reusable and configurable.",
    },
    {
      question: "What is useEffect used for?",
      answer:
        "useEffect runs side effects such as fetching data, updating localStorage, or subscribing to events after rendering.",
    },
    {
      question: "Why are keys used in lists?",
      answer:
        "Keys help React identify which list items changed, were added, or removed, making rendering more efficient and predictable.",
    },
  ],
  JavaScript: [
    {
      question: "What is the difference between let, const, and var?",
      answer:
        "let and const are block-scoped, while var is function-scoped. const cannot be reassigned, while let can be reassigned.",
    },
    {
      question: "What is a closure?",
      answer:
        "A closure is formed when a function remembers variables from its outer scope even after that outer function has finished executing.",
    },
    {
      question: "What are promises?",
      answer:
        "Promises represent asynchronous operations and can be pending, fulfilled, or rejected. They are commonly used with async/await.",
    },
    {
      question: "What is event bubbling?",
      answer:
        "Event bubbling means an event starts from the target element and moves upward through its parent elements.",
    },
    {
      question: "What is the difference between == and ===?",
      answer:
        "== compares after type conversion, while === compares both value and type without conversion.",
    },
  ],
  "Node.js": [
    {
      question: "What is Node.js?",
      answer:
        "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows JavaScript to run on the server.",
    },
    {
      question: "What is Express.js?",
      answer:
        "Express.js is a lightweight Node.js framework used to build APIs, routes, middleware, and backend services.",
    },
    {
      question: "What is middleware?",
      answer:
        "Middleware functions run between the request and response cycle and can handle logging, authentication, validation, or errors.",
    },
    {
      question: "How do you handle errors in Node.js?",
      answer:
        "Errors can be handled using try/catch with async functions, promise rejection handling, and Express error middleware.",
    },
    {
      question: "What is npm?",
      answer:
        "npm is the Node package manager used to install dependencies, run scripts, and manage project packages.",
    },
  ],
  DBMS: [
    {
      question: "What is DBMS?",
      answer:
        "A DBMS is software used to store, retrieve, manage, and organize data efficiently and securely.",
    },
    {
      question: "What is normalization?",
      answer:
        "Normalization organizes database tables to reduce redundancy and improve data integrity.",
    },
    {
      question: "What is a primary key?",
      answer:
        "A primary key uniquely identifies each record in a table and cannot be null.",
    },
    {
      question: "What is a foreign key?",
      answer:
        "A foreign key links one table to another by referencing the primary key of another table.",
    },
    {
      question: "What is SQL join?",
      answer:
        "A join combines rows from two or more tables based on a related column, such as inner join, left join, and right join.",
    },
  ],
  OOP: [
    {
      question: "What are the four pillars of OOP?",
      answer:
        "The four pillars are encapsulation, inheritance, polymorphism, and abstraction.",
    },
    {
      question: "What is encapsulation?",
      answer:
        "Encapsulation means wrapping data and methods together and restricting direct access to internal details.",
    },
    {
      question: "What is inheritance?",
      answer:
        "Inheritance allows a class to acquire properties and methods from another class, promoting reuse.",
    },
    {
      question: "What is polymorphism?",
      answer:
        "Polymorphism allows one interface or method to behave differently based on the object or context.",
    },
    {
      question: "What is abstraction?",
      answer:
        "Abstraction hides implementation details and exposes only the necessary features.",
    },
  ],
  "DSA Basics": [
    {
      question: "What is an array?",
      answer:
        "An array is a linear data structure that stores elements in contiguous memory and allows index-based access.",
    },
    {
      question: "What is a linked list?",
      answer:
        "A linked list stores elements as nodes, where each node contains data and a reference to the next node.",
    },
    {
      question: "What is a stack?",
      answer:
        "A stack is a linear data structure that follows LIFO, meaning the last inserted element is removed first.",
    },
    {
      question: "What is a queue?",
      answer:
        "A queue follows FIFO, meaning the first inserted element is removed first.",
    },
    {
      question: "What is time complexity?",
      answer:
        "Time complexity describes how the running time of an algorithm grows with input size.",
    },
  ],
  "ECE/Core Basics": [
    {
      question: "What is a diode?",
      answer:
        "A diode is a semiconductor device that allows current to flow mainly in one direction.",
    },
    {
      question: "What is a transistor?",
      answer:
        "A transistor is a semiconductor device used for switching and amplification.",
    },
    {
      question: "What is modulation?",
      answer:
        "Modulation is the process of varying a carrier signal according to the message signal for transmission.",
    },
    {
      question: "What is an embedded system?",
      answer:
        "An embedded system is a dedicated computer system designed to perform a specific function within a larger system.",
    },
    {
      question: "What is the difference between analog and digital signals?",
      answer:
        "Analog signals are continuous, while digital signals represent data using discrete values such as 0 and 1.",
    },
  ],
};

export const mockRoles = {
  "Frontend Developer": [
    "Explain a React project you built and your role in it.",
    "How would you make a web page responsive?",
    "What is the difference between state and props?",
    "How do you optimize frontend performance?",
    "Describe a bug you fixed in a UI.",
  ],
  "Backend Developer": [
    "Explain an API you created or used.",
    "How do you handle validation in backend systems?",
    "What is middleware and where have you used it?",
    "How would you design authentication for an app?",
    "How do you handle errors in a server application?",
  ],
  "Full Stack Developer": [
    "Explain a full-stack project from frontend to backend.",
    "How does data flow from UI to database?",
    "How do you connect React with an API?",
    "What would you do if an API is slow?",
    "How do you keep frontend and backend code organized?",
  ],
  "Software Engineer Intern": [
    "Tell me about yourself and your technical interests.",
    "Explain your strongest project.",
    "Which data structure do you use most often and why?",
    "How do you learn a new technology?",
    "Describe a time you worked in a team.",
  ],
  "ECE Fresher": [
    "Explain your final year or core electronics project.",
    "What is the difference between microprocessor and microcontroller?",
    "How does a transistor work as a switch?",
    "Why are you interested in this role?",
    "How do your ECE skills connect to software or industry work?",
  ],
};

export const starExample = {
  situation:
    "During a college project, our team needed to build a resume preparation tool before the submission deadline.",
  task:
    "My responsibility was to create the frontend flow for resume input, preview, and ATS analysis.",
  action:
    "I broke the work into reusable React components, connected the backend API, tested form states, and improved the UI for mobile and desktop.",
  result:
    "The project became functional, easier to present, and helped users generate and analyze resumes from one platform.",
};

export const checklistItems = [
  "Resume ready",
  "ATS score above 75",
  "LinkedIn updated",
  "Projects explained",
  "HR answers prepared",
  "Technical basics revised",
  "Mock interview practiced",
  "Company research done",
];
