
interface IModalOptions {
  html?: string;
  events?: [
    {
      name: string;
      trigger: () => void;
    }
  ]
}


export class ModernModal {

  private _overlay: HTMLElement;
  private _preloader: HTMLElement;
  private _openButton: HTMLElement;
  private _header: HTMLElement;
  private _modal: HTMLElement;
  private _content: HTMLElement;

  private _lastURL = '';
  private _lastContent: string|Object;
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

  constructor() {

    this._browserCheck();
    this._lastContent = null;

  }


  /**
   * Initializes all available elements.
   * This method should be used after the page is rendered
   * with the modal overlay.
   */
  public init(overlayID: string) {
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
  public show(url: string, head: string, contentObj?: Object|string, callback?: (overlay: HTMLElement) => void) {

    this._preloader.classList.remove('open');

    if (url === this._lastURL && this._template) {
      console.log('Using Existing Template')
      this._header.innerHTML = head;
      if (!this._compareObjs(this._lastContent, contentObj))
        this._writeContent(contentObj);
      this._open();
      if (callback) callback(this._overlay);

    } else {
      this._loadTemplate(url, (typeof contentObj === 'string') ? null : contentObj)
        .then((res: boolean) => {

          this._writeContent(contentObj);

          // Modal must be rendered before shown
          setTimeout(() => {
            this._open();
            if (head) this._header.innerHTML = head;
            if (callback) callback(this._overlay);
          }, 100);

        })
        .catch((e) => {
          console.error(e);
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
  private _loadTemplate(url: string, data?: string[]|Object) {

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
      .catch((e) => {
        rj(e);
      })


    })


  }



  /**
   * Shows the modal preloader when you know your content
   * is going to take a while to return.
   */
  public preload() {
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

    // Allows us to test if the same data is entered
    this._lastContent = contentObj;

    if (typeof contentObj === 'string') {
      this._content.innerHTML = contentObj;
    }
    else if (typeof contentObj === 'object') {

      for(let c in contentObj) {

        if (this._workingClasses.hasOwnProperty(c)) {
          if (typeof contentObj[c] === 'object') {
            let obj = contentObj[c] as IModalOptions;
            if (obj['html']) this._workingClasses[c].innerHTML = obj.html;
            if (obj['events']) {
              for(let e of obj.events) {
                console.dir(this._workingClasses[c])
                this._workingClasses[c].addEventListener(e.name, e.trigger)
              }
            }
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


  private _compareObjs(obj1: Object, obj2: Object) {

    console.log('Comparing Objects', obj1, obj2);

    // Rule out string
    if (typeof obj1 == 'string' || typeof obj2 == 'string') {
      return obj1 === obj2;
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;


    for (let k in obj1) {

      if (!obj2[k]) return false;

      let o1 = obj1[k] as IModalOptions
        , o2 = obj2[k] as IModalOptions;

      // Assume if the HTML is identical that all events are as well
      // TODO - When the need arises, do event checking
      if (o1.html || o2.html) {

        // Assume identical events with same html
        if (o1.html == o2.html) continue
        else return false;

      } else if(o1.events || o2.events) {
        if ((o1.events.length && o2.events.length) &&
            (o1.events.length == o2.events.length)
           ) continue;
        else return false;

        for(let i = 0; i < o1.events.length; i++) {
          if (`${o1.events[i].trigger}` != `${o2.events[i].trigger}`) return false;
        }


      }
      throw new Error('ModernModal::Objects have no HTML or EVENTS properties')
    }
    return true;
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