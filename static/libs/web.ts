
interface URIProperties {
  raw?: string;
  fields?: any;
  headers?: any;
  data?: any;
  method?: string;
}


class Web {


  constructor() {  }


  static GET(url: string, props: URIProperties, cb: (error: any, code: number, data, headers: any) => void) {
    props.method = 'GET';
    Web.sendRequest(url, props, cb);
  }


  static HEAD(url: string, props: URIProperties, cb: (error: any, code: number, data: any, headers: any) => void) {
    props.method = 'HEAD';
    Web.sendRequest(url, props, cb);
  }


  static POST(url: string, props: URIProperties, cb: (error: any, code: number, data, headers: any) => void) {
    props.method = 'POST';
    Web.sendRequest(url, props, cb);
  }

  static DELETE(url: string, props: URIProperties, cb: (error: any, code: number, data, headers: any) => void) {
    props.method = 'DELETE';
    Web.sendRequest(url, props, cb);
  }


  static sendRequest(url: string, props: URIProperties, cb: (error, code: number, data, headers: any) => void) {
    let req = new XMLHttpRequest()
      , fields = props.fields || null
      , raw = props.raw || null
      , forms = null;

    props.data = props.data || null;

    if (fields || raw && (!props.data)) {
      forms = Web.buildURI(fields, raw);
    }

    req.onload = () => {

      let data: any = null;
      data =
        (~req.getResponseHeader('Content-Type').indexOf('application/json'))
          ? data =
            (req.responseText.length)
              ? JSON.parse(req.responseText)
              : null
          : req.responseText;

      let headers = {
        ETag: req.getResponseHeader('ETag')
      };

      if (req.status >= 200 && req.status < 400) {
        cb(null, req.status, data, headers);
      }
      else {
        cb(data, req.status, null, headers);
      }
    };

    req.onerror = (ev) => {
      cb(ev, -1, null, null);
    };

    if (props.method == 'POST' && forms) {
      req.open(props.method, url);
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      if (props.headers) {
        for (let key in props.headers) {
          req.setRequestHeader(key, props.headers[key]);
        }
      }
      let data = encodeURI(forms.substr(1));
      req.send(data);
    }
    else {
      req.open(props.method, (!forms) ? url : url + forms);
      if (props.headers) {
        for (let key in props.headers) {
          req.setRequestHeader(key, props.headers[key]);
        }
      }
      req.send((forms) ? null : props.data);
    }

  }

  static buildURI(fields = null, raw = null): string {

      let path     = ''
        , fieldStr = '';

    if (fields) {
      for (let f in fields) {
        fieldStr += `${f}=${fields[f]}&`;
      }
      fieldStr = fieldStr.substr(0, fieldStr.length - 1);
    }

    path +=
      (raw)
        ? (fieldStr)
            ? `?${raw}&${fieldStr}`
            : `?${raw}`
        : (fieldStr)
            ? `?${fieldStr}`
            : '';

    return path;

  }


}