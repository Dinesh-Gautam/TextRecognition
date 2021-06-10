function createCanvas() {
  const canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    image = createImage("images/ (2).jpg");

  image.addEventListener("load", () => {
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const blackAndWhiteThreshold = 2.8, // 1-10 //can be determined by ai
      edgeThreshold = 50; // 1 - 255

    console.time();
    thickenEdges(imageData.data, canvas, edgeThreshold);
    mkImgBlackAndWhite(imageData.data, blackAndWhiteThreshold);
    enhanceText(imageData.data, canvas);

    ctx.putImageData(imageData, 0, 0);
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
      [
        data[c * 4 * canvas.width + (r + 1) * 4],
        data[c * 4 * canvas.width + (r + 2) * 4],
        data[(c + 1) * 4 * canvas.width + r * 4],
        data[(c + 2) * 4 * canvas.width + r * 4],
        data[(c + 1) * 4 * canvas.width + (r + 1) * 4],
        data[(c + 1) * 4 * canvas.width + (r + 2) * 4],
        data[(c + 2) * 4 * canvas.width + (r + 1) * 4],
        data[(c + 2) * 4 * canvas.width + (r + 2) * 4],
      ].forEach((e) => {
        if (e < 100) {
          blacks++;
        } else {
          whites++;
        }
      });

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

function init() {
  createCanvas();
}

init();
