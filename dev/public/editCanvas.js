const canvasEdit = document.querySelector(".canvas-edit");

let clickCanvasId = null;

const thresholdValue = document.querySelectorAll(".thresholdValue");
const changedEditValues = {};
const EDIT_VALUES = {
  threshold: {
    for: ".thresholdValue",
    min: 0.1,
    max: 10,
    step: 0.1,
    value: blackAndWhiteThreshold,
  },
};

let cropper;

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.nodeName === "CANVAS") {
    canvasEdit.classList.add("display");
    const ctx = target.getContext("2d");
    const imageData = ctx.getImageData(0, 0, target.width, target.height);
    const cloneCanvas = document.querySelector(".canvas-container canvas");

    const cloneCtx = cloneCanvas.getContext("2d");
    cloneCanvas.height = imageData.height;
    cloneCanvas.width = imageData.width;
    cloneCtx.putImageData(imageData, 0, 0);
    cropper = new Cropper(cloneCanvas, {
      aspectRatio: 16 / 9,
      crop(event) {
        console.log(event.detail.x);
        console.log(event.detail.y);
        console.log(event.detail.width);
        console.log(event.detail.height);
        console.log(event.detail.rotate);
        console.log(event.detail.scaleX);
        console.log(event.detail.scaleY);
      },
    });

    clickCanvasId = target.id;

    const values = changedEditValues[clickCanvasId] || EDIT_VALUES.threshold;

    assignEditValues(thresholdValue, values);
  }
});

///////////////----values Definer----////////////////

assignEditValues(thresholdValue, EDIT_VALUES.threshold);
addEventListenerToInputs(thresholdValue);

function createInput(inputType) {
  const form = document.createElement("form");
  const label = document.createElement("label");
  let input = [];
  if (inputType === "range") {
    input.push(document.createElement("input"));
    input.push(document.createElement("input"));
  }
  input.forEach((inputElement) => {
    form.appendChild(inputElement);
  });
  form.appendChild(label);

  console.log(form);
}

function addEventListenerToInputs(input) {
  input.forEach((e) => {
    e.addEventListener("change", (event) => {
      const changedValue = event.target.value;
      input.forEach((element) => {
        element.value = changedValue;
      });

      changeCanvasImageData(Number(changedValue), clickCanvasId);
    });
  });
}

function assignEditValues(input, ObjValue) {
  input.forEach((e) => {
    //assigning  values
    Object.assign(e, ObjValue);
  });
}

function changeCanvasImageData(changeValue, imageSrc) {
  const canvas = document.querySelector(".canvas-container canvas");
  const ctx = canvas.getContext("2d");
  const originalImage = createImage(imageSrc);

  originalImage.addEventListener("load", () => {
    ctx.drawImage(originalImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    mkImgBlackAndWhite(imageData.data, changeValue);

    ctx.putImageData(imageData, 0, 0);
  });
}

function saveEdit() {
  const cloneCanvas = document.querySelector(".canvas-container canvas");
  const ctx = cloneCanvas.getContext("2d");
  const imageData = ctx.getImageData(
    0,
    0,
    cloneCanvas.width,
    cloneCanvas.height
  );

  document
    .getElementById(clickCanvasId)
    .getContext("2d")
    .putImageData(imageData, 0, 0);

  canvasEdit.classList.remove("display");

  const thresholdValueEdit = document.querySelectorAll(".thresholdValue");
  thresholdValueEdit.forEach((e) => {
    const className = e.className;
    Object.assign(changedEditValues, {
      [clickCanvasId]: {
        for: className,
        value: e.value,
      },
    });
  });
  resetEdit();
}

function cancelEdit() {
  canvasEdit.classList.remove("display");

  resetEdit();
}

function resetEdit() {
  if (changedEditValues[clickCanvasId]) {
    for (let key in changedEditValues) {
      const className = changedEditValues[key].for;
      document.querySelectorAll(className).forEach((e) => {
        Object.assign(e, { value: changedEditValues.value });
      });
    }
  } else {
    for (let key in EDIT_VALUES) {
      const className = EDIT_VALUES[key].for;
      document.querySelectorAll(className).forEach((e) => {
        Object.assign(e, EDIT_VALUES[key]);
      });
    }
  }
}

function resetEditAllValues() {
  for (let key in EDIT_VALUES) {
    const className = EDIT_VALUES[key].for;
    document.querySelectorAll(className).forEach((e) => {
      Object.assign(e, EDIT_VALUES[key]);
    });
  }
  changeCanvasImageData(Number(EDIT_VALUES.threshold.value), clickCanvasId);
}
