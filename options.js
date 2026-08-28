const KEY = "pdfsigner.signatures";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function render() {
  const list = load();
  const el = document.getElementById("list");
  el.innerHTML = "";
  if (!list.length) {
    el.innerHTML = '<p class="muted">Пока нет ни одной подписи. Создайте её в редакторе.</p>';
    return;
  }
  list.forEach((sig, i) => {
    const card = document.createElement("div");
    card.className = "sig-card";
    const img = document.createElement("img");
    img.src = sig.dataUrl;
    img.alt = sig.name || `Подпись ${i + 1}`;
    const name = document.createElement("span");
    name.textContent = sig.name || `Подпись ${i + 1}`;
    const del = document.createElement("button");
    del.className = "btn ghost small";
    del.textContent = "Удалить";
    del.onclick = () => {
      const next = load();
      next.splice(i, 1);
      save(next);
      render();
    };
    card.append(img, name, del);
    el.appendChild(card);
  });
}

document.getElementById("clear").onclick = () => {
  save([]);
  render();
};

render();
