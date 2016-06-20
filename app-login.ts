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

    // Handle auto returning Google Signin
    if (this._auth2.isSignedIn.get()) {
      console.info('User Already Signed in with Google');
      this._loggedInWith |= LoginTypes.GOOGLE;
      return;
    }

    // Handle auto returning Facebook Signin
    FB.getLoginStatus(res => {
      if (res.status === 'connected') {
        console.info('User Already Signed in with Facebook');
        this._loggedInWith |= LoginTypes.FACEBOOK;
      }
    });
  }


  public signIn(type: string) {

    if (type === 'google') {

      Web.POST('/internal/login', {
        fields: {
          token: 'testing',
        }
      }, (err, code, data) => {
        console.log(err, code, data);
      });
      // this._auth2.signIn()
      //   .then(d => {
      //     let token = d.getAuthResponse().id_token;
      //     http.ajax({
      //       url: '/internal/login',
      //       headers: {
      //         'Content-Type': 'text/plain'
      //       },
      //       body: `${token}`
      //     }, (code, res, req) => {
      //       console.log(JSON.parse(res));
      //     });
      //   });

      return;
    }

    if (type === 'facebook') {
      FB.login(res => {
        console.dir(res);
      }, {
        scope: 'email,public_profile'
      });
      return;
    }


  }


  public signOut() {

    if (this._loggedInWith & LoginTypes.GOOGLE) {
      console.log('Signing out with Google');
      this._loggedInWith &= ~LoginTypes.GOOGLE;
      this._auth2.signOut();
      return;
    }

    if (this._loggedInWith & LoginTypes.FACEBOOK) {
      console.log('Signing out with Facebook');
      FB.logout((res) => {
        console.log(res);
      });
    }

  }


}