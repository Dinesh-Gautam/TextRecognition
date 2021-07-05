let data = null;
let indexArr = [];

fetch("../recognized.json", { method: "GET", type: "JSON" })
  .then((e) => e.json())
  .then((e) => {
    console.log("data loaded!");
    data = e;
    modifyData();
  })
  .catch((e) => console.error(e));

console.log("model loading...");

qna.load().then(
  // Find the answers
  findQuestionsAnswers
);

function modifyData() {
  data.forEach((e) => {
    e.paragraphs.forEach((para) => {
      let filteredString = para.replace(/[|&;$%@"<>()+,]/g, " ");
      filteredString = filteredString.replace(/\n/g, " ");
      para = filteredString;
    });
  });
}

const finalAnswer = [];
let searchingDone = false;

function findQuestionsAnswers(model) {
  console.log("Model Loaded!");
  document
    .querySelector(".question-searcher-btn")
    .addEventListener("click", (e) => {
      e.preventDefault();

      filteredData.forEach((string, index) => {
        model
          .findAnswers(document.getElementById("questionInput").value, string)
          .then((answers) => {
            if (answers.length > 0) {
              answers.forEach((e) => {
                e.index = index;
                finalAnswer.push(e);
              });
            }
            if (index + 1 === filteredData.length) {
              searchingDone = true;
            } else {
              searchingDone = false;
            }
            allParagraphsSearched();
          });
      });
    });
}
function allParagraphsSearched() {
  if (!searchingDone) {
    return;
  }

  const refIndexArr = [];
  finalAnswer.forEach((e) => refIndexArr.push(e.index));

  indexArr = [...new Set(refIndexArr)];
  displayAnswers(finalAnswer);
}

function displayAnswers(answers) {
  const resultElement = document.querySelector(".result");
  resultElement.innerHTML = "";
  const ul = document.createElement("ul");
  answers.forEach((e) => {
    const li = document.createElement("li");
    li.innerText = e.text;
    ul.appendChild(li);
  });
  resultElement.appendChild(ul);
  const paragraphs = indexArr.map((e) => {
    const p = document.createElement("p");
    p.innerText = data[e].text;
    return p;
  });

  paragraphs.forEach((p) => resultElement.appendChild(p));

  indexArr.forEach((e) => {
    const { imgSrc } = data[e];
    const image = document.createElement("img");
    image.src = "../public" + imgSrc;
    resultElement.appendChild(image);
  });
}

// model
//   .findAnswers(document.getElementById("questionInput").value, filteredData)
//   .then((answers) => {
//     const resultElement = document.querySelector(".result");
//     resultElement.innerHTML = "";
//     const ul = document.createElement("ul");
//     answers.forEach((e) => {
//       const li = document.createElement("li");
//       li.innerText = e.text;
//       ul.appendChild(li);
//     });
//     resultElement.appendChild(ul);
//   });

// .then((answers) => {
//   const resultElement = document.querySelector(".result");
//   resultElement.innerHTML = "";
//   const ul = document.createElement("ul");
//   answers.forEach((e) => {
//     const li = document.createElement("li");
//     li.innerText = e.text;
//     ul.appendChild(li);
//   });
//   resultElement.appendChild(ul);
// });
