// Game state
let currentQuestionIndex = 0;
let currentPrizeIndex = 14; // Starting from €100
let questions = [
    {
        question: "Welche Farbe hat der Himmel an einem klaren Tag?",
        answers: ["Blau", "Grün", "Rot", "Gelb"],
        correctAnswer: 0 // Index of correct answer (A)
    }
];

// DOM Elements
const questionContainer = document.getElementById('questionContainer');
const questionText = document.getElementById('questionText');
const moneyLadder = document.getElementById('moneyLadder');
const answerButtons = document.querySelectorAll('.answer-btn');

// Prize amounts
const prizeAmounts = [
    "€100", "€200", "€300", "€500", "€1.000",
    "€2.000", "€4.000", "€8.000", "€16.000", "€32.000",
    "€64.000", "€125.000", "€250.000", "€500.000", "€1.000.000"
].reverse();

// Initialize game
function initGame() {
    loadQuestionsFromStorage();
    updateMoneyLadder();
    displayQuestion();
    setupEventListeners();
}

// Load questions from localStorage if available
function loadQuestionsFromStorage() {
    const savedQuestions = localStorage.getItem('wwmQuestions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Answer buttons
    answerButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleAnswer(index));
    });
}

// Display current question
function displayQuestion() {
    if (questions.length === 0) {
        questionText.textContent = "Keine Fragen verfügbar. Bitte fügen Sie Fragen über die Fragenverwaltung hinzu.";
        answerButtons.forEach(btn => btn.style.display = 'none');
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    answerButtons.forEach((btn, index) => {
        btn.style.display = 'block';
        btn.textContent = String.fromCharCode(65 + index) + ": " + currentQuestion.answers[index];
        btn.className = 'answer-btn bg-[#000824] hover:bg-blue-700 p-4 rounded-lg text-left transition-colors duration-300';
    });
}

// Handle answer selection
function handleAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctIndex = currentQuestion.correctAnswer;

    // Disable all buttons temporarily
    answerButtons.forEach(btn => btn.style.pointerEvents = 'none');

    // Show selected answer
    answerButtons[selectedIndex].classList.add('selected');

    // Delay to show selection before revealing correct answer
    setTimeout(() => {
        if (selectedIndex === correctIndex) {
            handleCorrectAnswer(selectedIndex);
        } else {
            handleWrongAnswer(selectedIndex, correctIndex);
        }
    }, 2000);
}

// Handle correct answer
function handleCorrectAnswer(index) {
    answerButtons[index].classList.remove('selected');
    answerButtons[index].classList.add('correct');

    setTimeout(() => {
        answerButtons[index].classList.remove('correct');
        currentPrizeIndex--;
        updateMoneyLadder();

        if (currentPrizeIndex < 0) {
            alert("Herzlichen Glückwunsch! Sie haben €1.000.000 gewonnen!");
            resetGame();
        } else {
            currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
            displayQuestion();
            answerButtons.forEach(btn => btn.style.pointerEvents = 'auto');
        }
    }, 1500);
}

// Handle wrong answer
function handleWrongAnswer(selectedIndex, correctIndex) {
    answerButtons[selectedIndex].classList.remove('selected');
    answerButtons[selectedIndex].classList.add('wrong');
    answerButtons[correctIndex].classList.add('correct');

    setTimeout(() => {
        alert("Das war leider falsch! Spiel beendet.");
        resetGame();
    }, 1500);
}

// Update money ladder display
function updateMoneyLadder() {
    const items = moneyLadder.getElementsByTagName('li');
    Array.from(items).forEach((item, index) => {
        item.className = index === currentPrizeIndex ? 'p-2 text-yellow-400 font-bold border border-yellow-400 rounded' : 'p-2';
    });
}

// Reset game state
function resetGame() {
    currentQuestionIndex = 0;
    currentPrizeIndex = 14;
    updateMoneyLadder();
    displayQuestion();
    answerButtons.forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.className = 'answer-btn bg-[#000824] hover:bg-blue-700 p-4 rounded-lg text-left transition-colors duration-300';
    });
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);