
export class Web {

  private statusCodes = new Map<number, string>();



  constructor() {
    this.statusCodes.set(200, 'OK');
    this.statusCodes.set(201, 'Created');
    this.statusCodes.set(202, 'Accepted; Not Completed');
    this.statusCodes.set(204, 'No Content');
    this.statusCodes.set(205, 'Rest Content');
    this.statusCodes.set(301, 'Moved Permanently');
    this.statusCodes.set(304, 'Not Modified');
    this.statusCodes.set(400, 'Bad Request');
    this.statusCodes.set(401, 'Unauthorized');
    this.statusCodes.set(403, 'Forbidden');
    this.statusCodes.set(404, 'Not Found');
    this.statusCodes.set(500, 'Internal Server Error');
    this.statusCodes.set(501, 'Not Implemented');
    this.statusCodes.set(503, 'Service Unavailable');
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

    const resp = await fetch(url, options);
    const contentType = resp.headers.get('Content-Type') || '';
    const status = resp.status;

    let data: any = null;

    if (status < 300) {
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
        `${this.statusCodes.get(status)}\n${url}`
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

