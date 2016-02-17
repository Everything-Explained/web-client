import {Logger} from './logger';
import {inject} from 'aurelia-framework';

interface Error {
  message: string;
  stack: string;
  name: string;
}

@inject(Logger)
export class ErrorHandler {

  constructor(private _logger: Logger) {

  }

  public init() {

    let log = this._logger;

    window.onerror = function() {

      let error = arguments[4] as Error;

      log.error([error.message], error);
    };


  }

}