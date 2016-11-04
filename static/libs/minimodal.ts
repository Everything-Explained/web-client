

class MiniModal {

  private _modals: HTMLElement[];
  private _openModalBtns: HTMLElement[];


  constructor() {

    this._modals = this._toArray(document.querySelectorAll('.modal-overlay'));
    this._openModalBtns = this._toArray(document.querySelectorAll('.modal-trigger'));

    this._modals.forEach((modal) => {

      let closeBtn = modal.querySelector('.close-modal') as HTMLElement;

      if (closeBtn) {
        closeBtn.addEventListener('click',
          () => this._closeModal(modal));
      } else {
        // This is not a breaking condition
        console.warn(`MiniModal ::: No close Button detected in: "${modal.id}"`);
      }

      // Closes modal on overlay click
      modal.addEventListener('click',
        () => this._closeModal(modal));

      // Arbitrary clicks should not close the modal
      modal.children[0].addEventListener('click',
        (e: MouseEvent) => this._preventBubble(e));
    });

    this._openModalBtns.forEach((btn) => {
      let id = btn.dataset['trigger']
        , modal = this._findModal(id);

      if (!modal) throw new Error(`MiniModal ::: Incorrect Data on Button ::: (ID:"${id}")`);

      btn.addEventListener('click', () => {
        this._show(modal);
      });
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

  private _toArray(nodes: NodeList): any[] {
    return Array.prototype.slice.call(nodes);
  }


  private _findModal(id: string) {
    for (let e of this._modals) {
      if (e.id == id) return e;
    }
  }


  private _show(modal: HTMLElement) {
    modal.classList.add('modal-open');
  }

  public _hide(modal: HTMLElement) {
    modal.classList.remove('modal-open');
  }

  public show(id: string) {
    let modal = document.getElementById(id);
    if (!modal) {
      throw new Error(`MiniModal ::: Incorrect Modal ID:"${id}"`);
    }
    this._show(modal);
  }



}