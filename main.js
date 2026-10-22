(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var track = document.getElementById("track");
  var viewport = document.getElementById("viewport");
  var dotsEl = document.getElementById("dots");
  var counter = document.getElementById("counter");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  if (!track || !viewport) return;

  var slides = Array.prototype.slice.call(track.children);
  var total = slides.length;
  var DURATION = 950;
  var current = -1;
  var lockUntil = 0;

  var pad = function (n) { return String(n).padStart(2, "0"); };

  /* ------------------------------------------------------------------
     Injected styles
  ------------------------------------------------------------------ */
  var css = [
    ".viewport { touch-action: pan-y; }",
    ".lu-progress { position: fixed; top: 0; left: 0; width: 100%; height: 2px; background: var(--red); transform-origin: left; transform: scaleX(0.1); transition: transform 0.95s var(--ease); z-index: 30; pointer-events: none; }",
    ".lu-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }",
    ".nav a:not(.btn) { position: relative; }",
    ".nav a:not(.btn)::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform 0.45s var(--ease); }",
    ".nav a:not(.btn):hover::after, .nav a[aria-current='true']::after { transform: scaleX(1); }",
    ".nav a[aria-current='true']:not(.btn) { opacity: 1; }",
    ".btn .i { transition: transform 0.3s var(--ease); }",
    ".btn:hover .i { transform: translate(2px, -2px); }",
    ".stat strong, .full-buy .big { font-variant-numeric: tabular-nums; }",
    ".warm article:hover { border-color: var(--red); }"
  ];

  if (!reduceMotion) {
    css.push(
      /* Staggered content */
      ".rv-item { opacity: 0; transform: translateY(16px); transition: opacity 0.8s var(--ease), transform 0.8s var(--ease); }",
      ".slide.is-active .rv-item { opacity: 1; transform: none; transition-delay: var(--d, 0ms); }",
      /* Headline word masks */
      ".lu-w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.1em; margin-bottom: -0.1em; }",
      ".lu-wi { display: inline-block; transform: translateY(112%); transition: transform 0.95s var(--ease); }",
      ".slide.is-active .lu-wi { transform: none; transition-delay: calc(var(--d, 0ms) + var(--w, 0) * 55ms); }",
      /* Crosshair line draws in */
      ".diagram line { stroke-dasharray: 340; stroke-dashoffset: 340; transition: stroke-dashoffset 1.3s var(--ease) 0.9s; }",
      ".slide.is-active .diagram line { stroke-dashoffset: 0; }",
      /* Map routes and markers */
      ".map-box svg g { opacity: 0; transition: opacity 1s var(--ease) 0.9s; }",
      ".slide.is-active .map-box svg g { opacity: 0.8; }",
      ".map-box svg circle { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.4); transition: opacity 0.6s var(--ease) 1.4s, transform 0.6s var(--ease) 1.4s; }",
      ".slide.is-active .map-box svg circle { opacity: 1; transform: none; }"
    );
  }

  var style = document.createElement("style");
  style.setAttribute("data-source", "levelup-motion");
  style.textContent = css.join("\n");
  document.head.appendChild(style);

  /* ------------------------------------------------------------------
     Progress bar and screen reader announcements
  ------------------------------------------------------------------ */
  var progress = document.createElement("div");
  progress.className = "lu-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var live = document.createElement("div");
  live.className = "lu-sr";
  live.setAttribute("aria-live", "polite");
  document.body.appendChild(live);

  /* ------------------------------------------------------------------
     Dots
  ------------------------------------------------------------------ */
  var dots = slides.map(function (slide, index) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("aria-label", "Go to section " + (index + 1) + " of " + total);
    b.addEventListener("click", function () { go(index); });
    dotsEl.appendChild(b);
    return b;
  });

  /* ------------------------------------------------------------------
     Text and content preparation
  ------------------------------------------------------------------ */
  var HEADING = "h1.display, h2.display, .callout-box q";
  var STAGGER = ".stats, .steps, .panels, .roles, .warm, .glossary, .habits, .habit-list, .buy, .tips, .timers";

  function splitWords(el, order) {
    var text = el.textContent.replace(/\s+/g, " ").trim();
    var words = text.split(" ");
    el.setAttribute("aria-label", text);
    el.textContent = "";
    words.forEach(function (word, i) {
      var mask = document.createElement("span");
      mask.className = "lu-w";
      mask.setAttribute("aria-hidden", "true");
      var inner = document.createElement("span");
      inner.className = "lu-wi";
      inner.style.setProperty("--w", i);
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.classList.remove("reveal", "late");
    el.style.setProperty("--d", delayFor(order) + "ms");
  }

  function delayFor(order) { return Math.min(380 + order * 65, 1000); }

  function prepareSlide(slide) {
    var order = 0;

    function item(el) {
      el.classList.remove("reveal", "late");
      el.classList.add("rv-item");
      el.style.setProperty("--d", delayFor(order++) + "ms");
    }

    function walk(el, force) {
      if (el.matches(HEADING)) {
        splitWords(el, order++);
        return;
      }
      if (el.querySelector(HEADING) || el.matches(STAGGER)) {
        el.classList.remove("reveal", "late");
        Array.prototype.forEach.call(el.children, function (child) { walk(child, true); });
        return;
      }
      if (force || el.classList.contains("reveal")) item(el);
    }

    Array.prototype.forEach.call(slide.children, function (child) { walk(child, false); });
  }

  /* Count-ups for real figures (rounds, credits) */
  var counters = [];

  function collectCounters(slide) {
    var list = [];
    Array.prototype.forEach.call(slide.querySelectorAll(".stat strong"), function (el) {
      var node = el.firstChild;
      if (node && node.nodeType === 3 && /^\d+$/.test(node.nodeValue.trim())) {
        list.push({ node: node, value: parseInt(node.nodeValue, 10), format: String });
      }
    });
    Array.prototype.forEach.call(slide.querySelectorAll(".full-buy .big"), function (el) {
      var node = el.firstChild;
      if (node && node.nodeType === 3) {
        var v = parseInt(node.nodeValue.replace(/\D/g, ""), 10);
        if (v) list.push({ node: node, value: v, format: function (n) { return n.toLocaleString("en-US"); } });
      }
    });
    return list;
  }

  function tween(duration, onUpdate) {
    var start = performance.now();
    function frame(now) {
          var p = Math.min(1, (now - start) / duration);
      onUpdate(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function playCounters(slide) {
    if (slide._counted) return;
    slide._counted = true;
    (slide._counters || []).forEach(function (c) {
      setTimeout(function () {
        tween(1100, function (e) { c.node.nodeValue = c.format(Math.round(c.value * e)); });
      }, 650);
    });
  }

  if (!reduceMotion) {
    slides.forEach(function (slide) {
      prepareSlide(slide);
      slide._counters = collectCounters(slide);
      slide._counters.forEach(function (c) { c.node.nodeValue = c.format(0); });
    });
  }

  /* ------------------------------------------------------------------
     Navigation state
  ------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a[data-go]:not(.btn)"));

  function updateNav(index) {
    var active = null;
    if (index >= 1 && index <= total - 2) {
      navLinks.forEach(function (link) {
        if (parseInt(link.getAttribute("data-go"), 10) <= index) active = link;
      });
    }
    navLinks.forEach(function (link) {
      if (link === active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }
    function offset(index, dragPx) {
    return "translate3d(calc(" + (-index * 100) + "vw + " + (dragPx || 0) + "px),0,0)";
  }

  function go(index, instant) {
    index = Math.max(0, Math.min(total - 1, index));
    if (index === current) { track.style.transform = offset(current); return; }
    current = index;
    lockUntil = Date.now() + DURATION;

    if (instant) track.style.transition = "none";
    track.style.transform = offset(index);
    if (instant) { void track.offsetWidth; track.style.transition = ""; }

    slides.forEach(function (slide, i) {
      var isActive = i === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (isActive) { slide.removeAttribute("inert"); slide.scrollTop = 0; }
      else slide.setAttribute("inert", "");
    });

    dots.forEach(function (d, i) {
      if (i === index) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });

    document.body.setAttribute("data-theme", slides[index].getAttribute("data-theme") || "dark");
    counter.textContent = pad(index + 1) + " / " + pad(total);
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
    progress.style.transform = "scaleX(" + ((index + 1) / total) + ")";
    live.textContent = "Section " + (index + 1) + " of " + total + ": " + (slides[index].getAttribute("aria-label") || "");
    updateNav(index);
    playCounters(slides[index]);

    var id = slides[index].id;
    if (id && history.replaceState) history.replaceState(null, "", "#" + id);
  }

  function step(dir) {
    if (Date.now() < lockUntil) return;
    go(current + dir);
  }

  function indexFromHash() {
    var id = window.location.hash.replace("#", "");
    for (var i = 0; i < slides.length; i++) if (slides[i].id === id) return i;
    return 0;
  }

  /* ------------------------------------------------------------------
     Wheel and trackpad
     One gesture moves one slide. Inertia tails are ignored by requiring
     a short quiet gap between a triggered gesture and the next one.
  ------------------------------------------------------------------ */
  var lastWheel = 0;
  var needsQuiet = false;

  window.addEventListener("wheel", function (e) {
    var slide = slides[current];
    var vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
    var delta = vertical ? e.deltaY : e.deltaX;
    if (e.deltaMode === 1) delta *= 16;

    if (vertical && slide.scrollHeight > slide.clientHeight + 1) {
      var atTop = slide.scrollTop <= 0;
      var atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 1;
      if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) return;
    }

    e.preventDefault();

    var now = Date.now();
    var gap = now - lastWheel;
    lastWheel = now;

    if (gap > 100) needsQuiet = false;
    if (needsQuiet || now < lockUntil || Math.abs(delta) < 6) return;

    needsQuiet = true;
    step(delta > 0 ? 1 : -1);
  }, { passive: false });

  /* ------------------------------------------------------------------
     Keyboard
  ------------------------------------------------------------------ */
  window.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        step(1); e.preventDefault(); break;
      case "ArrowLeft":
      case "PageUp":
        step(-1); e.preventDefault(); break;
      case "Home":
        go(0); e.preventDefault(); break;
      case "End":
        go(total - 1); e.preventDefault(); break;
    }
  });

  /* ------------------------------------------------------------------
     Touch: the track follows the finger, then settles on a slide
  ------------------------------------------------------------------ */
  var touch = null;

  viewport.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) { touch = null; return; }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now(), axis: null, dx: 0 };
  }, { passive: true });

  viewport.addEventListener("touchmove", function (e) {
    if (!touch) return;
    var dx = e.touches[0].clientX - touch.x;
    var dy = e.touches[0].clientY - touch.y;

    if (!touch.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      touch.axis = Math.abs(dx) > Math.abs(dy) * 1.1 ? "x" : "y";
    }
    if (touch.axis !== "x") return;

    var atEdge = (current === 0 && dx > 0) || (current === total - 1 && dx < 0);
    touch.dx = atEdge ? dx * 0.3 : dx;
    track.style.transition = "none";
    track.style.transform = offset(current, touch.dx);
  }, { passive: true });

  function endTouch() {
    if (!touch) return;
    var t = touch;
    touch = null;
    if (t.axis !== "x") return;

    track.style.transition = "";
    var elapsed = Math.max(1, Date.now() - t.time);
    var velocity = Math.abs(t.dx) / elapsed;
    var threshold = Math.min(90, window.innerWidth * 0.2);

    if (Math.abs(t.dx) > threshold || (velocity > 0.45 && Math.abs(t.dx) > 30)) {
      go(current + (t.dx < 0 ? 1 : -1));
    } else {
      track.style.transform = offset(current);
    }
  }

  viewport.addEventListener("touchend", endTouch, { passive: true });
  viewport.addEventListener("touchcancel", endTouch, { passive: true });

  /* ------------------------------------------------------------------
     Buttons and links
  ------------------------------------------------------------------ */
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });

  document.querySelectorAll("[data-go]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      go(parseInt(el.getAttribute("data-go"), 10));
    });
  });

  window.addEventListener("hashchange", function () { go(indexFromHash()); });

  go(indexFromHash(), true);
})();
