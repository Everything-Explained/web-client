

export class ModernModal {

  private _modal: HTMLElement;
  private _overlay: HTMLElement;
  private _openButton: HTMLElement;
  private _closeButton: HTMLElement;
  private _header: HTMLElement;
  private _content: HTMLElement;

  constructor(overlayID: string, buttonID = '') {

    this._overlay = document.getElementById(overlayID);

    this._modal = <HTMLElement> this._overlay.getElementsByClassName('modal')[0];
    this._closeButton = <HTMLElement> this._modal.getElementsByClassName('close')[0];
    this._closeButton.innerHTML = '&#10060;';

    if (buttonID) {
      this._openButton = document.getElementById(buttonID);
      this._openButton.addEventListener('mousedown', (e) => {
        this.show();
      })
    }

    this._closeButton.addEventListener('mousedown', (e) => {
      if (e.button == 0)
        this._close();
    })

    this._overlay.addEventListener('mousedown', (e) => {
      this._close();
    })

    this._modal.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    })

    this._content = <HTMLElement> this._modal.getElementsByClassName('content')[0]
    this._header = <HTMLElement> this._modal.getElementsByTagName('header')[0];

  }


  set content(content: string) {
    this._content.innerHTML = content;
  }

  set header(content: string) {
    this._header.textContent = content;
  }

  public show() {
    this._overlay.classList.add('open');
    this._modal.classList.add('open');
  }

  private _close() {
    this._overlay.classList.remove('open');
    this._modal.classList.remove('open');
  }


}