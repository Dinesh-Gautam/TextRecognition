const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

console.time();

const threshold = 2.8;

let resultData = null;

const image = new Image();
image.src = "images/ (1).jpg";

// image.src = "images/text.jpg";
// image.src = "images/aitraining/aitraining.png";

image.addEventListener("load", () => {
  canvas.height = image.height;
  canvas.width = image.width;

  ctx.drawImage(image, 0, 0);

  let difference = 0;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  for (let r = 0; r < data.length; r += 4) {
    const R = data[r];
    const G = data[r + 1];
    const B = data[r + 2];

    const total = R + G + B;

    const average = total / 3;

    if (average > difference) {
      difference = average;
    }
    //   const A = data[i][r + 3];
  }
  detectEdges(imageData.data);

  // for (let r = 0; r < data.length; r += 4) {
  //   const R = data[r];
  //   const G = data[r + 1];
  //   const B = data[r + 2];

  //   const total = R + G + B;

  //   const average = total / threshold;

  //   if (average > difference) {
  //     data[r] = 255;
  //     data[r + 1] = 255;
  //     data[r + 2] = 255;
  //   } else {
  //     if (average < difference / 2) {
  //       data[r] = 0;
  //       data[r + 1] = 0;
  //       data[r + 2] = 0;
  //     } else {
  //       data[r] = 255;
  //       data[r + 1] = 255;
  //       data[r + 2] = 255;
  //     }
  //   }
  //   // const A = data[i][r + 3];
  // }

  imageData.data = data;
  // enhanceText(imageData.data);

  ctx.putImageData(imageData, 0, 0);

  console.timeEnd();
  // recoganizeText();
});

// function detectEdges(data) {
//   for (let c = 0; c < canvas.height; c++) {
//     for (let r = 0; r < canvas.width; r++) {
//       const R = data[c * 4 * canvas.width + r * 4];
//       const G = data[c * 4 * canvas.width + (r * 4 + 1)];
//       const B = data[c * 4 * canvas.width + (r * 4 + 2)];

//       const surrounding = [
//         data[c * 4 * canvas.width + (r + 1) * 4],
//         data[c * 4 * canvas.width + (r + 2) * 4],
//         data[(c + 1) * 4 * canvas.width + r * 4],
//         data[(c + 2) * 4 * canvas.width + r * 4],
//         data[(c + 1) * 4 * canvas.width + (r + 1) * 4],
//         data[(c + 1) * 4 * canvas.width + (r + 2) * 4],
//         data[(c + 2) * 4 * canvas.width + (r + 1) * 4],
//         data[(c + 2) * 4 * canvas.width + (r + 2) * 4],
//         data[c * 4 * canvas.width + (r - 1) * 4],
//         data[c * 4 * canvas.width + (r - 2) * 4],
//         data[(c - 1) * 4 * canvas.width + r * 4],
//         data[(c - 2) * 4 * canvas.width + r * 4],
//         data[(c - 1) * 4 * canvas.width + (r - 1) * 4],
//         data[(c - 1) * 4 * canvas.width + (r - 2) * 4],
//         data[(c - 2) * 4 * canvas.width + (r - 1) * 4],
//         data[(c - 2) * 4 * canvas.width + (r - 2) * 4],
//         data[(c + 1) * 4 * canvas.width + (r - 1) * 4],
//         data[(c + 1) * 4 * canvas.width + (r - 2) * 4],
//         data[(c + 2) * 4 * canvas.width + (r - 1) * 4],
//         data[(c + 2) * 4 * canvas.width + (r - 2) * 4],
//         data[(c - 1) * 4 * canvas.width + (r + 1) * 4],
//         data[(c - 1) * 4 * canvas.width + (r + 2) * 4],
//         data[(c - 2) * 4 * canvas.width + (r + 1) * 4],
//         data[(c - 2) * 4 * canvas.width + (r + 2) * 4],
//       ];

