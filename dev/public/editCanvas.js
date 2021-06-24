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

const CROPPER_VALUES = {};
const SAVED_CROPPER_VALUES = {};

let cropper;

document.querySelector(".root").addEventListener("click", (event) => {
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

    const values = changedEditValues[clickCanvasId] || EDIT_VALUES.threshold;

    assignEditValues(thresholdValue, values);
  }
});

const CROPPER = {
  instance: false,
  makeCropper() {
    cropper = new Cropper(document.querySelector(".canvas-container canvas"), {
      viewMode: 1,
      background: false,
      autoCrop: false,
    });
    this.instanceCreated();
  },
  instanceCreated() {
    this.instance = true;
    hideOrShowBtn(true, [".cropper-btn button:not(.cropper-maker-btn)"]);
    hideOrShowBtn(
      false,
      ".cropper-maker-btn , .edit-btn , .thresholdContainer"
    );
  },
  instanceDestroyed() {
    this.instance = false;
    hideOrShowBtn(false, [".cropper-btn button:not(.cropper-maker-btn)"]);
    hideOrShowBtn(true, ".cropper-maker-btn , .edit-btn , .thresholdContainer");
  },
  destroyCropper() {
    cropper?.destroy();
  },
  resetCropper() {
    cropper?.reset();
  },
  clearCropper() {
    cropper?.clear();
  },
  crop() {
    const croppedData = cropper?.getCroppedCanvas();

    if (CROPPER_VALUES[clickCanvasId]) {
      CROPPER_VALUES[clickCanvasId].x += cropper?.getData().x;
      CROPPER_VALUES[clickCanvasId].y += cropper?.getData().y;
    } else {
      CROPPER_VALUES[clickCanvasId] = cropper?.getData();
    }

    this.instanceDestroyed();

    document.querySelector(".canvas-container").innerHTML = "";

    const div = document.createElement("div");
    div.appendChild(croppedData);
    document.querySelector(".canvas-container").appendChild(div);
  },
};

function hideOrShowBtn(show, buttons) {
  if (typeof buttons === "object") {
    buttons.forEach((e) => hideOrShowBtn(show, e));
  } else {
    if (!show) {
      document
        .querySelectorAll(buttons)
        .forEach((e) => (e.style.display = "none"));
    } else {
      document
        .querySelectorAll(buttons)
        .forEach((e) => (e.style.display = "initial"));
    }
  }
}

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
    const currentImageCroppedValues = CROPPER_VALUES[clickCanvasId];

    if (currentImageCroppedValues) {
      ctx.drawImage(
        originalImage,
        -currentImageCroppedValues.x,
        -currentImageCroppedValues.y
      );
    } else {
      canvas.height = originalImage.height;
      canvas.width = originalImage.width;
      ctx.drawImage(originalImage, 0, 0);
    }
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

  const originalCanvas = document.getElementById(clickCanvasId);

  originalCanvas.height = cloneCanvas.height;
  originalCanvas.width = cloneCanvas.width;
  originalCanvas.getContext("2d").putImageData(imageData, 0, 0);

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

  SAVED_CROPPER_VALUES[clickCanvasId] = CROPPER_VALUES[clickCanvasId];

  resetEdit();
}

function cancelEdit() {
  canvasEdit.classList.remove("display");
  cropper?.destroy();
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

  CROPPER_VALUES[clickCanvasId] = SAVED_CROPPER_VALUES[clickCanvasId];

  const originalCanvas = document.getElementById(clickCanvasId);
  const ctx = originalCanvas.getContext("2d");
  const imageData = ctx.getImageData(
    0,
    0,
    originalCanvas.width,
    originalCanvas.height
  );

  const cloneCanvas = document.querySelector(".canvas-container canvas");

  cloneCanvas.height = originalCanvas.height;
  cloneCanvas.width = originalCanvas.width;
  cloneCanvas.getContext("2d").putImageData(imageData, 0, 0);
}
