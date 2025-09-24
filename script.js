let questions = [
  {
    question: "Which is the largest animal in the world?",
    answers: [
      { text: "Horse", correct: false },
      { text: "Elephant", correct: false },
      { text: "Blue Whale", correct: true },
      { text: "Rhinoceros", correct: false },
    ],
  },
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is 15 + 27?",
    answers: [
      { text: "40", correct: false },
      { text: "42", correct: true },
      { text: "45", correct: false },
      { text: "38", correct: false },
    ],
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "Vincent van Gogh", correct: false },
      { text: "Pablo Picasso", correct: false },
      { text: "Leonardo da Vinci", correct: true },
      { text: "Michelangelo", correct: false },
    ],
  },
  {
    question: "Which programming language is known for web development?",
    answers: [
      { text: "Python", correct: false },
      { text: "JavaScript", correct: true },
      { text: "C++", correct: false },
      { text: "Assembly", correct: false },
    ],
  },
];

async function fetchRandomQuestions(amount = 10) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&type=multiple`
    );
    const data = await response.json();

    return data.results.map((q) => ({
      question: q.question,
      answers: [
        { text: q.correct_answer, correct: true },
        ...q.incorrect_answers.map((ans) => ({ text: ans, correct: false })),
      ].sort(() => Math.random() - 0.5),
    }));
  } catch (error) {
    return questions;
  }
}

fetchRandomQuestions().then((newQuestions) => {
  questions = newQuestions;
});

const questionElement = document.querySelector("#question");
const answerBtn = document.querySelector("#answer-buttons");
const nextBtn = document.querySelector("#next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextBtn.innerHTML = "Next";
  showQuestion();
}
const showQuestion = () => {
  resetstate();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNum = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNum + "." + currentQuestion.question;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerBtn.append(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
};

const resetstate = () => {
  nextBtn.style.display = "none";
  while (answerBtn.firstChild) {
    answerBtn.removeChild(answerBtn.firstChild);
  }
};
const selectAnswer = (e) => {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerBtn.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextBtn.style.display = "block";
};

const handleNextbtn = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
};

const showScore = () => {
  resetstate();
  questionElement.textContent = `you scored ${score} out of ${questions.length}!`;
  nextBtn.textContent = "Play Again";
  nextBtn.style.display = "block";
};

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextbtn();
  } else {
    startQuiz();
  }
});
startQuiz();
