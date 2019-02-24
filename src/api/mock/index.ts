
interface IRequest {
  status: number;
  data?: any;
}

type InviteData = {
  alias: string;
  email: string;
  content: string;
}
type InviteTest = 'timeout'|'error';

export default class ClientAPI {

  constructor() {}

  public canRequestInvite(delay?: number, test?: InviteTest): Promise<IRequest> {
    return new Promise((rs, rj) => {
      this._timedResolver(() => {
        if (test && this._testInvite(test, rs)) return;
        rs({
          status: 200,
        })
      }, delay || 0)
    })
  }

  public requestInvite(data: InviteData, delay?: number, test?: InviteTest): Promise<IRequest> {
    return new Promise((rs, rj) => {
      this._timedResolver(() => {
        if (test && this._testRequestInvite(test, rs)) return;
        rs({
          status: 200
        })
      }, delay || 0)
    })
  }


  private _testInvite(test: InviteTest, rs: (arg: IRequest) => void) {

    if (test == 'timeout') {
      rs({
        status: 202,
        data: {
          hours: Math.floor(Math.random() * 23),
          minutes: Math.floor(Math.random() * 59)
        }
      })
      return true;
    }

    if (test == 'error') {
      rs({
        status: 500,
        data: 'Error Requesting Invite Form'
      });
      return true;
    }

    return false;
  }

  private _testRequestInvite(test: InviteTest, rs: (arg: IRequest) => void) {

    if (test == 'timeout') {
      rs({
        status: 202,
        data: 'Sent Invite During Timeout'
      })
      return true;
    }

    if (test == 'error') {
      rs({
        status: 500
      })
      return true;
    }
  }


  private _timedResolver(cb: () => void, delay: number) {
    setTimeout(() => {
      cb();
    }, delay);
  }

}