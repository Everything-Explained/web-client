export class MiniModal {

  private _modals: HTMLElement[] = [];
  private _escModalEvent: (ev: KeyboardEvent) => void;

  constructor() {}

  private _addModal(modal: HTMLElement) {

    // Add modal to modal list
    this._modals.push(modal);

    let closeBtn = modal.querySelector('.modal-close') as HTMLElement
      , modalList = this._modals;

    if (closeBtn) {
      closeBtn.addEventListener('click',
        () => this._closeModal(modal));
    } else {
      // This is not a breaking condition
      console.warn(`MiniModal ::: No close Button detected in: "${modal.id}"`);
    }

    document.removeEventListener('keyup', this._escModalEvent);
    let onKeyUp = (ev: KeyboardEvent) => {
      if (ev.keyCode == 27) {
        for (let m of modalList) {
          m.classList.remove('modal-open');
        }
      }
    };

    // Closes modal on overlay click
    modal.addEventListener('click',
      () => this._closeModal(modal));


    // Arbitrary clicks should not close the modal
    modal.children[0].addEventListener('click',
      (e: MouseEvent) => this._preventBubble(e));

    modal.children[1].addEventListener('click',
      (e: MouseEvent) => this._preventBubble(e));

    document.addEventListener('keyup', onKeyUp);

    this._escModalEvent = onKeyUp;

  }



  private _closeModal(modal: HTMLElement) {
    this._hide(modal);
  }

  /**
   * Prevent child event bubbling to parent element
   */
  private _preventBubble(e: MouseEvent) {
    e.preventDefault();
    e.cancelBubble = true;
  }


  private _show(modal: HTMLElement, exists = false) {
    if (exists) {
      modal.classList.remove('modal-preloader');
      return modal.classList.add('modal-open');
    }

    this._addModal(modal);
    modal.classList.add('modal-open');
  }

  public _hide(modal: HTMLElement) {
    if (modal.classList.contains('modal-open')) {
      modal.classList.remove('modal-open');
      modal.classList.remove('modal-preloader');
    }
  }

  public preload(id: string) {
    let modal: HTMLElement = null;
    for (let m of this._modals) {
      if (m.id == id) {
       return m.classList.add('modal-preloader');
      }
    }
    modal = document.getElementById(id);
    if (!modal) {
      throw new Error(`MiniModal ::: Modal ID Does NOT Exist: "${id}"`);
    }
    this._addModal(modal);
    modal.classList.add('modal-preloader');
  }

  public show(id: string) {
    let modal: HTMLElement = null;
    for (let m of this._modals) {
      if (m.id === id) {
        return this._show(m, true);
      }
    }
    modal = document.getElementById(id);
    if (!modal) {
      throw new Error(`MiniModal ::: Modal ID Does NOT Exist:"${id}"`);
    }
    this._show(modal);
  }



}