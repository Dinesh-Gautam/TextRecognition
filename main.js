const images = [];

for (let i = 1; i < 4; i++) {
  const image = new Image();
  const imageSrc = `images/ (${i}).jpg`;
  image.src = imageSrc;
  image.id = i - 1;

  images.push(image);
}

images.forEach((img) => {
  document.body.appendChild(img);
});

const worker = Tesseract.createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text },
  } = await worker.recognize(images[0]);
  console.log(text);
  await worker.terminate();
})();
