

async function getNutritionLabel(ingredientList) {
  const apiKey = '124e5c32595e41d6a6867a0d265e0b76';
  

  const response = await fetch(`https://api.spoonacular.com/recipes/visualizeNutrition?apiKey=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `ingredientList=${encodeURIComponent(ingredientList)}`
  });

  const nutritionHtml = await response.text();

  document.querySelector('.nutrition').innerHTML = nutritionHtml;
}


let ingredientList='';
async function loadins(){
  let html='';
  const url=new URL(window.location.href);
  const id=url.searchParams.get('id');

try{
    const response=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    
    const data=await response.json();
    const details=data.meals[0];
    const youtubeUrl = details.strYoutube;
    let thumbnailUrl;
    if (youtubeUrl) {
      const videoId = youtubeUrl.split("v=")[1];
      const ampersandPosition = videoId.indexOf("&");
      const cleanVideoId = ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
      thumbnailUrl = `https://img.youtube.com/vi/${cleanVideoId}/0.jpg`;
    }
    let ingredientshtml='';
    
    for(let i=1;i<=20;i++){
      const ingredient=details[`strIngredient${i}`];
      const measure=details[`strMeasure${i}`];
      if(ingredient && ingredient.trim() !== ''){
        ingredientList += `${measure ? measure.trim() : ''} ${ingredient.trim()}\n`;
        const imageurl=`https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient)}.png`;
        ingredientshtml+=
          `<div class="ingredient-item">
              <img src="${imageurl}" alt="${ingredient}">
              <span>${measure ? measure : ''} ${ingredient}</span>
            </div>
          `
      }
    }

    html+=
    `<div class="recipe-title">
        ${details.strMeal}
      </div>
      <div class="recipe-info">
        <div class="HealthScore">
          Cuisine:${details.strArea}
        </div>
        <div class="Youtube">
          <a href="${details.strYoutube}"
          target="_blank">Youtube Link</a>
        </div>
      </div>
      <div class="recipe-main">
        <div class="recipe-image-container">
          <img class="recipe-image" src="${details.strMealThumb}">
        </div>
        <div class="ingredients">
          <h3>Ingredients Required:</h3>
          <div class="ingredients-container">
            ${ingredientshtml}
          </div>
          
        </div>
      
      </div>
      <div class="instruction-card">
        <h3>Instructions:</h3>
        <p class="step-text">
          ${details.strInstructions}
        </p>
      </div>
      <div class="nutrition">
        <button class="nutrition-button">View Nutrition Info</button>
      </div>
    `
    return html;

  }catch(error){
    console.error('Error fetching meals:', error);
    return '<p>Error loading recipes. Please try again later.</p>';
  }
}


async function load() {
  document.querySelector('.recipe-box').innerHTML = '<p>Loading recipe instructions...</p>';
  const html=await loadins();
  document.querySelector('.recipe-box').innerHTML = html;
  const button = document.querySelector('.nutrition-button');
  if (button) {
    button.addEventListener('click', () => {
      getNutritionLabel(ingredientList);
    });
  
  }
}

load();
setupRedirectSearch();


function setupRedirectSearch() {
  const button = document.querySelector('.search-button');
  const input = document.querySelector('.search-bar');

  if (!button || !input) return;

  function redirect() {
    const query = input.value.trim();
    if (query !== '') {
      window.location.href = `main.html?query=${encodeURIComponent(query)}`;
    }
  }

  button.addEventListener('click', redirect);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      redirect();
    }
  });
}


