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
    },
    {
      question: "How does Python handle memory management?",
      correctAnswer: "Python uses a combination of reference counting and a cyclic garbage collector to manage memory. When an object's reference count drops to zero, it is deallocated. The garbage collector handles cyclic references that reference counting alone cannot resolve."
    },
    {
      question: "What are Python's list comprehensions?",
      correctAnswer: "List comprehensions provide a concise way to create lists. They consist of brackets containing an expression followed by a 'for' clause, and can include optional 'if' clauses for filtering."
    },
    {
      question: "What is the difference between 'is' and '==' in Python?",
      correctAnswer: "'is' checks for identity (whether two references point to the same object), while '==' checks for equality (whether the values of two objects are the same)."
    },
    {
      question: "What are Python's generators?",
      correctAnswer: "Generators are a type of iterable that generate values on-the-fly using the 'yield' statement. They are memory-efficient for large datasets as they do not store all values in memory at once."
    },
    {
      question: "How do you handle exceptions in Python?",
      correctAnswer: "Exceptions in Python are handled using 'try', 'except', 'else', and 'finally' blocks. The code that may raise an exception is placed in the 'try' block, and the handling code is placed in the 'except' block."
    },
    {
      question: "What are Python's built-in data types?",
      correctAnswer: "Python's built-in data types include int, float, str, list, tuple, dict, set, and bool. Each type serves different purposes for storing and manipulating data."
    },
    { 
      question: "What is the difference between a module and a package in Python?",
      correctAnswer: "A module is a single Python file containing code, while a package is a collection of modules organized in directories with an __init__.py file."
    },
    {
      question: "How does Python's list slicing work?",
      correctAnswer: "List slicing allows you to access a subset of a list using the syntax list[start:stop:step]. It returns a new list containing elements from the start index up to, but not including, the stop index, with an optional step for skipping elements."
    },
    {
      question: "What are lambda functions in Python?",
      correctAnswer: "Lambda functions are small anonymous functions defined using the 'lambda' keyword. They can take any number of arguments but can only have a single expression."
    },
    {
      question: "What is the difference between 'append()' and 'extend()' methods in Python lists?",
      correctAnswer: "'append()' adds a single element to the end of the list, while 'extend()' adds all elements from an iterable (like another list) to the end of the list."
    },
    {
      question: "How do you manage packages in Python?",
      correctAnswer: "Packages in Python are managed using tools like pip, which allows you to install, update, and remove packages from the Python Package Index (PyPI) or other repositories."
    },
    {
      question: "What is the purpose of the 'self' parameter in Python class methods?",
      correctAnswer: "'self' refers to the instance of the class and is used to access instance variables and methods. It must be the first parameter of instance methods."
    },
    {
      question: "What are Python's built-in functions for file handling?",
      correctAnswer: "Python provides built-in functions like open(), read(), write(), close(), and with statement for file handling. The open() function is used to open a file, and it returns a file object."
    },
    {
      question: "What is the difference between mutable and immutable types in Python?",
      correctAnswer: "Mutable types (like lists and dictionaries) can be changed after creation, while immutable types (like strings and tuples) cannot be modified once created."
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
    },
    {
      question: "What is the purpose of the 'async' and 'await' keywords in JavaScript?",
      correctAnswer: "'async' is used to define an asynchronous function, which returns a Promise. 'await' is used inside an async function to pause execution until a Promise is settled (resolved or rejected)."
    },
    {
      question: "What are JavaScript's data types?",
      correctAnswer: "JavaScript has several data types, including primitive types (string, number, boolean, null, undefined, symbol, bigint) and non-primitive types (object, array, function)."
    },
    {
      question: "What is the difference between '==' and '===' in JavaScript?",
      correctAnswer: "'==' checks for value equality with type coercion, while '===' checks for both value and type equality without coercion."
    },
    {
      question: "What is hoisting in JavaScript?",
      correctAnswer: "Hoisting is a behavior where variable and function declarations are moved to the top of their containing scope during the compilation phase. However, only declarations are hoisted, not initializations."
    },
    {
      question: "What are arrow functions in JavaScript?",
      correctAnswer: "Arrow functions provide a shorter syntax for writing functions and do not have their own 'this' context. They are often used for callbacks and functional programming."
    },
    {
      question: "What is the difference between 'null' and 'undefined' in JavaScript?",
      correctAnswer: "'null' is an intentional absence of any object value, while 'undefined' indicates a variable has been declared but not assigned a value."
    },
    {
      question: "What is the purpose of the 'bind' method in JavaScript?",
      correctAnswer: "The 'bind' method creates a new function that, when called, has its 'this' value set to the provided value, with a given sequence of arguments preceding any provided when the new function is called."
    },
    {
      question: "What is the difference between 'let' and 'const' in JavaScript?",
      correctAnswer: "'let' allows reassignment, while 'const' does not (though object properties can be modified)."
    },
    {
      question: "What is the difference between 'map', 'filter', and 'reduce' methods in JavaScript?",
      correctAnswer: "'map' creates a new array with the results of calling a provided function on every element, 'filter' creates a new array with all elements that pass the test, and 'reduce' applies a function against an accumulator and each element to reduce the array to a single value."
    },
    {
      question: "What is the difference between 'let' and 'var' in JavaScript?",
      correctAnswer: "'var' is function-scoped, while 'let' is block-scoped. 'let' allows reassignment, but 'var' does not (though object properties can be modified)."
    },
    {
      question: "What is the difference between 'let' and 'const' in JavaScript?",
      correctAnswer: "'let' allows reassignment, while 'const' does not (though object properties can be modified)."
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
    },
    {
      question: "What is the difference between 'ArrayList' and 'Vector' in Java?",
      correctAnswer: "'ArrayList' is non-synchronized and not thread-safe, while 'Vector' is synchronized and thread-safe. 'Vector' is generally less efficient than 'ArrayList' due to synchronization overhead."
    },
    {
      question: "What is the difference between 'throws' and 'throw' in Java?",
      correctAnswer: "'throws' is used in method signatures to declare exceptions that a method might throw, while 'throw' is used to actually throw an exception within a method."
    },
    {
      question: "What is the difference between 'String', 'StringBuilder', and 'StringBuffer' in Java?",
      correctAnswer: "'String' is immutable and thread-safe, 'StringBuilder' is mutable and not thread-safe, and 'StringBuffer' is mutable and thread-safe. 'StringBuilder' is faster than 'StringBuffer'."
    },
    {
      question: "What is the difference between 'public', 'private', and 'protected' access modifiers in Java?",
      correctAnswer: "'public' members are accessible from anywhere, 'private' members are accessible only within the class, and 'protected' members are accessible within the class and its derived classes."
    },
    {
      question: "What is the difference between 'extends' and 'implements' in Java?",
      correctAnswer: "'extends' is used for class inheritance, while 'implements' is used for interface implementation."
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
    },
    {
      question: "What is the difference between 'new' and 'malloc' in C++?",
      correctAnswer: "'new' allocates memory and calls the constructor, while 'malloc' only allocates memory without calling the constructor. 'new' returns a typed pointer, while 'malloc' returns a void pointer."
    },
    {
      question: "What is the difference between a class and a struct in C++?",
      correctAnswer: "In C++, the primary difference is that class members are private by default, while struct members are public by default. Otherwise, they are functionally similar."
    },
    {
      question: "What is the purpose of the 'const' keyword in C++?",
      correctAnswer: "'const' is used to declare variables whose values cannot be changed after initialization. It can also be applied to member functions to indicate they do not modify the object."
    },
    {
      question: "What is a template in C++?",
      correctAnswer: "A template is a blueprint for creating generic classes or functions that can operate with any data type. It allows code reusability and type safety."
    },
    {
      question: "What is the difference between stack and heap memory in C++?",
      correctAnswer: "Stack memory is used for static memory allocation and function call management, while heap memory is used for dynamic memory allocation. Stack memory is automatically managed, while heap memory requires manual management."
    },
    {
      question: "What is the difference between 'throw' and 'catch' in C++?",
      correctAnswer: "'throw' is used to signal that an exception has occurred, while 'catch' is used to handle the exception that was thrown."
    },
    {
      question: "What is the difference between shallow copy and deep copy in C++?",
      correctAnswer: "A shallow copy copies an object's immediate values, including pointers, leading to shared references. A deep copy creates a new object and recursively copies all objects pointed to, ensuring independent copies."
    },
    {
      question: "What is the purpose of the 'friend' keyword in C++?",
      correctAnswer: "'friend' allows a function or another class to access private and protected members of a class. It is used to enable close cooperation between classes or functions."
    },
    {
      question: "What is the difference between 'static' and 'dynamic' binding in C++?",
      correctAnswer: "'Static binding occurs at compile-time and is used for non-virtual functions, while dynamic binding occurs at runtime and is used for virtual functions, enabling polymorphism."
    },
    {
      question: "What is the difference between a pointer and a reference in C++?",
      correctAnswer: "A pointer is a variable that holds the memory address of another variable and can be reassigned. A reference is an alias for another variable and cannot be null or reassigned after initialization."
    },
    {
      question: "What is the purpose of the 'virtual' keyword in C++?",
      correctAnswer: "'virtual' is used to declare a member function as virtual, allowing it to be overridden in derived classes and enabling dynamic dispatch for polymorphism."
    },
    {
      question: "What is the difference between 'public inheritance', ' private inheritance', and 'protected inheritance' in C++?",
      correctAnswer: "'Public inheritance' means public and protected members of the base class remain public and protected in the derived class. 'Private inheritance' means all members of the base class become private in the derived class. 'Protected inheritance' means public and protected members of the base class become protected in the derived class."
    },
    {
      question: "What is the difference between 'const' member functions and non-const member functions in C++?",
      correctAnswer: "'const' member functions cannot modify any member variables of the class, while non-const member functions can modify member variables. 'const' functions can be called on const objects."
    }
  ],
  "Ruby": [
    {
      question: "What is the difference between a symbol and a string in Ruby?",
      correctAnswer: "A symbol is an immutable, interned string used primarily as identifiers, while a string is mutable and can be modified. Symbols are more memory-efficient for repeated use."
    },
    {
      question: "What are blocks, procs, and lambdas in Ruby?",
      correctAnswer: "Blocks are chunks of code passed to methods, procs are objects that encapsulate blocks and can be stored in variables, and lambdas are a special type of proc with stricter argument checking and return behavior."
    },
    {
      question: "What is the purpose of the 'self' keyword in Ruby?",
      correctAnswer: "'self' refers to the current object context. It can represent the instance of a class, the class itself, or the module, depending on where it is used."
    },
    {
      question: "What is metaprogramming in Ruby?",
      correctAnswer: "Metaprogramming is the ability to write code that can manipulate other code at runtime. It allows for dynamic method creation, modification of classes, and other advanced techniques."
    },
    {
      question: "What is the difference between 'include' and 'extend' in Ruby?",
      correctAnswer: "'include' mixes in a module's methods as instance methods, while 'extend' mixes in a module's methods as class methods."
    },
    {
      question: "What are Ruby's built-in data types?",
      correctAnswer: "Ruby's built-in data types include Integer, Float, String, Array, Hash, Symbol, NilClass, TrueClass, and FalseClass."
    },
    {
      question: "What is the difference between 'require' and 'load' in Ruby?",
      correctAnswer: "'require' loads a file only once and is used for libraries or gems, while 'load' loads a file every time it is called and is used for reloading code during development."
    },
    {
      question: "What is the difference between 'map' and 'each' methods in Ruby?",
      correctAnswer: "'each' iterates over a collection and returns the original collection, while 'map' transforms each element and returns a new array with the transformed values."
    },
    {
      question: "What is the purpose of the 'yield' keyword in Ruby?",
      correctAnswer: "'yield' is used to call a block passed to a method. It allows methods to execute blocks of code provided by the caller."
    },
    {
      question: "What is the difference between 'attr_accessor', 'attr_reader', and 'attr_writer' in Ruby?",
      correctAnswer: "'attr_accessor' creates both getter and setter methods, 'attr_reader' creates only a getter method, and 'attr_writer' creates only a setter method for instance variables."
    }
  ],
  "C": [
    {
      question: "What is the difference between 'malloc' and 'calloc' in C?",
      correctAnswer: "'malloc' allocates a specified number of bytes and leaves the memory uninitialized, while 'calloc' allocates memory for an array of elements, initializes all bytes to zero, and takes two arguments: number of elements and size of each element."
    },
    {
      question: "What is a pointer in C?",
      correctAnswer: "A pointer is a variable that stores the memory address of another variable. It allows for direct memory access and manipulation."
    },
    {
      question: "What is the difference between 'struct' and 'union' in C?",
      correctAnswer: "A 'struct' allocates separate memory for each member, while a 'union' shares the same memory space for all its members, meaning only one member can hold a value at any given time."
    },
    {
      question: "What is the purpose of the 'const' keyword in C?",
      correctAnswer: "'const' is used to declare variables whose values cannot be changed after initialization. It can also be applied to pointers to indicate that the data being pointed to should not be modified."
    },
    {
      question: "What is the difference between '++i' and 'i++' in C?",
      correctAnswer: "'++i' is the pre-increment operator that increments the value of 'i' before it is used in an expression, while 'i++' is the post-increment operator that increments the value of 'i' after it is used in an expression."
    },
    {
      question: "What is a segmentation fault in C?",
      correctAnswer: "A segmentation fault occurs when a program tries to access a memory location that it is not allowed to access, often due to dereferencing a null or invalid pointer."
    },
    {
      question: "What is the difference between 'break' and 'continue' statements in C?",
      correctAnswer: "'break' exits the nearest enclosing loop or switch statement, while 'continue' skips the current iteration of the nearest enclosing loop and proceeds to the next iteration."
    },
    {
      question: "What is the purpose of the 'static' keyword in C?",
      correctAnswer: "'static' can be used to declare variables with a local scope that retain their value between function calls, or to restrict the visibility of functions and variables to the file they are declared in."
    },
    {
      question: "What is the difference between 'typedef' and '#define' in C?",
      correctAnswer: "'typedef' creates a new type name for an existing type, while '#define' creates a macro that replaces text in the code before compilation. 'typedef' is type-safe, while '#define' is not."
    },
    {
      question: "What is the difference between 'fopen' and 'fclose' in C?",
      correctAnswer: "'fopen' is used to open a file and returns a file pointer, while 'fclose' is used to close an opened file and release associated resources."
    }
  ],
  "React": [
    {
      question: "What is the difference between a class component and a functional component in React?",
      correctAnswer: "Class components can have state and lifecycle methods, while functional components are stateless and do not have lifecycle methods. However, with the introduction of hooks, functional components can now manage state and side effects."
    },
    {
      question: "What are React hooks?",
      correctAnswer: "React hooks are functions that allow you to use state and other React features in functional components. Common hooks include useState, useEffect, useContext, and useRef."
    },
    {
      question: "What is the virtual DOM in React?",
      correctAnswer: "The virtual DOM is a lightweight representation of the actual DOM. React uses it to optimize updates by comparing the virtual DOM with the real DOM and applying only the necessary changes."
    },
    {
      question: "What is the purpose of 'keys' in React lists?",
      correctAnswer: "'Keys' are unique identifiers assigned to elements in a list to help React identify which items have changed, been added, or removed. They improve performance and help maintain component state."
    },
    {
      question: "What is the difference between controlled and uncontrolled components in React?",
      correctAnswer: "Controlled components have their state managed by React, typically through props and state, while uncontrolled components manage their own state internally, often using refs to access DOM elements."
    },
    {
      question: "What is the purpose of the 'useEffect' hook in React?",
      correctAnswer: "'useEffect' is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after the component renders and can be configured to run only when certain dependencies change."
    },
    {
      question: "What is the context API in React?",
      correctAnswer: "The context API allows for sharing state and data across the component tree without passing props down manually at every level. It is useful for global state management."
    },
    {
      question: "What is the difference between 'props' and 'state' in React?",
      correctAnswer: "'Props' are read-only and passed from parent to child components, while 'state' is mutable and managed within a component. State changes can trigger re-renders, while props are immutable."
    },
    {
      question: "What is JSX in React?",
      correctAnswer: "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It is used to describe the UI structure in React components."
    },
    {
      question: "What is the purpose of 'useRef' hook in React?",
      correctAnswer: "'useRef' is used to create a mutable reference that persists across renders. It can be used to access DOM elements directly or to store mutable values that do not trigger re-renders."
    },
    {
      question: "What is the difference between 'useState' and 'useReducer' hooks in React?",
      correctAnswer: "'useState' is used for managing simple state in functional components, while 'useReducer' is used for managing more complex state logic, similar to Redux, by using a reducer function to handle state transitions."
    },
    {
      question: "What is the purpose of 'React.memo'?",
      correctAnswer: "'React.memo' is a higher-order component that memoizes a functional component, preventing unnecessary re-renders when the props have not changed. It improves performance for components that render the same output given the same props."
    },
    {
      question: "What is the difference between 'useEffect' and 'useLayoutEffect' in React?",
      correctAnswer: "'useEffect' runs after the render is committed to the screen, while 'useLayoutEffect' runs synchronously after all DOM mutations but before the browser has painted. 'useLayoutEffect' is useful for reading layout from the DOM and synchronously re-rendering."
    },
    {
      question: "What is the purpose of 'React.forwardRef'?",
      correctAnswer: "'React.forwardRef' is a function that allows you to pass a ref through a component to one of its children. It is useful for accessing DOM elements or child component instances from parent components."
    }
  ],
  "Node.js": [
    {
      question: "What is the difference between 'require' and 'import' in Node.js?",
      correctAnswer: "'require' is used in CommonJS modules and is synchronous, while 'import' is used in ES6 modules and can be asynchronous. 'import' also supports static analysis and tree shaking."
    },
    {
      question: "What is the event-driven architecture in Node.js?",
      correctAnswer: "Node.js uses an event-driven architecture where the server responds to events (like incoming requests) using callbacks. This allows for non-blocking I/O operations and efficient handling of concurrent connections."
    },
    {
      question: "What is the purpose of the 'package.json' file in a Node.js project?",
      correctAnswer: "'package.json' is a metadata file that contains information about the project, including dependencies, scripts, version, and other configurations. It is essential for managing the project's packages and scripts."
    },
    {
      question: "What is middleware in Express.js?",
      correctAnswer: "Middleware is a function that has access to the request and response objects in an Express.js application. It can modify the request or response, end the request-response cycle, or call the next middleware in the stack."
    },
    {
      question: "What is the difference between synchronous and asynchronous programming in Node.js?",
      correctAnswer: "Synchronous programming blocks the execution of code until a task is completed, while asynchronous programming allows other tasks to run while waiting for a task to complete, using callbacks, promises, or async/await."
    },
    {
      question: "What is the purpose of the 'fs' module in Node.js?",
      correctAnswer: "The 'fs' (file system) module provides an API for interacting with the file system, allowing you to read, write, delete, and manipulate files and directories."
    },
    {
      question: "What is the difference between 'process.nextTick()' and 'setImmediate()' in Node.js?",
      correctAnswer: "'process.nextTick()' schedules a callback to be invoked in the next iteration of the event loop, before any I/O operations. 'setImmediate()' schedules a callback to be executed after the current poll phase of the event loop, allowing I/O operations to complete first."
    },
    {
      question: "What is the purpose of the 'cluster' module in Node.js?",
      correctAnswer: "The 'cluster' module allows you to create child processes (workers) that share the same server port, enabling you to take advantage of multi-core systems and improve application performance and reliability."
    },
    {
      question: "What is the difference between 'callback hell' and 'promises' in Node.js?",
      correctAnswer: "'Callback hell' refers to deeply nested callbacks that make code hard to read and maintain. Promises provide a cleaner way to handle asynchronous operations by allowing chaining and better error handling."
    },
    {
      question: "What is the purpose of the 'npm' in Node.js?",
      correctAnswer: "'npm' (Node Package Manager) is a package manager for JavaScript that allows you to install, share, and manage dependencies for your Node.js projects."
    },
    {
      question: "What is the difference between 'require' and 'import' in Node.js?",
      correctAnswer: "'require' is used in CommonJS modules and is synchronous, while 'import' is used in ES6 modules and can be asynchronous. 'import' also supports static analysis and tree shaking."
    },
    {
      question: "What is the purpose of the 'event emitter' in Node.js?",
      correctAnswer: "The 'EventEmitter' class in Node.js allows you to create and handle custom events. It provides methods to emit events and register listeners for those events, enabling an event-driven programming model."
    },
    {
      question: "What is the difference between 'process.nextTick()' and 'setImmediate()' in Node.js?",
      correctAnswer: "'process.nextTick()' schedules a callback to be invoked in the next iteration of the event loop, before any I/O operations. 'setImmediate()' schedules a callback to be executed after the current poll phase of the event loop, allowing I/O operations to complete first."
    },
    {
      question: "What is the purpose of the 'buffer' module in Node.js?",
      correctAnswer: "The 'buffer' module provides a way to handle binary data directly in memory. It is used for reading and manipulating raw binary data, such as files or network protocols."
    },
    {
      question: "What is the difference between 'fs.readFile' and 'fs.createReadStream' in Node.js?",
      correctAnswer: "'fs.readFile' reads the entire contents of a file into memory, while 'fs.createReadStream' creates a readable stream that allows you to read the file in chunks, which is more memory-efficient for large files."
    }
  ],
  "Angular": [
    {
      question: "What is the difference between AngularJS and Angular?",
      correctAnswer: "AngularJS (version 1.x) is based on JavaScript and uses a scope-based architecture, while Angular (version 2 and above) is based on TypeScript and uses a component-based architecture with improved performance and features."
    },
    {
      question: "What are Angular components?",
      correctAnswer: "Angular components are the building blocks of an Angular application. They consist of a TypeScript class, an HTML template, and optional CSS styles. Components control a portion of the UI and manage its behavior."
    },
    {
      question: "What is data binding in Angular?",
      correctAnswer: "Data binding in Angular is the synchronization of data between the model (component class) and the view (template). It can be one-way (interpolation, property binding) or two-way (using ngModel)."
    },
    {
      question: "What is dependency injection in Angular?",
      correctAnswer: "Dependency injection is a design pattern used in Angular to provide components with their dependencies (services, other components) rather than having them create their own. This promotes modularity and testability."
    },
    {
      question: "What are Angular directives?",
      correctAnswer: "Angular directives are special markers in the DOM that tell Angular to attach specific behavior to elements or transform the DOM. There are three types: component directives, structural directives (like *ngIf, *ngFor), and attribute directives (like ngClass, ngStyle)."
    },
    {
      question: "What is the purpose of Angular services?",
      correctAnswer: "Angular services are singleton objects that provide functionality or data to multiple components. They are used for tasks like data fetching, business logic, and state management, and are typically injected into components via dependency injection."
    },
    {
      question: "What is the Angular CLI?",
      correctAnswer: "The Angular CLI (Command Line Interface) is a tool that helps developers create, manage, and build Angular applications. It provides commands for generating components, services, modules, and more, as well as for running tests and building the application."
    },
    {
      question: "What is the difference between 'ngOnInit' and 'constructor' in Angular?",
      correctAnswer: "'constructor' is a TypeScript feature used for initializing class members, while 'ngOnInit' is an Angular lifecycle hook that is called after the component's data-bound properties have been initialized. It is a good place to put initialization logic that requires access to input properties."
    },
    {
      question: "What is the purpose of Angular modules?",
      correctAnswer: "Angular modules (NgModules) are used to organize an application into cohesive blocks of functionality. They group related components, directives, pipes, and services, and can import/export other modules to share functionality."
    },
    {
      question: "What is the difference between 'Observable' and 'Promise' in Angular?",
      correctAnswer: "A 'Promise' represents a single future value and is eager, while an 'Observable' can emit multiple values over time and is lazy. Observables provide more powerful operators for handling asynchronous data streams and can be canceled."
    }
  ],
  "Go": [
    {
      question: "What are goroutines in Go?",
      correctAnswer: "Goroutines are lightweight threads managed by the Go runtime. They allow concurrent execution of functions and are more efficient than traditional threads due to their low memory overhead and fast context switching."
    },
    {
      question: "What is a channel in Go?",
      correctAnswer: "A channel is a typed conduit that allows goroutines to communicate with each other and synchronize their execution. Channels can be used to send and receive values between goroutines safely."
    },
    {
      question: "What is the difference between 'var', ':=', and 'const' in Go?",
      correctAnswer: "'var' is used to declare variables with a specified type, ':=' is a shorthand for declaring and initializing variables with inferred types, and 'const' is used to declare constant values that cannot be changed after initialization."
    },
    {
      question: "What is the purpose of the 'defer' statement in Go?",
      correctAnswer: "'defer' is used to schedule a function call to be executed after the surrounding function completes. It is commonly used for resource cleanup, such as closing files or releasing locks."
    },
    {
      question: "What is the difference between a slice and an array in Go?",
      correctAnswer: "An array has a fixed size and its size is part of its type, while a slice is a dynamically-sized, flexible view into an array. Slices are more commonly used in Go due to their flexibility."
    },
    {
      question: "What is the purpose of the 'select' statement in Go?",
      correctAnswer: "'select' is used to wait on multiple channel operations. It blocks until one of its cases can proceed, allowing for concurrent handling of multiple channels."
    },
    {
      question: "What is the difference between 'make' and 'new' in Go?",
      correctAnswer: "'make' is used to create and initialize slices, maps, and channels, while 'new' is used to allocate memory for a variable of a specific type and returns a pointer to it."
    },
    {
      question: "What is the purpose of interfaces in Go?",
      correctAnswer: "Interfaces in Go define a set of method signatures that a type must implement. They allow for polymorphism and enable writing flexible and reusable code by decoupling the implementation from the interface."
    },
    {
      question: "What is the difference between a pointer and a value in Go?",
      correctAnswer: "A pointer holds the memory address of a value, allowing for indirect access and modification of the value. A value is a direct representation of data. Passing a pointer to a function allows the function to modify the original value, while passing a value creates a copy."
    },
    {
      question: "What is the purpose of the 'go' keyword in Go?",
      correctAnswer: "'go' is used to start a new goroutine, allowing a function to run concurrently with other goroutines. It enables concurrent programming and efficient use of system resources."
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