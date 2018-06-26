import { IStats } from '../../../../../server/models/db_modules/db_stats';


export enum UserType {
  USER,
  VIP,
  MOD,
  ADMIN
}


export interface IUser {
  alias:        string;
  about?:       string;
  email?:       string;
  typingState?: 'typing-started'|'typing-paused';
  firstName?:   string;
  lastName?:    string;
  picture?:     string;
  stats?:       IStats;
  room?:        { name: string; hash: string; };
}



export class UserData {

  private readonly _userData: IUser[] = [];

  public currentUser: IUser;

  get users() {
    return this._userData;
  }



  constructor() {}



  public addUsers(user: IUser|IUser[]) {

    if (Array.isArray(user))
      this._userData.push(...user)
    ;
    else
      this._userData.push(user)
    ;

  }


  public delUser(alias: string) {
    let user = this.findUser(alias);
    if (user) {
      let index = this._userData.indexOf(user);
      this._userData.splice(index, 1);
    }
  }


  public findUser(alias: string) {
    return this._userData.find(u => u.alias == alias);
  }


  public clear() {
    while (this._userData.pop());
  }


}