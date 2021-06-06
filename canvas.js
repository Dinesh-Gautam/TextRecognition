const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

const threshold = 2.8;

let resultData = null;

const image = new Image();
// image.src = "images/ (2).jpg";

image.src = "images/randomBook.jpg";

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
  for (let r = 0; r < data.length; r += 4) {
    const R = data[r];
    const G = data[r + 1];
    const B = data[r + 2];

    const total = R + G + B;

    const average = total / threshold;

    if (average > difference) {
      data[r] = 255;
      data[r + 1] = 255;
      data[r + 2] = 255;
    } else {
      if (average < difference / 2) {
        data[r] = 0;
        data[r + 1] = 0;
        data[r + 2] = 0;
      } else {
        data[r] = 255;
        data[r + 1] = 255;
        data[r + 2] = 255;
      }
    }
    //   const A = data[i][r + 3];
  }
  console.log(difference);
  imageData.data = data;

  ctx.putImageData(imageData, 0, 0);

  recoganizeText();
});

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
          return true;
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
