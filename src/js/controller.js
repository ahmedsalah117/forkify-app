import 'core-js'; // This is to polyfill modern JS core features and fn and make sure it's working across old browsers
import 'regenerator-runtime'; // This is to polyfill async/await and make sure it's working across old browsers
import resultsView from './views/resultsView.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { WINDOW_CLOSE_SEC } from './config.js';
import * as model from './model.js';

// https://forkify-api.herokuapp.com/v2

// MY API key : f7e5f97f-ecd0-4934-9b61-d63451f1807c
///////////////////////////////////////

const controlRecipe = async function () {
  try {
    // window.location is an object that has very important properties and methods about the url

    const id = window.location.hash.slice(1);

    if (!id) return; // guard Clause

    //loading spinner...
    recipeView.renderSpinner();
    // This will be triggered whenever the user clicks on a new recipe ,so that we refresh all the results and highlight the one that the user selected. This won't cause any errors when the code runs for the first time as the newDOM and the curDom in the update fn will be equal to an empty array.
    resultsView.update(model.getSearchResultsPerPage());
    bookmarksView.render(model.state.bookmarks);
    await model.loadRecipe(id);

    // Render Recipe.....

    recipeView.render(model.state.recipe);
    // bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

controlRecipe();

async function controlSearch() {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPerPage());
    paginationView.render(model.state.search);
  } catch (error) {
    searchView.renderError();
  }
}

function controlPagination(goToPage) {
  //rendering the next search results
  resultsView.render(model.getSearchResultsPerPage(goToPage));
  // render the next page buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // update the number of servings.
  model.updateServings(newServings);
  // update the recipe ingredients
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookMark() {
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
}

function controlBookMarks() {
  // model.restoreBookMarks(); // restore from localStorage;
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    //render a loading spinner
    addRecipeView.renderSpinner();
    //Upload the recipe data
    await model.uploadRecipe(newRecipe);
    //Render a success message
    addRecipeView.renderSuccessM();
    //render the new bookmarks
    bookmarksView.render(model.state.bookmarks);
    // update the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //we use the history api to change the url in the browser without reloading the page.
    // We can also use it to submit page back or forward ... window.history.back() as if the user clicked the back btn.
    // hide the form window
    setTimeout(function () {
      addRecipeView.toggleAddRecipe();
    }, WINDOW_CLOSE_SEC * 1000);
    //render the added recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    addRecipeView.renderError(err);
  }
}

function init() {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookMark);
  bookmarksView.addHandlerRender(controlBookMarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
