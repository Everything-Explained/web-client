import { customElement, bindable, inject, computedFrom } from 'aurelia-framework';
import { IUser, UserData } from '../../../../shared/models/user-data';
import { ChatSock, UserEvent } from '../../components/ChatSock';


@inject(UserData)
@customElement('user-list')
export class UserList {

  @bindable readonly sock: ChatSock;

  @computedFrom('_userData.users')
  get users() { return this._userData.users; }




  constructor(private _userData: UserData) {}




  public attached() {

  }


  public openContextMenu() {
    // Show context menu with basic actions
  }


  public openUserPanel() {
    // Modal popup for advanced user stats and interaction
  }
}