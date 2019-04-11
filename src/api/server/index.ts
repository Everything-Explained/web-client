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

interface InviteReqData {
  alias: string;
  email: string;
  content: string;
}



export default class ClientAPI {

  private web: Web;
  private _session!: SessionData;

  constructor() {
    this.web = new Web();
  }

  get ridQuery() {
    return `rid=${this._session.rid}`
  }

  get rid() {
    return this._session.rid;
  }

  get invite() {
    return this._session.invite;
  }


  public validateAlias(alias: string) {
    return this.web.get(`/auth/alias/${alias}?${this.ridQuery}`);
  }

  public canRequestInvite() {
    return this.web.get(`/invite/request?${this.ridQuery}`) as InviteReqResp
  }

  public requestInvite(data: InviteReqData) {
    return this.web.post(`/invite/request?${this.ridQuery}`, data);
  }

  public validateInvite(invite: string) {
    return this.web.get(`/auth/invite/${invite}?${this.ridQuery}`);
  }

  public updateAlias() {
    return this.web.patch(`/authed/api/alias?${this.ridQuery}`);
  }

  public signin(type: 'google'|'facebook') {
    if (type == 'google') {
      window.location.replace(`/auth/google?${this.ridQuery}`);
    }

    if (type == 'facebook') {
      window.location.replace(`/auth/facebook?${this.ridQuery}`);
    }
  }

  public getSettings() {
    return this.web.get(`/authed/api/settings?${this.ridQuery}`);
  }

  public logout() {
    window.location.replace(`/auth/logout?${this.ridQuery}`);
  }


  public async initSession() {
    let resp = await this.web.get(`/session`) as SessionResponse;
    this._session = resp.data.session;
    return this._session;
  }


}