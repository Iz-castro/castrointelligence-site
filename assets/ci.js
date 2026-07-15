/* ===========================================================
   Castro Intelligence — scripts institucionais
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Ano dinâmico ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Reveal ao rolar ---------- */
  (function () {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14 });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  })();

  /* ---------- Demo de conversa ----------
     A página define window.CI_CHAT = [{type:'in'|'out'|'tag'|'sys', text, t}]
     Regra de negócio: a agente NUNCA executa o agendamento.
     Ela entrega o link oficial ou encaminha para um atendente humano.
  ------------------------------------------------------------ */
  (function () {
    var body = document.getElementById("chatBody");
    var phone = document.querySelector(".phone");
    if (!body || !phone || !window.CI_CHAT) return;

    var msgs = window.CI_CHAT;

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    function linkify(s) {
      return esc(s).replace(/(https?:\/\/[^\s]+)/g, function (u) {
        return '<a href="' + u + '" target="_blank" rel="noopener">' + u + "</a>";
      });
    }

    var typing = null;
    function showTyping() {
      if (!typing) {
        typing = document.createElement("div");
        typing.className = "typing";
        typing.innerHTML = "<i></i><i></i><i></i>";
      }
      typing.classList.add("show");
      body.appendChild(typing);
    }
    function hideTyping() { if (typing) typing.classList.remove("show"); }

    function addBubble(m) {
      var el = document.createElement("div");
      if (m.type === "tag") { el.className = "bubble tag"; el.textContent = m.text; }
      else if (m.type === "sys") { el.className = "bubble sys"; el.textContent = m.text; }
      else {
        el.className = "bubble " + (m.type === "in" ? "in" : "out");
        el.innerHTML = linkify(m.text).replace(/\n/g, "<br>") +
          (m.t ? '<span class="t">' + esc(m.t) + "</span>" : "");
      }
      body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add("show"); });
    }

    var i = 0, started = false;
    function step() {
      if (i >= msgs.length) return;
      var m = msgs[i];
      if (m.type === "out") {
        showTyping();
        setTimeout(function () {
          hideTyping(); addBubble(m); i++; setTimeout(step, 800);
        }, m.text.length > 120 ? 1500 : 1100);
      } else {
        addBubble(m); i++;
        setTimeout(step, (m.type === "tag" || m.type === "sys") ? 700 : 900);
      }
    }
    function start() { if (started) return; started = true; setTimeout(step, 500); }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) {
        e.forEach(function (en) { if (en.isIntersecting) { start(); io.disconnect(); } });
      }, { threshold: 0.35 });
      io.observe(phone);
    } else { start(); }
  })();

})();
