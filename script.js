/* Sequence controller. Narrative nodes are created after the first gesture. */

const MEDIA_IMAGE_URL = "assets/media.jpg";
const MEDIA_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1758973935099-5b662a863f6c?auto=format&fit=max&w=2000&q=80";
const AUDIO_SRC = "assets/music.mp3";

const NOTE = [
  "No hice esto porque las cosas entre nosotros hayan sido siempre fáciles. Lo hice porque sé que no lo han sido.",
  "Hemos tenido días muy buenos. También discusiones, cosas dichas de más y momentos en los que los dos tuvimos que aprender. Yo me equivoco. No siempre hago las cosas bien, y lo sé.",
  "Aun así, cuando pienso en nosotros, sigo pensando en construir. En quedarme. En crecer contigo. En verte cumplir lo que quieres, en acompañarte en lo que estás aprendiendo y en lo que todavía ni sabemos que vamos a vivir.",
  "Últimamente hablamos de tranquilidad, de confianza, de compromiso y de futuro. De sentir que esto vale la pena. Yo te escuché. Y me quedé con eso.",
  "No siempre sé demostrarte lo que siento como quisiera. Estoy aprendiendo a quererte mejor.",
  "Esto no es solo un regalo. Es mi forma de decirte que pensé en ti. Cuando me contaste lo que querías, no se me pasó. Sé que hay cosas que te hacen ilusión, y esta vez quería ser yo quien te diera una.",
  "Te amo, Laura. ❤️",
];

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOBILE = window.matchMedia("(max-width: 720px)").matches;

const ICON_ON =
  "M4 10h3.2L11 6.2v11.6L7.2 14H4v-4zm10.2-2.2a5 5 0 0 1 0 8.4M16.8 5.2a8.2 8.2 0 0 1 0 13.6";
const ICON_OFF =
  "M4 10h3.2L11 6.2v11.6L7.2 14H4v-4zm12.2-1.2l4 8m0-8l-4 8";

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function bindAudio(button) {
  const audio = document.getElementById("bed");
  const icon = document.getElementById("sound-icon");
  let available = true;
  let desired = false;

  audio.loop = true;
  audio.preload = "none";
  audio.volume = 0.16;

  function paint(state) {
    button.dataset.state = state;
    button.setAttribute("aria-pressed", state === "on" ? "true" : "false");
    button.setAttribute("aria-label", state === "on" ? "Silenciar" : "Activar sonido");
    if (icon) icon.setAttribute("d", state === "on" ? ICON_ON : ICON_OFF);
  }

  audio.addEventListener("error", () => {
    available = false;
    paint("unavailable");
  });

  async function play() {
    if (!available) return;
    try {
      await audio.play();
      paint("on");
    } catch (err) {
      paint("off");
    }
  }

  button.addEventListener("click", () => {
    if (!available) return;
    if (!audio.paused) {
      audio.pause();
      desired = false;
      paint("off");
      return;
    }
    desired = true;
    play();
  });

  return {
    start() {
      button.hidden = false;
      if (!audio.src) {
        audio.src = AUDIO_SRC;
      }
      desired = true;
      play();
    },
  };
}

function startField() {
  const canvas = document.getElementById("field");
  if (!canvas || REDUCE) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let running = true;
  const count = MOBILE ? 28 : 60;
  const dots = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  for (let i = 0; i < count; i += 1) {
    dots.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.35 + 0.25,
      v: Math.random() * 0.22 + 0.04,
      a: Math.random() * 0.4 + 0.08,
      tw: Math.random() * Math.PI * 2,
    });
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) window.requestAnimationFrame(frame);
  });

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    for (const dot of dots) {
      dot.y -= dot.v;
      dot.tw += 0.02;
      if (dot.y < -4) {
        dot.y = height + 4;
        dot.x = Math.random() * width;
      }
      const alpha = dot.a * (0.55 + 0.45 * Math.sin(dot.tw));
      ctx.beginPath();
      ctx.fillStyle = `rgba(230, 211, 174, ${alpha})`;
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    }
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
}

function spawnDrifts() {
  if (REDUCE) return;
  const root = document.getElementById("petals");
  const sparks = document.getElementById("sparks");
  if (!root || !sparks) return;

  const petals = MOBILE ? 11 : 18;
  for (let i = 0; i < petals; i += 1) {
    const node = el("span", i % 3 === 0 ? "drift alt" : "drift");
    node.style.left = `${Math.random() * 100}%`;
    node.style.animationDuration = `${10 + Math.random() * 11}s`;
    node.style.animationDelay = `${-Math.random() * 14}s`;
    node.style.setProperty("--s", (0.55 + Math.random() * 0.8).toFixed(2));
    node.style.setProperty("--o", (0.28 + Math.random() * 0.4).toFixed(2));
    node.style.setProperty("--dx", `${-30 + Math.random() * 80}px`);
    node.style.setProperty("--spin", `${180 + Math.random() * 220}deg`);
    root.appendChild(node);
  }

  const marks = MOBILE ? 5 : 8;
  for (let i = 0; i < marks; i += 1) {
    const node = el("span", "spark");
    node.style.left = `${8 + Math.random() * 84}%`;
    node.style.animationDuration = `${16 + Math.random() * 14}s`;
    node.style.animationDelay = `${-Math.random() * 18}s`;
    node.style.setProperty("--dx", `${-24 + Math.random() * 48}px`);
    sparks.appendChild(node);
  }
}

