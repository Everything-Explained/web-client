import {Web} from './web-get';
import environment from '../../environment';
import { inject } from 'aurelia-framework';
import { Session } from '../models/session';



enum LoginTypes {
  NONE = 1,
  GOOGLE = 2,
  FACEBOOK = 4
}

@inject(Session)
export class Login {

  private _auth2: gapi.auth2.GoogleAuth;
  private _loggedInWith = LoginTypes.NONE;
  private _calledSignin = false;
  private _isReady = false;
  private _googleReady = false;
  private _fbReady = false;


  constructor(public session: Session) {}

  public initAuthLibs(cb: () => void) {
    if (this._isReady) return cb();
    this._checkReadyStates(cb);

    // Facebook waits on window async function
    this._initFacebookAuth();
    this._loadAuthScripts();
    this._initGoogleAuth();
    console.log('Loading APIs');
    this._isReady = true;
  }

  private _initGoogleAuth() {
    if (!window['gapi']) {
      setTimeout(() => {
        this._initGoogleAuth();
      }, 150);
    } else {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          fetch_basic_profile: true
        })
        .then(() => {
          this._auth2 = gapi.auth2.getAuthInstance();
          if (this._auth2.isSignedIn.get()) {
            console.log(`LOGGED-IN with Google`);
          } else {
            console.log('NOT logged in with Google');
          }
          this._googleReady = true;
        },
        (fail) => {
          console.error(fail);
        });
      });
    }


  }

  private _initFacebookAuth() {
    // INIT Facebook API
    window['fbAsyncInit'] = () => {
      let ronan = false;
      let appId =
            (environment.debug)
              ? (ronan)
                  ? '694741017370139'
                  : '951977694937280'
              : '1682404772003204' ;

      console.log(appId);
      FB.init({
        appId,
        xfbml: false,
        cookie: true,
        version: 'v2.5'
      });
      FB.getLoginStatus((res) => {
        if (res.status == 'connected') {
          console.log('LOGGED-IN with Facebook');
        } else {
          console.log('NOT logged in with Facebook');
        }
        this._fbReady = true;
      });
    };

  }


  private _loadAuthScripts() {

    let s = document.getElementsByTagName('script')[0] as HTMLElement
      , gel = document.createElement('script')
      , fel = document.createElement('script')
    ;

    gel.async = fel.async = true;
    gel.src = '//apis.google.com/js/api.js';
    fel.src = '//connect.facebook.net/en_US/sdk.js';

    s.parentNode.insertBefore(gel, s);
    s.parentNode.insertBefore(fel, s);

  }


  private _checkReadyStates(cb: () => void) {

    if (this._googleReady && this._fbReady) {
      cb();
    }
    else {
      setTimeout(() => {
        this._checkReadyStates(cb);
      }, 200);
    }

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


  public async signIn(type: string) {

    let defMsg = {msg:
      '<span class="fail">error logging in</span><br/>' +
      `are you <span>signed in</span> with <span>${type}?</span><br/>` +
      ' do you have a <span>noumenae</span> account?'};

    if (type === 'google') {
      let d = await this._auth2.signIn()
      let token = d.getAuthResponse().id_token;
      return this._logInWith('google', token);
    }

    if (type === 'facebook') {

      let fbAuth = FB.getAuthResponse();
      let session = window.session;

      return new Promise((rs, rj) => {
        // Already logged in
        if (fbAuth && session.authed) {
          rs([{msg: 'you\'re already signed into <span>noumenae</span>'}, -1, null]);
          return;
        }

        if (fbAuth && !session.authed) {
          rs(this._logInWith('facebook', fbAuth.accessToken));
          return;
        }

        FB.login(res => {
            rs(this._logInWith('facebook', res.authResponse.accessToken));
            return;
          },
          {scope: 'email'}
        );

      }) as Promise<[any, number, any]>;

    }

  }



  public async signUp(nick: string, type: string) {
    if (type === 'google') {

      // TODO - UI should log this
      // if (this._auth2.isSignedIn.get()) return;

      let d = await this._auth2.signIn()
        , token = d.getAuthResponse().id_token
      ;
      return this._signUpWith(nick, 'google', token);
    }

    if (type === 'facebook') {

      let fbAuth = FB.getAuthResponse();

      // TODO - UI Should log this
      // Already logged in
      if (fbAuth) {
        console.error('Already Logged In');
        return;
      }

      return new Promise((rs, rj) => {
        FB.login(res => {
          if (res.status == 'connected') {
            console.log('Singing up With', res.authResponse.accessToken);

            // facebook needs time to update
            setTimeout(() => {
              rs(this._signUpWith(nick, 'facebook', res.authResponse.accessToken));
            }, 500);

          }
        }, {scope: 'email'});

      }) as Promise<[any, number, any]>;

    }
  }



  private async _logInWith(auth_type: string, token: string) {

    return new Promise( async (rs, rj) => {
      let [err, code, data] =
          await Web.POST('/internal/login', {
            fields: {
              token,
              auth_type
            }
          })
      ;

      // DEBUG
      console.log(err, code, data);

      /*****************
       * FACEBOOK ONLY
       *
       * Force logout if user tries to log in before
       * signing up
       *******************/
      let authResp = FB.getAuthResponse();
      if (authResp) {
        FB.logout(resp => {
          console.log(resp);
        });
      }
      err = err || null;
      rs([err, code, data]);

    }) as Promise<[any, number, any]>;

  }


  private async _signUpWith(nick: string, auth_type: string, token: string) {

    return new Promise( async (rs, rj) => {
      let [err, code, data] =
          await Web.POST('/internal/signup', {
            fields: {
              token,
              auth_type,
              alias: nick
            }
          })
      ;

      // DEBUG
      console.log(err, code, data);
      rs([err, code, data]);

    }) as Promise<[any, number, any]>;

  }


  public signOut(cb: (err, code, data) => void) {

    function logout() {
      return new Promise( async (rs, rj) => {
        let [err, code, data] =
            await Web.POST('/internal/logout', {
              fields: {
                secret: window.session.secret
              }
            })
        ;

        rs([err, code, data]);
        if (!err) window.location.reload();
      });

    };

    let isAuthedWithGoogle = this._auth2.isSignedIn.get()
      , isAuthedWithFacebook = FB.getAuthResponse()
    ;

    if (!isAuthedWithGoogle && !isAuthedWithGoogle) {
      return logout();
    }

    if (isAuthedWithGoogle) {
      this._auth2.signOut();
      return logout();
    }

    if (isAuthedWithFacebook) {
      console.log('Logging out facebook');
      FB.logout((e) => {
        setTimeout(() => {
          logout();
        }, 500);
      });
    }

    // TODO - Failure to logout should be posted to UI

  }


}