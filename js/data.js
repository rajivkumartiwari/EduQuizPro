const quizData = {
    mcq: [
        { q: "HTML stands for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "High Text Markup Language"], answer: "Hyper Text Markup Language" },
        { q: "CSS is used for?", options: ["Styling Web Pages", "Structuring Web Pages", "Database Connection", "Programming Logic"], answer: "Styling Web Pages" },
        { q: "JS stands for?", options: ["JavaScript", "JavaSource", "JavaStyle", "JustScript"], answer: "JavaScript" },
        { q: "Which tag is used for line break in HTML?", options: ["<br>", "<lb>", "<break>", "<hr>"], answer: "<br>" },
        { q: "Which property is used for text color in CSS?", options: ["color", "font-color", "text-style", "text-color"], answer: "color" },
        { q: "Which HTML tag is used for table row?", options: ["<tr>", "<td>", "<table>", "<th>"], answer: "<tr>" },
        { q: "Which operator is used for strict equality in JS?", options: ["===", "==", "=", "!=="], answer: "===" },
        { q: "What does API stand for?", options: ["Application Programming Interface", "Applied Program Input", "Application Process Interface", "Applied Programming Interaction"], answer: "Application Programming Interface" },
        { q: "Which tag is used for unordered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], answer: "<ul>" },
        { q: "Which JS method converts JSON to object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.toObject()"], answer: "JSON.parse()" }
    ],
    trueFalse: [
        { q: "Python  high-level programming language ", a: true },
        { q: "Python  Guido van Rossum   ", a: true },
        { q: "Python  Windows OS   ", a: false },
        { q: "Python case-sensitive language ", a: true },
        { q: "Python  statements  end    semicolon (;)   ", a: false },
        { q: "Python interpreter-based language ", a: true },
        { q: "Python  variable declaration   ", a: false },
        { q: "Python  indentation     ", a: false },
        { q: "Python  “#” symbol comment     ", a: true },
        { q: "Python  tuple mutable  ", a: false }
    ],
    matching: [
        { id: 1, question: "Keyboard", answer: "Input Device" },
        { id: 2, question: "Monitor", answer: "Output Device" },
        { id: 3, question: "Mouse", answer: "Input Device" },
        { id: 4, question: "Printer", answer: "Output Device" },
        { id: 5, question: "Hard Disk", answer: "Secondary Storage" },
        { id: 6, question: "Scanner", answer: "Input Device" },
        { id: 7, question: "Speaker", answer: "Output Device" },
        { id: 8, question: "Pen Drive", answer: "Secondary Storage" }
    ],
    flashcards: [
        { img: './assets/images/Keyboard.jfif', answer: 'Keyboard', category: 'Input Device' },
        { img: './assets/images/Mouse.jfif', answer: 'Mouse', category: 'Input Device' },
        { img: './assets/images/Webcam.jfif', answer: 'Webcam', category: 'Input Device' },
        { img: './assets/images/Scanner.jfif', answer: 'Scanner', category: 'Input Device' },
        { img: './assets/images/Printer.jfif', answer: 'Printer', category: 'Output Device' },
        { img: './assets/images/Monitor.jfif', answer: 'Monitor', category: 'Output Device' },
        { img: './assets/images/Speaker.jfif', answer: 'Speaker', category: 'Output Device' },
        { img: './assets/images/Projector.jfif', answer: 'Projector', category: 'Output Device' },
        { img: './assets/images/Harddisk.jfif', answer: 'Hard Disk', category: 'Secondary Storage' },
        { img: './assets/images/CD.jfif', answer: 'CD', category: 'Secondary Storage' },
        { img: './assets/images/SSD.jfif', answer: 'SSD', category: 'Secondary Storage' },
        { img: './assets/images/USBDrive.jfif', answer: 'USB Drive', category: 'Secondary Storage' }
    ]
};

window.quizData = quizData;
