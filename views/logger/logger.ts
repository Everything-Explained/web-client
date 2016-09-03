/// <reference path="../../helpers/web.tx" />
import {Web} from '../../helpers/web';

declare var w: typeof Web;
declare var $: any;

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
  , txtLength: HTMLInputElement
  , selFile: HTMLSelectElement
  , lenObj: HTMLElement
  , lenMultiObj: HTMLInputElement
  , renderObj: HTMLElement
  , reqLenObj: HTMLElement
  , selectedFile = ''
  , logLength = 0;

document.addEventListener('DOMContentLoaded', () => {
  contentObj = document.getElementById('content');
  btnRefresh = document.getElementById('Refresh');
  txtLength = document.getElementById('Length') as HTMLInputElement;
  selFile  = document.getElementById('SelectFile') as HTMLSelectElement;
  lenObj = document.getElementById('LogLength');
  lenMultiObj = document.getElementById('LengthMultiplier') as HTMLInputElement;
  renderObj = document.getElementById('RenderTime');
  reqLenObj = document.getElementById('ReqLength');

  $('select').material_select();
  selFile.selectedIndex = 0;

  btnRefresh.addEventListener('click', () => {
    getLog(selFile.options[selFile.selectedIndex].textContent, (parseInt(txtLength.value) || 100));
  });
  getLog(selFile.options[selFile.selectedIndex].textContent);
});


function getLog(filename: string, length = 100) {

  performance.clearMeasures();
  performance.mark('RenderLog');
  contentObj.innerHTML = '';
  w.GET('/internal/logger',
  {
    fields: {
      length: length * parseInt(lenMultiObj.value),
      filename
    }
  }, (err, code, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let dataObj = JSON.parse(data) as IData[]
      , dataLength = dataObj.length
      , docFrag = document.createDocumentFragment();

    lenObj.innerText = dataLength.toString();

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
            req += `${d}=${v.data[d]}&`;
          }
        }

        el.classList.add('internal');
        methodEl.innerText = ' RTN ';
        dataEl.innerText = (req.length > 2) ? ` ${req.replace(/\&$/, '')} ` : '';
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
      else if (v.level == 50) {
        el.classList.add('error');
      }
      docFrag.appendChild(el);

    });
    contentObj.appendChild(docFrag);
    contentObj.scrollTop = contentObj.scrollHeight;
    performance.mark('EndRenderLog');
    performance.measure('LogRenderTime', 'RenderLog', 'EndRenderLog');
    console.log(performance.getEntriesByName('LogRenderTime')[0]);

    let timing = (performance.getEntriesByName('LogRenderTime')[0].duration).toFixed('0');

    renderObj.innerText = timing + 'ms';
  });
}


function refresh() {
  let length =
    (isNaN(txtLength.value))
      ? 100
      : parseInt(txtLength.value);

  getLog(selFile.options[selFile.selectedIndex].textContent, length);
}

function selectChanged() {
  refresh();
}

function getRealLength() {
  let mult = parseInt(lenMultiObj.value)
    , len = parseInt(txtLength.value);

  console.log('here', mult, len);

  reqLenObj.innerText = (len * mult).toString();
}