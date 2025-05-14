const form = document.querySelector(".search-form");
const recipeList = document.querySelector(".recipe-list");
const recipeDetails = document.querySelector(".recipe-details");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const inputValue = event.target[0].value;
    searchRecipes(inputValue);
});

// Busca receitas pelo ingrediente
async function searchRecipes(ingredient) {
    recipeList.innerHTML = `<p>Carregando Receitas...</p>`;
    recipeDetails.innerHTML = ""; // Limpa os detalhes ao fazer nova busca

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();

        if (data.meals) {
            showRecipes(data.meals);
        } else {
            recipeList.innerHTML = `<p>Nenhuma Receita Encontrada</p>`;
        }
    } catch (err) {
        recipeList.innerHTML = `<p>Erro ao buscar receitas</p>`;
    }
}

// Exibe a lista de receitas
function showRecipes(recipes) {
    recipeList.innerHTML = recipes.map(item => `
        <div class="recipe-card" onclick="getRecipeDetails('${item.idMeal}')">
            <img src="${item.strMealThumb}" alt="receita-foto">
            <h3>${item.strMeal}</h3>
        </div>
    `).join("");
}

// Função para buscar os detalhes da receita
async function getRecipeDetails(id) {
    recipeDetails.innerHTML = `<p>Carregando Detalhes...</p>`;

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const recipe = data.meals[0];

        let ingredients = "";
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`;
            } else {
                break;
            }
        }

        recipeDetails.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>Categoria: ${recipe.strCategory}</h3>
            <h3>Origem: ${recipe.strArea}</h3>
            <h3>Ingredientes:</h3>
            <ul>${ingredients}</ul>
            <h3>Instruções:</h3>
            <p>${recipe.strInstructions}</p>
            ${recipe.strTags ? `<p><strong>Tags:</strong> ${recipe.strTags}</p>` : ""}
            <p><strong>Vídeo:</strong> <a href="${recipe.strYoutube}" target="_blank">Assista no YouTube</a></p>
        `;
    } catch (err) {
        recipeDetails.innerHTML = `<p>Erro ao carregar detalhes da receita.</p>`;
    }
}

