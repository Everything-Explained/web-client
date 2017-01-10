
var lights = localStorage.getItem('lights');

function findTheLights() {
  
  var el = document.createElement('link')
    , head = document.getElementsByTagName('head')[0];
    
  el.setAttribute('id', 'Theme')
  el.setAttribute('rel', 'stylesheet');
  
  if (!lights) {
    el.setAttribute('href', '../css/themes/dark/theme.css')
    head.appendChild(el);
    localStorage.setItem('lights', 'off');
    return;
  }
  
  if (lights === 'on') {
    el.setAttribute('href', '../css/themes/light/theme.css')
  } else {
    el.setAttribute('href', '../css/themes/dark/theme.css')
  }
  
  head.appendChild(el);
  
}
