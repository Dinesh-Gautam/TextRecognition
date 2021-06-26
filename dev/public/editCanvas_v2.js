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

const CANVAS_EDIT = {
  modalBox: document.querySelector(".canvas-edit"),
  editCanvas: document.querySelector(".canvas-container canvas"),
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
      CANVAS_EDIT.modalBox.classList.add("display");

      //copying original canvas image data to clone canvas
      copyOriginalCanvasToCloneCanvas(target, CANVAS_EDIT.editCanvas);

      //checking for saved values in memory
      //   const values = changedEditValues[clickCanvasId] || EDIT_VALUES.threshold;

      //   assignEditValues(thresholdValue, values);
    }
  },
};

CANVAS.parentElement.addEventListener("click", CANVAS.onClick);
