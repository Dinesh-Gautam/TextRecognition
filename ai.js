const canvas = document.getElementById("can");
const canvas2 = document.getElementById("can2");
const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");

const threshold = 2.8;

let resultData = null;

const image = new Image();
image.src = "images/ (1).jpg";

// image.src = "images/text.jpg";

const inputArr = [],
  outputArr = [];

image.addEventListener("load", () => {
  canvas.height = image.height;
  canvas.width = image.width;

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  for (let r = 0; r < data.length; r += 4) {
    const R = data[r];
    const G = data[r + 1];
    const B = data[r + 2];

    const total = R + G + B;

    const average = total / 3;

    if ((r / 4) % 82800 === 0) {
      inputArr.push(Math.round(average));
    }
  }
  createCompressedImage();

  imageData.data = data;
  ctx.putImageData(imageData, 0, 0);
});

// function createCompressedImage() {
//   canvas2.height = canvas.height;
//   canvas2.width = canvas.width;
//   ctx.drawImage(image, 0, 0);
//   const imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
//   const data = imageData.data;

//   for (let i = 0; i < data.length; i += 4) {
//     data[i] = singlePixelArr[i / 4];
//     data[i + 1] = singlePixelArr[i / 4];
//     data[i + 2] = singlePixelArr[i / 4];
//     data[i + 3] = 255;
//   }

//   imageData.data = data;
//   ctx2.putImageData(imageData, 0, 0);
// }

function createCompressedImage() {
  const image2 = new Image();
  image2.src = "images/aitraining/aitraining.png";

  // image.src = "images/text.jpg";

  const singlePixelArr = [];

  image2.addEventListener("load", () => {
    canvas2.height = image2.height;
    canvas2.width = image2.width;

    ctx2.drawImage(image2, 0, 0);

    const imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

    const data = imageData.data;

    for (let r = 0; r < data.length; r += 4) {
      const R = data[r];
      const G = data[r + 1];
      const B = data[r + 2];

      const total = R + G + B;

      const average = total / 3;

      if ((r / 4) % 8280 === 0) {
        outputArr.push(Math.round(average));
      }
    }
    console.log(inputArr.length);
    console.log(outputArr.length);

    const trainingData = [
      {
        input: inputArr,
        output: outputArr,
      },
    ];

    const b = new brain.NeuralNetwork();

    b.train(trainingData);

    const result = b.run(inputArr);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(result[i / 4] * 255);
      data[i + 1] = Math.round(result[i / 4] * 255);
      data[i + 2] = Math.round(result[i / 4] * 255);
      data[i + 3] = 255;
    }

    console.log(result);

    imageData.data = data;
    ctx2.putImageData(imageData, 0, 0);
  });
}
