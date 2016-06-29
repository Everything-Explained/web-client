import * as http from 'nanoajax';
import {inject} from 'aurelia-framework';
import * as encrypt from './helpers/cheap-encrypt';
import {ModernModal} from './helpers/modern-modal';
import {IRobot} from './helpers/robot-check';
import * as vtor from 'validator';
import {Web} from './helpers/web';



enum LoginTypes {
  NONE = 1,
  GOOGLE = 2,
  FACEBOOK = 4
}

@inject(Web)
export class Login {

  private _auth2: gapi.auth2.GoogleAuth;
  private _loggedInWith = LoginTypes.NONE;
  private _calledSignin = false;


  constructor(private _web: Web) {


  }

  public initAuthLibs() {

    this._initGoogleAuth();
    this._initFacebookAuth();

  }

  private _initGoogleAuth() {

    if (!gapi || !gapi.auth2 || !gapi.auth2.getAuthInstance()) {
      setTimeout(() => {
        this._initGoogleAuth();
      }, 133);
      return;
    }

    this._auth2 = gapi.auth2.getAuthInstance();

  }

  private _initFacebookAuth() {

    // INIT Facebook API
    window['fbAsyncInit'] = () => {
      FB.init({
        appId: '1682404772003204',
        status: true,
        xfbml: false,
        cookie: true,
        version: 'v2.5'
      });
    };

    (function(d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }



  get isSignedIn() {

    if (!this._calledSignin) this._isUserSignedIn();

    return !!(this._loggedInWith &
              (
               LoginTypes.FACEBOOK |
               LoginTypes.GOOGLE
              ));
  }


  private _isUserSignedIn() {

    // Google Signin Status
    if (this._auth2.isSignedIn.get()) {
      console.info('User Already Signed in with Google');
      this._loggedInWith |= LoginTypes.GOOGLE;
      return;
    }

    // Facebook Signin Status
    let fbAuth = FB.getAuthResponse();
    if (fbAuth && fbAuth.accessToken) {
      console.info('User Signed in with Facebook');
      this._loggedInWith |= LoginTypes.FACEBOOK;
      return;
    }
  }


  public signIn(type: string, cb?: (err, code, data) => void) {

    if (type === 'google') {

      if (!this._auth2.isSignedIn.get()) {
        cb('you do not have a <span>google</span> account.', null, null);
        return;
      }

      // this._auth2.signIn()
      //   .then(d => {
      //     let token = d.getAuthResponse().id_token;
      //     console.log(token);
      //     this._logInWith('google', token, cb ? cb : null);
      //   });

      return;
    }

    if (type === 'facebook') {

      let fbAuth = FB.getAuthResponse();

      // Already logged in
      if (fbAuth) {
        cb('you already have a <span>facebook</span> account', null, null);
        return;
      }
      cb('you do not have a <span>facebook</span> account.', null, null);
      // this._logInWith('facebook', fbAuth.accessToken, cb ? cb : null);

      // FB.login(res => {
      //   this._logInWith('facebook', res.authResponse.accessToken);
      // });

      return;
    }

  }


  public signUp(nick: string, type: string) {
    if (type === 'google') {

      // TODO - UI should log this
      if (this._auth2.isSignedIn.get()) return;

      this._auth2.signIn()
        .then(d => {
          let token = d.getAuthResponse().id_token;
          this._signUpWith(nick, 'google', token);
        });
      return;
    }

    if (type === 'facebook') {

      let fbAuth = FB.getAuthResponse();

      // TODO - UI Should log this
      // Already logged in
      if (fbAuth) return;

      FB.login(res => {
        if (res.status == 'connected') {
          console.log('Singing up With', res.authResponse.accessToken);

          // facebook needs time to update
          setTimeout(() => {
            this._signUpWith(nick, 'facebook', res.authResponse.accessToken);
          }, 500);

        }
      }, {scope: 'email'});
      return;
    }
  }

  private _logInWith(auth_type: string, token: string, cb?: (err, code, data) => void) {
    Web.POST('/internal/login', {
      fields: {
        token,
        auth_type
      }
    }, (err, code, data) => {
      console.log(err, code, data);
      if (cb) cb(err, code, data);
    });
  }

  private _signUpWith(nick: string, auth_type: string, token: string) {

    Web.POST('/internal/signup', {
      fields: {
        token,
        auth_type,
        alias: nick
      }
    }, (err, code, data) => {
      console.log(err, code, data);
    });

  }


  public signOut() {

    // if (this._loggedInWith & LoginTypes.GOOGLE) {
    //   console.log('Signing out with Google');
    //   this._loggedInWith &= ~LoginTypes.GOOGLE;
    //   this._auth2.signOut();
    //   return;
    // }

    // if (this._loggedInWith & LoginTypes.FACEBOOK) {
    //   console.log('Signing out with Facebook');
    //   FB.logout((res) => {
    //     console.log(res);
    //   });
    // }
    FB.getLoginStatus(res => {
      if (res.status == 'connected') {
        // console.log(res.authResponse.accessToken);
        // Web.POST('/internal/logout', {
        //   data: res.authResponse.accessToken
        // }, (err, code, data) => {
        //   console.log(err, code, data);
        // });
        console.log('connected');
      }
      else console.log('hello');
    });


  }


}