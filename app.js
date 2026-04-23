const API_URL = '/items';

const form = document.getElementById('crud-form');
const itemIdInput = document.getElementById('item-id');
const itemNameInput = document.getElementById('item-name');
const itemValueInput = document.getElementById('item-value');
const cancelEditBtn = document.getElementById('cancel-edit');
const tableBody = document.querySelector('#items-table tbody');

async function fetchItems() {
  const res = await fetch(API_URL);
  const items = await res.json();
  renderTable(items);
}

function renderTable(items) {
  tableBody.innerHTML = '';
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name || ''}</td>
      <td>${item.value || ''}</td>
      <td>
        <button class="edit" onclick="editItem('${item.id}')">Edit</button>
        <button class="delete" onclick="deleteItem('${item.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

window.editItem = async function(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const item = await res.json();
  itemIdInput.value = item.id;
  itemNameInput.value = item.name;
  itemValueInput.value = item.value;
  form.querySelector('button[type="submit"]').textContent = 'Update Item';
  cancelEditBtn.style.display = 'inline-block';
}

window.deleteItem = async function(id) {
  if (!confirm('Delete this item?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchItems();
}

form.onsubmit = async e => {
  e.preventDefault();
  const id = itemIdInput.value;
  const name = itemNameInput.value.trim();
  const value = itemValueInput.value.trim();
  if (!name || !value) return;
  if (id) {
    // Update
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value })
    });
  } else {
    // Create
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value })
    });
  }
  form.reset();
  form.querySelector('button[type="submit"]').textContent = 'Add Item';
  cancelEditBtn.style.display = 'none';
  fetchItems();
};

cancelEditBtn.onclick = () => {
  form.reset();
  form.querySelector('button[type="submit"]').textContent = 'Add Item';
  cancelEditBtn.style.display = 'none';
};

fetchItems();
