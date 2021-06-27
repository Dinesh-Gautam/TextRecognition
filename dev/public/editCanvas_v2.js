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
  editInputsParentElement: document.querySelector(".range-controllers"),

  open(clickCanvasId) {
    this.modalBox.classList.add("display");

    //assigning values to edit inputs
    this.assignEditValues(
      VALUES.editValues,
      this.editInputsParentElement,
      clickCanvasId
    );
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
  syncEditValues() {
    for (let key in VALUES.editValues.default) {
      const className = "." + key;
      // add event listener for change in input values
      document.querySelectorAll(className).forEach((input) => {
        //syncing input values on change.
        input.addEventListener("input", setInputValue);
      });
    }
    function setInputValue(event) {
      const { value, className } = event.target;
      document
        .querySelectorAll("." + className)
        .forEach((element) => (element.value = value));
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
      CANVAS_EDIT.open(this.clickCanvasId);

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
