
interface IDomop extends Array<HTMLElement> {
  on(eventName: 'keyup', callback: (e: KeyboardEvent) => void): IDomop;
  on(eventName: 'keypress', callback: (e: KeyboardEvent) => void): IDomop;
  on(eventName: 'keydown', callback: (e: KeyboardEvent) => void): IDomop;
  on(eventName: 'mousedown', callback: (e: MouseEvent) => void): IDomop;
  on(eventName: 'mouseup', callback: (e: MouseEvent) => void): IDomop;
  on(eventName: 'click', callback: (e: MouseEvent) => void): IDomop;
  on(eventName: string, callback: (e: Event) => void): IDomop;

  off(eventName: string, callback?: (e:Event) => void): IDomop;
  addClass(className: string): IDomop;
  removeClass(className: string): IDomop;
  hasClass(className: string): boolean;
  setProp(name: string, data: any): IDomop;
  width(value: number): IDomop;
  height(value: number): IDomop;
  size(width: number, height: number): IDomop;
  focus(): IDomop;
  append(html: string): IDomop;
  get(selector: string): IDomop;
  eq(index: number): IDomop;

  properties: Object;
  __domop: boolean;
  __listeners: any;
}


export function $(selector: any, firstElement = false) {

  var nodes = searchDOM(selector, firstElement);

  if (!nodes) return null;

  // Convert NodeList into Array object
  var els           = <IDomop>Array.prototype.slice.call(nodes)
    , isHTMLElement = (obj: any) => {
        return obj !== window && obj !== document;
      }

  els.properties = {};
  els.__listeners = {};

  // ON EVENT
  els.on = (eventName: string, callback: (e: Event) => void) => {

    els.__listeners[eventName] = els.__listeners[eventName] || [];

    let exists = false;
    if(els.__listeners[eventName].length) {
      els.__listeners[eventName].forEach(cb => {
        if (String(cb) === String(callback)) exists = true;
      })
    }

    if (exists) return;

    els.__listeners[eventName].push(callback);

    els.forEach(el => el.addEventListener(eventName, callback));
    return els;
  }

  // OFF EVENT
  els.off = (eventName: string, callback?: (e: Event) => void) => {

    if (!els.__listeners[eventName]) return els;

    if (typeof callback == 'undefined') {
      els.forEach(el => {
        els.__listeners[eventName]
              .forEach(cb => el.removeEventListener(eventName, cb))
      })
      delete els.__listeners[eventName];
    }

    else {
      let l = <any[]>els.__listeners;

      els.forEach(el => {
        l[eventName] = l[eventName].filter(cb => {
          if (String(callback) !== String(cb)) return true;
          el.removeEventListener(eventName, cb);
          return false;
        })
      })

    }
    return els;
  }

  // Returns on first success
  // TODO: Should return array of HTMLElements
  // TODO: Should return after ALL initialized elements have been filtered
  els.get = (selector: string) => {

    for(var el of els) {

      if (selector.match(/^#[a-zA-Z0-9:]+$/g)) {
        let obj = el.querySelector(selector);
        return (obj) ? $(obj) : null;
      }

      if (selector.match(/^\.[a-zA-Z0-9:]+$/g)) {
        let obj = el.getElementsByClassName(selector.substr(1))
        return (obj.length) ? $(obj) : null;
      }

      let obj = el.querySelectorAll(selector);
      return (obj.length) ? $(obj) : null;
    }

  }

  els.setProp = (name: string, data: any) => {
    els.properties[name] = data;
    return els;
  }

  els.addClass = (className: string) => {
    if (!isHTMLElement(els[0])) return null;
    els.forEach(el => el.classList.add(className));
    return els;
  }

  els.removeClass = (className: string) => {
    if(!isHTMLElement(els[0])) return null;
    els.forEach(el => el.classList.remove(className));
    return els;
  }

  els.hasClass = (className: string) => {
    return !isHTMLElement(els[0]) ? null : els[0].classList.contains(className);
  }

  els.eq = (index: number) => {
    if (index < els.length) return $(els[index]);
    throw new Error("Element Index out of Range");
  }

  els.size = (width: number|string, height: number|string) => {

    let w = (typeof width === 'string') ? width : `${width}px`,
        h = (typeof height === 'string') ? height : `${height}px`;

    for(let el of els) {
      el.style.width = w;
      el.style.height = h;
    }
    return this;

  }

  els.width = (width: number|string) => {

    let w = (typeof width === 'string') ? width : `${width}px`;

    for(let el of els) {
      el.style.width = w;
    }
    return this;

  }

  els.height = (height: number|string) => {

    let h = (typeof height === 'string') ? height : `${height}px`;

    for(let el of els) {
      el.style.height = h;
    }
    return this;

  }


  els.__domop = true;
  return els;
}


function searchDOM(selector: any, firstElement = false) {

  var nodes: any|any[];

  if (!selector) throw new Error('Selector is Undefined');

  if (typeof selector === 'string') {
    // Find IDs
    if(selector.match(/^#[a-zA-Z0-9:]+/g)) {
      nodes = [document.getElementById(selector.substr(1))];
    }
    // Find classes
    else if (selector.match(/^\.[a-zA-Z0-9:]+/g)) {
      let q = document.getElementsByClassName(selector.substr(1));
      nodes = firstElement ? [q[0]] : q;
    }
    // General selector
    else {
      let q = document.querySelectorAll(selector);
      nodes = firstElement ? [q[0]] : q;
    }
  }
  else {
    if (selector === window || selector === document) {
      nodes = [selector];
    }
    // Allow arrays of elements to be initialized
    else if (selector['length'] !== undefined) {
      nodes = [];
      for(let el of selector) {
        if (!el['classList'])throw new Error('Invalid Element');
        nodes.push(el);
      }
    } else {
      if(!selector['classList']) throw new Error('Invalid Element');
      nodes = [selector];
    }
  }

  if (!nodes.length || nodes[0] == null) return null;
  if(!nodes[0].classList &&
      selector !== document &&
      selector !== window) {
        throw new Error('Outdated Browser::classList undefined')
  }

  return nodes;

}