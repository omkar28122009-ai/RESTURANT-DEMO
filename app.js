console.log("ULTRA LUXURY BACKGROUND LOADED");

(function () {

document.addEventListener("DOMContentLoaded", () => {

  /* ================= CANVAS ================= */
  const canvas = document.createElement("canvas");
  canvas.id = "bgCanvas";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");

  let w, h, dpr = window.devicePixelRatio || 1;

  function resize() {
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  /* ================= NOISE ================= */
  function noise(x, y, t) {
    return Math.sin(x * 1.2 + t) * Math.cos(y * 1.2 + t);
  }

  /* ================= FLOATING ORBS ================= */
  const orbs = Array.from({ length: 8 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 200 + Math.random() * 250,
    speed: 0.2 + Math.random() * 0.3,
    type: Math.random() > 0.5 ? "blue" : "gold"
  }));

  /* ================= DRAW ================= */
  function draw(time) {

    time *= 0.0004;

    ctx.clearRect(0, 0, w, h);

    /* ===== BASE DARK GRADIENT ===== */
    let bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#05070f");
    bg.addColorStop(1, "#0a0f25");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    /* ===== ORBS (BLUE + GOLD) ===== */
    orbs.forEach(o => {
      o.y -= o.speed;

      if (o.y < -200) {
        o.y = window.innerHeight + 200;
        o.x = Math.random() * window.innerWidth;
      }

      let color =
        o.type === "blue"
          ? "rgba(80,120,255,0.18)"
          : "rgba(212,175,55,0.18)";

      let g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    /* ===== WAVE MESH (MAIN EFFECT) ===== */
    for (let j = 0; j < 14; j++) {

      ctx.beginPath();

      for (let i = 0; i < 80; i++) {

        let x = (i / 80) * window.innerWidth;

        let y =
          window.innerHeight / 2 +
          noise(i * 0.04, j * 0.06, time) * (40 + j * 6);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      let opacity = 0.02 + j * 0.005;

      let color =
        j % 2 === 0
          ? `rgba(90,120,255,${opacity})`
          : `rgba(212,175,55,${opacity})`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    /* ===== DEPTH LAYER (BOTTOM WAVE) ===== */
    for (let j = 0; j < 8; j++) {

      ctx.beginPath();

      for (let i = 0; i < 60; i++) {

        let x = (i / 60) * window.innerWidth;

        let y =
          window.innerHeight -
          200 +
          noise(i * 0.05, j * 0.1, time) * (30 + j * 5);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(255,255,255,${0.015 + j * 0.01})`;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

});

})();