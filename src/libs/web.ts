import { relativeTimeRounding } from 'moment';

export class Web {

  private _statusCodes: string[] = [];



  constructor() {
    this._statusCodes[200] = 'Ok';
    this._statusCodes[201] = 'Created';
    this._statusCodes[202] = 'Accepted; Not Completed';
    this._statusCodes[204] = 'No Content';
    this._statusCodes[205] = 'Reset Content';
    this._statusCodes[301] = 'Moved Permanently';
    this._statusCodes[304] = 'Not Modified';
    this._statusCodes[400] = 'Bad Request';
    this._statusCodes[401] = 'Unauthorized';
    this._statusCodes[403] = 'Forbidden';
    this._statusCodes[404] = 'Not Found';
    this._statusCodes[500] = 'Internal Server Error';
    this._statusCodes[501] = 'Not Implemented';
    this._statusCodes[503] = 'Service Unavailable';
  }




  public get(url: string, options?: RequestInit): unknown {
    const method = 'GET';

    options =
      options
        ? Object.assign({method}, options)
        : {method}
    ;

    return this._fetch(url, options);
  }

  public post(url: string, body: any, options?: RequestInit) {

    const method = 'POST';
    let contentType = ''
      , bodyData = ''
    ;

    if (body) {
      if (typeof body == 'object') {
        contentType = 'application/json';
        bodyData = JSON.stringify(body);
      }
      else {
        contentType = 'text/plain';
        bodyData = body;
      }
    }

    options = Object.assign(
      {
        method,
        headers: { 'Content-Type': contentType },
        body: bodyData
      },
      options,
    );

    return this._fetch(url, options);
  }

  
  public patch(url: string) {
    return this.post(url, null, {
      method: 'PATCH'
    })
  }


  public delete(url: string) {
    return this.post(url, null, {
      method: 'DELETE',
    });
  }


  private async _fetch(url: string, options: RequestInit) {

    const resp = await fetch(url, options)
        , contentType = resp.headers.get('Content-Type') || ''
    ;
    let data: any = null;

    if (resp.status < 300) {
      if (~contentType.indexOf('application/json')) {
        data = resp.json();
      }
      else if (~contentType.indexOf('image/')) {
        data = resp.blob();
      }
    }
    else {
      console.warn(
        `Fetch Error:: ${status} => ` +
        `${this._statusCodes[status]}\n${url}`
      )
    }

    return {
      status: resp.status,
      data: data
        ? await data
        : await resp.text()
    };
  }


  public static measure(timeName: string) {
    const entry = performance.getEntriesByName(timeName);
    if (!entry.length) return '0ms';
    let duration = entry[0].duration;
    const timingStr =
      (duration > 1000)
        ? (duration /= 1000).toFixed(2) + 's'
        : duration.toFixed(0) + 'ms'
    ;
    performance.clearMeasures(timeName);
    return timingStr;
  }


  public static timeIt(name: string, prefix: string, cb: () => void) {
    performance.mark(`${prefix}PerfStart`);
    cb();
    performance.mark(`${prefix}PerfEnd`);
    performance.measure(name, `${prefix}PerfStart`, `${prefix}PerfEnd`);
  }


  public static async timeItAsync(name: string, prefix: string, cb: () => void) {
    performance.mark(`${prefix}PerfStart`);
    await cb();
    performance.mark(`${prefix}PerfEnd`);
    performance.measure(name, `${prefix}PerfStart`, `${prefix}PerfEnd`);
  }
}

