const hero = document.querySelector(".hero");
const artwork = document.querySelector(".hero-art");
const revealItems = document.querySelectorAll(".reveal");
const projectVisuals = document.querySelectorAll(".project-tile-visual");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (hero && artwork && !reduceMotion) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    artwork.style.setProperty("--move-x", `${x * -12}px`);
    artwork.style.setProperty("--move-y", `${y * -12}px`);
  });

  hero.addEventListener("pointerleave", () => {
    artwork.style.setProperty("--move-x", "0px");
    artwork.style.setProperty("--move-y", "0px");
  });
}

if (!reduceMotion) {
  projectVisuals.forEach((visual) => {
    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      visual.style.setProperty("--card-x", `${x}%`);
      visual.style.setProperty("--card-y", `${y}%`);
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.setProperty("--card-x", "50%");
      visual.style.setProperty("--card-y", "50%");
    });
  });
}