//       let whites = 0;
//       blacks = 0;

//       const total = R + G + B / 3;
//       let difference = 0;
//       for (let i = 0; i < surrounding.length; i++) {
//         let diff = surrounding[i] - difference;
//         if (diff > difference) {
//           difference = diff;
//         }
//       }
//       for (let i = 0; i < surrounding.length; i++) {
//         if (surrounding[i] < difference) {
//           blacks++;
//         } else {
//           whites++;
//         }
//       }
//       if (difference < 160) {
//         data[c * 4 * canvas.width + r * 4] = 0;
//         data[c * 4 * canvas.width + (r * 4 + 1)] = 0;
//         data[c * 4 * canvas.width + (r * 4 + 2)] = 0;
//       }
//       // if (whites > blacks) {
//       //   data[c * 4 * canvas.width + r * 4] = 255;
//       //   data[c * 4 * canvas.width + (r * 4 + 1)] = 255;
//       //   data[c * 4 * canvas.width + (r * 4 + 2)] = 255;
//       // }
//       // } else {
//       //   data[c * 4 * canvas.width + r * 4] = 255;
//       //   data[c * 4 * canvas.width + (r * 4 + 1)] = 255;
//       //   data[c * 4 * canvas.width + (r * 4 + 2)] = 255;
//       // }
//       // else {
//       //   data[c * 4 * canvas.width + r * 4] = 255;
//       //   data[c * 4 * canvas.width + (r * 4 + 1)] = 255;
//       //   data[c * 4 * canvas.width + (r * 4 + 2)] = 255;
//       // }
//     }
//   }

//   data = data;
// }

function detectEdges(data) {
  for (let c = 0; c < canvas.height; c++) {
    for (let r = 0; r < canvas.width; r++) {
      // const c = 300,
      //   r = 300;

      const R = data[c * 4 * canvas.width + r * 4];
      const G = data[c * 4 * canvas.width + (r * 4 + 1)];
      const B = data[c * 4 * canvas.width + (r * 4 + 2)];

      const average = R + G + B / 3;

      let max = 0;
      let min = 255;

      let surroundingAvg = 0;

      const surrounding = [
        data[c * 4 * canvas.width + (r + 1) * 4],
        data[c * 4 * canvas.width + (r + 2) * 4],
        data[(c + 1) * 4 * canvas.width + r * 4],
        data[(c + 2) * 4 * canvas.width + r * 4],
        data[(c + 1) * 4 * canvas.width + (r + 1) * 4],
        data[(c + 1) * 4 * canvas.width + (r + 2) * 4],
        data[(c + 2) * 4 * canvas.width + (r + 1) * 4],
        data[(c + 2) * 4 * canvas.width + (r + 2) * 4],
      ];

      for (let i in surrounding) {
        surroundingAvg += surrounding[i];

        surrounding[i] < min ? (min = surrounding[i]) : null;
        surrounding[i] > max ? (max = surrounding[i]) : null;
      }

      surroundingAvg /= surrounding.length;

      const diff = max - min;

      // console.log(diff);
      // data[c * 4 * canvas.width + r * 4] = 255;

      if (diff > 50) {
        //   // it is the edge
        data[c * 4 * canvas.width + r * 4] = 255;
      } else {
      }
      //   // it is black or white

      //   if (average < surroundingAvg) {
      //     data[c * 4 * canvas.width + r * 4] = 255;
      //   } else {
      //     data[c * 4 * canvas.width + r * 4] = 0;
      //   }
      // }
    }
  }

  data = data;
}

