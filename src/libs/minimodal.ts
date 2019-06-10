export class MiniModal {

  private modals: HTMLElement[] = [];
  private escModalEvent = (ev: KeyboardEvent) => {};

  constructor() {}



  public preload(id: string) {
    for (let m of this.modals) {
      if (m.id == id) {
       return m.classList.add('modal-preloader');
      }
    }
    let modal = document.getElementById(id);
    if (!modal) {
      throw new Error(`MiniModal ::: Modal ID Does NOT Exist: "${id}"`);
    }
    else {
      this.addModal(modal);
      modal.classList.add('modal-preloader');
    }

  }

  public open(id: string) {
    for (let m of this.modals) {
      if (m.id === id) {
        return this.show(m, true);
      }
    }
    let modal = document.getElementById(id);
    if (!modal) {
      throw new Error(`MiniModal ::: Modal ID Does NOT Exist:"${id}"`);
    }
    else this.show(modal);
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

    this.modals.find((el, i) => {
      if (el.id == id) {
        this.modals.splice(i, 1);
        return true;
      }
      return false;
    });

  }





  private addModal(modal: HTMLElement) {

    // Add modal to modal list
    this.modals.push(modal);

    let closeBtn = modal.querySelector('.modal-close') as HTMLElement
      , modalList = this.modals;

    if (closeBtn) {
      closeBtn.addEventListener('click',
        () => this.closeModal(modal));
    } else {
      // This is not a breaking condition
      console.warn(`MiniModal ::: No close Button detected in: "${modal.id}"`);
    }

    document.removeEventListener('keyup', this.escModalEvent);
    let onKeyUp = (ev: KeyboardEvent) => {
      if (ev.keyCode == 27) {
        for (let m of modalList) {
          m.classList.remove('modal-open');
        }
      }
    };

    // Closes modal on overlay click
    modal.addEventListener('click',
      () => this.closeModal(modal)
    );


    // Arbitrary clicks should not close the modal
    modal.children[0].addEventListener('click',
      e => this.preventBubble(e as MouseEvent)
    );

    modal.children[1].addEventListener('click',
      e => this.preventBubble(e as MouseEvent)
    );

    document.addEventListener('keyup', onKeyUp);

    this.escModalEvent = onKeyUp;

  }


  private closeModal(modal: HTMLElement) {
    this.hide(modal);
  }

  
  /**
   * Prevent child event bubbling to parent element
   */
  private preventBubble(e: MouseEvent) {
    e.preventDefault();
    e.cancelBubble = true;
  }


  private show(modal: HTMLElement, exists = false) {
    if (exists) {
      modal.classList.remove('modal-preloader');
      return modal.classList.add('modal-open');
    }

    this.addModal(modal);
    modal.classList.add('modal-open');
  }


  private hide(modal: HTMLElement) {
    if (modal.classList.contains('modal-open')) {
      modal.classList.remove('modal-open');
      modal.classList.remove('modal-preloader');
    }
  }





}