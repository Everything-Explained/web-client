import * as http from 'nanoajax';
import {inject} from 'aurelia-framework';
import * as encrypt from './helpers/cheap-encrypt';
import {ModernModal} from './helpers/modern-modal';
import * as vtor from 'validator';


interface ILoginData {
  user_id: string;
  picture: string;
  email: string;
  nickname: string;
  locale: string;
}


export class Login {

  private _clientID = 'VOhiMrFfTsx2SSgoGOr25G8qa3J6W0yj';
  private _domain = 'aedaeum.auth0.com';
  private _header = 'WWW-Authenticate';

  private _lock: Auth0LockStatic;

  constructor(private _modal: ModernModal) {
    this._lock = new Auth0Lock(this._clientID, this._domain);
  }

  exec() {
    
    let data = { 
      user_id: 'facebook|10156229933700346',
      picture: 'https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=d55c8b6987279516ff0d4abf9872a816&oe=570F2B2F',
      email: 'aelumen@gmail.com',
      nickname: 'aelumen',
      locale: 'en_US' 
    }
    
    this._completeSignup(data);

    // this._lock.show((err, profile, token) => {

    //   if (err) {
    //     console.log(err);
    //     return;
    //   }

    //   console.info(profile);

    //   this._requestLogin(token).then((key: string) => {

    //     this._login(token, key, profile).then((res: [number, string]) => {
    //       console.log(res);
    //     })

    //   })

    // })
  }



  private _requestLogin(token: string) {

    return new Promise((rs, rj) => {

      http.ajax({
        url: '/internal/loginrequest',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },

      (code, res, req) => {

        let header = req.getResponseHeader(this._header)

          // Decode header from base64
          , data = atob(header)

          // Decode last 2 chars
          , salt = parseInt(data.substr(-2), 16)

          // Decode 2 chars before last 2 chars
          , saltRamp = parseInt(data.substr(-4, 2), 16) / 100


        // Clean footers
        data = data.slice(0, -4);


        let decoded = '';
        for(let i = 0, s = salt; i < data.length; i+=2) {

          // Convert to ASCII code
          let alldata = parseInt(data[i] + data[i + 1], 16);

          // Convert to char
          decoded += String.fromCharCode(alldata - s);
          s = Math.floor(s * saltRamp);
        }

        rs(decoded);

      })

    })



  }



  private _login(token: string, key: string, profile: Auth0UserProfile) {

    return new Promise((rs, rj) => {

      let data = encrypt.encode(key, JSON.stringify({
        user_id: profile.user_id,
        picture: profile.picture,
        email: profile.email,
        nickname: profile.nickname,
        locale: profile.locale
      }))

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

      })

    })

  }




  private _completeSignup(data: ILoginData) {

    this._modal.show('modals/login', 'Complete Login', {
      '.nick': {
        value: data.nickname,
        events: [
          {
            name: 'keyup',
            trigger: (e, ol, objs) => this._validateUsername(e, ol, objs)
          }
        ]
      },
      '.email': {
        value: data.email,
        events: [
          {
            name: 'keyup',
            trigger: (e, ol, objs) => this._validateEmail(e, ol, objs)
          }
        ]
      },
      '.can-save-container': null,
      '.can-save': null,
      '.email-check': null,
      '.nick-check': null,
      '.nick-error': null,
      '.nick-error-container': null,
      '.email-error': null,
      '.email-error-container': null,
    })

  }




  /**
   * Validate Username/Nick during account setup
   */
  private _validateUsername(e: KeyboardEvent, ol: HTMLElement, objs: any) {
    let input = e.target as HTMLInputElement
      , check = objs['.nick-check'] as HTMLElement
      , stc = objs['.nick-error-container'] as HTMLElement
      , sto = objs['.nick-error'] as HTMLElement;


    if (vtor.matches(input.value, /[a-zA-Z0-9]+/g) &&
        vtor.isLength(input.value, 4, 21))
    {
      check.classList.remove('invalid');
      this._setLoginStatus(stc, sto, false);
    } else {
      check.classList.add('invalid');
      this._setLoginStatus(stc, sto, true);
    }
    this._canUserSave(objs);
  }




  /**
   * Validate email during account setup.
   */
  private _validateEmail(e: KeyboardEvent, ol: HTMLElement, objs: any) {
    let input = (e.target as HTMLInputElement).value
      , check = objs['.email-check'] as HTMLElement
      , stc = objs['.email-error-container'] as HTMLElement
      , sto = objs['.email-error'] as HTMLElement;

    if (vtor.isEmail(input)) {
      check.classList.remove('invalid');
      this._setLoginStatus(stc, sto, false);
    } else {
      check.classList.add('invalid');
      this._setLoginStatus(stc, sto, true);
    }
    this._canUserSave(objs);
  }




  /**
   * Hide/Show the specified Account Setup status.
   */
  private _setLoginStatus(stc: HTMLElement, sto: HTMLElement, status: boolean) {
    if (status && !stc.classList.contains('open')) {
      stc.classList.add('open');
      setTimeout(() => {
        sto.classList.add('open');
      }, 50);
    } else if(!status && stc.classList.contains('open')) {
      stc.classList.remove('open');
      sto.classList.remove('open');
    }
  }




  /**
   * Check if the user can save their changes based
   * based on the username and email validation.
   */
  private _canUserSave(objs: any) {
    let statusEmail = objs['.email-check'] as HTMLElement
      , statusUsern = objs['.nick-check'] as HTMLElement
      , csc = objs['.can-save-container'] as HTMLElement
      , csv = objs['.can-save'] as HTMLElement;

    if (statusEmail.classList.contains('invalid') ||
        statusUsern.classList.contains('invalid')) {
      this._setLoginStatus(csc, csv, false);
    } else {
      this._setLoginStatus(csc, csv, true);
    }

  }



  /**
   * Check if the specified nick already exists.
   */
  private checkUsername(name: string): Promise<boolean> {

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
      })
    })

  }




}