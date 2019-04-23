export default class Utils {
  static loadScript(globalIdent: string, src: string) {
    return new Promise(rs => {
      const globalFlag = globalIdent;
      if (globalThis[globalFlag]) {
        return rs(true);
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        globalThis[globalFlag] = true;
        rs(true);
      }
      document.head.appendChild(script);
    });
  }
}