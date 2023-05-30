import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  _errorMessage = `No recipes found for your query. Please try again!`;
  _successMessage = '';

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markUp = this._generateMarkup();
    if (!render) {
      return markUp;
    }
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   return this.renderError();
    // }

    this._data = data;
    const newMarkUp = this._generateMarkup();
    //converting the new markup to html elements.

    // The Virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkUp);

    const newDOMelements = newDOM.querySelectorAll('*');

    // The Actual DOM
    const curDOMelements = Array.from(this._parentEl.querySelectorAll('*'));

    newDOMelements.forEach((newEle, i) => {
      const curElement = curDOMelements[i];
      // Here we are checking if the 2 elements are equal & if the new element has any text content inside "not an img for ex" ,so that we can update the text content of the element
      debugger;
      if (
        !newEle.isEqualNode(curElement) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        curElement.textContent = newEle.textContent;
      }
      // Updating the attributes of each element incase of its content has changed.
      if (!newEle.isEqualNode(curElement)) {
        const newEleAttrs = Array.from(newEle.attributes);
        newEleAttrs.forEach(attr => {
          curElement?.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  renderError(message = this._errorMessage) {
    const markUp = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderSuccessM(message = this._successMessage) {
    const markUp = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderSpinner() {
    const html = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
}
