document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- Mobile navigation ---------------- */
  const menu = document.querySelector(".menu-btn");
  const mobile = document.querySelector("#mobileNav");

  if (menu && mobile) {
    const setMenu = (open) => {
      menu.setAttribute("aria-expanded", String(open));
      mobile.hidden = !open;
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };

    setMenu(false);

    menu.addEventListener("click", () => {
      setMenu(menu.getAttribute("aria-expanded") !== "true");
    });

    mobile.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  /* ---------------- Video performance pattern ----------------
     Production implementation:
     - keep poster as the LCP asset
     - do not download video until user interaction
     - replace alert with a dynamically injected <video>/<iframe>
  */
  const videoButtons = document.querySelectorAll("[data-video]");

  videoButtons.forEach(button => {
    button.addEventListener("click", () => {
      const poster = button.closest(".hero-media")?.querySelector(".video-poster");

      if (!poster) return;

      if (poster.dataset.loaded === "true") return;

      poster.dataset.loaded = "true";

      const message = document.createElement("div");
      message.setAttribute("role", "status");
      message.style.cssText =
        "position:absolute;inset:0;display:grid;place-items:center;padding:30px;text-align:center;color:#fff;background:rgba(7,21,47,.86);z-index:10;border-radius:inherit;";
      message.innerHTML =
        "<div><strong>Video loaded on interaction</strong><br><small>Production: replace this state with the compressed Tanla video player.</small></div>";

      poster.appendChild(message);
    });
  });

  /* ---------------- Chatbot ---------------- */
  const toggle = document.querySelector("#chatToggle");
  const bot = document.querySelector("#chatbot");
  const close = document.querySelector("#chatClose");

  const setChat = open => {
    if (!bot || !toggle) return;
    bot.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  };

  if (toggle && bot) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", () => {
      setChat(bot.hidden);
    });
  }

  if (close) {
    close.addEventListener("click", () => setChat(false));
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setChat(false);
  });

  document.querySelectorAll(".quick button").forEach(button => {
    button.addEventListener("click", () => {
      const body = document.querySelector(".chat-body");
      if (!body) return;

      const response = document.createElement("p");
      response.className = "bot";

      const intent = button.textContent.trim();

      if (intent === "Find a solution") {
        response.textContent =
          "What are you trying to achieve: protect users, grow revenue, improve CX or build trusted messaging?";
      } else if (intent === "Explore products") {
        response.textContent =
          "I can guide you toward Anti-Scam, Anti-Spam, Trubloq, Wisely, MaaP, RCS, SMS, Voice and WhatsApp Business API.";
      } else {
        response.textContent =
          "A production assistant should route qualified visitors to sales, demo booking or the relevant product specialist.";
      }

      body.appendChild(response);
      body.scrollTop = body.scrollHeight;
    });
  });

  /* ---------------- Newsletter demo ---------------- */
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const email = form.querySelector("input[type='email']");
      const button = form.querySelector("button");

      if (!email || !email.checkValidity()) {
        email?.focus();
        return;
      }

      if (button) {
        button.textContent = "Subscribed";
        button.disabled = true;
      }

      email.setAttribute("aria-label", "Subscribed email");
    });
  });

  /* ---------------- Smooth anchor handling ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });
});

/* =========================================
   Lightweight Scroll Reveal
   Uses IntersectionObserver instead of
   continuous scroll events.
   ========================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      // Animate only once
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* =========================================================
   TANLA CUSTOMER LOGO MARQUEE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const marquee = document.querySelector(".trust-marquee");
  const track = document.querySelector(".trust-marquee__track");

  if (!marquee || !track) {
    return;
  }


  /* =======================================================
     PAUSE WHEN USER HOVERS
     ======================================================= */

  marquee.addEventListener("mouseenter", function () {
    track.style.animationPlayState = "paused";
  });

  marquee.addEventListener("mouseleave", function () {
    track.style.animationPlayState = "running";
  });


  /* =======================================================
     PAUSE WHEN USER FOCUSES A LOGO
     Useful for keyboard accessibility.
     ======================================================= */

  const logoCards = marquee.querySelectorAll(".trust-logo-card");

  logoCards.forEach(function (card) {

    card.setAttribute("tabindex", "0");

    card.addEventListener("focus", function () {
      track.style.animationPlayState = "paused";
    });

    card.addEventListener("blur", function () {
      track.style.animationPlayState = "running";
    });

  });


  /* =======================================================
     REDUCED MOTION
     Respect user's accessibility preference.
     ======================================================= */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function handleReducedMotion(event) {

    if (event.matches) {
      track.style.animationPlayState = "paused";
    } else {
      track.style.animationPlayState = "running";
    }

  }

  /* =========================================================
   ANIMATED STAT COUNTERS
   ========================================================= */
  function animateCount(el, duration = 1400) {
    const text = el.textContent.trim();
    const match = text.match(/[\d,]+/);
    if (!match) return; // nothing numeric to animate (e.g. "Largest")

    const digits = match[0];
    const target = parseInt(digits.replace(/,/g, ""), 10);
    const prefix = text.slice(0, match.index);
    const suffix = text.slice(match.index + digits.length);
    const useComma = digits.includes(",");
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic, feels less mechanical than linear
      const current = Math.round(target * eased);
      el.textContent = prefix + (useComma ? current.toLocaleString("en-US") : current) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const countEls = document.querySelectorAll(
    ".impact-panel strong, .story-stat strong, .proof-row strong, .logo-grid strong"
  );
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && countEls.length) {
    const countObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    countEls.forEach((el) => countObserver.observe(el));
  }
  // reduced-motion users just see the final static number — no extra branch needed,
  // since we never touch el.textContent in that case.

  handleReducedMotion(reducedMotion);

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener(
      "change",
      handleReducedMotion
    );
  }

});

(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('tanla-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('tanla-theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggle) { toggle.setAttribute('aria-label', 'Switch to light mode'); }
    } else {
      root.removeAttribute('data-theme');
      if (toggle) { toggle.setAttribute('aria-label', 'Switch to dark mode'); }
    }
  }
})();