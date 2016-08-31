/// <reference path="../../helpers/web.tx" />
import {Web} from '../../helpers/web';

declare var w: typeof Web;

interface IData {
  level: number;
  country: string;
  identity: string;
  req_type: string;
  msg: string;
  time: string;
  data: Object;
}

let contentObj: HTMLElement
  , btnRefresh: HTMLElement
  , txtLength: HTMLInputElement;

document.addEventListener('DOMContentLoaded', () => {
  contentObj = document.getElementById('content');
  btnRefresh = document.getElementById('Refresh');
  txtLength = document.getElementById('Length') as HTMLInputElement;

  btnRefresh.addEventListener('click', () => {
    getLog((parseInt(txtLength.value) || 100));
  });
  getLog();
});


function getLog(length = 100) {

  contentObj.innerHTML = '';
  w.GET('/internal/logger',
  {
    fields: {
      length
    }
  }, (err, code, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let dataObj = JSON.parse(data) as IData[];

    dataObj.forEach(v => {
      let el = document.createElement('div')
        , timeEl = document.createElement('span')
        , msgEl = document.createElement('span')
        , idEl = document.createElement('span')
        , dataEl = document.createElement('span')
        , methodEl = document.createElement('span')
        , time = new Date(v.time);

      timeEl.innerText = `${time.toLocaleDateString()} ${time.toLocaleTimeString()} `;
      timeEl.classList.add('time');
      idEl.innerText = `${v.identity}`;
      idEl.classList.add('identity');

      let msg =
        (v['req_type'])
          ? ` ${v.req_type} ${v.msg}`
          : ` ${v.msg}`;

      methodEl.innerText = ` ${msg.split(' ', 2)[1]} `;

      // Strip method from main message
      msg = msg.replace('POST', '').replace('GET', '');

      if (~msg.indexOf('/internal') && msg.match(/\/internal\/[a-zA-Z]+\s/)) {
        msg = msg.split(' ').filter(v => {
                if (~v.indexOf('internal')) return false;
                return true;
              }).join(' ');

        let req = '/?';
        if (v.data) {
          for (let d in v.data) {
            req += `${d}=${v.data[d]}`;
          }
        }

        el.classList.add('internal');
        methodEl.innerText = ' RTN ';
        dataEl.innerText = (req.length > 2) ? ` ${req} ` : '';
        dataEl.classList.add('data');
      }

      msgEl.innerText = msg;

      el.appendChild(timeEl);
      el.appendChild(idEl);
      el.appendChild(methodEl);
      if (dataEl.innerText.length) el.appendChild(dataEl);
      el.appendChild(msgEl);

      if (v.level == 30) {
        el.classList.add('info');
      }
      else if (v.level == 40) {
        el.classList.add('warn');
      }
      contentObj.appendChild(el);
      contentObj.scrollTop = contentObj.scrollHeight;
    });

  });
}


function refresh() {
  getLog();
}