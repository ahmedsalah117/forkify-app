import { API_URL, RES_PER_Page } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';
import { TIME_OUT_SEC, KEY, WINDOW_CLOSE_SEC } from './config.js';
import addRecipeView from './views/addRecipeView.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_Page,
  },
  bookmarks: [],
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

function createRecipeObject(recipe) {
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    publisher: recipe.publisher,
    source: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    title: recipe.title,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipe(id) {
  try {
    const recipe = await Promise.race([
      AJAX(`${API_URL}/${id}?key=${KEY}`),
      timeout(TIME_OUT_SEC),
    ]);
    state.recipe = createRecipeObject(recipe);

    if (
      state.bookmarks.some(bookmark => {
        return bookmark.id === id;
      })
    ) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
}

//https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza

export async function loadSearchResults(query) {
  state.search.query = query;
  try {
    const data = await AJAX(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}&key=${KEY}`
    );

    state.search.results = data.map(rec => {
      return {
        id: rec.id,
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
}

export function getSearchResultsPerPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    return (ing.quantity =
      (ing.quantity * newServings) / state.recipe.servings);
  });

  state.recipe.servings = newServings;
}

function saveBookMarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookMark(recipe) {
  //Add the recipe as a bookmark
  state.bookmarks.push(recipe);

  //Mark the recipe as bookmarked by adding a new prop to the recipe object.

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  saveBookMarks();
}

export function deleteBookMark(id) {
  // Deleting it from the bookmarks array.

  const index = state.bookmarks.findIndex(ele => {
    return ele.id === id;
  });

  const deletedArr = state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  saveBookMarks();
}

export function restoreBookMarks() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
}

restoreBookMarks();

export async function uploadRecipe(newRecipe) {
  try {
    const recipeArr = Object.entries(newRecipe);
    const ingredients = recipeArr
      .filter(entry => {
        return entry[0].startsWith('ingredient') && entry[1] !== '';
      })
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim);
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format. Please use the correct format :)'
          );
        }

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const preparedRecipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      ingredients,
    };

    const recipe = await AJAX(`${API_URL}?key=${KEY}`, preparedRecipe);
    const recipeObject = createRecipeObject(recipe);
    state.recipe = recipeObject;
    addBookMark(recipeObject);
  } catch (err) {
    throw err;
  }
}

// TypeError: Cannot read properties of undefined (reading 'id')
//     at createRecipeObject (model.js:26:16)
//     at Object.uploadRecipe (model.js:179:26)
//     at async controlAddRecipe (controller.js:94:5)
