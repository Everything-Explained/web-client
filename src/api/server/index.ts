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

export interface SessionData {
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
    return this.web.get(`/invite/request?${this.rid}`) as InviteReqResp
  }

  public signin(type: 'google'|'facebook') {
    if (type == 'google') {
      window.location.replace(`/auth/google?${this.rid}`);
    }
  }


  public async initSession() {
    if (this._session) return;
    let resp = await this.web.get(`/session`) as SessionResponse;
    this._session = resp.data.session;
  }


}