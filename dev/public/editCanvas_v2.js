function copyOriginalCanvasToCloneCanvas(targetCanvas, cloneCanvas) {
  const ctx = targetCanvas.getContext("2d");
  const imageData = ctx.getImageData(
    0,
    0,
    targetCanvas.width,
    targetCanvas.height
  );

  const cloneCtx = cloneCanvas.getContext("2d");
  cloneCanvas.height = imageData.height;
  cloneCanvas.width = imageData.width;
  cloneCtx.putImageData(imageData, 0, 0);
}

function changeCanvasEditImageData(editCanvas, changeValue, originalImageSrc) {
  const canvas = editCanvas;
  const ctx = canvas.getContext("2d");
  const originalImage = createImage(originalImageSrc);

  originalImage.addEventListener("load", () => {
    const currentImageCroppedValues = false && CROPPER_VALUES[clickCanvasId];

    if (currentImageCroppedValues) {
      // ctx.drawImage(
      //   originalImage,
      //   -currentImageCroppedValues.x,
      //   -currentImageCroppedValues.y
      // );
    } else {
      canvas.height = originalImage.height;
      canvas.width = originalImage.width;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImage, 0, 0);
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    mkImgBlackAndWhite(imageData.data, changeValue);

    ctx.putImageData(imageData, 0, 0);
  });
}

let clickCanvasId = null;

const VALUES = {
  editValues: {
    default: {
      thresholdValue: {
        min: 0.1,
        max: 10,
        step: 0.1,
        value: blackAndWhiteThreshold,
      },
    },
    saved: {},
  },
  cropValues: {},
};

const CANVAS_EDIT = {
  //selectors
  modalBox: document.querySelector(".canvas-edit"),
  editCanvas: document.querySelector(".canvas-container canvas"),
  editInputsParentElement: document.querySelector(".range-controllers"),

  open() {
    this.modalBox.classList.add("display");

    //assigning values to edit inputs
    this.assignEditValues(VALUES.editValues, this.editInputsParentElement);
  },
  close() {
    this.modalBox.classList.remove("display");
  },
  save() {
    copyOriginalCanvasToCloneCanvas(
      this.editCanvas,
      document.getElementById(clickCanvasId)
    );
    Object.keys(VALUES.editValues.default).forEach((inputClass) => {
      const className = "." + inputClass;
      const inputValue = document.querySelector("input" + className).value;
      VALUES.editValues.saved[clickCanvasId] = {};
      Object.assign(VALUES.editValues.saved[clickCanvasId], {
        [inputClass]: {
          value: inputValue,
        },
      });
    });
    this.close();
  },
  reset() {
    this.assignEditValues(VALUES.editValues, this.editInputsParentElement);
    copyOriginalCanvasToCloneCanvas(
      document.getElementById(clickCanvasId),
      CANVAS_EDIT.editCanvas
    );
  },
  assignEditValues(values, inputParent) {
    const defaultValues = values.default;
    const savedEditValues = values.saved[clickCanvasId];

    assignValue(defaultValues);
    assignValue(savedEditValues);

    function assignValue(values) {
      for (let key in values) {
        const value = values[key];
        const className = "." + key;

        const targetInput = inputParent.querySelectorAll(className);

        targetInput.forEach((input) => {
          Object.assign(input, value);
        });
      }
    }
  },
  syncEditValues() {
    for (let key in VALUES.editValues.default) {
      const className = "." + key;
      // add event listener for change in input values
      document.querySelectorAll(className).forEach((input) => {
        //syncing input values on change.
        input.addEventListener("change", setInputValue);
      });
    }
    function setInputValue(event) {
      const { value, className } = event.target;
      document
        .querySelectorAll("." + className)
        .forEach((element) => (element.value = value));

      //changing edit canvas data with changed input values
      changeCanvasEditImageData(
        document.querySelector(".canvas-container canvas"),
        Number(value),
        clickCanvasId
      );
    }
  },
};

const CANVAS = {
  parentElement: document.querySelector(".root"),

  onClick(event) {
    const target = event.target;

    if (target.nodeName === "CANVAS") {
      //changing canvas id
      clickCanvasId = target.id;

      //open canvas edit modal
      CANVAS_EDIT.open();

      //copying original canvas image data to clone canvas
      copyOriginalCanvasToCloneCanvas(target, CANVAS_EDIT.editCanvas);
    }
  },
};

CANVAS.parentElement.addEventListener("click", CANVAS.onClick);

function init() {
  CANVAS_EDIT.syncEditValues();
}

init();
