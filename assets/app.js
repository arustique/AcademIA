// AcademIA — logique partagée (client Supabase, session, rendu du contenu)

const { createClient } = supabase; // global "supabase" fourni par le CDN @supabase/supabase-js
const sb = createClient(window.ACADEMIA_CONFIG.SUPABASE_URL, window.ACADEMIA_CONFIG.SUPABASE_ANON_KEY);

// ---------- Session ----------
async function requireSession(redirectTo = "auth.html") {
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    window.location.href = redirectTo;
    return null;
  }
  return data.session;
}

async function getProfile(userId) {
  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).single();
  if (error) { console.error(error); return null; }
  return data;
}

async function signOut() {
  await sb.auth.signOut();
  window.location.href = "index.html";
}

// ---------- Escape utilitaire ----------
function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// ---------- Rendu des blocs de contenu (même structure que le guide Word) ----------
function renderBlocks(blocks) {
  return blocks.map(renderBlock).join("");
}

function renderBlock(b) {
  switch (b.t) {
    case "h3":
      return `<h3 class="block-h3">${esc(b.text)}</h3>`;
    case "h3sub":
      return `<div class="block-h3sub"><span class="num">${esc(b.num)}</span>${esc(b.text)}</div>`;
    case "h3sub2":
      return `<div class="block-h3sub2">${esc(b.text)}</div>`;
    case "p":
      return `<p>${esc(b.text)}</p>`;
    case "bullets":
      return `<ul class="bullets">${b.items.map(it =>
        `<li><b>${esc(it.label)}</b> — ${esc(it.text)}</li>`).join("")}</ul>`;
    case "steps":
      return `<ol class="steps">${b.items.map(it =>
        `<li><b>${esc(it.label)}</b> — ${esc(it.text)}</li>`).join("")}</ol>`;
    case "callout":
      return `<div class="callout"><div class="label">${esc(b.label)}</div><div class="text">${esc(b.text)}</div></div>`;
    case "prompt": {
      const id = "p" + Math.random().toString(36).slice(2, 9);
      return `<div class="prompt-box">
        <span class="tag">Prompt à copier</span>
        <pre id="${id}">${esc(b.text)}</pre>
        <button class="copy-btn" onclick="copyPrompt('${id}', this)">Copier le prompt</button>
      </div>`;
    }
    case "linkline":
      return `<p><em>${esc(b.label)}</em> : <a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.url)}</a></p>`;
    case "table": {
      const head = `<tr>${b.headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr>`;
      const rows = b.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
      return `<table class="data-table">${head}${rows}</table>`;
    }
    case "resources":
      return `<div class="resources"><span class="tag">Pour aller plus loin</span>${b.items.map(it => `
        <div class="resource-item">
          <a class="title" href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.title)}</a>
          <div class="desc">${esc(it.desc || "")}</div>
        </div>`).join("")}</div>`;
    default:
      return "";
  }
}

function copyPrompt(id, btn) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = "Copié ✓";
    setTimeout(() => (btn.textContent = original), 1800);
  });
}
