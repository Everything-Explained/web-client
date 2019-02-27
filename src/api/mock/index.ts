
interface IRequest {
  status: number;
  data?: {
    hours?: number;
    minutes?: number;
    error?: {
      msg: string;
      data?: any
    }
  }
}

type InviteData = {
  alias: string;
  email: string;
  content: string;
}
type InviteTest = 'timeout'|'error';
type ValidInvite = 'invalid'|'notexist'|'expired';

export default class ClientAPI {

  constructor() {}

  public canRequestInvite(delay?: number, test?: InviteTest) {
    return this._timedResolver<IRequest>(() => {

      if (test == 'timeout') {
        return {
          status: 202,
          data: {
            hours: Math.floor(Math.random() * 23),
            minutes: Math.floor(Math.random() * 59),
          }
        }
      }

      if (test == 'error') {
        return {
          status: 500,
          data: {
            error: {
              msg: 'Error Requesting Invite Form'
            }
          }
        }
      }

      return {
        status: 200
      }

    }, delay || 0)
  }


  public requestInvite(data: InviteData, delay?: number, test?: InviteTest) {
    return this._timedResolver<IRequest>(() => {

      if (test == 'timeout') {
        return {
          status: 202,
          data: {
            error: {
              msg: 'Sent Invite During Timeout'
            }
          }
        }
      }

      if (test == 'error') {
        return { status: 500 }
      }

      return { status: 200 }

    }, delay || 0);
  }


  public validateInvite(invite: string, delay?: number, test?: ValidInvite) {
    return this._timedResolver(() => {

      // Prototype response from server
      let data = {
        valid    : true,
        expired  : false,
        exists   : true,
        validated: true
      }

      if (test == 'invalid') {
        data.valid = false;
        data.exists = false;
        data.validated = false;
      }

      if (test == 'notexist') {
        data.valid = true;
        data.exists = false;
        data.validated = false;
      }

      if (test == 'expired') {
        data.valid = true;
        data.exists = true;
        data.expired = true;
        data.validated = false;
      }

      return {
        status: !test ? 200 : 400,
        data
      }

    }, delay || 0)
  }


  private _timedResolver<T>(cb: () => T, delay: number): Promise<T> {
    return new Promise((rs, rj) => {
      setTimeout(() => {
        rs(cb());
      }, delay);
    })
  }

}