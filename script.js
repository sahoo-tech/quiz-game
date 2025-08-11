class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.difficulty = 'medium';
        this.questions = [];
        this.startTime = null;
        this.endTime = null;
        this.currentScreen = 'welcome';
        
        this.initializeElements();
        this.bindEvents();
        this.loadBestScore();
        this.generateQuestions();
        this.initializeHistory();
    }

    initializeElements() {
        // Screens
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Welcome screen elements
        this.startBtn = document.getElementById('startQuizBtn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        
        // Quiz screen elements
        this.progressFill = document.getElementById('progressFill');
        this.questionCounter = document.getElementById('questionCounter');
        this.timerElement = document.getElementById('timer');
        this.difficultyBadge = document.getElementById('difficultyBadge');
        this.questionPoints = document.getElementById('questionPoints');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Results screen elements
        this.resultsIcon = document.getElementById('resultsIcon');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.resultsMessage = document.getElementById('resultsMessage');
        this.finalScore = document.getElementById('finalScore');
        this.correctAnswersEl = document.getElementById('correctAnswers');
        this.wrongAnswersEl = document.getElementById('wrongAnswers');
        this.accuracyEl = document.getElementById('accuracy');
        this.totalTimeEl = document.getElementById('totalTime');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        // Score elements
        this.currentScoreEl = document.getElementById('currentScore');
        this.bestScoreEl = document.getElementById('bestScore');
        
        // Toast
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e));
        });
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        this.shareBtn.addEventListener('click', () => this.shareScore());
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => this.handlePopState(e));
        
        // Warn user before leaving during quiz
        window.addEventListener('beforeunload', (e) => {
            if (this.currentScreen === 'quiz' && this.timer) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
                return e.returnValue;
            }
        });
    }

    selectDifficulty(e) {
        this.difficultyBtns.forEach(btn => btn.classList.remove('active'));
        e.target.closest('.difficulty-btn').classList.add('active');
        this.difficulty = e.target.closest('.difficulty-btn').dataset.difficulty;
        this.generateQuestions();
    }

    generateQuestions() {
        const questionSets = {
            easy: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    correct: 2,
                    points: 5
                },
                {
                    question: "What is 2 + 2?",
                    options: ["3", "4", "5", "6"],
                    correct: 1,
                    points: 5
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correct: 1,
                    points: 5
                },
                {
                    question: "What is the largest mammal in the world?",
                    options: ["Elephant", "Blue Whale", "Giraffe", "Hippo"],
                    correct: 1,
                    points: 5
                },
                {
                    question: "How many days are there in a week?",
                    options: ["5", "6", "7", "8"],
                    correct: 2,
                    points: 5
                },
                {
                    question: "What color do you get when you mix red and yellow?",
                    options: ["Green", "Orange", "Purple", "Pink"],
                    correct: 1,
                    points: 5
                },
                {
                    question: "Which animal is known as the King of the Jungle?",
                    options: ["Tiger", "Lion", "Elephant", "Bear"],
                    correct: 1,
                    points: 5
                },
                {
                    question: "What is the opposite of 'hot'?",
                    options: ["Warm", "Cool", "Cold", "Freezing"],
                    correct: 2,
                    points: 5
                },
                {
                    question: "How many continents are there?",
                    options: ["5", "6", "7", "8"],
                    correct: 2,
                    points: 5
                },
                {
                    question: "What do bees make?",
                    options: ["Milk", "Honey", "Butter", "Cheese"],
                    correct: 1,
                    points: 5
                }
            ],
            medium: [
                {
                    question: "What is the chemical symbol for gold?",
                    options: ["Go", "Gd", "Au", "Ag"],
                    correct: 2,
                    points: 10
                },
                {
                    question: "In which year did World War II end?",
                    options: ["1944", "1945", "1946", "1947"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "What is the square root of 144?",
                    options: ["10", "12", "14", "16"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "Which organ in the human body produces insulin?",
                    options: ["Liver", "Pancreas", "Kidney", "Heart"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "What is the hardest natural substance on Earth?",
                    options: ["Gold", "Iron", "Diamond", "Platinum"],
                    correct: 2,
                    points: 10
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Picasso", "Van Gogh", "Leonardo da Vinci", "Michelangelo"],
                    correct: 2,
                    points: 10
                },
                {
                    question: "What is the largest ocean on Earth?",
                    options: ["Atlantic", "Pacific", "Indian", "Arctic"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "How many bones are there in an adult human body?",
                    options: ["198", "206", "215", "224"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "What is the capital of Australia?",
                    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                    correct: 2,
                    points: 10
                },
                {
                    question: "Which gas makes up about 78% of Earth's atmosphere?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "In Greek mythology, who is the king of the gods?",
                    options: ["Apollo", "Zeus", "Poseidon", "Hades"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "What is the smallest prime number?",
                    options: ["0", "1", "2", "3"],
                    correct: 2,
                    points: 10
                },
                {
                    question: "Which planet is closest to the Sun?",
                    options: ["Venus", "Mercury", "Earth", "Mars"],
                    correct: 1,
                    points: 10
                },
                {
                    question: "What is the currency of Japan?",
                    options: ["Yuan", "Won", "Yen", "Rupee"],
                    correct: 2,
                    points: 10
                },
                {
                    question: "Who wrote 'Romeo and Juliet'?",
                    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                    correct: 1,
                    points: 10
                }
            ],
            hard: [
                {
                    question: "What is the Planck constant approximately equal to?",
                    options: ["6.626 × 10^-34 J⋅s", "3.14 × 10^-34 J⋅s", "9.81 × 10^-34 J⋅s", "2.718 × 10^-34 J⋅s"],
                    correct: 0,
                    points: 15
                },
                {
                    question: "Which programming language was developed by Bjarne Stroustrup?",
                    options: ["Python", "Java", "C++", "JavaScript"],
                    correct: 2,
                    points: 15
                },
                {
                    question: "What is the time complexity of quicksort in the average case?",
                    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "In quantum mechanics, what does the Schrödinger equation describe?",
                    options: ["Wave function evolution", "Particle position", "Energy levels", "Spin states"],
                    correct: 0,
                    points: 15
                },
                {
                    question: "What is the derivative of ln(x)?",
                    options: ["x", "1/x", "e^x", "x²"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "Which Nobel Prize winner discovered the structure of DNA?",
                    options: ["Watson & Crick", "Mendel", "Darwin", "Pasteur"],
                    correct: 0,
                    points: 15
                },
                {
                    question: "What is the Big O notation for binary search?",
                    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "In which layer of the OSI model does HTTP operate?",
                    options: ["Transport", "Network", "Application", "Session"],
                    correct: 2,
                    points: 15
                },
                {
                    question: "What is the integral of e^x dx?",
                    options: ["e^x + C", "xe^x + C", "e^(x+1) + C", "ln(x) + C"],
                    correct: 0,
                    points: 15
                },
                {
                    question: "Which sorting algorithm has the best worst-case time complexity?",
                    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Selection Sort"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "What is the space complexity of merge sort?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correct: 2,
                    points: 15
                },
                {
                    question: "In machine learning, what does 'overfitting' mean?",
                    options: ["Model is too simple", "Model memorizes training data", "Model has high bias", "Model converges slowly"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "What is the atomic number of carbon?",
                    options: ["4", "6", "8", "12"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "Which design pattern ensures a class has only one instance?",
                    options: ["Factory", "Observer", "Singleton", "Strategy"],
                    correct: 2,
                    points: 15
                },
                {
                    question: "What is the time complexity of inserting an element in a balanced BST?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "In database normalization, what is 3NF?",
                    options: ["Third Normal Form", "Triple Network Function", "Three Node Format", "Tertiary Null Field"],
                    correct: 0,
                    points: 15
                },
                {
                    question: "What does ACID stand for in database systems?",
                    options: ["Atomic, Consistent, Isolated, Durable", "Array, Class, Interface, Data", "Algorithm, Cache, Index, Database", "Access, Control, Identity, Distribution"],
                    correct: 0,
                    points: 15
                },
                {
                    question: "Which protocol is used for secure HTTP communication?",
                    options: ["FTP", "SSH", "TLS/SSL", "SMTP"],
                    correct: 2,
                    points: 15
                },
                {
                    question: "What is the limit of (sin x)/x as x approaches 0?",
                    options: ["0", "1", "∞", "undefined"],
                    correct: 1,
                    points: 15
                },
                {
                    question: "In computer graphics, what does GPU stand for?",
                    options: ["General Processing Unit", "Graphics Processing Unit", "Global Processing Unit", "Game Processing Unit"],
                    correct: 1,
                    points: 15
                }
            ]
        };

        const questionCount = this.difficulty === 'easy' ? 10 : this.difficulty === 'medium' ? 15 : 20;
        const availableQuestions = questionSets[this.difficulty];
        
        // Shuffle and select questions
        this.questions = this.shuffleArray([...availableQuestions]).slice(0, questionCount);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startQuiz() {
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            this.resetGameState();
            this.showScreen('quiz');
            this.startTime = new Date();
            this.loadQuestion();
            this.startTimer();
        }, 1000);
    }

    resetGameState() {
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.timeLeft = 30;
        this.updateScore();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        
        // Update progress
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.questionCounter.textContent = `${this.currentQuestion + 1} / ${this.questions.length}`;
        
        // Update question info
        this.difficultyBadge.textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        this.questionPoints.textContent = `${question.points} pts`;
        this.questionText.textContent = question.question;
        
        // Generate options
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <span>${option}</span>
            `;
            optionElement.addEventListener('click', () => this.selectOption(index));
            this.optionsContainer.appendChild(optionElement);
        });
        
        this.nextBtn.disabled = true;
        this.timeLeft = 30;
        this.startTimer();
    }

    selectOption(selectedIndex) {
        const options = document.querySelectorAll('.option');
        const question = this.questions[this.currentQuestion];
        
        // Disable all options
        options.forEach(option => option.classList.add('disabled'));
        
        // Show correct/wrong answers
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                option.classList.add('wrong');
            }
        });
        
        // Update score and stats
        if (selectedIndex === question.correct) {
            this.correctAnswers++;
            this.score += question.points;
            this.showToast('Correct! Well done!', 'success');
        } else {
            this.wrongAnswers++;
            this.showToast('Wrong answer. Better luck next time!', 'error');
        }
        
        this.updateScore();
        this.nextBtn.disabled = false;
        this.stopTimer();
    }

    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.questions.length) {
            this.endQuiz();
        } else {
            this.loadQuestion();
        }
    }

    startTimer() {
        this.stopTimer();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = `${this.timeLeft}s`;
            
            if (this.timeLeft <= 10) {
                this.timerElement.classList.add('timer-warning');
            } else {
                this.timerElement.classList.remove('timer-warning');
            }
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timerElement.classList.remove('timer-warning');
    }

    timeUp() {
        this.stopTimer();
        this.wrongAnswers++;
        this.showToast('Time\'s up!', 'error');
        
        // Show correct answer
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.classList.add('disabled');
            if (index === question.correct) {
                option.classList.add('correct');
            }
        });
        
        this.nextBtn.disabled = false;
    }

    endQuiz() {
        this.stopTimer();
        this.endTime = new Date();
        this.showResults();
        this.saveBestScore();
    }

    showResults() {
        const accuracy = Math.round((this.correctAnswers / this.questions.length) * 100);
        const totalTime = Math.round((this.endTime - this.startTime) / 1000);
        
        // Update results display
        this.finalScore.textContent = this.score;
        this.correctAnswersEl.textContent = this.correctAnswers;
        this.wrongAnswersEl.textContent = this.wrongAnswers;
        this.accuracyEl.textContent = `${accuracy}%`;
        this.totalTimeEl.textContent = `${totalTime}s`;
        
        // Set results message based on performance
        let icon, title, message;
        if (accuracy >= 90) {
            icon = 'excellent';
            title = 'Excellent!';
            message = 'Outstanding performance! You\'re a quiz master!';
        } else if (accuracy >= 70) {
            icon = 'good';
            title = 'Well Done!';
            message = 'Great job! You have solid knowledge!';
        } else if (accuracy >= 50) {
            icon = 'average';
            title = 'Good Effort!';
            message = 'Not bad! Keep practicing to improve!';
        } else {
            icon = 'poor';
            title = 'Keep Trying!';
            message = 'Don\'t give up! Practice makes perfect!';
        }
        
        this.resultsIcon.className = `results-icon ${icon}`;
        this.resultsTitle.textContent = title;
        this.resultsMessage.textContent = message;
        
        this.showScreen('results');
    }

    updateScore() {
        this.currentScoreEl.textContent = this.score;
    }

    saveBestScore() {
        const bestScore = localStorage.getItem('quizBestScore') || 0;
        if (this.score > bestScore) {
            localStorage.setItem('quizBestScore', this.score);
            this.bestScoreEl.textContent = this.score;
            this.showToast('New best score!', 'success');
        }
    }

    loadBestScore() {
        const bestScore = localStorage.getItem('quizBestScore') || 0;
        this.bestScoreEl.textContent = bestScore;
    }

    shareScore() {
        const accuracy = Math.round((this.correctAnswers / this.questions.length) * 100);
        const shareText = `I just scored ${this.score} points with ${accuracy}% accuracy on QuizMaster Pro! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'QuizMaster Pro Score',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Score copied to clipboard!', 'info');
            });
        }
    }

    resetGame() {
        this.stopTimer();
        this.showScreen('welcome');
        this.generateQuestions();
    }

    showScreen(screenName, updateHistory = true) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(`${screenName}Screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            
            // Update browser history
            if (updateHistory) {
                const state = {
                    screen: screenName,
                    currentQuestion: this.currentQuestion,
                    score: this.score,
                    correctAnswers: this.correctAnswers,
                    wrongAnswers: this.wrongAnswers
                };
                
                const url = screenName === 'welcome' ? 
                    window.location.pathname : 
                    `${window.location.pathname}#${screenName}`;
                    
                history.pushState(state, '', url);
            }
        }
    }

    showLoading() {
        this.loadingOverlay.classList.add('active');
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('active');
    }

    showToast(message, type = 'info') {
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            info: 'fas fa-info-circle'
        };
        
        this.toast.className = `toast ${type}`;
        this.toast.querySelector('.toast-icon').className = `toast-icon ${iconMap[type]}`;
        this.toast.querySelector('.toast-message').textContent = message;
        
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    initializeHistory() {
        // Set initial state
        const initialState = {
            screen: 'welcome',
            currentQuestion: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0
        };
        history.replaceState(initialState, '', window.location.pathname);
    }

    handlePopState(e) {
        if (e.state) {
            // Restore state from history
            this.currentQuestion = e.state.currentQuestion || 0;
            this.score = e.state.score || 0;
            this.correctAnswers = e.state.correctAnswers || 0;
            this.wrongAnswers = e.state.wrongAnswers || 0;
            
            // Show the appropriate screen without updating history
            this.showScreen(e.state.screen, false);
            
            // If we're going back to quiz screen, we need to handle it carefully
            if (e.state.screen === 'quiz' && this.questions.length > 0) {
                // Stop any running timer
                this.stopTimer();
                // Load the current question
                if (this.currentQuestion < this.questions.length) {
                    this.loadQuestion();
                } else {
                    // If quiz was completed, go to results
                    this.showScreen('results', false);
                }
            }
            
            // Update score display
            this.updateScore();
        } else {
            // No state, go to welcome screen
            this.showScreen('welcome', false);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new QuizGame();
    
    // Handle initial page load with hash
    const hash = window.location.hash.substring(1);
    if (hash && ['quiz', 'results'].includes(hash)) {
        // If there's a hash but no proper state, redirect to welcome
        game.showScreen('welcome');
    }
});

// Add some additional interactive features
document.addEventListener('keydown', (e) => {
    const activeScreen = document.querySelector('.screen.active');
    
    if (activeScreen && activeScreen.id === 'quizScreen') {
        // Allow keyboard shortcuts for options (A, B, C, D)
        const keyMap = { 'KeyA': 0, 'KeyB': 1, 'KeyC': 2, 'KeyD': 3 };
        if (keyMap.hasOwnProperty(e.code)) {
            const options = document.querySelectorAll('.option:not(.disabled)');
            if (options[keyMap[e.code]]) {
                options[keyMap[e.code]].click();
            }
        }
        
        // Enter key for next question
        if (e.code === 'Enter') {
            const nextBtn = document.getElementById('nextBtn');
            if (!nextBtn.disabled) {
                nextBtn.click();
            }
        }
    }
    
    if (activeScreen && activeScreen.id === 'welcomeScreen') {
        // Space or Enter to start quiz
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            document.getElementById('startQuizBtn').click();
        }
    }
});