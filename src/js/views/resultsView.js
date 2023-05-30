import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');

  _generateMarkup() {
    return this._data
      .map(result => {
        return previewView.render(result, false);
      })
      .join('');
  }
}

export default new ResultsView();
