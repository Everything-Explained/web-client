export class MiniModal {

  private _modals: HTMLElement[] = [];
  private _escModalEvent = (ev: KeyboardEvent) => {};

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
      () => this._closeModal(modal)
    );


    // Arbitrary clicks should not close the modal
    modal.children[0].addEventListener('click',
      e => this._preventBubble(e as MouseEvent)
    );

    modal.children[1].addEventListener('click',
      e => this._preventBubble(e as MouseEvent)
    );

    document.addEventListener('keyup', onKeyUp);

    this._escModalEvent = onKeyUp;

  }


  public preload(id: string) {
    for (let m of this._modals) {
      if (m.id == id) {
       return m.classList.add('modal-preloader');
      }
    }
    let modal = document.getElementById(id);
    if (!modal) {
      throw new Error(`MiniModal ::: Modal ID Does NOT Exist: "${id}"`);
    }
    else {
      this._addModal(modal);
      modal.classList.add('modal-preloader');
    }

  }

  public show(id: string) {
    for (let m of this._modals) {
      if (m.id === id) {
        return this._show(m, true);
      }
    }
    let modal = document.getElementById(id);
    if (!modal) {
      throw new Error(`MiniModal ::: Modal ID Does NOT Exist:"${id}"`);
    }
    else this._show(modal);
  }


  /**
   * Removes a modal by id, from the internal modal list.
   * (Only use this if your modal HTML is removed from the DOM)
   *
   * @param {string} id The id of the modal element
   *
   * @memberOf MiniModal
   */
  public cleanup(id: string) {

    this._modals.find((el, i) => {
      if (el.id == id) {
        this._modals.splice(i, 1);
        return true;
      }
      return false;
    });

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

  private _hide(modal: HTMLElement) {
    if (modal.classList.contains('modal-open')) {
      modal.classList.remove('modal-open');
      modal.classList.remove('modal-preloader');
    }
  }





}