let data = null;
let filteredData = "";

fetch("../recognized.json", { method: "GET", type: "JSON" })
  .then((e) => e.json())
  .then((e) => {
    console.log("data loaded!");
    data = e;
    modifyData();
  })
  .catch((e) => console.log(e));

console.log("model loading...");

qna.load().then(
  // Find the answers
  findQuestionsAnswers
);

function modifyData() {
  data.forEach((e) => {
    let filteredString = e.text.replace(/[|&;$%@"<>()+,]/g, " ");
    filteredString = filteredString.replace(/\n/g, " ");
    filteredData += ` ${filteredString}`;
  });
}

function findQuestionsAnswers(model) {
  console.log("Model Loaded!");
  document
    .querySelector(".question-searcher-btn")
    .addEventListener("click", (e) => {
      e.preventDefault();
      model
        .findAnswers(
          document.getElementById("questionInput").value,
          filteredData
        )
        .then((answers) => {
          console.log("Answers: ", answers);
        });
    });
}
