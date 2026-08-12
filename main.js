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
})();
