import * as http from 'nanoajax';
import {inject} from 'aurelia-framework';
import * as encrypt from './helpers/cheap-encrypt';
import {ModernModal} from './helpers/modern-modal';
import {IRobot} from './helpers/robot-check';
import * as vtor from 'validator';


interface LoginData {
  google_id?: string;
  facebook_id?: string;
  picture: string;
  email: string;
  email_verified?: boolean;
  nick: string;
  locale: string;
}

interface LoginStatusObjs {
  sto: HTMLElement;
  stc: HTMLElement;
  chk?: HTMLElement;
}


interface LoginObjs {
    avatar:       HTMLImageElement;
    email:        HTMLInputElement;
    nick:         HTMLInputElement;
    cansave:      HTMLElement;
    cansavec:     HTMLElement;
    emailCheck:   HTMLElement;
    emailInvalid: HTMLElement;
    emailErrorc:  HTMLElement;
    nickCheck:    HTMLElement;
    nickInvalid:  HTMLElement;
    nickErrorc:   HTMLElement;
    saveButton:   HTMLButtonElement;
}

enum LoginState {
  NONE = 1,
  ISHUMAN = 2,
  ISINVITED = 4,
  ISSIGNEDIN = 8
}


export class Login {

  private _clientID = 'VOhiMrFfTsx2SSgoGOr25G8qa3J6W0yj';
  private _domain   = 'aedaeum.auth0.com';
  private _header   = 'WWW-Authenticate';
  private _robot: IRobot;

  private _validationTimeout = 0;

  private _objs = {} as LoginObjs;

  private _classes = [
    '.avatar',
    '.nick',
    '.nick-check',
    '.nick-invalid',
    '.nick-error-container',
    '.email',
    '.email-check',
    '.email-invalid',
    '.email-error-container',
    '.can-save-container',
    '.can-save',
    '.save'
  ];

  private _lock: Auth0LockStatic;

  private _loginState = LoginState.NONE;
  private _profile = {} as LoginData;
  private _inviteSecret = null as string;

  constructor(private _modal: ModernModal) {
    this._lock = new Auth0Lock(this._clientID, this._domain);

  }

  signup() {

    if (this._loginState & LoginState.ISSIGNEDIN) {

    }

    if (this._loginState & LoginState.ISINVITED) {
      this._showSignup();
      return;
    }

    if (this._loginState & LoginState.ISHUMAN) {
      this._askForInvite();
      return;
    }


    this
      ._showRobotTest()
      .then(() => this._askForInvite())
      .then((res: any) => {
        this._modal.close();
        return this._showSignup(this._inviteSecret = res);
      })
      .then((data: any) => {
        console.log('hello');
      });

  }


  private _showSignup(secret?: string) {

    return new Promise((rs, rj) => {
      this._loginState =
        (secret || this._inviteSecret)
          ? LoginState.ISINVITED
          : this._loginState;

      this._lock.showSignup({

      }, () => {

      });

    });


  }


  private _showRobotTest() {

    return new Promise((rs, rj) => {
      console.log(this);
      this._modal.show('modals/robot', 'I Robot Test', {
        objs: ['.try-again', '.text-container']
      }, (o: any, loaded: boolean) => {

        if (!this._robot) {
          let objs = Array.prototype.slice.call(document.querySelectorAll('.node')) as HTMLElement[]
            , content = o['.text-container'] as HTMLElement
            , button = o['.try-again'] as HTMLElement;

          this._robot = new IRobot(objs, (res) => {

            if (res) {
              rs(true);
              this._loginState = LoginState.ISHUMAN;
            } else {
              content.classList.add('error');
              content.innerText = 'Sorry, try again!';
            }

          });

          setTimeout(() => {
            this._robot.start(600);
            button.addEventListener('click', () => {
              content.classList.remove('error');
              content.innerText = 'Click the circles in the order they blink.';
              this._robot.restart(600);
            });
          }, 700);
        }
      });

    });

  }

  signIn() {

    // let data = {
    //   email: "aelumen@gmail.com",
    //   locale: "en",
    //   nickname: "aelumen",
    //   picture: "https://lh4.googleusercontent.com/-jm9RnjaBMrI/AAAAAAAAAAI/AAAAAAAAAWQ/6K_OsI87w4g/photo.jpg",
    //   user_id: "google-oauth2|113221828266023013722"
    // }

    let data = {
      email: 'aelumen@gmail.com',
      locale: 'en',
      nick: 'aelumen',
      picture: 'https://scontent.xx.fbcdn.net/hprofile-xtl1/v/t1.0-1/p50x50/1909949_10156451943195346_4119065300640329697_n.jpg?oh=ceef56f378b2dd26ad06dd418e3fe9bf&oe=56FC1166',
      user_id: 'facebook|10156229933700346'
    };

    if (data.user_id.indexOf('google') > -1) {
      data.picture = data.picture.split('photo.jpg')[0] + 's64-c-mo/photo.jpg';
    }
    else if (data.user_id.indexOf('facebook') > -1) {
      data.picture = 'https://graph.facebook.com/' + data.user_id.split('|')[1] + '/picture?width=64';
    }

    // this._test(data);

    this._completeSignup(data);


    // this._askForInvite();


    // this._lock.showSignin({
    //   rememberLastLogin: true
    // }, (err, profile, token) => {

    //   if (err) {
    //     console.log(err);
    //     return;
    //   }

    //   console.info(profile);

    //   localStorage.setItem('userToken', token);

    //   this._requestLogin(token).then((key: string) => {

    //     this._login(token, key, profile).then((res: [number, string]) => {
    //       console.log(res);
    //     });

    //   });

    // });
  }


