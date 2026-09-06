(function () {
  "use strict";

  var pages = Array.prototype.slice.call(document.querySelectorAll(".spread"));
  var toc = Array.prototype.slice.call(document.querySelectorAll(".toc__item"));
  var pagination = document.getElementById("pagination");
  var page = Number(localStorage.getItem("microCPage")) || 0;

  var labels = [
    "PORTADA · ÍNDICE",
    "CAPÍTULO I · GPIO Y EL LED",
    "CAPÍTULO II · BITS Y REGISTROS",
    "CAPÍTULO III · EL RETO (CON CUIDADO)"
  ];

  // ---------- Navegación entre páginas ----------

  function closeMenu() {
    document.getElementById("sidebar").classList.remove("is-open");
    document.getElementById("sidebar-scrim").classList.remove("is-open");
    document.getElementById("menu-button").setAttribute("aria-expanded", "false");
  }

  function renderDots() {
    pagination.innerHTML = "";
    pages.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ir al capítulo " + (i + 1));
      dot.className = i === page ? "is-active" : "";
      dot.addEventListener("click", function () { go(i); });
      pagination.appendChild(dot);
    });
  }

  function go(next) {
    page = Math.max(0, Math.min(pages.length - 1, next));

    pages.forEach(function (el, i) {
      el.hidden = i !== page;
      el.classList.toggle("is-visible", i === page);
    });
    toc.forEach(function (el) {
      el.classList.toggle("is-active", Number(el.dataset.page) === page);
    });

    document.getElementById("previous-page").disabled = page === 0;
    var nextBtn = document.getElementById("next-page");
    nextBtn.disabled = page === pages.length - 1;
    nextBtn.innerHTML = page === pages.length - 1 ? "Fin <span>✓</span>" : "Siguiente <span>›</span>";

    document.body.dataset.chapter = String(page);
    document.getElementById("chapter-kicker").textContent = labels[page];
    document.getElementById("progress-label").textContent = (page + 1) + " de " + pages.length;
    document.getElementById("progress-bar").style.width = ((page + 1) / pages.length * 100) + "%";

    localStorage.setItem("microCPage", page);
    renderDots();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  }

  toc.forEach(function (el) {
    el.addEventListener("click", function () { go(Number(el.dataset.page)); });
  });
  document.getElementById("previous-page").addEventListener("click", function () { go(page - 1); });
  document.getElementById("next-page").addEventListener("click", function () { go(page + 1); });
  document.querySelectorAll("[data-next]").forEach(function (el) {
    el.addEventListener("click", function () { go(page + 1); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") go(page + 1);
    if (e.key === "ArrowLeft") go(page - 1);
  });

  // ---------- Menú lateral / modo de lectura ----------

  var menuButton = document.getElementById("menu-button");
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("sidebar-scrim");

  menuButton.addEventListener("click", function () {
    var open = sidebar.classList.toggle("is-open");
    scrim.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  scrim.addEventListener("click", closeMenu);

  document.getElementById("contrast-button").addEventListener("click", function () {
    var dark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("microCDark", dark ? "1" : "0");
  });
  if (localStorage.getItem("microCDark") === "1") {
    document.body.classList.add("dark-mode");
  }

  document.getElementById("reset-button").addEventListener("click", function () {
    localStorage.removeItem("microCPage");
    go(0);
  });
  document.getElementById("restart-book").addEventListener("click", function () {
    go(0);
  });

  // ---------- Capítulo I: estado del pin (LOW / HIGH) ----------

  var stateDisplay = document.getElementById("state-display");
  var pinState = document.getElementById("pin-state");
  var pinVoltage = document.getElementById("pin-voltage");

  document.querySelectorAll(".state-choice").forEach(function (button) {
    button.addEventListener("click", function () {
      var high = button.dataset.state === "high";
      stateDisplay.classList.toggle("is-high", high);
      pinState.textContent = high ? "HIGH" : "LOW";
      pinVoltage.textContent = high ? "5 V · LED encendido" : "0 V · LED apagado";
      document.querySelectorAll(".state-choice").forEach(function (b) {
        b.classList.toggle("is-selected", b === button);
      });
    });
  });

  // ---------- Capítulo II: registro PORTB interactivo ----------

  var register = document.getElementById("register");
  var bits = [];
  for (var i = 7; i >= 0; i--) {
    var bit = document.createElement("button");
    bit.type = "button";
    bit.className = "bit";
    bit.textContent = "0";
    bit.dataset.bit = i;
    bit.setAttribute("aria-label", "Bit " + i);
    if (i === 5) bit.classList.add("is-pin");
    register.appendChild(bit);
    bits.push(bit);
  }

  function updateRegister(active) {
    var binary = "";
    bits.forEach(function (bit) {
      var on = bit.classList.contains("is-on");
      bit.textContent = on ? "1" : "0";
      binary += on ? "1" : "0";
    });
    document.getElementById("register-binary").textContent = binary;
    document.getElementById("register-description").textContent =
      active === 5 ? "Bit 5 controla el pin 13. Acabas de modificar el LED desde el registro."
      : active < 0 ? "Registro restaurado a cero."
      : "Bit " + active + " actualizado. Cada bit puede tomar el valor 0 o 1.";
  }

  bits.forEach(function (bit) {
    bit.addEventListener("click", function () {
      bit.classList.toggle("is-on");
      updateRegister(Number(bit.dataset.bit));
    });
  });
  document.getElementById("clear-register").addEventListener("click", function () {
    bits.forEach(function (b) { b.classList.remove("is-on"); });
    updateRegister(-1);
  });

  // ---------- Capítulo III: simulación de buffer overflow ----------

  var memoryWrite = document.getElementById("memory-write");
  var memoryLayout = document.getElementById("memory-layout");
  var memoryNeighbor = document.getElementById("memory-neighbor");
  var memoryStatus = document.getElementById("memory-status");

  memoryWrite.addEventListener("click", function () {
    memoryLayout.classList.add("is-corrupt");
    memoryNeighbor.textContent = "led = BASURA";
    memoryStatus.className = "memory-status is-corrupt";
    memoryStatus.textContent = "estado[4] ya no pertenece al arreglo: el ejemplo acaba de pisar el valor vecino.";
    memoryWrite.disabled = true;
    memoryWrite.textContent = "Memoria corrompida";
  });

  // ---------- Arranque ----------
  go(page);
}());