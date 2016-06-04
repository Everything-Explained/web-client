const client_id = '15334727358-lehq7huis9fm49iee7i03l15sj6g8r68.apps.googleusercontent.com';
const apiKey = 'AIzaSyAJTuseZ8KbSzREwbs4lcTu4icoMIKhYQY';
const scope = 'https://www.googleapis.com/auth/plus.me';

import {IRobot} from '../../helpers/robot-check';

export class Signin {

  private _auth2: gapi.auth2.GoogleAuth;
  private _robotButton: HTMLElement;
  private _robotNodes: HTMLElement[];
  private _robotError: HTMLElement;
  private _robot: IRobot;

  public robotButtonText = 'Start!';

  constructor() {}

    public test() {



    // gapi.client.setApiKey(apiKey);

    // this.test2();

  }

  get isRobotError() {
    let val = false;
    if (this._robot) val = this._robot.inError;
    return val;
  }

  public activateRobot() {
    if (this._robot.started) {
      this._robot.restart();
    } else {
      this._robot.start(700, 300);
    }
  }

  public test2() {
    gapi.auth.authorize({ client_id, scope, immediate: true}, (result) => {
      console.log('hello there');
      console.log(result);
    });
  }

  signIn() {
    // this._auth2.signIn()
    //   .then((d) => {
    //     console.log(d.getAuthResponse());
    //   });
    // auth2.attachClickHandler(el, {}, (user) => {
    //   console.log(user.getBasicProfile().getId());
    // },
    // (error) => {
    //   console.log(error);
    // });
  }


  attached() {
    // gapi.load('auth2', () => {
    //   this._auth2 = gapi.auth2.init({
    //     client_id
    //   });
    //   // this.attachSignin(document.getElementById('test'), auth2);
    // });

    this._robotButton = document.querySelector('.try-again') as HTMLElement;
    this._robotNodes = Array.prototype.slice.call(document.querySelectorAll('.node')) as HTMLElement[];

    this._robot = new IRobot(this._robotNodes, res => {
      if (res) {
        console.log("You're not a robot!!!");
      } else {
        this.robotButtonText = 'Try Again!';
      }
    });

  }

}
