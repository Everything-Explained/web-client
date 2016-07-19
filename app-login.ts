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
  private _isReady = false;


  constructor(private _web: Web) {


  }

  public initAuthLibs() {

    if (this._isReady) return;
    this._initGoogleAuth();
    this._initFacebookAuth();
    this._isReady = true;
  }

  private _initGoogleAuth() {

    if (!window['gapi'] || !gapi.auth2 || !gapi.auth2.getAuthInstance()) {
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

    let defMsg = {msg:
      '<span class="fail">error logging in</span><br/>' +
      `are you <span>signed in</span> with <span>${type}?</span><br/>` +
      ' do you have a <span>noumenae</span> account?'};

    if (type === 'google') {

      this._auth2.signIn()
        .then(d => {
          let token = d.getAuthResponse().id_token;
          this._logInWith('google', token, cb ? cb : null);
        });

      return;
    }

    if (type === 'facebook') {

      let fbAuth = FB.getAuthResponse();
      let session = window.session;


      // Already logged in
      if (fbAuth && session.authed) {
        cb({msg: 'you\'re already signed into <span>noumenae</span>'}, null, null);
        return;
      }

      if (fbAuth && !session.authed) {
        this._logInWith('facebook', fbAuth.accessToken, cb ? cb : null);
        return;
      }

      FB.login(res => {
          this._logInWith('facebook', res.authResponse.accessToken, cb ? cb : null);
          return;
        },
        {scope: 'email'}
      );

      // cb(defMsg, null, null);

      return;
    }

  }



  public signUp(nick: string, type: string, cb: (err, code, data) => void) {
    if (type === 'google') {

      // TODO - UI should log this
      // if (this._auth2.isSignedIn.get()) return;

      this._auth2.signIn()
        .then(d => {
          let token = d.getAuthResponse().id_token;
          this._signUpWith(nick, 'google', token, cb);
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
            this._signUpWith(nick, 'facebook', res.authResponse.accessToken, cb);
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
      err = (err) ? JSON.parse(err) : null;
      if (cb) cb(err, code, data);
    });
  }



  private _signUpWith(nick: string, auth_type: string, token: string, cb: (err, code, data) => void) {

    Web.POST('/internal/signup', {
      fields: {
        token,
        auth_type,
        alias: nick
      }
    }, (err, code, data) => {
      console.log(err, code, data);
      cb(err, code, data);
    });

  }



  public signOut(cb: (err, code, data) => void) {

    Web.POST('/internal/logout', {
      fields: {
        secret: window.session.secret
      }
    },
    (err, code, data) => {
      console.log(err, code, data);
      cb(err, code, data);
    });


  }


}