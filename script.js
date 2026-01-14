// Basic interactions
document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.getElementById('title');
  const subtitleEl = document.getElementById('subtitle');
  const titleInput = document.getElementById('titleInput');
  const applyTitle = document.getElementById('applyTitle');
  const accentColor = document.getElementById('accentColor');
  const applyColor = document.getElementById('applyColor');
  const items = document.getElementById('items');
  const newItem = document.getElementById('newItem');
  const addItem = document.getElementById('addItem');
  const sampleBtn = document.getElementById('sampleBtn');

  applyTitle.addEventListener('click', () => {
    const v = titleInput.value.trim();
    if (v) titleEl.textContent = v;
  });

  applyColor.addEventListener('click', () => {
    const c = accentColor.value;
    document.documentElement.style.setProperty('--accent', c);
  });

  addItem.addEventListener('click', () => {
    const v = newItem.value.trim();
    if (!v) return;
    const li = document.createElement('li');
    li.innerHTML = `${escapeHtml(v)} <button class="remove">X</button>`;
    items.appendChild(li);
    newItem.value = '';
  });

  items.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
      const li = e.target.closest('li');
      if (li) li.remove();
    }
  });

  sampleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    subtitleEl.textContent = 'Bạn vừa nhấn nút mẫu!';
  });

  // simple escape to avoid HTML injection
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
