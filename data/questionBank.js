export const questionBank = {
  "Python": [
    {
      question: "What is the difference between a list and a tuple in Python?",
      correctAnswer: "Lists are mutable (can be modified), while tuples are immutable (cannot be changed after creation). Lists use square brackets [], and tuples use parentheses ()."
    },
    {
      question: "Explain how Python's GIL affects multithreading.",
      correctAnswer: "The Global Interpreter Lock (GIL) allows only one thread to execute Python bytecode at a time, limiting true parallel execution in CPU-bound tasks. It helps with memory management but can be a bottleneck."
    },
    {
      question: "What is a decorator in Python?",
      correctAnswer: "A decorator is a function that modifies the behavior of another function or method. It is applied using the '@decorator_name' syntax before the function definition."
    },
    {
      question: "What is the purpose of the 'with' statement in Python?",
      correctAnswer: "The 'with' statement simplifies exception handling by encapsulating common preparation and cleanup tasks. It is often used with file operations to ensure files are properly closed after use."
    },
    {
      question: "What is the difference between 'deep copy' and 'shallow copy' in Python?",
      correctAnswer: "A shallow copy creates a new object but inserts references into it to the objects found in the original. A deep copy creates a new object and recursively copies all objects found in the original, creating independent copies."
    }
  ],
  "JavaScript": [
    {
      question: "What is the difference between 'let', 'const', and 'var' in JavaScript?",
      correctAnswer: "'var' is function-scoped, while 'let' and 'const' are block-scoped. 'let' allows reassignment, but 'const' does not (though object properties can be modified)."
    },
    {
      question: "What is event delegation in JavaScript?",
      correctAnswer: "Event delegation is a technique where a single event listener is attached to a parent element instead of multiple listeners on child elements. Events bubble up, allowing efficient handling."
    },
    {
      question: "Explain the concept of promises in JavaScript.",
      correctAnswer: "Promises are objects representing the eventual completion (or failure) of an asynchronous operation. They allow chaining with 'then' and 'catch' methods to handle results or errors."
    },
    {
      question: "What is a closure in JavaScript?",
      correctAnswer: "A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope. It allows for data encapsulation and private variables."
    },
    {
      question: "What is the event loop in JavaScript?",
      correctAnswer: "The event loop is a mechanism that handles asynchronous operations in JavaScript. It continuously checks the call stack and task queue, moving tasks from the queue to the stack when empty."
    }
  ],
  "Java": [
    {
      question: "What is the difference between an interface and an abstract class in Java?",
      correctAnswer: "An abstract class can have method implementations and fields, while an interface (before Java 8) only has abstract methods. From Java 8, interfaces can have default and static methods."
    },
    {
      question: "Explain the concept of garbage collection in Java.",
      correctAnswer: "Garbage collection is the process of automatically reclaiming memory by removing objects that are no longer reachable or needed, helping to prevent memory leaks and optimize resource usage."
    },
    {
      question: "What is the purpose of the 'final' keyword in Java?",
      correctAnswer: "'final' can be applied to variables, methods, and classes. For variables, it means the value cannot be changed; for methods, it means they cannot be overridden; for classes, it means they cannot be subclassed."
    },
    {
      question: "What is the difference between '==' and 'equals()' in Java?",
      correctAnswer: "'==' checks for reference equality (whether two references point to the same object), while 'equals()' checks for value equality (whether two objects are logically equivalent)."
    },
    {
      question: "What is polymorphism in Java?",
      correctAnswer: "Polymorphism allows objects of different types to be treated as objects of a common base type. It includes method overriding (runtime polymorphism) and method overloading (compile-time polymorphism)."
    }
  ],
  "C++": [
    {
      question: "What is the difference between 'public', 'private', and 'protected' access specifiers in C++?",
      correctAnswer: "'public' members are accessible from anywhere, 'private' members are accessible only within the class, and 'protected' members are accessible within the class and its derived classes."
    },
    {
      question: "Explain the concept of RAII in C++.",
      correctAnswer: "RAII (Resource Acquisition Is Initialization) is a programming idiom where resource allocation is tied to object lifetime. Resources are acquired during object creation and released during destruction, ensuring proper cleanup."
    },
    {
      question: "What is a virtual function in C++?",
      correctAnswer: "A virtual function is a member function that can be overridden in derived classes. It allows for dynamic dispatch, enabling polymorphism where the method called depends on the actual object type at runtime."
    },
    {
      question: "What are smart pointers in C++?",
      correctAnswer: "Smart pointers automatically manage memory by wrapping raw pointers. unique_ptr provides exclusive ownership, shared_ptr allows shared ownership with reference counting, and weak_ptr prevents circular references."
    },
    {
      question: "What is operator overloading in C++?",
      correctAnswer: "Operator overloading allows defining custom behavior for operators when used with user-defined types. It enables natural syntax for operations on objects, making code more intuitive and readable."
    }
  ]
};

export const getQuestionsByLanguage = (language, count = 5) => {
  const questions = questionBank[language] || [];
  return questions.slice(0, count).map((q, index) => ({
    id: index + 1,
    ...q
  }));
};

export const getRandomQuestions = (language, count = 5) => {
  const questions = questionBank[language] || [];
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q, index) => ({
    id: index + 1,
    ...q
  }));
};