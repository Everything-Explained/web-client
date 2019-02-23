



export default class ClientAPI {

  constructor() {}

  public canRequestInvite() {
    return new Promise((rs, rj) => {
      this._timedResolver(() => {
        rs(true);
      }, 1000)
    })
  }


  private _timedResolver(cb: () => void, delay: number) {
    setTimeout(() => {
      cb();
    }, delay);
  }

}