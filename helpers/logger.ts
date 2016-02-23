import {ModernModal} from './modern-modal';
import {inject} from 'aurelia-framework';


interface Error {
  name: string;
  message: string;
  stack: string;
}

interface Console {
  groupCollapsed: (title: string, ...optionalArgs) => void;
  info: (msg: string, ...optionalArgs) => void;
  log: (msg: string, ...optionalArgs) => void;
}

interface Trace {
  path: string;
  line: string;
  name: string;
  href: string;
  stack: string;
  errorType: string;
}

enum LogLevels {
  INFO,
  WARN,
  ERROR,
  OFF
}

@inject(ModernModal)
export class Logger {

  static _logLevel = LogLevels.INFO;

  static _headerStyle =
    `font-size: 12px;
     padding: 1px 7px 1px 7px;
     background: #111;
     font-weight: bold;
     line-height: 25px;
     border-radius: 3px;`;

  static _headerStyleInfo =
    `color: yellow;`;

  static _headerStyleError =
    `color: #ff7070`;

  static _itemStyle =
    `font-size: 12px;
     padding: 1px 7px 1px 7px;
     margin-left: 4px;
     left: 2px;
     background: #333;
     color: #aaa;
     font-weight: bold;
     border-radius: 3px;`;

  static _separator =
    `font-weight: bold;
     margin-left: 4px;
     font-size: 16px;
     color: #88cc88;
     font-family: Consolas, monospace;`;

  static set logLevel(val: LogLevels) {
    // TODO: Do some type-checking
    Logger._logLevel = val;
  }

  private _errorListStyle = {
    position: 'absolute',
    display: 'block',
    bottom: '20px',
    right: '20px',
    zIndex: '1000'
  };

  private _closeButtonStyle = {
    display: 'inline-block',
    float: 'right',
    cursor: 'pointer'
  };

  private _obj: HTMLElement;

  constructor(private _modal: ModernModal) {

    let log   = console.info
      , error = console.error
      , self  = this;

    console.info = (args) => {
      this.info(args);
    };


    console.error = function() {
      // error.apply(this, Array.prototype.slice.call(arguments, 0));
      self.error(Array.prototype.slice.call(arguments, 0));
    };

    this._obj = document.createElement('div');
    this._obj.classList.add('log-error-list');

    for (let i in this._errorListStyle) {
      if (this._obj.style[i] != 'undefined') {
        this._obj.style[i] = this._errorListStyle[i];
      }
    }

    let body = document.querySelector('body');

    body.appendChild(this._obj);

  }


  info(...msg: any[]) {

    let error = new Error() as Error
      , trace = this._findExecutionOrigin(error.stack)
      , con   = console as Console;

    con.groupCollapsed(`%cINFO%c${trace.name}%c:%c${trace.path}%c@%c${trace.line}`,
      Logger._headerStyle + Logger._headerStyleInfo,
      Logger._itemStyle,
      Logger._separator,
      Logger._itemStyle,
      Logger._separator,
      Logger._itemStyle
    );

    // this._addMessage(LogLevels.INFO, 'this is a test');
    console.log(msg);
    console.groupEnd();
  }

  warn() {}

  debug() {}