  private _test(profile) {

    this._validateAPIURL('verifylogin', profile)
      .then((res) => {
        console.log('Success', res);
      })
      .catch((e) => {
        console.log('Error', e);
      });

  }



  private _requestLogin(token: string) {

    return new Promise((rs, rj) => {

      http.ajax({
        url: '/internal/loginrequest'
      },

      (code, res, req) => {

        let header = req.getResponseHeader(this._header)

          // Decode header from base64
          , data = atob(header)

          // Decode last 2 chars
          , salt = parseInt(data.substr(-2), 16)

          // Decode 2 chars before last 2 chars
          , saltRamp = parseInt(data.substr(-4, 2), 16) / 100;


        // Clean footers
        data = data.slice(0, -4);


        let decoded = '';
        for (let i = 0, s = salt; i < data.length; i += 2) {

          // Convert to ASCII code
          let alldata = parseInt(data[i] + data[i + 1], 16);

          // Convert to char
          decoded += String.fromCharCode(alldata - s);
          s = Math.floor(s * saltRamp);
        }

        rs(decoded);

      });

    });



  }


  private _validateAPIURL(url: string, data: string|Object, token = '', hidden = false) {

    let contentType = (typeof data === 'string') ? 'text/plain' : 'application/json';

    let headers = (token)
      ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': contentType
        }
      : {
          'Content-Type': contentType
        }
      , newData: string|Object;

    url = `/internal/${url}`;

