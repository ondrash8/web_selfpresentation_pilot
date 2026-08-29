(function () {
  const root = document.documentElement;
  const langBtn = document.getElementById("lang-toggle");
  const themeBtn = document.getElementById("theme-toggle");

  function applyLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = translations[lang] && translations[lang][key];
      if (text) el.textContent = text;
    });
    root.setAttribute("lang", lang === "cz" ? "cs" : "en");
    langBtn.setAttribute("aria-pressed", lang === "en");
    localStorage.setItem("lang", lang);
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.setAttribute("aria-pressed", theme === "dark");
    localStorage.setItem("theme", theme);
  }

  const savedLang =
    localStorage.getItem("lang") ||
    (navigator.language && navigator.language.startsWith("cs") ? "cz" : "en");

  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  applyLanguage(savedLang);
  applyTheme(savedTheme);

  // Email obfuscation: assembled at runtime so simple bots scraping
  // the raw HTML/source can't harvest a plain-text address.
  const emailUser = "simunek88";
  const emailDomain = "gmail.com";
  const emailLink = document.getElementById("email-link");
  if (emailLink) {
    emailLink.setAttribute("href", "mailto:" + emailUser + "@" + emailDomain);
  }

  langBtn.addEventListener("click", () => {
    const current = localStorage.getItem("lang") || "cz";
    applyLanguage(current === "cz" ? "en" : "cz");
  });

  themeBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // Carousel
  const track = document.getElementById("carousel-track");
  const dotsWrap = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  if (track) {
    const slides = track.children.length;
    let index = 0;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to photo " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    function goTo(i) {
      index = (i + slides) % slides;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      [...dotsWrap.children].forEach((d, di) => d.classList.toggle("active", di === index));
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    document.getElementById("carousel").addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    });

    // basic touch swipe
    let touchStartX = null;
    track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) goTo(delta > 0 ? index - 1 : index + 1);
      touchStartX = null;
    });
  }
})();
