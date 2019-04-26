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

  /**
   * Returns a normalized time string: `h:mm a`
   */
  static toNormalTimeString(time: string|number|Date) {
    return (
      new Date(time)
        .toLocaleTimeString(
          'en-US',
          { hour: 'numeric', minute: 'numeric' }
        )
    )
  }

  /**
   * Returns a numeric date: `mm/dd/yyyy`
   */
  static toNumericDate(time: string|number|Date) {
    return (
      new Date(time)
        .toLocaleDateString(
          'en-US',
          {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
          }
        )
    )
  }

  /**
   * Returns a normalized date: `M dd, yyyy`
   */
  static toNormalDate(time: string|number|Date) {
    return (
      new Date(time)
        .toLocaleDateString(
          'en-US',
          {
            month: 'long',
            year: 'numeric',
            day: 'numeric'
          }
        )
    )
  }
}