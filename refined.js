const blackAndWhiteThreshold = 2.8, // 1-10 //can be determined by ai
  edgeThreshold = 50; // 1 - 255

let originalImageData = [];
const canvas = document.createElement("canvas"),
  canvas2 = document.createElement("canvas"),
  ctx = canvas.getContext("2d"),
  ctx2 = canvas.getContext("2d");

function createCanvas() {
  const ctx = canvas.getContext("2d"),
    ctx2 = canvas.getContext("2d"),
    image = createImage("images/ (1).jpg");

  image.addEventListener("load", () => {
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage(image, 0, 0);

    canvas2.height = image.height;
    canvas2.width = image.width;
    ctx2.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    originalImageData = ctx2.getImageData(0, 0, canvas.width, canvas.height);

    console.time();

    //----filters------

    mkImgBlackAndWhite(imageData.data, blackAndWhiteThreshold);
    // enhanceText(imageData.data, canvas);
    // thickenEdges(imageData.data, canvas, edgeThreshold);

    ///-----------------

    ctx.putImageData(imageData, 0, 0);

    recognizeText(canvas);

    console.timeEnd();
    document.body.appendChild(canvas);
  });
}

function enhanceText(data, canvas) {
  for (let c = 0; c < canvas.height; c++) {
    for (let r = 0; r < canvas.width; r++) {
      let blacks = 0,
        whites = 0,
        max = 0;
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

      for (let i = 0; i < surrounding.length; i++) {
        if (surrounding[i] < 100) {
          blacks++;
        } else {
          whites++;
        }
      }

      if (whites > blacks) {
        max = 255;
      } else {
        max = 0;
      }

      data[c * 4 * canvas.width + r * 4] = max;
      data[c * 4 * canvas.width + (r * 4 + 1)] = max;
      data[c * 4 * canvas.width + (r * 4 + 2)] = max;
    }
  }
}

function thickenEdges(data, canvas, edgeThreshold) {
  let minAverage;

  for (let c = 0; c < canvas.height; c++) {
    for (let r = 0; r < canvas.width; r++) {
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

      for (let i = 0; i < surrounding.length; i++) {
        surroundingAvg += surrounding[i];
        surrounding[i] < min ? (min = surrounding[i]) : null;
        surrounding[i] > max ? (max = surrounding[i]) : null;
      }

      surroundingAvg /= surrounding.length;

      const diff = max - min;

      if (diff > edgeThreshold) {
        // it is the edge

        data[c * 4 * canvas.width + r * 4] = 0;
        data[c * 4 * canvas.width + (r * 4 + 1)] = 0;
        data[c * 4 * canvas.width + (r * 4 + 2)] = 0;
        if (surroundingAvg < minAverage) {
          minAverage = surroundingAvg;
        }
      }
    }
  }
}

function mkImgBlackAndWhite(data, threshold) {
  let difference = 0;
  for (let r = 0; r < data.length; r += 4) {
    const R = data[r];
    const G = data[r + 1];
    const B = data[r + 2];
    const total = R + G + B;
    const average = total / 3;
    if (average > difference) {
      difference = average;
    }
  }
  for (let r = 0; r < data.length; r += 4) {
    const R = data[r];
    const G = data[r + 1];
    const B = data[r + 2];
    const total = R + G + B;
    const average = total / threshold;

    if (average > difference) {
      pixel(255);
    } else {
      if (average < difference / 2) {
        pixel(0);
      } else {
        pixel(255);
      }
    }

    function pixel(value) {
      data[r] = value;
      data[r + 1] = value;
      data[r + 2] = value;
    }
  }
}

function createImage(imgSrc) {
  const img = new Image();
  img.src = imgSrc;
  return img;
}

function recognizeText(canvas) {
  let heightBox = 0,
    widthBox = 0;

  let errorRecognizingText = [];

  const div = document.createElement("div");
  Object.assign(div.style, {
    position: "absolute",
    top: 0,
    left: 0,
    height: "4px",
    background: "red",
    width: "0px",
    zIndex: 100,
  });
  document.body.appendChild(div);
  const scheduler = Tesseract.createScheduler();
  const worker1 = Tesseract.createWorker({
    logger: (m) => {
      const progress = Math.round(m.progress * 100);
      div.style.width = progress + "%";
      if (progress > 99) {
        div.style.display = "none";
      } else [(div.style.display = "initial")];
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

    await Promise.all(
      Array(1)
        .fill(10)
        .map(() => scheduler.addJob("recognize", canvas))
    ).then((e) => {
      resultData = e;
      e[0].data.words
        .filter((e) => {
          if (e.confidence < 60) {
            const div = document.createElement("div");
            const { x0, x1, y0, y1 } = e.bbox;
            div.classList.add("word-element");
            Object.assign(div.style, {
              top: `${y0}px`,
              left: `${x0}px`,
              width: `${x1 - x0}px`,
              height: `${y1 - y0}px`,
              border: "1px solid red",
              position: "absolute",
              fontSize: `${Math.round(y1 - y0)}px`,
            });
            document.body.appendChild(div);

            const errorImageData = ctx2.getImageData(x0, y0, x1 - x0, y1 - y0);
            thickenEdges(
              errorImageData.data,
              {
                height: y1 - y0,
                width: x1 - x0,
              },
              edgeThreshold
            );
            enhanceText(errorImageData.data, {
              height: y1 - y0,
              width: x1 - x0,
            });

            ctx.putImageData(errorImageData, x0, y0);

            errorRecognizingText.push({
              left: x0,
              top: y0,
              width: x1 - x0,
              height: y1 - y0,
            });
          }

          return e.confidence > 60;
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

          if (x1 > widthBox) {
            widthBox = x1;
          }
          if (y1 > heightBox) {
            heightBox = y1;
          }
          document.body.appendChild(div);
        });

      // console.log(errorRecognizingText);

      const wordsDiv = document.createElement("div");
      wordsDiv.classList.add("words-container");
      Object.assign(wordsDiv.style, {
        top: `${0}px`,
        left: `${0}px`,
        width: `${widthBox}px`,
        height: `${heightBox}px`,
        border: "20px solid red",
        position: "absolute",
        zIndex: 1000,
      });
      // document.body.appendChild(wordsDiv);
    });

    // await Promise.all(
    //   errorRecognizingText.map((rectangle) =>
    //     // (rectangle) => console.log(rectangle)
    //     scheduler.addJob("recognize", canvas, { rectangle })
    //   )
    // );

    await scheduler.terminate();
    // await recognizeText(canvas);
  })();
}

function init() {
  createCanvas();
}

init();
