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
  modalBox: document.querySelector(".canvas-edit"),
  editCanvas: document.querySelector(".canvas-container canvas"),

  open() {
    this.modalBox.classList.add("display");
  },
  assignEditValues(values, inputParent, clickCanvasId) {
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
};

const CANVAS = {
  clickCanvasId: null,
  parentElement: document.querySelector(".root"),

  onClick(event) {
    const target = event.target;

    if (target.nodeName === "CANVAS") {
      //changing canvas id
      this.clickCanvasId = target.id;

      //open canvas edit modal
      CANVAS_EDIT.open();

      //copying original canvas image data to clone canvas
      copyOriginalCanvasToCloneCanvas(target, CANVAS_EDIT.editCanvas);

      //assigning values to edit inputs
      const editValues = VALUES.editValues;
      const inputsParentElement = document.querySelector(".range-controllers");

      CANVAS_EDIT.assignEditValues(
        editValues,
        inputsParentElement,
        this.clickCanvasId
      );
    }
  },
};

CANVAS.parentElement.addEventListener("click", CANVAS.onClick);
