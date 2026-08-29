(function () {
  "use strict";

  /* =========================================================
     Background Music & Audio Controls
     ========================================================= */
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  function playMusic() {
    if (!bgMusic) return;
    bgMusic.play().then(function () {
      if (musicToggle) {
        musicToggle.classList.add("is-playing");
      }
    }).catch(function (err) {
      console.log("Audio play allowed on gesture:", err);
    });
  }

  function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    if (musicToggle) {
      musicToggle.classList.remove("is-playing");
    }
  }

  function toggleMusic(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!bgMusic) return;
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
  }

  if (bgMusic) {
    bgMusic.addEventListener("play", function () {
      if (musicToggle) musicToggle.classList.add("is-playing");
    });
    bgMusic.addEventListener("pause", function () {
      if (musicToggle) musicToggle.classList.remove("is-playing");
    });
  }

  /* =========================================================
     Cover Screen — Tap to Open
     ========================================================= */
  const coverScreen = document.getElementById("coverScreen");
  const openBtn = document.getElementById("openBtn");
  const invitation = document.getElementById("invitation");
  const coverRipple = document.getElementById("coverRipple");

  function openInvitation(e) {
    if (!coverScreen || coverScreen.classList.contains("opening")) return;

    // Start background music immediately on user gesture
    playMusic();

    // Show floating music control button in bottom corner
    if (musicToggle) {
      setTimeout(function () {
        musicToggle.classList.add("visible");
      }, 300);
    }

    // Ripple effect at tap position
    if (e && coverRipple) {
      const rect = coverScreen.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      coverRipple.style.left = x + "px";
      coverRipple.style.top = y + "px";
      coverRipple.classList.remove("animate");
      void coverRipple.offsetWidth; // reflow
      coverRipple.classList.add("animate");
    }

    // Start cover exit animation
    coverScreen.classList.add("opening");

    // Show invitation content beneath
    if (invitation) {
      invitation.setAttribute("aria-hidden", "false");
      invitation.classList.add("visible");
    }

    // Prevent scrolling during animation
    document.body.style.overflow = "hidden";

    setTimeout(function () {
      coverScreen.classList.add("hidden");
      document.body.style.overflow = "";
      // Trigger initial reveals
      revealAll();
    }, 1100);
  }

  if (coverScreen) {
    coverScreen.addEventListener("click", openInvitation);
    coverScreen.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") openInvitation(e);
    });
    // Prevent button click from double-firing
    if (openBtn) {
      openBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openInvitation(e);
      });
    }
  }

  /* =========================================================
     Google Maps URL
     ========================================================= */
  const GOOGLE_MAPS_URL = "";

  const mapsBtn = document.getElementById("mapsBtn");
  if (mapsBtn) {
    if (GOOGLE_MAPS_URL) {
      mapsBtn.href = GOOGLE_MAPS_URL;
    } else {
      mapsBtn.classList.add("is-disabled");
      mapsBtn.setAttribute("aria-disabled", "true");
      mapsBtn.removeAttribute("href");
    }
  }

  /* =========================================================
     Countdown — 25 Oct 2026, 11:42 AM IST (UTC+5:30)
     ========================================================= */
  const target = new Date("2026-10-25T11:42:00+05:30").getTime();

  const cdEls = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };

  function pad(n) { return String(n).padStart(2, "0"); }

  function tickCountdown() {
    const now = Date.now();
    let diff = target - now;
    if (diff <= 0) {
      Object.values(cdEls).forEach(function (el) { if (el) el.textContent = "00"; });
      return;
    }
    const day = Math.floor(diff / 86400000); diff -= day * 86400000;
    const hour = Math.floor(diff / 3600000); diff -= hour * 3600000;
    const min = Math.floor(diff / 60000); diff -= min * 60000;
    const sec = Math.floor(diff / 1000);
    if (cdEls.days) cdEls.days.textContent = pad(day);
    if (cdEls.hours) cdEls.hours.textContent = pad(hour);
    if (cdEls.mins) cdEls.mins.textContent = pad(min);
    if (cdEls.secs) cdEls.secs.textContent = pad(sec);
  }

  if (cdEls.days) { tickCountdown(); setInterval(tickCountdown, 1000); }

  /* =========================================================
     Scroll Reveal
     ========================================================= */
  var revealEls = [];
  var revealObserver = null;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealAll() {
    revealEls = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* =========================================================
     Share Invitation
     ========================================================= */
  const shareBtn = document.getElementById("shareBtn");
  const shareText = "With happiness, we invite you to celebrate the wedding of Anupama & Lijin on 25 October 2026.";
  const shareUrl = window.location.href;

  if (shareBtn) {
    shareBtn.addEventListener("click", async function () {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Anupama & Lijin | Wedding Invitation",
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch (err) { /* user cancelled — fall through */ }
      }
      const waUrl = "https://wa.me/?text=" + encodeURIComponent(shareText + " " + shareUrl);
      window.open(waUrl, "_blank", "noopener");
    });
  }

  /* =========================================================
     Hero scroll hint — fade on first scroll
     ========================================================= */
  const scrollHint = document.querySelector(".hero-scroll-hint");
  if (scrollHint) {
    window.addEventListener("scroll", function hideHint() {
      scrollHint.style.opacity = "0";
      window.removeEventListener("scroll", hideHint);
    }, { passive: true, once: true });
  }

  /* =========================================================
     Fixed Scroll Indicator — show while scrollable, hide at bottom
     ========================================================= */
  var scrollIndicator = document.getElementById("scrollIndicator");

  function updateScrollIndicator() {
    if (!scrollIndicator) return;
    var scrollY = window.scrollY || window.pageYOffset;
    var windowH = window.innerHeight;
    var docH = document.documentElement.scrollHeight;

    // Only hide when very close to the bottom (within 120px)
    var nearBottom = scrollY + windowH >= docH - 120;

    if (nearBottom) {
      scrollIndicator.classList.remove("visible");
      scrollIndicator.classList.add("hidden");
    } else {
      scrollIndicator.classList.remove("hidden");
      scrollIndicator.classList.add("visible");
    }
  }

  // Start listening once invitation is open — show immediately in hero
  var _origRevealAll = revealAll;
  revealAll = function () {
    _origRevealAll();
    window.addEventListener("scroll", updateScrollIndicator, { passive: true });
    // Show right away so it's visible in the hero section
    setTimeout(function () {
      if (scrollIndicator) {
        scrollIndicator.classList.remove("hidden");
        scrollIndicator.classList.add("visible");
      }
    }, 400);
  };

})();