function enhanceText(data) {
  for (let c = 0; c < canvas.height; c++) {
    for (let r = 0; r < canvas.width; r++) {
      // let c = 20,
      //   r = 50;

      const R = data[c * 4 * canvas.width + r * 4];
      const G = data[c * 4 * canvas.width + (r * 4 + 1)];
      const B = data[c * 4 * canvas.width + (r * 4 + 2)];

      const total = R + G + B / 3;

      let blacks = 0,
        whites = 0,
        max = 0;

      [
        data[c * 4 * canvas.width + (r + 1) * 4],
        data[c * 4 * canvas.width + (r + 2) * 4],
        data[(c + 1) * 4 * canvas.width + r * 4],
        data[(c + 2) * 4 * canvas.width + r * 4],
        data[(c + 1) * 4 * canvas.width + (r + 1) * 4],
        data[(c + 1) * 4 * canvas.width + (r + 2) * 4],
        data[(c + 2) * 4 * canvas.width + (r + 1) * 4],
        data[(c + 2) * 4 * canvas.width + (r + 2) * 4],
        // data[c * 4 * canvas.width + (r - 1) * 4],
        // data[c * 4 * canvas.width + (r - 2) * 4],
        // data[(c - 1) * 4 * canvas.width + r * 4],
        // data[(c - 2) * 4 * canvas.width + r * 4],
        // data[(c - 1) * 4 * canvas.width + (r - 1) * 4],
        // data[(c - 1) * 4 * canvas.width + (r - 2) * 4],
        // data[(c - 2) * 4 * canvas.width + (r - 1) * 4],
        // data[(c - 2) * 4 * canvas.width + (r - 2) * 4],
        // data[(c + 1) * 4 * canvas.width + (r - 1) * 4],
        // data[(c + 1) * 4 * canvas.width + (r - 2) * 4],
        // data[(c + 2) * 4 * canvas.width + (r - 1) * 4],
        // data[(c + 2) * 4 * canvas.width + (r - 2) * 4],
        // data[(c - 1) * 4 * canvas.width + (r + 1) * 4],
        // data[(c - 1) * 4 * canvas.width + (r + 2) * 4],
        // data[(c - 2) * 4 * canvas.width + (r + 1) * 4],
        // data[(c - 2) * 4 * canvas.width + (r + 2) * 4],
      ].forEach((e) => {
        if (e < 100) {
          blacks++;
        } else {
          whites++;
        }
      });
      // data[c * 4 * canvas.width + (r + 1) * 4] = 255;
      // data[c * 4 * canvas.width + (r + 2) * 4] = 255;
      // data[(c + 1) * 4 * canvas.width + r * 4] = 255;
      // data[(c + 2) * 4 * canvas.width + r * 4] = 255;
      // data[(c + 1) * 4 * canvas.width + (r + 1) * 4] = 255;
      // data[(c + 1) * 4 * canvas.width + (r + 2) * 4] = 255;
      // data[(c + 2) * 4 * canvas.width + (r + 1) * 4] = 255;
      // data[(c + 2) * 4 * canvas.width + (r + 2) * 4] = 255;
      // data[c * 4 * canvas.width + (r - 1) * 4] = 255;
      // data[c * 4 * canvas.width + (r - 2) * 4] = 255;
      // data[(c - 1) * 4 * canvas.width + r * 4] = 255;
      // data[(c - 2) * 4 * canvas.width + r * 4] = 255;
      // data[(c - 1) * 4 * canvas.width + (r - 1) * 4] = 255;
      // data[(c - 1) * 4 * canvas.width + (r - 2) * 4] = 255;
      // data[(c - 2) * 4 * canvas.width + (r - 1) * 4] = 255;
      // data[(c - 2) * 4 * canvas.width + (r - 2) * 4] = 255;
      // data[(c + 1) * 4 * canvas.width + (r - 1) * 4] = 255;
      // data[(c + 1) * 4 * canvas.width + (r - 2) * 4] = 255;
      // data[(c + 2) * 4 * canvas.width + (r - 1) * 4] = 255;
      // data[(c + 2) * 4 * canvas.width + (r - 2) * 4] = 255;
      // data[(c - 1) * 4 * canvas.width + (r + 1) * 4] = 255;
      // data[(c - 1) * 4 * canvas.width + (r + 2) * 4] = 255;
      // data[(c - 2) * 4 * canvas.width + (r + 1) * 4] = 255;
      // data[(c - 2) * 4 * canvas.width + (r + 2) * 4] = 255;

      if (whites > blacks) {
        max = 255;
      } else {
        max = 0;
      }

      // data[c * 4 * canvas.width + r * 4] = max;
      // data[c * 4 * canvas.width + (r * 4 + 1)] = max;
      // data[c * 4 * canvas.width + (r * 4 + 2)] = max;
    }
  }

  data = data;
}