function burstFrom(caseNode) {
  const layer = caseNode.querySelector(".burst");
  if (!layer || REDUCE) return;
  layer.replaceChildren();
  const total = MOBILE ? 18 : 26;
  for (let i = 0; i < total; i += 1) {
    const node = el("i", i % 4 === 0 ? "bit mark" : "bit");
    const angle = (Math.PI * 2 * i) / total + Math.random() * 0.4;
    const dist = 70 + Math.random() * (MOBILE ? 110 : 150);
    node.style.setProperty("--x", `${Math.cos(angle) * dist}px`);
    node.style.setProperty("--y", `${Math.sin(angle) * dist - 30}px`);
    node.style.animationDelay = `${Math.random() * 0.12}s`;
    layer.appendChild(node);
  }
}

function buildCase() {
  const wrap = el("div", "case");
  wrap.id = "case";
  wrap.innerHTML = `
    <div class="case-rig">
      <div class="aura"></div>
      <div class="shell">
        <span class="band band-y"></span>
        <span class="band band-x"></span>
      </div>
      <div class="lid">
        <div class="lid-face">
          <span class="band band-y"></span>
          <span class="knot"></span>
        </div>
      </div>
    </div>
    <div class="case-shadow"></div>
    <div class="burst"></div>
  `;
  return wrap;
}

async function writeNote(sheet, hint) {
  for (let index = 0; index < NOTE.length; index += 1) {
    if (!REDUCE) await delay(index === 0 ? 900 : 460);
    sheet.hidden = false;
    if (index === 0) sheet.classList.add("rise");
    const paragraph = el("p", index === NOTE.length - 1 ? "closing" : "", NOTE[index]);
    sheet.appendChild(paragraph);
  }
  hint.hidden = false;
  hint.classList.add("rise");
}

function mountStory(root) {
  const note = el("section", "chapter chapter-note");
  const name = el("h2", "name rise");
  name.append(document.createTextNode("Laura"), el("span", "", "❤️"));
  name.style.animationDelay = "0.15s";
  const lead = el("p", "lead rise", "Hay cosas que a veces no sé cómo decirte...");
  lead.style.animationDelay = "0.7s";

  const sheet = el("article", "sheet");
  sheet.hidden = true;
  const hint = el("div", "hint");
  hint.hidden = true;
  hint.appendChild(el("i"));
  hint.setAttribute("aria-hidden", "true");

  note.append(name, lead, sheet, hint);
  void writeNote(sheet, hint);

  const pending = el("section", "chapter chapter-case");
  const bridge = el("p", "bridge rise", "Pero todavía falta una cosa...");
  bridge.style.animationDelay = "0.2s";
  const caseNode = buildCase();
  const open = el("button", "action plain", "Abrir ❤️");
  open.type = "button";
  open.id = "open";
  pending.append(bridge, caseNode, open);

  const reveal = el("section", "chapter chapter-reveal");
  reveal.id = "reveal";
  reveal.hidden = true;

  const frame = el("div", "frame");
  const image = el("img");
  image.alt = "";
  image.decoding = "async";
  image.src = MEDIA_IMAGE_URL;
  image.addEventListener("error", () => {
    if (image.dataset.fallback === "1") {
      frame.classList.add("is-empty");
      image.remove();
      return;
    }
    image.dataset.fallback = "1";
    image.src = MEDIA_IMAGE_SOURCE;
  });
  frame.appendChild(image);

  const soft = el("p", "soft", "Sí... finalmente pude ❤️");
  soft.style.animationDelay = "0.15s";
  const headline = el("h2", "headline", "Tu tablet.");
  headline.style.animationDelay = "0.4s";
  const copyA = el(
    "p",
    "copy",
    "Porque sé que quieres aprender, crear, jugar, hacer tus lives, descubrir cosas nuevas y construir poco a poco algo tuyo."
  );
  copyA.style.animationDelay = "0.7s";
  const copyB = el(
    "p",
    "copy",
    "Espero que esto sea apenas el comienzo de muchas cosas bonitas que puedas conseguir."
  );
  copyB.style.animationDelay = "1s";

  const sign = el("div", "sign");
  const rule = el("div", "line");
  const forLine = el("p", "for", "Para ti, Laura ❤️");
  forLine.style.animationDelay = "1.35s";
  const byline = el("p", "byline", "Con amor,");
  byline.style.animationDelay = "1.6s";
  const by = el("p", "by", "Ángel");
  by.style.animationDelay = "1.85s";
  const last = el("p", "last", "Ahora sí... ve a buscar tu regalo. ❤️");
  last.style.animationDelay = "2.2s";
  sign.append(rule, forLine, byline, by, last);

  reveal.append(frame, soft, headline, copyA, copyB, sign);
  root.append(note, pending, reveal);

  open.addEventListener("click", () => openCase(open, caseNode, reveal));
}

async function openCase(button, caseNode, reveal) {
  if (button.dataset.locked === "1") return;
  button.dataset.locked = "1";
  button.disabled = true;
  caseNode.classList.add("is-open");
  document.body.classList.add("is-focus");
  burstFrom(caseNode);
  await delay(REDUCE ? 40 : 1400);
  reveal.hidden = false;
  reveal.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
}

function boot() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const enter = document.getElementById("enter");
  const gate = document.getElementById("gate");
  const story = document.getElementById("story");
  const ambient = document.getElementById("ambient");
  const sound = document.getElementById("sound");
  if (!enter || !gate || !story || !ambient || !sound) return;

  const audio = bindAudio(sound);

  enter.addEventListener("click", async () => {
    if (enter.dataset.locked === "1") return;
    enter.dataset.locked = "1";
    enter.disabled = true;
    audio.start();
    document.body.classList.add("is-leaving");
    await delay(REDUCE ? 20 : 720);
    gate.hidden = true;
    ambient.hidden = false;
    story.hidden = false;
    document.body.classList.add("is-scene");
    mountStory(story);
    startField();
    spawnDrifts();
    window.scrollTo(0, 0);
  });
}

boot();
