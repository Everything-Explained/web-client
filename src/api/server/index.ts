import { Web } from '@/libs/web';

interface ResponseData {
  error?: {
    msg: string;
  }
}

interface APIResponse {
  status: number;
  data?: ResponseData;
}

interface SessionData {
  alias: string;
  rid: string;
  invite: string;
  authed: boolean;
}
interface SessionDataResp extends ResponseData {
  session: SessionData;
}
export interface SessionResponse extends APIResponse {
  data: SessionDataResp;
}

interface ReqInviteData {
  hours: number;
  minutes: number;
}
interface InviteReqDataResp extends ResponseData {
  timeout?: ReqInviteData;
}
export interface InviteReqResp extends APIResponse {
  data?: InviteReqDataResp;
}



export default class ClientAPI {

  private web: Web;
  private _session!: SessionData;

  constructor() {
    this.web = new Web();
  }

  get rid() {
    return `rid=${this._session.rid}`
  }

  public canRequestInvite() {
    return this._exec(() => {
      return this.web.get(`/invite/request?${this.rid}`) as InviteReqResp
    })
  }

  public getSession() {
    return this.web.get(`/session`) as SessionResponse
  }


  /**
   * Load the session (for RID) before calling an API
   * end point.
   */
  private async _exec<T>(cb: () => T) {
    let resp: SessionResponse | undefined
    if (!this._session) {
      resp = await this.getSession()
      if(resp.status == 200) {
        this._session = resp.data.session;
      }
    }

    if (this._session.rid) {
      return cb();
    }

    console.error(resp);
    throw new Error('Cannot connect to session');
  }

}