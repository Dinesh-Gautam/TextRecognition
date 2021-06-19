const canvasEdit = document.querySelector(".canvas-edit");

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.nodeName === "CANVAS") {
    canvasEdit.classList.add("display");
    const ctx = target.getContext("2d");
    const imageData = ctx.getImageData(0, 0, target.width, target.height);
    const cloneCanvas = document.querySelector(".canvas-container canvas");
    const cloneCtx = cloneCanvas.getContext("2d");
    console.log(imageData);
    cloneCanvas.height = imageData.height;
    cloneCanvas.width = imageData.width;
    cloneCtx.putImageData(imageData, 0, 0);
  }
});

document.querySelector(".edit-btn .cancel").addEventListener("click", () => {
  canvasEdit.classList.remove("display");
});
