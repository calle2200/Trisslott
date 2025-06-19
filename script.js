const symbols = [
    "ring.png", "plane.png", "dress.png",
    "ring.png", "ring.png", "plane.png",
    "dress.png", "necklace.png", "dress.png"
  ];
  
  const container = document.getElementById("scratch-card");
  const result = document.getElementById("result");
  
  let revealedCount = 0;
  const revealedValues = [];
  
  symbols.forEach((imgFile) => {
    const wrap = document.createElement("div");
    wrap.className = "scratch-container";
  
    // Bild bakom skraplagret
    const valueDiv = document.createElement("div");
    valueDiv.className = "hidden-value";
    const img = document.createElement("img");
    img.src = `images/${imgFile}`;  // Lägg bilder i "images/"-mappen
    valueDiv.appendChild(img);
    wrap.appendChild(valueDiv);
  
    // Hint-ikon ovanpå (visas innan man börjar skrapa)
    const hint = document.createElement("img");
    hint.className = "hint-icon";
    hint.src = "images/gift.png"; // din "skrapa här"-ikon
    wrap.appendChild(hint);
  
    // Skraplager (canvas)
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
  
    ctx.fillStyle = "#B0B0B0";
    ctx.fillRect(0, 0, 100, 100);
  
    let isDrawing = false;
    let scratchedPixels = 0;
  
    const getXY = (e) => {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      return { x, y };
    };
  
    const scratch = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const { x, y } = getXY(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
  
      scratchedPixels++;
      if (scratchedPixels > 20 && !canvas.revealed) {
        canvas.revealed = true;
        hint.style.display = "none"; // Ta bort hint-ikonen
        revealedCount++;
        revealedValues.push(imgFile);
        if (revealedCount === 9) checkWin();
      }
    };
  
    canvas.addEventListener("mousedown", () => isDrawing = true);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseleave", () => isDrawing = false);
  
    canvas.addEventListener("touchstart", () => isDrawing = true);
    canvas.addEventListener("touchend", () => isDrawing = false);
    canvas.addEventListener("touchmove", scratch);
  
    wrap.appendChild(canvas);
    container.appendChild(wrap);
  });
  
  function checkWin() {
    const counts = {};
    revealedValues.forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
    });
  
    let winner = null;
    for (let key in counts) {
      if (counts[key] >= 3) {
        winner = key;
        break;
      }
    }
  
    if (winner) {
      const cleanName = winner.replace(".png", "");
      result.textContent = `🎉 Du vann med tre ${cleanName}!`;
      result.style.color = "green";
    } else {
      result.textContent = "😢 Tyvärr, ingen vinst den här gången.";
      result.style.color = "red";
    }
  }
  