function recoganizeText() {
  const scheduler = Tesseract.createScheduler();
  const worker1 = Tesseract.createWorker({
    logger: (m) => {
      console.log(
        Array(Math.round(m.progress * 100))
          .fill("*")
          .join("")
      );
    },
  });
  const worker2 = Tesseract.createWorker();
  const worker3 = Tesseract.createWorker();
  const worker4 = Tesseract.createWorker();
  const worker5 = Tesseract.createWorker();
  const worker6 = Tesseract.createWorker();
  const worker7 = Tesseract.createWorker();
  const worker8 = Tesseract.createWorker();
  const worker9 = Tesseract.createWorker();
  const worker10 = Tesseract.createWorker();
  const worker11 = Tesseract.createWorker();
  const worker12 = Tesseract.createWorker();

  (async () => {
    await worker1.load();
    await worker2.load();
    await worker3.load();
    await worker4.load();
    await worker5.load();
    await worker6.load();
    await worker7.load();
    await worker8.load();
    await worker9.load();
    await worker10.load();
    await worker11.load();
    await worker12.load();
    await worker1.loadLanguage("eng");
    await worker2.loadLanguage("eng");
    await worker3.loadLanguage("eng");
    await worker4.loadLanguage("eng");
    await worker5.loadLanguage("eng");
    await worker6.loadLanguage("eng");
    await worker7.loadLanguage("eng");
    await worker8.loadLanguage("eng");
    await worker9.loadLanguage("eng");
    await worker10.loadLanguage("eng");
    await worker11.loadLanguage("eng");
    await worker12.loadLanguage("eng");
    await worker1.initialize("eng");
    await worker2.initialize("eng");
    await worker3.initialize("eng");
    await worker4.initialize("eng");
    await worker5.initialize("eng");
    await worker6.initialize("eng");
    await worker7.initialize("eng");
    await worker8.initialize("eng");
    await worker9.initialize("eng");
    await worker10.initialize("eng");
    await worker11.initialize("eng");
    await worker12.initialize("eng");
    scheduler.addWorker(worker1);
    scheduler.addWorker(worker2);
    scheduler.addWorker(worker3);
    scheduler.addWorker(worker4);
    scheduler.addWorker(worker5);
    scheduler.addWorker(worker6);
    scheduler.addWorker(worker7);
    scheduler.addWorker(worker8);
    scheduler.addWorker(worker9);
    scheduler.addWorker(worker10);
    scheduler.addWorker(worker11);
    scheduler.addWorker(worker12);

    const results = await Promise.all(
      Array(1)
        .fill(0)
        .map(() => scheduler.addJob("recognize", canvas))
    ).then((e) => {
      resultData = e;
      const wordResults = e[0].data.words
        .filter(({ confidence }) => {
          return confidence > 60;
        })
        .map((word) => {
          const div = document.createElement("div");
          div.innerHTML = word.text;
          const { x0, x1, y0, y1 } = word.bbox;
          div.classList.add("word-element");
          Object.assign(div.style, {
            top: `${y0}px`,
            left: `${x0}px`,
            width: `${x1 - x0}px`,
            height: `${y1 - y0}px`,
            border: "1px solid black",
            position: "absolute",
            background: "white",
            fontSize: `${Math.round(y1 - y0)}px`,
          });
          document.body.appendChild(div);
        });
    });

    await scheduler.terminate();
  })();
}