    return new Promise((rs, rj) => {

      if (hidden) {
        headers['WWW-Authenticate'] = data;
        newData = 'Hello World';
      }
      else newData =
        (typeof data === 'string' || typeof data === 'number')
          ? data
          : JSON.stringify(data);

      let ajaxOptions = {
        url,
        headers
      };

      if (newData) ajaxOptions['body'] = newData;

      http.ajax(ajaxOptions, (code, res, req) => {

        if (code == 200) {
          rs(JSON.parse(res));
        } else {
          rj(res);
        }

      });


    });



  }



  private _login(token: string, key: string, profile: Auth0UserProfile) {

    return new Promise((rs, rj) => {

      let data = encrypt.encode(key, JSON.stringify({
        user_id: profile.user_id,
        picture: profile.picture,
        email: profile.email,
        nickname: profile.nickname,
        locale: profile.locale
      }));

      console.log(data);

      http.ajax({
        url: '/internal/login',
        method: 'POST',
        body: 'Hello World!',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
          'WWW-Authenticate': data
        }
      }, (code, res, req) => {

        rs([code, res]);

      });

    });

  }



  private _askForInvite() {

    return new Promise((rs, rj) => {

      this._modal.show('modals/invite', 'Enter Invite Code', {
        '.submit': {
          events:
          [{
            name: 'click',
            trigger: (e, ol, objs) => {
              this._validateInvite(objs)
                .then(rs)
                .catch(rj);
            }
          }]
        },
        objs: ['.error', '.error-container', '.invite-input']
      });

    });

  }



  private _validateInvite(objs: any) {

    return new Promise((rs, rj) => {
      this
        ._validateAPIURL('validinvite', objs['.invite-input'].value)
          .then((res: any) => {

            if (!res.valid) {
              this._setModalStatus({
                stc: objs['.error-container'],
                sto: objs['.error']
              }, false, 'Invalid Invite');
              return;
            }

            if (res.expired) {
              this._setModalStatus({
                stc: objs['.error-container'],
                sto: objs['.error']
              }, false, 'Sorry, that invite has expired');
              return;
            }

            rs(res);

          })
          .catch(rj);
    });


  }




  private _completeSignup(data: LoginData) {


    this._modal.show('modals/login', 'Complete Signup', {
      '.nick': {
        value: data.nick,
        events: [
          {
            name: 'keyup',
            trigger: (e, ol, objs) => this._validateSignup(e, 'nick')
          }
        ]
      },
      '.email': {
        value: data.email,
        events: [
          {
            name: 'keyup',
            trigger: (e, ol, objs) => this._validateSignup(e, 'email')
          }
        ]
      },
      '.save': {
        events: [
          {
            name: 'click',
            trigger: () => {
              this._validateAPIURL('verifylogin', data)
              .catch((er) => {
                console.error(er);
              });
            }
          }
        ]
      },
      objs: this._classes
    }, (objs) => {
      this._populateLoginObjs(objs);

      this._objs.avatar.src = data.picture;
      this._canUserSave();

    });

  }


  private _validateSignup(e: KeyboardEvent, type: string) {

    // SHIFT, CTRL, CAPSLOCK
    if (e.which == 16 || e.which == 17 || e.which == 20) {
      return;
    }

    clearTimeout(this._validationTimeout);

    let objs: { stc: HTMLElement, sto: HTMLElement, chk: HTMLElement };

    this._validationTimeout = setTimeout(() => {

      // In case the timing failed
      clearTimeout(this._validationTimeout);

      let input = (e.target as HTMLInputElement).value;

      switch (type) {

        case 'email':
          objs =
          {
            stc: this._objs.emailErrorc,
            sto: this._objs.emailInvalid,
            chk: this._objs.emailCheck
          };

          if (input.length < 1 || !input) {
            this._setModalStatus(objs, false, 'Please enter an email address.');
          }
          else if (vtor.isEmail(input)) {
            this._setModalStatus(objs, true);
          } else {
            this._setModalStatus(objs, false, 'That email is not correctly formatted.');
          }

        break;



        case 'nick':
          objs =
          {
            stc: this._objs.nickErrorc,
            sto: this._objs.nickInvalid,
            chk: this._objs.nickCheck
          };

          if (input.length < 1 || !input) {
            this._setModalStatus(objs, false);
          }
          if (input.length < 4) {
            this._setModalStatus(objs, false);
          }
          else if (vtor.matches(input, /^[a-zA-Z0-9]+$/g)) {
            this._setModalStatus(objs, true);
          } else {
            console.log('invalid');
            this._setModalStatus(objs, false);
          }
        break;


        default:
          throw 'AppLogin::validateSignup::Invalid Validation Type';

      }

      this._canUserSave();


    }, 500);






  }


  /**
   * Hide/Show the specified Account Setup status.
   *
   * @param objs - Container, Output, and Checkmark objects
   * @param status - Whether the status should be success or fail
   */
  private _setModalStatus(objs: LoginStatusObjs, status: boolean, content?: string) {

    let { stc, sto, chk } = objs;

    if (!status && !stc.classList.contains('open')) {
      if (content) {
        sto.innerHTML = content;
      }
      if (chk) chk.classList.add('invalid');
      stc.classList.add('open');
      setTimeout(() => {
        sto.classList.add('open');
      }, 50);
    }
    else if (status && stc.classList.contains('open')) {
      if (chk) chk.classList.remove('invalid');
      stc.classList.remove('open');
      sto.classList.remove('open');
    }
    else if (content && content != sto.innerText) {
      sto.classList.remove('open');
      setTimeout(() => {
        sto.innerHTML = content;
        sto.classList.add('open');
      }, 350);
    } else if (chk && status) {
      chk.classList.remove('invalid');
    } else if (chk && !status) {
      chk.classList.add('invalid');
    }
  }




  /**
   * Check if the user can save their changes
   * based on the username, email, and invite validation.
   */
  private _canUserSave() {

    let objs =
    {
      stc: this._objs.cansavec,
      sto: this._objs.cansave
    };

    if (this._objs.emailCheck.classList.contains('invalid') ||
        this._objs.nickCheck.classList.contains('invalid')) {
      this._setModalStatus(objs, true);
      this._objs.saveButton.disabled = true;
    } else {
      this._setModalStatus(objs, false);
      this._objs.saveButton.disabled = false;
    }

  }


  private _populateLoginObjs(objs: any) {
    for (let o in objs) {
      switch (vtor.ltrim(o, '.')) {
        case 'avatar': this._objs['avatar'] = objs[o]; break;
        case 'email': this._objs['email'] = objs[o]; break;
        case 'nick':
          console.log(objs, this._objs);
          this._objs['nick'] = objs[o];
        break;
        case 'can-save': this._objs['cansave'] = objs[o]; break;
        case 'can-save-container': this._objs['cansavec'] = objs[o]; break;
        case 'email-check': this._objs['emailCheck'] = objs[o]; break;
        case 'email-invalid': this._objs['emailInvalid'] = objs[o]; break;
        case 'email-error-container': this._objs['emailErrorc'] = objs[o]; break;
        case 'nick-check': this._objs['nickCheck'] = objs[o]; break;
        case 'nick-invalid': this._objs['nickInvalid'] = objs[o];  break;
        case 'nick-error-container': this._objs['nickErrorc'] = objs[o]; break;
        case 'save': this._objs['saveButton'] = objs[o]; break;

        default:
          throw new Error('AppLogin::PopulateLoginObjs::Can\'t find \'' + o + '\' in object list.');
      }
    }

    let i = 0
      , test = [] as string[];
    for (let k in this._objs) {
      test.push(k);
      i++;
    }
    if (i != this._classes.length) {
      console.log(test);
      console.log(this._classes);
      throw new Error('AppLogin::populateLoginObjs::Available Classes and Objs do not match');
    }

  }



  /**
   * Check if the specified nick already exists.
   */
  private checkUsername(name: string) {

    return new Promise((rs, rj) => {
      http.ajax({
        url: '/internal/validnick',
        method: 'POST',
        body: name,
        headers: {
          'Content-Type': 'text/plain'
        }
      }, (code, res, req) => {

        if (code == 200) rs((res == 'true') ? true : false);
        else             rj(res);
      });
    });

  }




}