  public error(msg: any[], oError?: Error) {

    let message = ''
      , header  = '';

    if (!msg[0] || typeof msg[0] != 'string') {
      throw new Error('ERROR logs must contain a message string');
    }

    // Handle Aurelia life-cycle promise rejection Exceptions
    if (msg.length > 1 && ~msg[0].indexOf('promise rejection') && msg[1] instanceof Error) {
      oError = msg[1] as Error;
    }

    if (~msg[0].indexOf('app-router')) {
      if (~msg[1].message.indexOf('404 Not Found')) {
        header = 'Aurelia::[app-router] 404 Not Found';
      }
      message = msg[1].message;
      oError = msg[1];                        // SET Inner Error
    }

    if (~msg[0].indexOf('event-aggregator')) {
      header = 'Aurelia::[event-aggregator]';
      message = msg[1].message;
      oError = msg[1];                        // SET Inner Error
    }

    if (!header) header = msg[0];
    if (!message) message = msg[0];


    let error   = (oError) ? oError : new Error() as Error
      , trace   = this._findExecutionOrigin(error.stack, !!oError)
      , con     = console as Console;





    con.groupCollapsed(`%cERROR::${msg[0]}%c${trace.name}%c:%c${trace.path}%c@%c${trace.line}`,
      Logger._headerStyle + Logger._headerStyleError,
      Logger._itemStyle,
      Logger._separator,
      Logger._itemStyle,
      Logger._separator,
      Logger._itemStyle
    );

    if (msg.length > 1) {
      console.log('');
      console.log(msg);
      console.log('');
    }
    else console.log(msg);
    console.groupEnd();


    this._addMessage(LogLevels.ERROR, {
      header,
      message,
      trace
    });

  }




  private _addMessage(type: LogLevels, data: {header: string; message: string, trace: Trace}) {

    let msgContainer = document.createElement('div')
      , msg          = document.createElement('div')
      , close        = document.createElement('div');

    msg.style.display      = 'inline-block';
    msg.style.paddingRight = '10px';
    msg.style.cursor       = 'pointer';
    close.innerHTML        = '&#10060;';

    close.classList.add('log-close-button');

    close.addEventListener('mousedown', (e) => {
      if (e.buttons == 1) {
        this._obj.removeChild(msgContainer);
      }
    });

    let stackLines = data.trace.stack.split(' at ');

    // First line is always "error"
    stackLines.splice(0, 1);

    stackLines.forEach((v, i) => {
      let parts = v.split('/');

      if (stackLines[i].trim().indexOf('http') != 0) {

        stackLines[i] = stackLines[i]
          .split('(')[0] + '(' +
                  parts[parts.length - 2] + '/' +
                  parts[parts.length - 1];
      } else {
        stackLines[i] = '(' + parts[parts.length - 2] + '/' + parts[parts.length - 1] + ')';
      }
    });

    data.trace.stack = stackLines.join('<br/>');

    msg.addEventListener('mousedown', (e) => {
      if (e.buttons == 1) {
        this._modal.show('modals/exception', data.header,
        `<b>Line: </b>${data.trace.line}<br/>
         <b>Method: </b>${data.trace.name}<br/>
         <b>Message: </b>${data.message}<br/>
         <b>Stack: </b><br/>
         <div class='stack'>${data.trace.stack}</div>`);
      }
    });

    for (let k in this._closeButtonStyle) {
      if (close.style[k] != 'undefined') close.style[k] = this._closeButtonStyle[k];
    }

    if (type == LogLevels.INFO) {
      msgContainer.classList.add('log-info');
      msg.innerText = data.header;
    }

    else if (type == LogLevels.ERROR) {
      msgContainer.classList.add('log-error');
      msg.innerText = 'Exception::' + data.header;
    }

    this._obj.appendChild(msgContainer);
    msgContainer.appendChild(msg);
    msgContainer.appendChild(close);

  }




  private _findExecutionOrigin(stack: string, root = false): Trace {

    let extractPath  = new RegExp('(/[0-9a-zA-Z#@\.\-]+)+.js', 'g')
      , splitStack   = stack.split('\n')
      , errorType    = (splitStack[0] == 'Error') ? 'GenericError' : splitStack[0]
      , origin       = (root) ? splitStack[1].trim() : splitStack[3].trim()     // Should be the original execution line
      , originTokens = origin.split(' ')
      , stackURL     = origin.split('://')[1]   // Removed domain
      , href         = originTokens[originTokens.length - 1];


    let methodName =
        ~origin.indexOf(' new ') ?
          `new ${originTokens[2]}` : `${originTokens[1]}()`

      , relativePath = extractPath.exec(stackURL)[0]
      , lineNumber   = stackURL.split(':').pop().replace(')', '');


    return { name: methodName, path: relativePath, line: lineNumber, errorType,  href, stack };

  }





}
