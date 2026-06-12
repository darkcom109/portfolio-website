const hero = document.querySelector(".hero");
const artwork = document.querySelector(".hero-art");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
