// scripts.js — data + render logic for RecipeVeg (vegetarian-only view)

// Sample data (mix includes a non-veg item to demonstrate filtering; only veg recipes will be shown)
const RECIPES = [
  {
    id: 1,
    title: "Paneer Butter Masala",
    image: "https://images.unsplash.com/photo-1604908177522-0b7c7d54188a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
    description: "Creamy tomato-based curry with soft paneer cubes.",
    tags: ["North Indian", "Main"],
    isVegetarian: true,
    benefits: [
      "Paneer is a good source of protein and calcium.",
      "Tomatoes provide vitamin C and antioxidants.",
      "Balanced fats and protein help satiety."
    ]
  },
  {
    id: 2,
    title: "Vegetable Biryani",
    image: "https://images.unsplash.com/photo-1604908177523-324c8c2b9cc9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
    description: "Aromatic rice layered with seasonal vegetables and spices.",
    tags: ["Rice", "Festive"],
    isVegetarian: true,
    benefits: [
      "Vegetables increase fiber and micronutrient intake.",
      "Spices like turmeric have anti-inflammatory properties.",
      "Rice provides sustained energy from complex carbs."
    ]
  },
  {
    id: 3,
    title: "Masoor Dal (Red Lentil Curry)",
    image: "https://images.unsplash.com/photo-1589308078053-9b2b2f69d6f7?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
    description: "Simple and nutritious red lentil curry.",
    tags: ["Protein-rich", "Comfort Food"],
    isVegetarian: true,
    benefits: [
      "Lentils are high in plant-based protein and fiber.",
      "Supports stable blood sugar levels.",
      "Rich in folate, iron, and potassium."
    ]
  },
  {
    id: 4,
    title: "Chicken Curry (example non-veg)",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
    description: "Traditional chicken curry.",
    tags: ["Non-veg"],
    isVegetarian: false,
    benefits: [
      "High in animal protein."
    ]
  }
];

// DOM elements
const recipesEl = document.getElementById('recipes');
const searchEl = document.getElementById('search');
const tagFilterEl = document.getElementById('tagFilter');

const modalEl = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalList = document.getElementById('modalList');
const modalClose = document.getElementById('modalClose');

function init() {
  populateTagFilter();
  renderRecipes();

  searchEl.addEventListener('input', renderRecipes);
  tagFilterEl.addEventListener('change', renderRecipes);
  modalClose.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

function populateTagFilter() {
  // extract tags from vegetarian recipes only
  const tags = new Set();
  RECIPES.filter(r => r.isVegetarian).forEach(r => r.tags.forEach(t => tags.add(t)));
  Array.from(tags).sort().forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    tagFilterEl.appendChild(opt);
  });
}

function renderRecipes() {
  const query = searchEl.value.trim().toLowerCase();
  const tag = tagFilterEl.value;

  // filter: only vegetarian recipes
  const filtered = RECIPES.filter(r => r.isVegetarian)
    .filter(r => (!query || r.title.toLowerCase().includes(query) || (r.description && r.description.toLowerCase().includes(query))))
    .filter(r => (!tag || r.tags.includes(tag)));

  recipesEl.innerHTML = '';

  if (filtered.length === 0) {
    recipesEl.innerHTML = '<p>No vegetarian recipes found.</p>';
    return;
  }

  filtered.forEach(recipe => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img alt="${escapeHtml(recipe.title)}" src="${recipe.image}" />
      <div class="card-body">
        <h3>${escapeHtml(recipe.title)}</h3>
        <p>${escapeHtml(recipe.description)}</p>
        <div class="meta">
          ${recipe.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="actions">
          <button class="btn view-benefits" data-id="${recipe.id}">View Benefits</button>
          <button class="btn secondary" onclick="copyRecipe(${recipe.id})">Copy Title</button>
        </div>
      </div>
    `;
    recipesEl.appendChild(card);
  });

  // attach event listeners for the newly added buttons
  document.querySelectorAll('.view-benefits').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.id);
      openBenefits(id);
    });
  });
}

function openBenefits(id) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe) return;
  modalTitle.textContent = \
`${recipe.title} — Benefits`;
  modalList.innerHTML = recipe.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join('');
  modalEl.setAttribute('aria-hidden', 'false');
  // move focus to close button for accessibility
  modalClose.focus();
}

function closeModal() {
  modalEl.setAttribute('aria-hidden', 'true');
}

// small helper to copy recipe title (demo action)
function copyRecipe(id) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe) return;
  navigator.clipboard?.writeText(recipe.title).then(() => {
    alert(`Copied: ${recipe.title}`);
  }).catch(() => {
    alert('Clipboard not available');
  });
}

// basic HTML escape for simple content
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

init();
