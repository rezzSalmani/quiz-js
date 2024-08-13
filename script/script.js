const $ = document;

const quizStarter = $.querySelector(".start-quiz");
const startBtn = $.querySelector("#start-quiz-btn");
const quizBox = $.querySelector(".quiz-box");
const quizContent = $.querySelector(".quiz-content");
const nextQueBtn = $.querySelector("#next-question");
const quizCounter = $.querySelector(".quiz-counter");
const timeLeft = $.querySelector("#time-left");
const timeStatus = $.querySelector("#time-status");
const timerProgress = $.querySelector(".timer-progress");
const resultBox = $.querySelector(".result-box");
const restartBtn = $.querySelector(".restart-btn");
let currentQIndex = 0;
let correctAnswers = 0;
let timeLimit = 15;
let counter;
let counterProgress;
let widthOfProgressBar = 0;
const correctAnswerSvg = `<span class="correct-svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>`;
const wrongAnswerSvg = `<span class="wrong-svg"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>`;
const winnerSvg = ` <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
          />
        </svg>`;
const loserSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
</svg>
`;
const shuffle = (array) => {
  const cloneArray = [...array];
  const shuffledArray = [];
  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.floor(Math.random() * cloneArray.length);
    shuffledArray.push(cloneArray[randomIndex]);
    cloneArray.splice(randomIndex, 1);
  }
  return shuffledArray;
};

startBtn.onclick = () => {
  quizStarter.classList.remove("show-box");
  setTimeout(() => {
    quizBox.classList.add("show-box");
  }, 250);
  initializeGame();
};

const initializeGame = () => {
  currentQIndex = 0;
  correctAnswers = 0;
  clearInterval(counter);
  clearInterval(counterProgress);
  changeQuiz(0);
  progressCounter(timeLimit);
  timeCounter(timeLimit);
};

const changeQuiz = (index) => {
  const options = questions[index].options;
  const shuffleOptions = shuffle(options);
  const targetQuizContent = `
   <h6><span>${questions[index].id}</span>. ${questions[index].question}</h6>
        <ul>
        ${shuffleOptions
          .map(
            (option) =>
              `<li class="option" onClick="checkAnswer(this)">${option}</li>`
          )
          .join("")}
        </ul>
  `;
  const counter = `
          <span>
            <span>${currentQIndex + 1}</span>
            of
            <span>${questions.length}</span>
            questions
          </span>
  `;
  quizCounter.innerHTML = counter;
  quizContent.innerHTML = targetQuizContent;
};

nextQueBtn.onclick = () => {
  if (currentQIndex === questions.length - 2) nextQueBtn.innerText = "End Quiz";
  clearInterval(counter);
  clearInterval(counterProgress);
  if (currentQIndex < questions.length - 1) {
    currentQIndex++;
    changeQuiz(currentQIndex);
    timeCounter(timeLimit);
    progressCounter(timeLimit);
  } else {
    endQuiz(correctAnswers);
  }
  nextQueBtn.setAttribute("disabled", "");
  timeStatus.textContent = "Time Off";
};

const checkAnswer = (element) => {
  const correctAnswer = questions[currentQIndex].answer;
  clearInterval(counter);
  clearInterval(counterProgress);
  if (element.innerText === correctAnswer) {
    addCorrectOption(element);
    timerProgress.style.backgroundColor = "#009688";
    correctAnswers++;
  } else {
    timerProgress.style.backgroundColor = "#BF360C";
    selectWrongOption(element);
    selectCorrectAnswer(correctAnswer);
  }
  disableAllOptions();
  nextQueBtn.removeAttribute("disabled");
  timeStatus.textContent = "Time end";
};

function selectCorrectAnswer() {
  const allQuizOptions = $.querySelectorAll(".option");
  const correctAnswer = questions[currentQIndex].answer;
  allQuizOptions.forEach((queItem) => {
    if (
      queItem.innerText === correctAnswer &&
      !queItem.classList.contains("correct")
    ) {
      addCorrectOption(queItem);
    }
  });
}
const disableAllOptions = () => {
  const allQuizOptions = $.querySelectorAll(".option");
  allQuizOptions.forEach((item) => item.classList.add("disable"));
};
const addCorrectOption = (element) => {
  element.classList.add("correct");
  setTimeout(() => {
    element.insertAdjacentHTML("beforeend", correctAnswerSvg);
  }, 300);
};

const selectWrongOption = (element) => {
  element.classList.add("wrong");
  element.insertAdjacentHTML("beforeend", wrongAnswerSvg);
};
const timeCounter = (time) => {
  counter = setInterval(timer, 1000);

  function timer() {
    timerProgress.style.backgroundColor = "#BF360C";
    timeLeft.textContent = time;
    time--;

    if (time < 9) {
      timeLeft.textContent = "0" + time;
    }

    if (time <= 0) {
      clearInterval(counter);
      timeStatus.textContent = "Time Ended";
      selectCorrectAnswer();
      disableAllOptions();
      nextQueBtn.removeAttribute("disabled");
    }
  }
};
function progressCounter(timeLimit) {
  timerProgress.style.width = "0";
  const totalWidth = 100;
  const intervalTime = 1000;
  let elapsedTime = 0;
  counterProgress = setInterval(timer, intervalTime);

  function timer() {
    elapsedTime++;
    const progressWidth = (elapsedTime / timeLimit) * totalWidth; // Calculate the width as a percentage
    timerProgress.style.width = progressWidth + "%";
    console.log(elapsedTime);
    if (elapsedTime >= timeLimit) {
      clearInterval(counterProgress);
    }
  }
}

function endQuiz(score) {
  quizBox.classList.remove("show-box");
  if (score > questions.length / 2) {
    const winResult = `
     <span class="result-win-icon">
       ${winnerSvg}
      </span>
      <h6>🎉 Congratulation 🎉</h6>
      <span>You Complete Quiz with ${score * 10} Score</span>
      <button class="restart-btn">Restart Quiz</button>
    `;
    resultBox.innerHTML = winResult;
  } else {
    const loseResult = `
     <span class="result-lose-icon">
       ${loserSvg}
      </span>
      <h6>🥲 Try agin 🥲</h6>
      <span>You Complete Quiz with ${score * 10} Score</span>
      <button class="restart-btn" onclick="resetQuiz()">Restart Quiz</button>
    `;
    resultBox.innerHTML = loseResult;
  }
  setTimeout(() => {
    resultBox.classList.add("show-box");
  }, 250);
}
const resetQuiz = () => {
  resultBox.classList.remove("show-box");
  setTimeout(() => {
    quizStarter.classList.add("show-box");
  }, 250);
};
