let recipies=[];
async function loadFetch() {
  let htmlMain = '';
  try{
    const response=await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const data=await response.json();
    const areas=data.meals;
    populateCuisineDropdown(areas);
    for(const country of areas ){
      const res=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country.strArea}`);
      const mealsData= await res.json();
      const items=mealsData.meals;
      
      items.forEach(item => {
        htmlMain += `
          <div class="recipe-container">
            <div class="image-container">
              <img class="recipe-image" src="${item.strMealThumb}">
            </div>
            <div class="recipe-name">
              ${item.strMeal}
            </div>
            <div class="cuisine-badge">
              Cuisine:${country.strArea}
            </div>
            <a href="instructions.html?id=${item.idMeal}">
              <div class="recipe-button-container">
                <button class="recipe-button">View the Recipe</button>
              </div>
            </a> 
          </div>
        `;
        recipies.push({
          'id':item.idMeal,
          'name':item.strMeal,
          'cuisine':country.strArea
        })
      });
    }
    
    
    return htmlMain;
  }catch(error){
    console.error('Error fetching meals:', error);
    return '<p>Error loading recipes. Please try again later.</p>';
  }
}
 
    
     
async function load() {
  document.querySelector('.recipe-grid').innerHTML = '<p>Loading recipes...</p>';
  const html=await loadFetch();
  document.querySelector('.recipe-grid').innerHTML = html;
  autoSearchFromURL();
  
}

load();


async function searchAppear(recipeSearch){
  let searchHTML='';
  try{
    for (const recipe of recipeSearch){
      const response=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.id}`);
      const data=await response.json();
      const details=data.meals[0];
      searchHTML+=
        ` <div class="recipe-container">
            <div class="image-container">
              <img class="recipe-image" src="${details.strMealThumb}">
            </div>
            <div class="recipe-name">
              ${details.strMeal}
            </div>
            <div class="cuisine-badge">
              Cuisine:${details.strArea}
            </div>
            <a href="instructions.html?id=${details.idMeal}">
              <div class="recipe-button-container">
                <button class="recipe-button">View the Recipe</button>
              </div>
            </a> 
          </div>
      `

    }
    return searchHTML;
  }catch(error){
    console.error('Error fetching meals:', error);
    return '<p>Error loading recipes. Please try again later.</p>';
  }
}

async function runSearch(query) {
  const lowerQuery = query.trim().toLowerCase();

  let recipeSearch = [];
  recipies.forEach((recipe) => {
    const name = recipe.name;
    const id = recipe.id;
    if (name.toLowerCase().includes(lowerQuery)) {
      recipeSearch.push(recipe);
    }
  });

  const html = await searchAppear(recipeSearch);
  document.querySelector('.recipe-grid').innerHTML = html;
}
function autoSearchFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');

  if (query) {
    document.querySelector('.js-search-bar').value = query;
    runSearch(query);
  }
}


function search() {
  const button = document.querySelector('.js-search-button');
  const input = document.querySelector('.js-search-bar');
  const resultsGrid = document.querySelector('.recipe-grid');

  if (!button || !input || !resultsGrid) {
    console.warn('Search elements not found.');
    return;
  }

  async function doSearch() {
    const query = input.value.trim();
    if (query !== '') {
      await runSearch(query);
    }
  }

  button.addEventListener('click', doSearch);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      doSearch();
    }
  });
}


function populateCuisineDropdown(areas) {
  const select = document.querySelector('.filter-cuisine');
  areas.forEach(area => {
    const option = document.createElement('option');
    option.value = area.strArea;
    option.textContent = area.strArea;
    select.appendChild(option);
  });
}


async function filter(){
  const selectCuisine=document.querySelector('.filter-cuisine').value;
  let filtered =recipies;
  if(selectCuisine !== 'All Cuisines'){
    filtered=recipies.filter(recipe =>
       recipe.cuisine === selectCuisine
    )
  }
  document.querySelector('.recipe-grid').innerHTML =
  '<p>Loading recipes...Please Wait</p>';
  const html = await searchAppear(filtered);
  document.querySelector('.recipe-grid').innerHTML = html;
}
document.querySelector('.filter-apply').addEventListener('click',filter)
search();