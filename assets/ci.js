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

  /* ---------- Header encolhe ao rolar ---------- */
  (function () {
    var h = document.querySelector(".site-header");
    if (!h) return;
    var ticking = false;
    function upd() {
      h.classList.toggle("shrink", window.scrollY > 60);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(upd); ticking = true; }
    }, { passive: true });
    upd();
  })();

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

  /* ---------- Mensuração de conversão ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("a,button");
    if (!el) return;
    var label = el.getAttribute("data-gtm");
    var evt = el.getAttribute("data-event");
    if (!label && !evt) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: evt || "cta_click",
      cta_id: label || undefined,
      link_url: el.href || undefined,
      link_text: (el.textContent || "").trim(),
      page_name: document.documentElement.dataset.pageName || undefined,
      lead_channel: el.href && el.href.indexOf("wa.me") > -1 ? "whatsapp" : (el.href && el.href.indexOf("mailto:") === 0 ? "email" : "site")
    });
  });

  /* ---------- Profundidade de rolagem ---------- */
  (function () {
    var sent = {};
    function check() {
      var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
      if (h <= 0) return;
      var pct = Math.round((window.scrollY / h) * 100);
      [25, 50, 75, 90].forEach(function (mark) {
        if (pct >= mark && !sent[mark]) {
          sent[mark] = true;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "scroll_depth", percent_scrolled: mark, page_name: document.documentElement.dataset.pageName || undefined });
        }
      });
    }
    window.addEventListener("scroll", check, { passive: true });
  })();

  /* ---------- Formulário de diagnóstico ---------- */
  (function () {
    var form = document.querySelector("[data-lead-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var msg = [
        "Olá, vim pelo site da Castro Intelligence e quero solicitar um diagnóstico de Dados e IA.",
        "",
        "Nome: " + d.get("name"),
        "Empresa: " + d.get("company"),
        "Cargo: " + (d.get("role") || "não informado"),
        "Setor: " + d.get("sector"),
        "Desafio: " + d.get("challenge"),
        "Contexto: " + d.get("message")
      ].join("\n");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:"generate_lead",lead_channel:"whatsapp",lead_form:"diagnostico",lead_sector:d.get("sector"),lead_challenge:d.get("challenge")});
      window.open("https://wa.me/5531982779779?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  })();

})();
