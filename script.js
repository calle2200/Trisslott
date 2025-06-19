const cards = [
  // Förlustlott 1
  [
    "resa.png", "smycke.png", "smycke.png",
    "glass.png", "träningskläder.png", "glass.png",
    "middag.png", "resa.png", "klänning.png"
  ],
  // Förlustlott 2
  [
    "smycke.png", "glass.png", "träningskläder.png",
    "resa.png", "klänning.png", "resa.png",
    "middag.png", "träningskläder.png", "glass.png"
  ],
  // Vinstlott 3 (3 st "ring.png")
  [
    "glass.png", "träningskläder.png", "resa.png",
    "glass.png", "smycke.png", "middag.png",
    "resa.png", "träningskläder.png", "glass.png"
  ]
];

let currentCardIndex = 0;

const container = document.getElementById("scratch-card");
const result = document.getElementById("result");

// Skapa "Nästa lott"-knappen
const nextButton = document.createElement("button");
nextButton.textContent = "Nästa lott";
nextButton.style.display = "none";
nextButton.className = "next-button";
nextButton.addEventListener("click", () => {
  currentCardIndex++;
  if (currentCardIndex < cards.length) {
    result.textContent = "";
    renderCard(cards[currentCardIndex]);
    nextButton.style.display = "none";
  } else {
    result.textContent = "Du har skrapat alla lotter!";
    nextButton.style.display = "none";
  }
});

// Lägg knappen under resultatet
result.insertAdjacentElement("afterend", nextButton);

function renderCard(symbols) {
  container.innerHTML = "";
  let revealedCount = 0;
  const revealedValues = [];

  symbols.forEach((imgFile) => {
    const wrap = document.createElement("div");
    wrap.className = "scratch-container";

    const valueDiv = document.createElement("div");
    valueDiv.className = "hidden-value";
    const img = document.createElement("img");
    img.src = `images/${imgFile}`;
    valueDiv.appendChild(img);
    wrap.appendChild(valueDiv);

    const hint = document.createElement("img");
    hint.className = "hint-icon";
    hint.src = "images/gift.png";
    wrap.appendChild(hint);

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
      if (scratchedPixels > 15) {
  hint.style.display = "none"; // Dölj hint tidigt
}

if (scratchedPixels > 40 && !canvas.revealed) {
  canvas.revealed = true;
  revealedCount++;
  revealedValues.push(imgFile);
  if (revealedCount === 9) {
    checkWin(revealedValues);
  }
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

  // Vinstkontroll
  function checkWin(values) {
    const counts = {};
    values.forEach(val => {
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
      result.textContent = `Du vann med tre ${cleanName}!`;
      result.style.color = "green";
    } else {
      result.textContent = "Ingen vinst den här gången.";
      result.style.color = "red";
    }

    if (currentCardIndex < cards.length - 1) {
      nextButton.style.display = "inline-block";
    }
  }
}

// Starta första lotten
renderCard(cards[currentCardIndex]);