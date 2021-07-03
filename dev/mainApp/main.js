let data = null;

fetch("../recognized.json", { method: "GET", type: "JSON" })
  .then((e) => e.json())
  .then((e) => (data = e))
  .catch((e) => console.log(e));

qna.load().then(
  // Find the answers
  findQuestionsAnswers
);

function findQuestionsAnswers(model) {
  console.log("Modal Loaded!");
  document
    .querySelector(".question-searcher-btn")
    .addEventListener("click", (e) => {
      e.preventDefault();
      model
        .findAnswers(
          document.getElementById("questionInput").value,
          data.join(" ")
        )
        .then((answers) => {
          console.log("Answers: ", answers);
        });
    });
}
