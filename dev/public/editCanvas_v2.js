function copyOriginalCanvasToCloneCanvas(cloneCanvas, originalCanvas) {
  const ctx = cloneCanvas.getContext("2d");
  const imageData = ctx.getImageData(
    0,
    0,
    cloneCanvas.width,
    cloneCanvas.height
  );

  originalCanvas.height = cloneCanvas.height;
  originalCanvas.width = cloneCanvas.width;
  originalCanvas.getContext("2d").putImageData(imageData, 0, 0);
}

function changeCanvasEditImageData(
  editCanvas,
  changeValue,
  originalImageSrc,
  VALUES = {}
) {
  const canvas = editCanvas;
  const ctx = canvas.getContext("2d");
  const originalImage = createImage(originalImageSrc);

  originalImage.addEventListener("load", () => {
    const currentImageCroppedValues = VALUES?.cropValues?.data[clickCanvasId];

    if (currentImageCroppedValues) {
      ctx.drawImage(
        originalImage,
        -currentImageCroppedValues.x,
        -currentImageCroppedValues.y
      );
    } else {
      canvas.height = originalImage.height;
      canvas.width = originalImage.width;
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImage, 0, 0);
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    mkImgBlackAndWhite(imageData.data, changeValue);

    ctx.putImageData(imageData, 0, 0);
  });
}

function hideAndShowBtn(showBtn, hideBtn) {
  document.querySelectorAll(showBtn).forEach((element) => {
    element.style.display = "initial";
  });
  document.querySelectorAll(hideBtn).forEach((element) => {
    element.style.display = "none";
  });
}

let clickCanvasId = null,
  cropper = null;

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
  cropValues: {
    data: {},
    saved: {},
  },
};

const CANVAS_EDIT = {
  //selectors
  modalBox: ".canvas-edit",
  editCanvas: ".canvas-container canvas",
  editInputsParentElement: ".range-controllers",
  // features
  cropInstance: false,
  open() {
    document.querySelector(this.modalBox).classList.add("display");

    //assigning values to edit inputs
    this.assignEditValues(
      VALUES.editValues,
      document.querySelector(this.editInputsParentElement)
    );
  },
  close() {
    document.querySelector(this.modalBox).classList.remove("display");
  },
  save() {
    VALUES.cropValues.saved[clickCanvasId] =
      VALUES.cropValues.data[clickCanvasId];

    copyOriginalCanvasToCloneCanvas(
      document.querySelector(this.editCanvas),
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
    this.assignEditValues(
      VALUES.editValues,
      document.querySelector(this.editInputsParentElement)
    );

    VALUES.cropValues.data[clickCanvasId] =
      VALUES.cropValues.saved[clickCanvasId];

    copyOriginalCanvasToCloneCanvas(
      document.getElementById(clickCanvasId),
      document.querySelector(this.editCanvas)
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
        clickCanvasId,
        VALUES
      );
    }
  },
  makeCropper() {
    cropper = new Cropper(document.querySelector(this.editCanvas), {
      viewMode: 1,
      background: false,
      autoCrop: false,
    });
    this.cropInstanceCreated();
  },
  cropInstanceCreated() {
    this.cropInstance = true;
    hideAndShowBtn(
      ".cropper-btn button:not(.cropper-maker-btn)",
      ".cropper-maker-btn , .edit-btn , .thresholdContainer"
    );
  },
  cropInstanceDestroyed() {
    this.cropInstance = false;
    hideAndShowBtn(
      ".cropper-maker-btn , .edit-btn , .thresholdContainer",
      ".cropper-btn button:not(.cropper-maker-btn)"
    );
  },
  destroyCropper() {
    this.cropInstanceDestroyed();
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
    if (VALUES.cropValues.data[clickCanvasId]) {
      VALUES.cropValues.data[clickCanvasId].x += cropper?.getData().x;
      VALUES.cropValues.data[clickCanvasId].y += cropper?.getData().y;
    } else {
      VALUES.cropValues.data[clickCanvasId] = cropper?.getData();
    }

    this.destroyCropper();

    document.querySelector(".canvas-container").innerHTML = "";

    const div = document.createElement("div");
    div.appendChild(croppedData);
    document.querySelector(".canvas-container").appendChild(div);
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
      copyOriginalCanvasToCloneCanvas(
        target,
        document.querySelector(CANVAS_EDIT.editCanvas)
      );
    }
  },
};

CANVAS.parentElement.addEventListener("click", CANVAS.onClick);

function init() {
  CANVAS_EDIT.syncEditValues();
}

init();

////////////////-------------------///////////////////
const canvasSelections = [];

class Selection {
  constructor(canvasElement, cropperOptions) {
    this.cropper = new Cropper(canvasElement, cropperOptions);
    this.selected = false;
  }
  show() {}
  hide() {}
  getSelectionData() {}
}

function addSelection() {
  canvasSelections.push(
    new Selection(document.querySelector(".canvas-container canvas"), {
      viewMode: 1,
      autoCrop: false,
      movable: false,
      rotatable: false,
      scalable: false,
      zoomable: false,
    })
  );
}
