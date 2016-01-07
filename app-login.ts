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
  
  private _objs = new Object() as {
    email: HTMLInputElement;
    nick: HTMLInputElement;
    cansave: HTMLElement;
    cansavec: HTMLElement;
    emailcheck: HTMLElement;
    emailerror: HTMLElement;
    emailerrorc: HTMLElement;
    nickcheck: HTMLElement;
    nickerror: HTMLElement;
    nickerrorc: HTMLElement;
  }
  
  private _classes = [
    '.nick',
    '.email',
    '.can-save-container',
    '.can-save',
    '.email-check',
    '.email-error',
    '.email-error-container',
    '.nick-check',
    '.nick-error',
    '.nick-error-container'
  ]

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
            trigger: (e, ol, objs) => this._validateNick(e, ol, objs)
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
      objs: this._classes
    }, (objs) => {
      this._populateLoginObjs(objs);
    })

  }




  /**
   * Validate Username/Nick during account setup
   */
  private _validateNick(e: KeyboardEvent, ol: HTMLElement, objs: any) {
    let input = e.target as HTMLInputElement;


    if (vtor.matches(input.value, /^[a-zA-Z0-9]+$/g) &&
        vtor.isLength(input.value, 4, 21))
    {
      this._objs.nickcheck.classList.remove('invalid');
      this._setLoginStatus(this._objs.nickerrorc, this._objs.nickerror, false);
    } else {
      this._objs.nickcheck.classList.add('invalid');
      this._setLoginStatus(this._objs.nickerrorc, this._objs.nickerror, true);
    }
    this._canUserSave(objs);
  }




  /**
   * Validate email during account setup.
   */
  private _validateEmail(e: KeyboardEvent, ol: HTMLElement, objs: any) {
    let input = (e.target as HTMLInputElement).value;

    if (vtor.isEmail(input)) {
      this._objs.emailcheck.classList.remove('invalid');
      this._setLoginStatus(this._objs.emailerrorc, this._objs.emailerror, false);
    } else {
      this._objs.emailcheck.classList.add('invalid');
      this._setLoginStatus(this._objs.emailerrorc, this._objs.emailerror, true);
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
    } 
    else if(!status && stc.classList.contains('open')) {
      stc.classList.remove('open');
      sto.classList.remove('open');
    }
  }




  /**
   * Check if the user can save their changes
   * based on the username and email validation.
   */
  private _canUserSave(objs: any) {

    if (this._objs.emailcheck.classList.contains('invalid') ||
        this._objs.nickcheck.classList.contains('invalid')) {
      this._setLoginStatus(this._objs.cansavec, this._objs.cansave, false);
    } else {
      this._setLoginStatus(this._objs.cansavec, this._objs.cansave, true);
    }

  }
  
  
  private _populateLoginObjs(objs: any) {
    for(let o in objs) {
      switch(vtor.ltrim(o,'.')) {
        case 'email': this._objs['email'] = objs[o]; break;
        case 'nick': this._objs['nick'] = objs[o]; break;
        case 'can-save': this._objs['cansave'] = objs[o]; break;
        case 'can-save-container': this._objs['cansavec'] = objs[o]; break;
        case 'email-check': this._objs['emailcheck'] = objs[o]; break;
        case 'email-error': this._objs['emailerror'] = objs[o]; break;
        case 'email-error-container': this._objs['emailerrorc'] = objs[o]; break;
        case 'nick-check': this._objs['nickcheck'] = objs[o]; break;
        case 'nick-error': this._objs['nickerror'] = objs[o];  break;
        case 'nick-error-container': this._objs['nickerrorc'] = objs[o]; break;
        
        default: 
          throw new Error("AppLogin::PopulateLoginObjs::Can't find '" + o + "' in object list.")
      }
    }
    
    let i = 0;
    for(let k in this._objs) i++;
    if (i != this._classes.length) {
      throw new Error('AppLogin::populateLoginObjs::Available Classes and Objs do not match')
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