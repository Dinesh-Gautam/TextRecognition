const blackAndWhiteThreshold = 2.8, // 1-10 //can be determined by ai
  edgeThreshold = 50; // 1 - 255

const scheduler = Tesseract.createScheduler();
//-------------------

const recoBtn = document.querySelector(".reco-btn");

recoBtn.addEventListener("click", (event) => recognizeText(scheduler, 0));

function createCanvas(imgSrc) {
  const canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    image = createImage(imgSrc);

  image.addEventListener("load", () => {
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //----filters------

    mkImgBlackAndWhite(imageData.data, blackAndWhiteThreshold);
    // enhanceText(imageData.data, canvas);
    // thickenEdges(imageData.data, canvas, edgeThreshold);

    ///-----------------

    ctx.putImageData(imageData, 0, 0);

    const div = document.createElement("div");
    div.id = imgSrc;

    const span = document.createElement("span");
    span.innerText = document.querySelectorAll(".root canvas").length + 1;
    div.appendChild(canvas);
    div.appendChild(span);
    document.querySelector(".root").appendChild(div);
  });
}

//-------------------
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

//----------------------------------------------------------
function mkImgBlackAndWhite(data, threshold) {
  console.log("Making image black and white!");
  console.time();

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
  console.timeEnd();
}

function createImage(imgSrc) {
  const img = new Image();
  img.src = imgSrc;
  return img;
}

function initTessrect() {
  const div = document.createElement("div");
  Object.assign(div.style, {
    position: "fixed",
    bottom: 0,
    left: 0,
    height: "0.4vh",
    background: "rgba(242, 5, 25 , 0.8)",
    width: "0px",
    zIndex: 1000,
  });
  document.body.appendChild(div);

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
  })().then(() => {
    console.log("worker loaded...");
    recoBtn.disabled = false;
  });
}

function recognizeText(scheduler, index) {
  recoBtn.disabled = true;
  if (index < document.querySelectorAll(".root div").length) {
    const continues = Math.min(
      Number(document.querySelector("#continuesImages").value),
      document.querySelectorAll(".root div").length,
      document.querySelectorAll(" .root div").length - index
    );
    const ImagesArr = [];
    const recoImages = [];
    for (let i = 0; i < continues; i++) {
      console.log("recognizing Text of Image No. :" + (index + 1 + i));
      const element = document.querySelectorAll(".root canvas")[i];

      element.parentElement.style.borderColor = "rgba(242, 5, 25 , 0.5)";
      recoImages.push(element);

      ImagesArr.push(scheduler.addJob("recognize", element));
    }
    Promise.all(ImagesArr).then((eArr) => {
      recoImages.forEach((e) => {
        e.parentElement.style.borderColor = "rgba(5, 245, 25 , 0.5)";
        e.remove();
      });
      eArr.forEach((e, index) => {
        // const { blocks, lines, confidence, hocr, paragraphs, text, words } =
        //   e.data;

        // const deStructuredData = {
        //   confidence,
        //   text,
        //   imgSrc: recoImages[index].id,
        // };
        // console.log(e);
        // postImagesTextData(deStructuredData);

        const deStructuredData = deStructure(e.data, {
          imgSrc: recoImages[index].id,
        });
        postImagesTextData(deStructuredData);
      });
      recognizeText(scheduler, (index += continues));
    });
  } else {
    console.log("terminating scheduler");
    allTextRecognized();
    scheduler.terminate();

    alert("Text Data is Saved.");
  }
}
function deStructure(data, attachedData) {
  const newObj = {
    paragraphs: data.paragraphs.map((paragraph) => paragraph.text),
  };

  Object.assign(newObj, attachedData);
  return newObj;
}

function postImagesTextData(data) {
  fetch("/preText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function allTextRecognized() {
  // fetch("/text", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(allImagesTextData),
  // });

  fetch("/finalPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  document.querySelector(".btns").style.display = "none";
  // recoBtn.disabled = false;
}

function fetchImages() {
  fetch("/images", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((res) => {
      res.forEach((img) => {
        createCanvas("/images/" + img);
      });
    });
}

function init() {
  fetchImages();
  initTessrect();
}

init();

/////////////
