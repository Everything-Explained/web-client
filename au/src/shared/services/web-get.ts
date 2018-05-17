


interface URIProperties {
  raw?: string;
  fields?: any;
  headers?: any;
  data?: any;
  method?: string;
  json?: boolean;
}


export class Web {


  constructor() {  }


  static GET(url: string, props?: URIProperties) {
    props = props || {};
    props.method = 'GET';
    return Web.sendRequest(url, props);
  }


  static POST(url: string, props?: URIProperties) {
    props = props || {};
    props.method = 'POST';
    return Web.sendRequest(url, props);
  }

  static DELETE(url: string, props?: URIProperties) {
    props = props || {};
    props.method = 'DELETE';
    return Web.sendRequest(url, props);
  }


  static sendRequest(url: string, props: URIProperties): Promise<[any, number, any]> {
    let req = new XMLHttpRequest()
      , fields = props.fields || null
      , raw = props.raw || null
      , forms = null
    ;

    props.data = props.data || null;

    if (fields || raw && (!props.data)) {
      forms = Web.buildURI(fields, raw);
    }

    return new Promise((rs, rj) => {
      req.onload = () => {

        let data: any = null;
        data =
          (~req.getResponseHeader('Content-Type').indexOf('application/json'))
            ? data = JSON.parse(req.responseText)
            : req.responseText
        ;

        if (req.status >= 200 && req.status < 400) {
          rs([null, req.status, data]);
        }
        else {
          rs([data, req.status, null]);
        }
      };

      req.onerror = (ev) => {
        rs([ev, -1, null]);
      };

      if (props.method == 'POST' && forms) {
        req.open(props.method, url);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        let data = encodeURI(forms.substr(1));
        req.send(data);
      }
      else {
        req.open(props.method, (!forms) ? url : url + forms);
        req.send((forms) ? null : props.data);
      }
    });

  }

  static buildURI(fields = null, raw = null): string {

    let path     = ''
      , fieldStr = ''
    ;

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
            : ''
    ;

    return path;

  }


}