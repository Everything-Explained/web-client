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
}

let contentObj: HTMLElement
  , btnRefresh: HTMLElement
  , txtLength: HTMLInputElement;

document.addEventListener('DOMContentLoaded', () => {
  contentObj = document.getElementById('content');
  btnRefresh = document.getElementById('Refresh');
  txtLength = document.getElementById('Length') as HTMLInputElement;

  btnRefresh.addEventListener('click', () => {
    getLog((parseInt(txtLength.value) || 30));
  });
  getLog();
});


function getLog(length = 30) {

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
        , time = new Date(v.time);

      timeEl.innerText = `${time.toLocaleDateString()} ${time.toLocaleTimeString()} `;
      timeEl.classList.add('time');
      idEl.innerText = `${v.identity}`;
      idEl.classList.add('identity');

      let msg =
        (v['req_type'])
          ? ` ${v.req_type} :: ${v.msg}`
          : ` ${v.msg}`;

      msgEl.innerText = msg;

      el.appendChild(timeEl);
      el.appendChild(idEl);
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