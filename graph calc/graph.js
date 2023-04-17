const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isDragging = false;
let lastX, lastY;

canvas.addEventListener("mousedown", e => {
  isDragging = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mousemove", e => {
  if (isDragging) {
    const dx = e.offsetX - lastX;
    const dy = e.offsetY - lastY;
    lastX = e.offsetX;
    lastY = e.offsetY;
    const xmin = Number(document.getElementById("xmin").value);
    const xmax = Number(document.getElementById("xmax").value);
    const ymin = Number(document.getElementById("ymin").value);
    const ymax = Number(document.getElementById("ymax").value);
    document.getElementById("xmin").value = xmin - dx * (xmax - xmin) / canvas.width;
    document.getElementById("xmax").value = xmax - dx * (xmax - xmin) / canvas.width;
    document.getElementById("ymin").value = ymin + dy * (ymax - ymin) / canvas.height;
    document.getElementById("ymax").value = ymax + dy * (ymax - ymin) / canvas.height;
    draw();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

function draw() {
  const xmin = Number(document.getElementById("xmin").value);
  const xmax = Number(document.getElementById("xmax").value);
  const ymin = Number(document.getElementById("ymin").value);
  const ymax = Number(document.getElementById("ymax").value);

  const xRange = xmax - xmin;
  const yRange = ymax - ymin;
  const xStep = xRange / canvas.width;
  const yStep = yRange / canvas.height;

  const fn = document.getElementById("fn").value;
  const expr = math.compile(fn);

  const showXAxis = document.getElementById("showXAxis").checked;
  const showYAxis = document.getElementById("showYAxis").checked;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  if (showXAxis && (ymin <= 0 && ymax >= 0)) {
    const yZero = canvas.height * ymax / yRange;
    ctx.moveTo(0, yZero);
    ctx.lineTo(canvas.width, yZero);
  }

  if (showYAxis && (xmin <= 0 && xmax >= 0)) {
    const xZero = canvas.width * (-xmin) / xRange;
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, canvas.height);
  }

  for (let x = xmin; x <= xmax; x += xStep) {
    const y = expr.evaluate({ x });
    const px = canvas.width * (x - xmin) / xRange;
    const py = canvas.height * (ymax - y) / yRange;
    if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
      if (x == xmin) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
  }

  ctx.stroke();
}