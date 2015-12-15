

class ModernModal {

  private _overlay: HTMLElement;
  private _preloader: HTMLElement;
  private _openButton: HTMLElement;
  private _header: HTMLElement;
  private _modal: HTMLElement;
  private _content: HTMLElement;

  private _lastURL = '';
  private _template: HTMLElement;
  private _workingClasses = new Object();
  private _browserChecked = false;

  public classes = {
    modalContainer: 'modal-container',
    modal: 'modal',
    preloader: 'modal-preloader',
    content: 'modal-content',
    closeBtn: 'modal-close',
  }

  constructor(overlayID: string) {

    this._browserCheck();

    this._overlay = document.getElementById(overlayID);
    this._preloader = this._overlay.querySelector('.' + this.classes.preloader) as HTMLElement;

    // Apply default mouse events
    this._overlay.addEventListener('mousedown', (ev) => {
      let t = ev.target as HTMLElement;
      if(t.className == this.classes.closeBtn) {
        this._close();
      }

      if(t.id == overlayID || t.className == this.classes.modalContainer) {
        this._close();
      }
    })

  }



  /**
   * Shows the modal using the specified template
   *
   * @param url The location of the html template
   * @param head The header of the modal window
   * @param contentObj The optional dynamic content to add based on class names
   */
  public show(url: string, head: string, contentObj?: Object|string) {

    this._preloader.classList.remove('open');

    if (url === this._lastURL && this._template) {
      this._header.innerHTML = head;
      this._writeContent(contentObj);
      this._open();

    } else {
      this.loadTemplate(url, (typeof contentObj === 'string') ? null : contentObj)
        .then((res: boolean) => {

          this._writeContent(contentObj);

          // Modal must be rendered before shown
          setTimeout(() => {
            this._open();
            if (head) this._header.innerHTML = head;
          }, 100);

        })
    }


  }



  /**
   * Loads the template into the page.
   *
   * @param url The location of the template to load
   * @param data A string array of classes or Object containing information
   *             about the elements you intend to update.
   */
  public loadTemplate(url: string, data?: string[]|Object) {

    // Track the last template
    this._lastURL = url;

    this._clearPrevTemplate();

    return new Promise((rs, rj) => {

      this._getTemplate(url).then((res: string) => {

        this._template = this._parseTemplate(res);
        this._overlay.appendChild(document.importNode(this._template, true));
        this._header = this._overlay.querySelector('header') as HTMLElement;
        this._content = this._overlay.querySelector('.' + this.classes.content) as HTMLElement;
        this._modal = this._overlay.querySelector('.' + this.classes.modal) as HTMLElement;

        if ( data) {
          this._getElementsFromClasses(data);
        }

        rs(true);

      })


    })


  }



  /**
   * Shows the modal preloader when you know your content
   * is going to take a while to return.
   */
  public preload() {
    this._clearPrevTemplate();
    this._preloader.classList.add('open');
    this._overlay.classList.add('open');
  }



  /** Clears the previously loaded template. */
  private _clearPrevTemplate() {
    if (this._template) {
      let node = this._overlay.getElementsByClassName(this.classes.modalContainer)[0] as HTMLElement
      node.parentNode.removeChild(node);
      this._template = null;
    }
  }



  /** Returns an error if the browser is not supported */
  private _browserCheck() {

    if (!window['Promise'])
      throw new Error('Your browser does not support native promises');

    if (!(window['DOMParser'] && new DOMParser()['parseFromString']))
      throw new Error('Your browser does not support the DOMParser methods')

    if (!document['importNode'])
      throw new Error('Your browser does not support templates');

    this._browserChecked = true;

  }



  /** Writes the dynamic user content to the specified objects HTML */
  private _writeContent(contentObj: Object|string) {

    if (typeof contentObj === 'string') {
      this._content.innerHTML = contentObj;
    }
    else if (typeof contentObj === 'object') {
      for(let c in contentObj) {
        if (this._workingClasses.hasOwnProperty(c)) {
          if (typeof contentObj[c] === 'object') {
            this._workingClasses[c].innerHTML = contentObj[c].html;
            this._workingClasses[c].addEventListener(contentObj[c].event, contentObj[c].trigger);
          } else {
            this._workingClasses[c].innerHTML = contentObj[c];
          }
        }
      }
    }

  }



  /** Caches the DOM elements from the provided classes */
  private _getElementsFromClasses(classes: string[]|Object) {
    if (classes instanceof Array) {
      let els = Array.prototype.slice.call(this._overlay.querySelectorAll(classes.join(','))) as HTMLElement[];
      for(let e of els) {
        this._workingClasses['.' + e.className] = e;
      }
    } else {
      for(let c in classes) {
        this._workingClasses[c] = this._overlay.querySelector(c);
      }
    }
  }


  /** Retrieves the working template HTML from the specified URL */
  private _getTemplate(url: string): Promise<string> {

    return new Promise((rs, rj) => {
      let req = new XMLHttpRequest();
      req.addEventListener('load', (res) => {
        rs(req.response);
      })
      req.onerror = (e) => {
        rj(new Error('Error getting template'));
      }
      req.open('GET', url, true);
      req.send();
    })

  }


  /** Returns the html template into a query-able document */
  private _parseTemplate(html: string) {

    let parser = new DOMParser()
      , dom = parser.parseFromString(html, 'text/html')
      , template = dom.querySelector('template')['content'] as HTMLElement

    return template;

  }



  private _close() {
    this._overlay.classList.remove('open');
    this._modal.classList.remove('open');
  }


  private _open() {
    this._overlay.classList.add('open');
    this._modal.classList.add('open');
  }


}