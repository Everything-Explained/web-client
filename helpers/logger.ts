


enum LogLevels {
  INFO,
  WARN,
  ERROR,
  OFF
}


export class Logger {

  static _logLevel = LogLevels.INFO;

  static _headerStyle =
    `font-size: 12px;
     padding: 4px;
     background: blue;
     color: yellow;
     font-weight: bold;
     line-height: 25px;
     border-radius: 5px;`

  static _itemStyle =
    `font-size: 12px;
     padding: 4px;
     margin-left: 4px;
     left: 2px;
     background: #777;
     color: white;
     font-weight: bold;
     border-radius: 5px;`

  static _separator =
    `font-weight: bold;
     margin-left: 4px;
     font-size: 16px;
     color: black;
     font-family: Consolas, monospace;`

  static set logLevel(val: LogLevels) {
    // TODO: Do some type-checking
    Logger._logLevel = val;
  }



  constructor() {

    var log = console.info;
    console.info = function() {
      log.apply(this, Array.prototype.slice.call(arguments, 0))
    }

  }


  info(...msg: any[]) {

    // var trace = this._findExecutionOrigin(new Error().stack);

    // console.groupCollapsed(`%cINFO%c${trace.name}%c:%c${trace.path}%c@%c${trace.line}`,
    //   Logger._headerStyle,
    //   Logger._itemStyle,
    //   Logger._separator,
    //   Logger._itemStyle,
    //   Logger._separator,
    //   Logger._itemStyle
    // );
    console.log(msg);
    console.groupEnd();
  }

  warn() {}

  debug() {}

  error() {}


  private _findExecutionOrigin(stack: string) {

    console.log(stack);

    var extractPath = new RegExp('(/[0-9a-zA-Z#]+)+.js', 'g');

    var splitStack = stack.split('\n'),
        origin = splitStack[2].trim(),      // Should be the original execution line
        originTokens = origin.split(' '),
        stackURL = origin.split('://')[1];  // Removed domain

    var href = originTokens[originTokens.length - 1];

    var methodName =
      origin.indexOf(' new ') > -1 ?
        `new ${originTokens[2]}` : `${originTokens[1]}`;

    var relativePath = extractPath.exec(stackURL)[0];

    var lineNumber = stackURL.split(relativePath)[1].split(':')[1];
    console.log(methodName, relativePath, lineNumber, href);

    return { name: methodName, path: relativePath, line: lineNumber, href }

  }





}
