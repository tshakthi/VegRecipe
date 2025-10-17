let isTamil = false;
let editIndex = null;

const recipes = JSON.parse(localStorage.getItem("recipes")) || [
  {
    nameEn: "Sambar",
    nameTa: "சாம்பார்",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2019/05/sambar-recipe.jpg",
    ingredientsEn: ["Toor dal", "Tamarind", "Vegetables", "Sambar powder"],
    ingredientsTa: ["துவரம் பருப்பு", "புளி", "காய்கறிகள்", "சாம்பார் பொடி"],
    instructionsEn: "Cook dal and vegetables with tamarind water and sambar powder.",
    instructionsTa: "துவரம் பருப்பு, காய்கறிகள், புளிநீர் மற்றும் சாம்பார் பொடி சேர்த்து வேகவைக்கவும்."
  }
];

const container = document.getElementById("recipeContainer");
const modal = document.getElementById("recipeModal");
const closeBtn = document.querySelector(".close");
const formModal = document.getElementById("formModal");
const closeFormBtn = document.querySelector(".close-form");

// Display recipes
function displayRecipes() {
  container.innerHTML = "";
  recipes.forEach((recipe, index) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.nameEn}">
      <h3>${isTamil ? recipe.nameTa : recipe.nameEn}</h3>
      <div class="actions">
        <button onclick="editRecipe(${index})">Edit</button>
        <button onclick="deleteRecipe(${index})">Delete</button>
      </div>
    `;
    card.onclick = (e) => {
      if (!e.target.matches("button")) showRecipe(recipe);
    };
    container.appendChild(card);
  });
}
displayRecipes();

// Search
document.getElementById("searchInput").addEventListener("input", function() {
  const query = this.value.toLowerCase();
  const filtered = recipes.filter(r =>
    (isTamil ? r.nameTa : r.nameEn).toLowerCase().includes(query)
  );
  container.innerHTML = "";
  filtered.forEach(r => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `<img src="${r.image}" alt="${r.nameEn}"><h3>${isTamil ? r.nameTa : r.nameEn}</h3>`;
    card.onclick = () => showRecipe(r);
    container.appendChild(card);
  });
});

// Show Recipe
function showRecipe(recipe) {
  modal.style.display = "block";
  document.getElementById("recipeTitle").textContent = isTamil ? recipe.nameTa : recipe.nameEn;
  document.getElementById("recipeImage").src = recipe.image;

  const ingredientsList = document.getElementById("recipeIngredients");
  ingredientsList.innerHTML = "";
  (isTamil ? recipe.ingredientsTa : recipe.ingredientsEn).forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ingredientsList.appendChild(li);
  });

  document.getElementById("recipeInstructions").textContent = isTamil ? recipe.instructionsTa : recipe.instructionsEn;
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

// Language Toggle
document.getElementById("langToggle").onclick = () => {
  isTamil = !isTamil;
  document.getElementById("title").textContent = isTamil ? "🌿 தமிழ் சைவ சமையல்" : "🌿 Tamil Nadu Veg Recipes";
  document.getElementById("searchInput").placeholder = isTamil ? "சமையல் தேட..." : "Search recipes...";
  document.getElementById("ingredientTitle").textContent = isTamil ? "பொருட்கள்:" : "Ingredients:";
  document.getElementById("instructionTitle").textContent = isTamil ? "செய்முறை:" : "Instructions:";
  document.getElementById("langToggle").textContent = isTamil ? "English" : "தமிழ்";
  displayRecipes();
};

// Add Recipe Modal
document.getElementById("addRecipeBtn").onclick = () => {
  editIndex = null;
  document.getElementById("formTitle").textContent = "Add Recipe";
  formModal.style.display = "block";
};

closeFormBtn.onclick = () => formModal.style.display = "none";

document.getElementById("saveRecipeBtn").onclick = () => {
  const name = document.getElementById("recipeName").value.trim();
  const image = document.getElementById("recipeImageURL").value.trim();
  const ingredients = document.getElementById("recipeIngredientsInput").value.split(",");
  const instructions = document.getElementById("recipeInstructionsInput").value.trim();

  if (!name || !image || ingredients.length === 0 || !instructions) {
    alert("Please fill all fields!");
    return;
  }

  const newRecipe = {
    nameEn: name,
    nameTa: name, // optional: can add translation later
    image,
    ingredientsEn: ingredients,
    ingredientsTa: ingredients,
    instructionsEn: instructions,
    instructionsTa: instructions
  };

  if (editIndex !== null) recipes[editIndex] = newRecipe;
  else recipes.push(newRecipe);

  localStorage.setItem("recipes", JSON.stringify(recipes));
  displayRecipes();
  formModal.style.display = "none";
  clearForm();
};

// Edit & Delete
function editRecipe(index) {
  const r = recipes[index];
  document.getElementById("recipeName").value = r.nameEn;
  document.getElementById("recipeImageURL").value = r.image;
  document.getElementById("recipeIngredientsInput").value = r.ingredientsEn.join(", ");
  document.getElementById("recipeInstructionsInput").value = r.instructionsEn;
  editIndex = index;
  document.getElementById("formTitle").textContent = "Edit Recipe";
  formModal.style.display = "block";
}

function deleteRecipe(index) {
  if (confirm("Delete this recipe?")) {
    recipes.splice(index, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    displayRecipes();
  }
}

function clearForm() {
  document.getElementById("recipeName").value = "";
  document.getElementById("recipeImageURL").value = "";
  document.getElementById("recipeIngredientsInput").value = "";
  document.getElementById("recipeInstructionsInput").value = "";
}
