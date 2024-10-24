const quizData = [
    {
        question: "Thủ đô của Việt Nam là gì?",
        options: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế"],
        correct: 0
    },
    {
        question: "Đâu là số lớn nhất?",
        options: ["15", "25", "5", "10"],
        correct: 1
    },
    {
        question: "1 + 1 = ?",
        options: ["1", "2", "3", "4"],
        correct: 1
    },
    {
        question: "HTML là viết tắt của?",
        options: [
            "Hyper Text Markup Language",
            "High Text Markup Language",
            "Hyper Tabular Markup Language",
            "None of these"
        ],
        correct: 0
    },
    {
        question: "CSS dùng để làm gì?",
        options: [
            "Tạo cấu trúc web",
            "Tạo style cho web",
            "Tạo chức năng cho web",
            "Tất cả các đáp án trên"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
const quiz = document.getElementById('quiz');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
const skipBtn = document.getElementById('skip-btn');
const backBtn = document.getElementById('back-btn');
let score = 0;
let answered = false;
let userAnswers = new Array(quizData.length).fill(null); // Mảng lưu trữ đáp án người dùng

function updateProgressBar() {
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    document.querySelector('.progress-bar-fill').style.width = `${progress}%`;
}

function showQuestion() {
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('total-questions').textContent = quizData.length;
    updateProgressBar();
    
    const questionData = quizData[currentQuestion];
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    questionDiv.innerHTML = `
        <h2>${questionData.question}</h2>
        <div class="options">
            ${questionData.options.map((option, index) => `
                <div class="option" data-index="${index}">
                    ${option}
                </div>
            `).join('')}
        </div>
    `;

    quiz.innerHTML = '';
    quiz.appendChild(questionDiv);

    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => selectOption(option));
    });
}

function selectOption(selected) {
    if (answered) return;
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    selected.classList.add('selected');

    // Thêm hiệu ứng ripple
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    selected.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
}

function showResult() {
    const percentage = (score / quizData.length) * 100;
    let message = '';
    if (percentage >= 80) {
        message = 'Xuất sắc! 🎉';
    } else if (percentage >= 60) {
        message = 'Khá tốt! 👍';
    } else {
        message = 'Hãy cố gắng hơn! 💪';
    }

    resultDiv.innerHTML = `
        <div class="result-score">${score}/${quizData.length}</div>
        <div class="result-message">${message}</div>
        <div class="result-percentage">${percentage}%</div>
        <button onclick="resetQuiz()">Làm lại</button>
    `;
    submitBtn.style.display = 'none';
    skipBtn.style.display = 'none'; // Ẩn nút Bỏ qua khi xem kết quả
}

function checkAnswer() {
    const selected = document.querySelector('.option.selected');
    if (!selected && currentQuestion < quizData.length) {
        alert('Vui lòng chọn một đáp án!');
        return;
    }

    answered = true;
    const selectedIndex = parseInt(selected.dataset.index);
    const correct = quizData[currentQuestion].correct;

    // Lưu đáp án của người dùng
    userAnswers[currentQuestion] = selectedIndex;

    if (selectedIndex === correct) {
        score++;
        selected.classList.add('correct');
    } else {
        selected.classList.add('wrong');
        document.querySelectorAll('.option')[correct].classList.add('correct');
    }

    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        submitBtn.textContent = 'Câu tiếp theo';
    } else {
        submitBtn.textContent = 'Xem kết quả';
    }
}

function nextQuestion() {
    if (currentQuestion < quizData.length) {
        answered = false;
        showQuestion();
        // Nếu câu hỏi đã được trả lời, hiển thị đáp án đã chọn và đúng/sai
        if (userAnswers[currentQuestion] !== null) {
            const selectedIndex = userAnswers[currentQuestion];
            const selectedOption = document.querySelector(`.option[data-index="${selectedIndex}"]`);
            const correctIndex = quizData[currentQuestion].correct;
            
            if (selectedOption) {
                selectedOption.classList.add('selected');
                answered = true;
                
                // Hiển thị đúng/sai
                if (selectedIndex === correctIndex) {
                    selectedOption.classList.add('correct'); // Đúng
                } else {
                    selectedOption.classList.add('wrong'); // Sai
                    document.querySelector(`.option[data-index="${correctIndex}"]`).classList.add('correct'); // Đánh dấu đáp án đúng
                }

                // Ẩn nút "Câu tiếp theo" nếu quay lại câu đã trả lời
                submitBtn.style.display = 'none';
            }
        } else {
            submitBtn.textContent = 'Trả lời';
            submitBtn.style.display = 'block'; // Hiển thị nút "Trả lời" nếu câu chưa được trả lời
        }

        skipBtn.style.display = 'block'; // Hiện nút Bỏ qua
        backBtn.style.display = currentQuestion > 0 ? 'block' : 'none'; // Hiện nút "Quay lại" nếu không phải câu đầu tiên
    } else {
        showResult();
        skipBtn.style.display = 'none'; // Ẩn nút Bỏ qua khi không còn câu hỏi nào
        backBtn.style.display = 'none'; // Ẩn nút "Quay lại" khi hiển thị kết quả
    }
}

submitBtn.addEventListener('click', () => {
    if (!answered) {
        checkAnswer();
    } else {
        nextQuestion();
    }
});

skipBtn.addEventListener('click', () => {
    if (currentQuestion < quizData.length) {
        answered = true; // Đánh dấu là đã xử lý câu hỏi
        currentQuestion++; // Chuyển sang câu tiếp theo
        nextQuestion(); // Chuyển sang câu hỏi tiếp theo
    }
});

backBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--; // Giảm câu hỏi hiện tại
        answered = false; // Đánh dấu là chưa trả lời
        nextQuestion(); // Hiển thị câu hỏi trước đó
    }
    // Hiển thị đáp án đã chọn và đúng/sai nếu có
    const selectedIndex = userAnswers[currentQuestion];
    const correctIndex = quizData[currentQuestion].correct;

    if (selectedIndex !== null) {
        const selectedOption = document.querySelector(`.option[data-index="${selectedIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            answered = true;
            
            // Hiển thị đúng/sai
            if (selectedIndex === correctIndex) {
                selectedOption.classList.add('correct'); // Đúng
            } else {
                selectedOption.classList.add('wrong'); // Sai
                document.querySelector(`.option[data-index="${correctIndex}"]`).classList.add('correct'); // Đánh dấu đáp án đúng
            }

            // Ẩn nút "Câu tiếp theo" nếu quay lại câu đã trả lời
            submitBtn.style.display = 'none';
        }
    }
});

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    submitBtn.style.display = 'block';
    submitBtn.textContent = 'Trả lời';
    userAnswers.fill(null); // Đặt lại đáp án người dùng
    resultDiv.innerHTML = '';
    skipBtn.style.display = 'block'; // Hiện nút Bỏ qua khi bắt đầu lại
    backBtn.style.display = 'none'; // Ẩn nút "Quay lại" khi bắt đầu lại
    showQuestion();
}

// Start the quiz
showQuestion();
