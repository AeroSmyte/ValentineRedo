window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  let painting = false;
  let currentColor = "black";

  ctx.scale(dpr, dpr);

  document.fonts.ready.then(() => {
    function drawCanvas(recipientName) {
      ctx.clearRect(0, 0, rect.width, rect.height);

      // 1. Background first - using rect.width/height not canvas.width/height
      ctx.fillStyle = "#fdf8e1";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 2. Text on top
      ctx.fillStyle = "black";
      ctx.font = "32px awesome";
      ctx.fillText("to:", 20, 40);
      ctx.fillText(recipientName, 65, 40);
    }

    setTimeout(() => drawCanvas(""), 100);

    function startPosition(e) {
      painting = true;
      draw(e);
    }

    function finishedPosition() {
      painting = false;
      ctx.beginPath();
    }

    function draw(e) {
      if (!painting) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.strokeStyle = currentColor;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    const colorButtons = document.querySelectorAll("[data-color]");
    colorButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentColor = btn.dataset.color;
      });
    });

    let nameInput = document.getElementById("name");
    nameInput.addEventListener("input", (e) => {
      drawCanvas(e.target.value);
    });

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", downloadImage);

    function downloadImage() {
      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "my-image.png";
      link.href = image;
      link.click();
    }

    let clearBtn = document.getElementById("clearBtn");
    clearBtn.addEventListener("click", () => {
      drawCanvas("");
    });
  });
});
