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

function modifyData() {
  data.forEach((e) => {
    e.paragraphs = e.paragraphs.map((para) => {
      let filteredString = para.replace(/[|&;$%@"<>()+,]/g, " ");
      para = filteredString.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      return para;
    });
  });
}

// Simple Search

const simpleSearchForm = document.querySelector(".simple-search");
simpleSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = simpleSearchForm.querySelector("#questionInputSimple").value;

  const simpleSearchResult = parseSimpleSearchValue(value);
  displayAnswers(".simple-search-result", simpleSearchResult);
});

function parseSimpleSearchValue(value) {
  const separateValues = [value];
  // .split(" ")
  // .filter((valueWord) => valueWord.length > 2);

  return data
    .map((eachData, index) => {
      const mapPara = eachData.paragraphs
        .map((para, index) => {
          return separateValues
            .map((value) => {
              const match = para.toLowerCase().match(new RegExp(value), "g");
              if (match === null) return;
              match.paragraphIndex = index;
              return match;
            })
            .filter((para) => para);
        })
        .filter((para) => para.length > 0);
      return { ...eachData, sourceIndex: index, paragraphs: mapPara };
    })
    .filter((arr) => arr.paragraphs.length > 0);
}

// A.I Search
// qna.load().then(
//   // Find the answers
//   findQuestionsAnswers
// );

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

function displayAnswers(parentElement, answers) {
  const [short, paragraph, image] = document.querySelectorAll(
    parentElement + " " + ".result-body"
  );
  const shortAnswer = answers.map((ans) =>
    creatAnswerElement("ul", "li", synthesisAnswer(ans.paragraphs))
  );
  const wholeParagraph = answers.map((ans) => {
    const sourceParagraph = [...data[ans.sourceIndex].paragraphs];
    const ansParagraphs = ans.paragraphs;
    const matchedParagraphs = ans.paragraphs.map(
      (para) => para[0].paragraphIndex
    );
    matchedParagraphs.forEach((paraIndex, index) => {
      sourceParagraph[paraIndex] = synthesisAnswer([ansParagraphs[index]]).join(
        ""
      );
    });
    return sourceParagraph.join("<br>");
  });
  const imageAnswers = answers.map((ans) => {
    const { imgSrc } = ans;
    const img = document.createElement("img");
    img.src = "../public/" + imgSrc;
    return img;
  });

  console.log(wholeParagraph);
  short.innerHTML = "";
  paragraph.innerHTML = "";
  image.innerHTML = "";
  shortAnswer.forEach((ans) => short.appendChild(ans));
  wholeParagraph.forEach((ans) =>
    paragraph.appendChild(creatAnswerElement("div", "p", [ans]))
  );
  imageAnswers.forEach((img) => image.appendChild(img));
}
function synthesisAnswer(sourceStringArr) {
  // const modString = sourceStringArr.input.split("")[sourceStringArr.index];

  return sourceStringArr.map((string) => {
    string = string[0];

    let matchedWordIndex = {
      stringStarting: 0,
      wordStarting: string.index,
      wordEnding: string.index + string[0].length,
      stringEnding: string.input.length,
    };
    return `${string.input.slice(
      matchedWordIndex.stringStarting,
      matchedWordIndex.wordStarting
    )}<span class="highlight-text">${string.input.slice(
      matchedWordIndex.wordStarting,
      matchedWordIndex.wordEnding
    )}</span>${string.input.slice(
      matchedWordIndex.wordEnding,
      matchedWordIndex.stringEnding
    )}`;
  });
  // return answers[0].paragraphs.map((para) => para.input);
}

function creatAnswerElement(ele, innerEle, innerHTML) {
  const element = document.createElement(ele);

  innerHTML.forEach((e) => {
    const innerElement = document.createElement(innerEle);
    innerElement.innerHTML = e;
    element.appendChild(innerElement);
  });

  return element;
}

// function displayAnswers(parentElement , answers) {
//   const resultElement = document.querySelector(".result-body");
//   resultElement.innerHTML = "";
//   const ul = document.createElement("ul");
//   answers.forEach((e) => {
//     const li = document.createElement("li");
//     li.innerText = e.text;
//     ul.appendChild(li);
//   });
//   resultElement.appendChild(ul);
//   const paragraphs = indexArr.map((e) => {
//     const p = document.createElement("p");
//     p.innerText = data[e].text;
//     return p;
//   });

//   paragraphs.forEach((p) => resultElement.appendChild(p));

//   indexArr.forEach((e) => {
//     const { imgSrc } = data[e];
//     const image = document.createElement("img");
//     image.src = "../public" + imgSrc;
//     resultElement.appendChild(image);
//   });
// }

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
