// Load questions from localStorage
let questions = [];

function loadQuestions() {
    const savedQuestions = localStorage.getItem('wwmQuestions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
        displayQuestions();
    }
}

// Display all questions in the list
function displayQuestions() {
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'bg-[#000824] p-4 rounded-lg border border-blue-400';
        
        // Question content
        const content = `
            <div class="flex justify-between items-start">
                <div class="flex-grow">
                    <h3 class="font-bold mb-2">Frage ${index + 1}:</h3>
                    <p class="mb-2">${question.question}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        ${question.answers.map((answer, ansIndex) => `
                            <div class="flex items-center ${ansIndex === question.correctAnswer ? 'text-green-400' : ''}">
                                <span class="mr-2">${String.fromCharCode(65 + ansIndex)}:</span>
                                <span>${answer}</span>
                                ${ansIndex === question.correctAnswer ? '<span class="ml-2">(✓)</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editQuestion(${index})" class="text-blue-400 hover:text-blue-300">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteQuestion(${index})" class="text-red-400 hover:text-red-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        questionDiv.innerHTML = content;
        questionList.appendChild(questionDiv);
    });
}

// Handle form submission for new questions
document.getElementById('questionForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const questionInput = document.getElementById('questionInput');
    const answerInputs = document.querySelectorAll('input[type="text"]');
    const correctAnswerRadio = document.querySelector('input[name="correctAnswer"]:checked');

    if (!correctAnswerRadio) {
        alert('Bitte wählen Sie die richtige Antwort aus.');
        return;
    }

    const newQuestion = {
        question: questionInput.value,
        answers: Array.from(answerInputs).map(input => input.value),
        correctAnswer: ['A', 'B', 'C', 'D'].indexOf(correctAnswerRadio.value)
    };

    questions.push(newQuestion);
    saveQuestions();
    displayQuestions();
    e.target.reset();
});

// Delete a question
function deleteQuestion(index) {
    if (confirm('Möchten Sie diese Frage wirklich löschen?')) {
        questions.splice(index, 1);
        saveQuestions();
        displayQuestions();
    }
}

// Edit a question
function editQuestion(index) {
    const question = questions[index];
    
    // Fill the form with the question data
    document.getElementById('questionInput').value = question.question;
    
    const answerInputs = document.querySelectorAll('input[type="text"]');
    question.answers.forEach((answer, i) => {
        answerInputs[i].value = answer;
    });
    
    // Select the correct answer radio button
    const radioButtons = document.querySelectorAll('input[name="correctAnswer"]');
    radioButtons[question.correctAnswer].checked = true;
    
    // Remove the old question
    questions.splice(index, 1);
    saveQuestions();
    displayQuestions();
    
    // Scroll to the form
    document.getElementById('questionForm').scrollIntoView({ behavior: 'smooth' });
}

// Save questions to localStorage
function saveQuestions() {
    localStorage.setItem('wwmQuestions', JSON.stringify(questions));
}

// Initialize the admin page
document.addEventListener('DOMContentLoaded', loadQuestions);