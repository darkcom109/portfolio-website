const year = document.querySelector("[data-year]");
const revealItems = document.querySelectorAll(".reveal");
const canvas = document.querySelector("#orb-canvas");
const projectCards = document.querySelectorAll(".project-card");
const stackCards = document.querySelectorAll(".stack-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js-enabled");

if (year) {
  year.textContent = new Date().getFullYear();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (!reduceMotion) {
  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--spot-x", `${x}%`);
      card.style.setProperty("--spot-y", `${y}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--spot-x", "50%");
      card.style.setProperty("--spot-y", "50%");
    });
  });

  stackCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--stack-x", `${x}%`);
      card.style.setProperty("--stack-y", `${y}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--stack-x", "50%");
      card.style.setProperty("--stack-y", "50%");
    });
  });
}

if (canvas) {
  const context = canvas.getContext("2d");
  const pointer = { x: 0, y: 0 };
  let particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let animationId = 0;

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = width < 520 ? 360 : 620;
    particles = Array.from({ length: count }, (_, index) => {
      const offset = index + 0.5;
      const phi = Math.acos(1 - (2 * offset) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * offset;

      return {
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        hue: index % 7,
      };
    });
  };

  const drawOrb = () => {
    frame += reduceMotion ? 0 : 0.0065;
    context.clearRect(0, 0, width, height);

    const centerX = width / 2 + pointer.x * 18;
    const centerY = height / 2 + pointer.y * 18;
    const radius = Math.min(width, height) * 0.31;
    const sinY = Math.sin(frame);
    const cosY = Math.cos(frame);
    const sinX = Math.sin(frame * 0.62);
    const cosX = Math.cos(frame * 0.62);

    particles.forEach((particle) => {
      const x1 = particle.x * cosY - particle.z * sinY;
      const z1 = particle.x * sinY + particle.z * cosY;
      const y1 = particle.y * cosX - z1 * sinX;
      const z2 = particle.y * sinX + z1 * cosX;
      const scale = 0.78 + (z2 + 1) * 0.22;
      const alpha = 0.22 + (z2 + 1) * 0.32;
      const x = centerX + x1 * radius * scale;
      const y = centerY + y1 * radius * scale;

      context.beginPath();
      context.fillStyle =
        particle.hue % 3 === 0
          ? `rgba(88, 230, 255, ${alpha})`
          : particle.hue % 3 === 1
            ? `rgba(143, 107, 255, ${alpha})`
            : `rgba(255, 98, 61, ${alpha * 0.76})`;
      context.arc(x, y, Math.max(0.85, scale * 1.45), 0, Math.PI * 2);
      context.fill();
    });

    const gradient = context.createRadialGradient(centerX, centerY, radius * 0.08, centerX, centerY, radius * 1.05);
    gradient.addColorStop(0, "rgba(88, 230, 255, 0.08)");
    gradient.addColorStop(0.62, "rgba(143, 107, 255, 0.05)");
    gradient.addColorStop(1, "rgba(255, 98, 61, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
    context.fill();

    if (!reduceMotion) {
      animationId = requestAnimationFrame(drawOrb);
    }
  };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
  });

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationId);
    resizeCanvas();
    drawOrb();
  });

  resizeCanvas();
  drawOrb();
}
