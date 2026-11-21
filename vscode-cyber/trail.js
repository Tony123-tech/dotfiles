// ==VS Code & Terminal God-Tier Cyber Engine==
(function () {
  "use strict";

  const TRAIL_LIFE = 300;
  const SPARK_LIFE = 420;
  const HIGH_WPM_INTERVAL = 150;
  const COMBO_RESET_MS = 2200;
  const IDLE_MATRIX_MS = 15000;
  const PB_STORAGE_KEY = "tonymic_cyber_best_wpm";

  const RAINBOW = [
    "#ff0000",
    "#ff7f00",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#8b00ff",
  ];
  const NEON_SPARKS = ["#00ffff", "#ff00ff", "#ffff33", "#00ff9f", "#bd93f9"];
  const DISSOLVE_SPARKS = ["#ff0055", "#ff2a6d", "#8b00ff", "#ff00ff"];

  const T = () => ({
    pri: "#00ffff",
    sec: "#ff00ff",
    ok: "#00ff9f",
    sparks: NEON_SPARKS,
  });

  let smoothedWpm = 0;

  let synthSoundEnabled = false;
  let audioCtx = null;

  function playCyberClick(freq = 520, duration = 0.025) {
    if (!synthSoundEnabled) return;
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        110,
        audioCtx.currentTime + duration,
      );
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  function showCyberToast(text, color = "#00ff9f") {
    const toast = document.createElement("div");
    Object.assign(toast.style, {
      position: "fixed",
      top: "42px",
      right: "24px",
      padding: "6px 14px",
      background: "rgba(10, 4, 16, 0.9)",
      border: `1px solid ${color}`,
      boxShadow: `0 0 14px ${color}`,
      color: color,
      fontFamily: "'JetBrainsMono Nerd Font', monospace",
      fontSize: "11px",
      fontWeight: "bold",
      borderRadius: "6px",
      pointerEvents: "none",
      zIndex: "10005",
      opacity: "0",
      transform: "translateY(-8px)",
      transition: "opacity 180ms ease, transform 180ms ease",
    });
    toast.textContent = text;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      setTimeout(() => toast.remove(), 200);
    }, 1200);
  }

  const aura = document.createElement("div");
  Object.assign(aura.style, {
    position: "fixed",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0, 255, 255, 0.055) 0%, rgba(255, 0, 255, 0.025) 45%, transparent 70%)",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    zIndex: "9997",
    left: "-500px",
    top: "-500px",
  });
  document.body.appendChild(aura);

  function spawnClickRipple(x, y) {
    const ripple = document.createElement("div");
    Object.assign(ripple.style, {
      position: "fixed",
      left: x + "px",
      top: y + "px",
      width: "10px",
      height: "10px",
      border: "1.5px solid #00ffff",
      boxShadow: "0 0 8px #ff00ff",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "10000",
      opacity: "0.85",
      transform: "translate(-50%, -50%) scale(0.3)",
      transition:
        "opacity 400ms ease-out, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
    });
    document.body.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.opacity = "0";
      ripple.style.transform = "translate(-50%, -50%) scale(4.2)";
    });
    setTimeout(() => ripple.remove(), 410);
  }

  function spawnFloatingTag(x, y, label, color = "#00ffff") {
    const tag = document.createElement("div");
    Object.assign(tag.style, {
      position: "fixed",
      left: x + "px",
      top: y - 14 + "px",
      color: color,
      textShadow: `0 0 8px ${color}`,
      fontFamily: "'JetBrainsMono Nerd Font', monospace",
      fontSize: "10px",
      fontWeight: "bold",
      pointerEvents: "none",
      zIndex: "10004",
      opacity: "1",
      transition: "opacity 550ms ease-out, transform 550ms ease-out",
    });
    tag.textContent = label;
    document.body.appendChild(tag);
    requestAnimationFrame(() => {
      tag.style.opacity = "0";
      tag.style.transform = "translateY(-22px)";
    });
    setTimeout(() => tag.remove(), 560);
  }

  function spawnDataSurge(x, y) {
    const bits = ["0", "1", "⚡", "FF", "0x"];
    for (let i = 0; i < 10; i++) {
      const bit = document.createElement("div");
      const dx = (Math.random() - 0.5) * 60;
      const dy = 25 + Math.random() * 55;
      Object.assign(bit.style, {
        position: "fixed",
        left: x + dx + "px",
        top: y + "px",
        color: i % 2 === 0 ? "#00ff9f" : "#00ffff",
        textShadow: "0 0 6px #00ff9f",
        fontFamily: "monospace",
        fontSize: "11px",
        fontWeight: "bold",
        pointerEvents: "none",
        zIndex: "10003",
        opacity: "0.95",
        transition: "opacity 500ms ease-out, transform 500ms ease-in",
      });
      bit.textContent = bits[Math.floor(Math.random() * bits.length)];
      document.body.appendChild(bit);
      requestAnimationFrame(() => {
        bit.style.opacity = "0";
        bit.style.transform = `translateY(${dy}px)`;
      });
      setTimeout(() => bit.remove(), 510);
    }
  }

  const termBeam = document.createElement("div");
  Object.assign(termBeam.style, {
    position: "fixed",
    height: "18px",
    background:
      "linear-gradient(90deg, rgba(0, 255, 255, 0.14), rgba(255, 0, 255, 0.05), transparent)",
    borderLeft: "2px solid #00ffff",
    pointerEvents: "none",
    zIndex: "9996",
    opacity: "0",
    transition: "top 60ms ease, opacity 150ms ease",
  });
  document.body.appendChild(termBeam);

  function updateTerminalBeam() {
    const termCursor = document.querySelector(".xterm .xterm-cursor");
    const termScreen = document.querySelector(".xterm .xterm-screen");
    if (document.activeElement?.closest(".xterm") && termCursor && termScreen) {
      const cRect = termCursor.getBoundingClientRect();
      const sRect = termScreen.getBoundingClientRect();
      if (cRect.top > 0 && sRect.width > 0) {
        termBeam.style.left = sRect.left + "px";
        termBeam.style.top = cRect.top + "px";
        termBeam.style.width = sRect.width + "px";
        termBeam.style.height = (cRect.height || 18) + "px";
        termBeam.style.opacity = "1";
        return;
      }
    }
    termBeam.style.opacity = "0";
  }

  const energyBar = document.createElement("div");
  Object.assign(energyBar.style, {
    position: "fixed",
    left: "0",
    bottom: "22px",
    height: "2px",
    width: "0%",
    background: "linear-gradient(90deg, #00ffff, #bd93f9, #ff00ff, #ffff33)",
    boxShadow: "0 0 8px #00ffff",
    pointerEvents: "none",
    zIndex: "10002",
    transition: "width 120ms ease-out, opacity 300ms ease",
    opacity: "0",
  });
  document.body.appendChild(energyBar);

  const hud = document.createElement("div");
  Object.assign(hud.style, {
    position: "fixed",
    right: "24px",
    bottom: "34px",
    padding: "8px 14px",
    background: "rgba(10, 4, 16, 0.85)",
    backdropFilter: "blur(10px)",
    webkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(0, 255, 255, 0.5)",
    boxShadow: "0 0 15px rgba(0, 255, 255, 0.25)",
    borderRadius: "8px",
    fontFamily: "'JetBrainsMono Nerd Font', 'JetBrains Mono', monospace",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#00ffff",
    pointerEvents: "none",
    zIndex: "10001",
    opacity: "0",
    transform: "translateY(8px)",
    transition:
      "opacity 220ms ease, transform 220ms ease, border-color 200ms ease, box-shadow 200ms ease",
  });
  document.body.appendChild(hud);

  let bestWpm = parseInt(localStorage.getItem(PB_STORAGE_KEY) || "0", 10);
  let comboCount = 0;
  let keyTimestamps = [];
  let comboResetTimer = null;
  let pbCelebratedThisBurst = false;

  function getCyberRank(combo) {
    if (combo >= 150) return { title: "GODLIKE", color: "#ffff33" };
    if (combo >= 80) return { title: "CYBERPSYCHO", color: "#ff00ff" };
    if (combo >= 30) return { title: "OVERCLOCK", color: "#00ff9f" };
    return { title: "NETRUNNER", color: "#00ffff" };
  }

  function updateHud(now, cursorRect) {
    comboCount++;
    keyTimestamps.push(now);
    keyTimestamps = keyTimestamps.filter((t) => now - t <= 4000);

    let wpm = 0;
    if (keyTimestamps.length >= 2) {
      const spanMin = (now - keyTimestamps[0]) / 60000;
      if (spanMin > 0) wpm = Math.round(keyTimestamps.length / 5 / spanMin);
    }
    smoothedWpm = wpm;

    const pct = Math.min(100, Math.round((wpm / 140) * 100));
    energyBar.style.opacity = "1";
    energyBar.style.width = pct + "%";

    let isNewPb = false;
    if (comboCount >= 15 && wpm > bestWpm && wpm < 300) {
      bestWpm = wpm;
      localStorage.setItem(PB_STORAGE_KEY, String(bestWpm));
      isNewPb = true;
      if (!pbCelebratedThisBurst && cursorRect) {
        pbCelebratedThisBurst = true;
        spawnSparks(
          cursorRect.left + cursorRect.width / 2,
          cursorRect.top + cursorRect.height / 2,
          18,
          NEON_SPARKS,
        );
      }
    }

    const rank = getCyberRank(comboCount);
    hud.style.opacity = "1";
    hud.style.transform = "translateY(0)";

    if (isNewPb || pbCelebratedThisBurst) {
      hud.style.borderColor = "#ffff33";
      hud.style.boxShadow = "0 0 20px rgba(255, 255, 51, 0.6)";
      hud.innerHTML = `<span style="color:#ffff33">👑 NEW PB! ${wpm} WPM</span> <span style="color:#6272a4">|</span> <span style="color:#00ff9f">${comboCount}x</span>`;
    } else {
      hud.style.borderColor = rank.color;
      hud.style.boxShadow = `0 0 16px ${rank.color}55`;
      hud.innerHTML = `<span style="color:${rank.color}">[${rank.title}]</span> <span style="color:#ffffff">${wpm} WPM</span> <span style="color:#6272a4">|</span> <span style="color:#00ff9f">${comboCount}x</span> <span style="color:#6272a4">(PB:${bestWpm})</span>`;
    }

    clearTimeout(comboResetTimer);
    comboResetTimer = setTimeout(() => {
      comboCount = 0;
      keyTimestamps = [];
      pbCelebratedThisBurst = false;
      hud.style.opacity = "0";
      hud.style.transform = "translateY(8px)";
      energyBar.style.width = "0%";
      energyBar.style.opacity = "0";
    }, COMBO_RESET_MS);
  }

  const matrixCanvas = document.createElement("canvas");
  Object.assign(matrixCanvas.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "9995",
    opacity: "0",
    transition: "opacity 1200ms ease",
  });
  document.body.appendChild(matrixCanvas);

  const ctx = matrixCanvas.getContext("2d");
  let matrixInterval = null;
  let idleTimer = null;
  const matrixChars =
    "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF⚡";
  let drops = [];

  function startMatrixRain() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const columns = Math.floor(matrixCanvas.width / 18);
    drops = Array(columns).fill(1);
    matrixCanvas.style.opacity = "0.14";

    clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
      ctx.fillStyle = "rgba(10, 4, 16, 0.12)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = "#00ff9f";
      ctx.font = "14px 'JetBrainsMono Nerd Font', monospace";

      for (let i = 0; i < drops.length; i++) {
        const text =
          matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * 18, drops[i] * 18);
        if (drops[i] * 18 > matrixCanvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    }, 55);
  }

  function resetIdleTimer() {
    if (matrixCanvas.style.opacity !== "0") {
      matrixCanvas.style.opacity = "0";
      setTimeout(() => clearInterval(matrixInterval), 1200);
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startMatrixRain, IDLE_MATRIX_MS);
  }

  setInterval(() => {
    const panel = document.querySelector(".monaco-workbench .part.panel");
    const errBadge = document.querySelector(
      ".part.statusbar .codicon-error",
    )?.parentElement;
    if (!panel || !errBadge) return;
    const hasErrors = /[1-9]/.test(errBadge.textContent || "");
    panel.classList.toggle("cyber-error-alert", hasErrors);
  }, 1500);

  function getActiveCursorEl() {
    if (document.activeElement && document.activeElement.closest(".xterm")) {
      return document.querySelector(".xterm .xterm-cursor");
    }
    return document.querySelector(".monaco-editor .cursors-layer .cursor");
  }

  function spawnTrail(x, y, width, height) {
    if (x === 0 && y === 0) return;
    const dot = document.createElement("div");
    const color = RAINBOW[Math.floor(Math.random() * RAINBOW.length)];
    Object.assign(dot.style, {
      position: "fixed",
      left: x + "px",
      top: y + "px",
      width: (width || 8) + "px",
      height: (height || 18) + "px",
      background: color,
      borderRadius: "2px",
      pointerEvents: "none",
      zIndex: "9999",
      opacity: "0.85",
      filter: "blur(1px)",
      transition: `opacity ${TRAIL_LIFE}ms ease-out, transform ${TRAIL_LIFE}ms ease-out`,
    });
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = "0";
      dot.style.transform = "scale(0.5) translateX(-6px)";
    });
    setTimeout(() => dot.remove(), TRAIL_LIFE);
  }

  function spawnSparks(x, y, count = 5, palette = NEON_SPARKS) {
    if (x === 0 && y === 0) return;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      const color = palette[Math.floor(Math.random() * palette.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 16 + Math.random() * (count > 6 ? 45 : 26);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 8;
      Object.assign(spark.style, {
        position: "fixed",
        left: x + "px",
        top: y + "px",
        width: "4px",
        height: "4px",
        background: color,
        boxShadow: `0 0 6px ${color}`,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "10000",
        opacity: "1",
        transform: "translate(0, 0) scale(1)",
        transition: `opacity ${SPARK_LIFE}ms ease-out, transform ${SPARK_LIFE}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      });
      document.body.appendChild(spark);
      requestAnimationFrame(() => {
        spark.style.opacity = "0";
        spark.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`;
      });
      setTimeout(() => spark.remove(), SPARK_LIFE);
    }
  }

  let shakeTimeout = null;
  function triggerMicroShake() {
    const target = document.activeElement?.closest(".xterm")
      ? document.querySelector(".xterm-screen")
      : document.querySelector(".monaco-editor .lines-content");
    if (!target) return;
    const rx = (Math.random() - 0.5) * 2.4;
    const ry = (Math.random() - 0.5) * 2.4;
    target.style.transform = `translate(${rx}px, ${ry}px)`;
    clearTimeout(shakeTimeout);
    shakeTimeout = setTimeout(() => {
      target.style.transform = "";
    }, 45);
  }

  function spawnShockwave(x, y) {
    if (x === 0 && y === 0) return;
    const ring = document.createElement("div");
    Object.assign(ring.style, {
      position: "fixed",
      left: x + "px",
      top: y + "px",
      width: "14px",
      height: "14px",
      border: "2px solid #00ffff",
      boxShadow: "0 0 12px #00ffff, inset 0 0 8px #ff00ff",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "9999",
      opacity: "0.95",
      transform: "translate(-30%, -30%) scale(0.4)",
      transition:
        "opacity 450ms ease-out, transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
    });
    document.body.appendChild(ring);
    requestAnimationFrame(() => {
      ring.style.opacity = "0";
      ring.style.transform = "translate(-30%, -30%) scale(3.6)";
    });
    setTimeout(() => ring.remove(), 460);
  }

  let mouseTicking = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  document.addEventListener(
    "mousemove",
    (e) => {
      resetIdleTimer();
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      if (!mouseTicking) {
        mouseTicking = true;
        requestAnimationFrame(() => {
          aura.style.left = e.clientX + "px";
          aura.style.top = e.clientY + "px";
          const editorContent = document.querySelector(
            ".monaco-workbench .part.editor > .content",
          );
          if (editorContent) {
            const px = Math.round((e.clientX / window.innerWidth) * -12);
            const py = Math.round((e.clientY / window.innerHeight) * -12);
            editorContent.style.backgroundPosition = `${px}px ${py}px`;
          }
          mouseTicking = false;
        });
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "mousedown",
    (e) => {
      resetIdleTimer();
      spawnClickRipple(e.clientX, e.clientY);
      requestAnimationFrame(updateTerminalBeam);
    },
    true,
  );

  let lastScrollSpark = 0;
  document.addEventListener(
    "wheel",
    (e) => {
      resetIdleTimer();
      const now = performance.now();
      if (now - lastScrollSpark > 65) {
        lastScrollSpark = now;
        spawnSparks(window.innerWidth - 10, e.clientY, 2, [
          "#00ffff",
          "#ff00ff",
        ]);
      }
    },
    { passive: true },
  );

  let lastKeyTime = 0;
  let lastSpawn = 0;

  document.addEventListener(
    "keydown",
    (e) => {
      resetIdleTimer();

      if (e.altKey && e.key.toLowerCase() === "m") {
        synthSoundEnabled = !synthSoundEnabled;
        showCyberToast(
          synthSoundEnabled ? "🔊 SYNTH AUDIO: ON" : "🔇 SYNTH AUDIO: OFF",
          synthSoundEnabled ? "#00ffff" : "#ff00ff",
        );
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        showCyberToast("⚡ SYS.SYNCED", "#00ff9f");
        playCyberClick(880, 0.05);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
        spawnFloatingTag(
          lastMouseX || 200,
          lastMouseY || 200,
          "COPIED // HEX",
          "#00ffff",
        );
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "v") {
        const c = getActiveCursorEl();
        if (c) {
          const rect = c.getBoundingClientRect();
          spawnDataSurge(rect.left, rect.top);
        }
        return;
      }

      if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key))
        return;

      const c = getActiveCursorEl();
      if (!c) return;

      const now = performance.now();
      const delta = now - lastKeyTime;
      lastKeyTime = now;

      playCyberClick(480 + Math.random() * 140, 0.02);
      requestAnimationFrame(updateTerminalBeam);

      if (e.key === "Backspace" || e.key === "Delete") {
        requestAnimationFrame(() => {
          const rect = c.getBoundingClientRect();
          spawnSparks(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            6,
            DISSOLVE_SPARKS,
          );
        });
        return;
      }

      if (e.key === "Enter") {
        requestAnimationFrame(() => {
          const rect = c.getBoundingClientRect();
          spawnShockwave(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
          );
        });
        return;
      }

      if (now - lastSpawn < 30) return;
      lastSpawn = now;

      requestAnimationFrame(() => {
        const rect = c.getBoundingClientRect();
        updateHud(now, rect);
        spawnTrail(rect.left, rect.top, rect.width, rect.height);

        if (delta > 0 && delta <= HIGH_WPM_INTERVAL) {
          spawnSparks(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            5,
            NEON_SPARKS,
          );
          triggerMicroShake();
        }
      });
    },
    true,
  );

  const hexPill = document.createElement("div");
  Object.assign(hexPill.style, {
    position: "fixed",
    top: "6px",
    right: "140px",
    padding: "2px 10px",
    background: "rgba(10, 4, 16, 0.75)",
    border: "1px solid var(--cyber-pri, #00ffff)",
    borderRadius: "4px",
    fontFamily: "'JetBrainsMono Nerd Font', monospace",
    fontSize: "10px",
    color: "var(--cyber-pri, #00ffff)",
    pointerEvents: "none",
    zIndex: "10005",
    opacity: "0.75",
    letterSpacing: "0.5px",
  });
  hexPill.textContent = "0x7FFE0000 // NEURAL_LINK: OK";
  document.body.appendChild(hexPill);

  function bumpHexTelemetry() {
    const addr =
      "0x" +
      Math.floor(0x7ffe0000 + Math.random() * 0xffff)
        .toString(16)
        .toUpperCase();
    hexPill.textContent = `${addr} // SYNC_ACTIVE`;
    hexPill.style.opacity = "1";
    setTimeout(() => {
      hexPill.style.opacity = "0.7";
    }, 200);
  }

  setInterval(() => {
    const isOverdrive = smoothedWpm >= 100;
    document.body.classList.toggle("cyber-overdrive-edge", isOverdrive);
  }, 250);

  document.addEventListener(
    "keydown",
    (e) => {
      bumpHexTelemetry();

      if (e.key === "Enter" && document.activeElement?.closest(".xterm")) {
        const screen = document.querySelector(".xterm-screen");
        if (screen) {
          screen.classList.remove("cyber-blackwall-glitch");
          void screen.offsetWidth;
          screen.classList.add("cyber-blackwall-glitch");
        }
      }

      const cursors = document.querySelectorAll(
        ".monaco-editor .cursors-layer .cursor",
      );
      if (
        cursors.length > 1 &&
        !["Shift", "Control", "Alt", "Meta"].includes(e.key)
      ) {
        requestAnimationFrame(() => {
          cursors.forEach((cur, idx) => {
            if (idx === 0) return;
            const r = cur.getBoundingClientRect();
            if (r.left > 0 && r.top > 0) {
              spawnSparks(
                r.left + r.width / 2,
                r.top + r.height / 2,
                3,
                T().sparks,
              );
            }
          });
        });
      }

      if (e.altKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        launchBreachGame();
      }
    },
    true,
  );

  const gameModal = document.createElement("div");
  Object.assign(gameModal.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "320px",
    padding: "18px",
    background: "rgba(10, 4, 16, 0.96)",
    backdropFilter: "blur(16px)",
    webkitBackdropFilter: "blur(16px)",
    border: "1px solid #ff00ff",
    boxShadow: "0 0 30px rgba(255, 0, 255, 0.45)",
    borderRadius: "10px",
    fontFamily: "'JetBrainsMono Nerd Font', monospace",
    color: "#d1f7ff",
    zIndex: "10030",
    display: "none",
    textAlign: "center",
  });
  document.body.appendChild(gameModal);

  function launchBreachGame() {
    if (gameModal.style.display === "block") {
      gameModal.style.display = "none";
      return;
    }
    const codes = ["1C", "55", "BD", "E9", "7A"];
    const targetSeq = [
      codes[Math.floor(Math.random() * 5)],
      codes[Math.floor(Math.random() * 5)],
      codes[Math.floor(Math.random() * 5)],
    ];
    let progress = 0;
    let timeLeft = 15.0;

    gameModal.style.display = "block";
    const grid = Array.from(
      { length: 25 },
      () => codes[Math.floor(Math.random() * codes.length)],
    );
    targetSeq.forEach((code) => {
      grid[Math.floor(Math.random() * 25)] = code;
    });

    function renderGame(statusMsg = "") {
      gameModal.innerHTML = `
        <div style="display:flex;justify-content:space-between;color:#ff00ff;font-weight:bold;margin-bottom:8px;">
          <span>😈 BREACH PROTOCOL</span>
          <span id="bg-timer" style="color:#ffff33;">${timeLeft.toFixed(1)}s</span>
        </div>
        <div style="font-size:11px;color:#00ffff;margin-bottom:10px;">
          TARGET: ${targetSeq.map((c, i) => `<span style="padding:2px 6px;border:1px solid ${i < progress ? "#00ff9f" : "#00ffff"};background:${i < progress ? "#00ff9f33" : "transparent"};margin:0 2px;">${c}</span>`).join("")}
        </div>
        <div id="bg-grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:10px;">
          ${grid.map((c, idx) => `<button data-idx="${idx}" data-val="${c}" style="padding:8px 0;background:#161826;color:#d1f7ff;border:1px solid #00ffff55;border-radius:4px;cursor:pointer;font-weight:bold;">${c}</button>`).join("")}
        </div>
        <div style="font-size:11px;color:#00ff9f;min-height:16px;">${statusMsg || "Click matching hex sequence! (ESC to exit)"}</div>
      `;

      gameModal.querySelectorAll("#bg-grid button").forEach((btn) => {
        btn.onclick = () => {
          if (btn.dataset.val === targetSeq[progress]) {
            btn.style.background = "#00ff9f";
            btn.style.color = "#090a0f";
            progress++;
            playCyberClick(700 + progress * 150, 0.04);
            if (progress === targetSeq.length) {
              clearInterval(timer);
              renderGame("⚡ ROOT ACCESS GRANTED! +1000 XP");
              spawnSparks(
                window.innerWidth / 2,
                window.innerHeight / 2,
                24,
                T().sparks,
              );
              setTimeout(() => {
                gameModal.style.display = "none";
              }, 1400);
            } else {
              renderGame();
            }
          } else {
            playCyberClick(160, 0.08);
            btn.style.borderColor = "#ff0055";
          }
        };
      });
    }

    renderGame();
    const timer = setInterval(() => {
      timeLeft -= 0.1;
      const tEl = gameModal.querySelector("#bg-timer");
      if (tEl) tEl.textContent = Math.max(0, timeLeft).toFixed(1) + "s";
      if (timeLeft <= 0 || gameModal.style.display === "none") {
        clearInterval(timer);
        if (gameModal.style.display === "block") {
          renderGame("✖ BREACH FAILED — SYSTEM LOCKED");
          setTimeout(() => {
            gameModal.style.display = "none";
          }, 1200);
        }
      }
    }, 100);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && gameModal.style.display === "block") {
      gameModal.style.display = "none";
    }
  });

  document.addEventListener("mousemove", resetIdleTimer);
  document.addEventListener("keydown", resetIdleTimer);
  document.addEventListener("click", resetIdleTimer);
  document.addEventListener("touchstart", resetIdleTimer);
  setTimeout(resetIdleTimer, 1000);
  console.log("[Cyber] God-Tier 20-Module Cyber Engine initialized");

  function spawnGravitySparks(x, y, count = 6) {
    if ((x === 0 && y === 0) || count <= 0) return;
    const pal = T().sparks;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      const color = pal[Math.floor(Math.random() * pal.length)];
      Object.assign(spark.style, {
        position: "fixed",
        left: x + "px",
        top: y + "px",
        width: "3.5px",
        height: "3.5px",
        background: color,
        boxShadow: `0 0 6px ${color}`,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "10006",
      });
      document.body.appendChild(spark);

      let vx = (Math.random() - 0.5) * 5.5;
      let vy = -2.2 - Math.random() * 3.5;
      const gravity = 0.28;
      let px = x;
      let py = y;
      let alpha = 1.0;

      function step() {
        vy += gravity;
        px += vx;
        py += vy;
        alpha -= 0.038;
        if (alpha <= 0) {
          spark.remove();
          return;
        }
        spark.style.left = px + "px";
        spark.style.top = py + "px";
        spark.style.opacity = String(alpha);
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  function spawnHoloCopyTag(x, y) {
    const tag = document.createElement("div");
    Object.assign(tag.style, {
      position: "fixed",
      left: x + "px",
      top: y - 16 + "px",
      color: T().pri,
      textShadow: `0 0 8px ${T().pri}`,
      fontFamily: "'JetBrainsMono Nerd Font', monospace",
      fontSize: "10px",
      fontWeight: "bold",
      pointerEvents: "none",
      zIndex: "10007",
      opacity: "1",
      transition: "opacity 550ms ease-out, transform 550ms ease-out",
    });
    tag.textContent = "COPIED // HEX";
    document.body.appendChild(tag);
    requestAnimationFrame(() => {
      tag.style.opacity = "0";
      tag.style.transform = "translateY(-24px)";
    });
    setTimeout(() => tag.remove(), 560);
  }

  function spawnBinarySurge(x, y) {
    const tokens = ["0", "1", "⚡", "0xFF", "10"];
    for (let i = 0; i < 12; i++) {
      const node = document.createElement("div");
      const dx = (Math.random() - 0.5) * 65;
      const dy = 30 + Math.random() * 60;
      Object.assign(node.style, {
        position: "fixed",
        left: x + dx + "px",
        top: y + "px",
        color: i % 2 === 0 ? T().ok : T().pri,
        textShadow: `0 0 6px ${T().ok}`,
        fontFamily: "'JetBrainsMono Nerd Font', monospace",
        fontSize: "11px",
        fontWeight: "bold",
        pointerEvents: "none",
        zIndex: "10007",
        opacity: "0.95",
        transition: "opacity 520ms ease-out, transform 520ms ease-in",
      });
      node.textContent = tokens[Math.floor(Math.random() * tokens.length)];
      document.body.appendChild(node);
      requestAnimationFrame(() => {
        node.style.opacity = "0";
        node.style.transform = `translateY(${dy}px)`;
      });
      setTimeout(() => node.remove(), 530);
    }
  }

  let ptrX = 200;
  let ptrY = 200;
  document.addEventListener(
    "mousemove",
    (e) => {
      ptrX = e.clientX;
      ptrY = e.clientY;
    },
    { passive: true },
  );

  let lastGravTime = 0;
  document.addEventListener(
    "keydown",
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
        spawnHoloCopyTag(ptrX, ptrY);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "v") {
        const c = getActiveCursorEl();
        if (c) {
          const r = c.getBoundingClientRect();
          spawnBinarySurge(r.left, r.top);
        }
        return;
      }

      if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key))
        return;
      const now = performance.now();
      if (now - lastGravTime < 110 && T().sparks.length > 0) {
        const c = getActiveCursorEl();
        if (c) {
          requestAnimationFrame(() => {
            const r = c.getBoundingClientRect();
            spawnGravitySparks(
              r.left + r.width / 2,
              r.top + r.height / 2,
              Math.min(4, 6),
            );
          });
        }
      }
      lastGravTime = now;
    },
    true,
  );

  function spawnLaserRaycast(targetX, targetY) {
    if (targetX <= 0 || targetY <= 0) return;
    const beam = document.createElement("div");
    const startX = window.innerWidth;
    const dx = targetX - startX;
    const dy = targetY - (targetY - 60);
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    Object.assign(beam.style, {
      position: "fixed",
      left: startX + "px",
      top: targetY - 60 + "px",
      width: length + "px",
      height: "1.5px",
      background: `linear-gradient(90deg, transparent, ${T().pri}, #ffffff)`,
      boxShadow: `0 0 8px ${T().pri}`,
      transformOrigin: "0 50%",
      transform: `rotate(${angle}deg)`,
      pointerEvents: "none",
      zIndex: "10008",
      opacity: "0.85",
      transition: "opacity 160ms ease-out",
    });

    document.body.appendChild(beam);
    requestAnimationFrame(() => {
      beam.style.opacity = "0";
    });
    setTimeout(() => beam.remove(), 170);
  }

  function spawnTargetDecodeTag(x, y) {
    const tag = document.createElement("div");
    Object.assign(tag.style, {
      position: "fixed",
      left: x + 12 + "px",
      top: y - 22 + "px",
      padding: "2px 8px",
      background: "rgba(10, 4, 16, 0.88)",
      border: `1px solid ${T().sec}`,
      boxShadow: `0 0 10px ${T().sec}`,
      color: T().sec,
      fontFamily: "'JetBrainsMono Nerd Font', monospace",
      fontSize: "10px",
      fontWeight: "bold",
      borderRadius: "4px",
      pointerEvents: "none",
      zIndex: "10009",
      opacity: "1",
      transition: "opacity 650ms ease-out, transform 650ms ease-out",
    });
    document.body.appendChild(tag);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@%";
    const finalText = "TARGET // LOCKED";
    let step = 0;

    const scrambleTimer = setInterval(() => {
      step++;
      if (step >= 6) {
        clearInterval(scrambleTimer);
        tag.textContent = finalText;
        tag.style.color = T().ok;
        tag.style.borderColor = T().ok;
      } else {
        tag.textContent = Array.from(
          { length: 12 },
          () => chars[Math.floor(Math.random() * chars.length)],
        ).join("");
      }
    }, 35);

    setTimeout(() => {
      tag.style.opacity = "0";
      tag.style.transform = "translateY(-14px)";
      setTimeout(() => tag.remove(), 660);
    }, 550);
  }

  const standbyBanner = document.createElement("div");
  standbyBanner.className = "cyber-holo-flicker";
  Object.assign(standbyBanner.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px 22px",
    background: "rgba(10, 4, 16, 0.82)",
    backdropFilter: "blur(8px)",
    webkitBackdropFilter: "blur(8px)",
    border: "1px solid var(--cyber-pri, #00ffff)",
    boxShadow: "0 0 24px rgba(0, 255, 255, 0.3)",
    color: "var(--cyber-pri, #00ffff)",
    fontFamily: "'JetBrainsMono Nerd Font', monospace",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "2px",
    borderRadius: "6px",
    pointerEvents: "none",
    zIndex: "10015",
    display: "none",
  });
  standbyBanner.textContent = "[ // SYSTEM STANDBY : FIREWALL ACTIVE ]";
  document.body.appendChild(standbyBanner);

  window.addEventListener("blur", () => {
    const wb = document.querySelector(".monaco-workbench");
    if (wb) wb.classList.add("cyber-window-blur");
    standbyBanner.style.display = "block";
  });

  window.addEventListener("focus", () => {
    const wb = document.querySelector(".monaco-workbench");
    if (wb) wb.classList.remove("cyber-window-blur");
    standbyBanner.style.display = "none";
  });

  const ecgBox = document.createElement("div");
  Object.assign(ecgBox.style, {
    position: "fixed",
    top: "5px",
    right: "335px",
    width: "72px",
    height: "20px",
    pointerEvents: "none",
    zIndex: "10005",
    opacity: "0.85",
  });
  ecgBox.innerHTML = `<svg width="72" height="20" viewBox="0 0 72 20"><polyline id="cyber-ecg-line" fill="none" stroke="var(--cyber-ok, #00ff9f)" stroke-width="1.5" points="0,10 18,10 24,4 30,17 36,2 42,14 48,10 72,10"/></svg>`;
  document.body.appendChild(ecgBox);

  let ecgPhase = 0;
  setInterval(() => {
    const poly = document.getElementById("cyber-ecg-line");
    if (!poly) return;
    const speedFactor = smoothedWpm > 20 ? Math.min(3.5, smoothedWpm / 35) : 1;
    ecgPhase += 0.35 * speedFactor;
    const amp = speedFactor > 1.5 ? 7 : 3.5;
    const y1 = 10 - Math.sin(ecgPhase) * amp;
    const y2 = 10 + Math.cos(ecgPhase * 1.4) * amp;
    const y3 = 10 - Math.sin(ecgPhase * 2.1) * (amp * 1.2);
    poly.setAttribute("stroke", speedFactor > 2.2 ? T().sec : T().ok);
    poly.setAttribute(
      "points",
      `0,10 14,10 22,${y1.toFixed(1)} 32,${y2.toFixed(1)} 42,${y3.toFixed(1)} 52,10 72,10`,
    );
  }, 60);

  document.addEventListener(
    "dblclick",
    (e) => {
      spawnTargetDecodeTag(e.clientX, e.clientY);
    },
    true,
  );

  let lastLaserTime = 0;
  document.addEventListener(
    "keydown",
    (e) => {
      if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key))
        return;
      const now = performance.now();
      if (now - lastLaserTime < 120) {
        const c = getActiveCursorEl();
        if (c) {
          requestAnimationFrame(() => {
            const r = c.getBoundingClientRect();
            spawnLaserRaycast(r.left + r.width / 2, r.top + r.height / 2);
          });
        }
      }
      lastLaserTime = now;
    },
    true,
  );
})();
