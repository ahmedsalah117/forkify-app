import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _successMessage = 'Recipe was successfully added :)';
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleAddRecipe() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleAddRecipe.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleAddRecipe.bind(this));
    this._overlay.addEventListener('click', this.toggleAddRecipe.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = [...new FormData(this)];
      const dataObject = Object.fromEntries(data);
      handler(dataObject);
    });
  }
}

export default new AddRecipeView();
