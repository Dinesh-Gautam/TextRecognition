const canvasEdit = document.querySelector(".canvas-edit");

let clickCanvasId = null;

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
    clickCanvasId = target.id;
  }
});

document.querySelector(".edit-btn .cancel").addEventListener("click", () => {
  cancelEdit();
});

///////////////----values Definer----////////////////

const EDIT_VALUES = {
  threshold: {
    min: 0.1,
    max: 10,
    step: 0.1,
    value: 2,
  },
};

//value assigner
const thresholdValue = document.querySelectorAll(".thresholdValue");

assignDefaultAndChangedValue(thresholdValue, EDIT_VALUES.threshold);

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

function assignDefaultAndChangedValue(input, ObjValue) {
  input.forEach((e) => {
    //assigning default values
    Object.assign(e, ObjValue);

    e.addEventListener("change", (event) => {
      const changedValue = event.target.value;
      input.forEach((element) => {
        element.value = changedValue;
      });
      console.log(Number(changedValue));
      changeCanvasImageData(Number(changedValue), clickCanvasId);
    });
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

  cancelEdit();
}

function cancelEdit() {
  canvasEdit.classList.remove("display");
}
