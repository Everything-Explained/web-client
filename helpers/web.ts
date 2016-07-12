
interface URIProperties {
  raw?: string;
  fields?: any;
  headers?: any;
  data?: any;
  method?: string;
}


export class Web {


  constructor() {  }


  static GET(url: string, props: URIProperties, cb: (error: any, code: number, data) => void) {
    props.method = 'GET';
    Web.sendRequest(url, props, cb);
  }


  static POST(url: string, props: URIProperties, cb: (error: any, code: number, data) => void) {
    props.method = 'POST';
    Web.sendRequest(url, props, cb);
  }


  static sendRequest(url: string, props: URIProperties, cb: (error, code: number, data) => void) {
    let req = new XMLHttpRequest()
      , fields = props.fields || null
      , raw = props.raw || null
      , forms = null;

    props.data = props.data || null;

    if (fields || raw && (!props.data)) {
      forms = Web.buildURI(fields, raw);
    }

    req.open(props.method, (!forms) ? url : url + forms);

    req.onload = () => {
      if (req.status >= 200 && req.status < 400) {
        cb(null, req.status, req.responseText);
      }
      else {
        cb(req.responseText, req.status, null);
      }
    };



    req.onerror = (ev) => {
      cb(ev, -1, null);
    };

    if (props.headers) {
      for (let h in props.headers) {
        req.setRequestHeader(h, props.headers[h]);
      }
    }

    req.send((forms) ? null : props.data);


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