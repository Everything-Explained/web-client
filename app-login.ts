import * as http from 'nanoajax';
import * as encrypt from './helpers/cheap-encrypt';

export class Login {
  
  private _clientID = 'VOhiMrFfTsx2SSgoGOr25G8qa3J6W0yj';
  private _domain = 'aedaeum.auth0.com';
  private _header = 'WWW-Authenticate';
  
  private _lock: Auth0LockStatic;
  
  constructor() {
    this._lock = new Auth0Lock(this._clientID, this._domain);
  }
  
  exec() {
    
    this._lock.show((err, profile, token) => {
      
      if (err) {
        console.log(err);
        return;
      }
      
      console.info(profile);
      
      this._requestLogin(token).then((key: string) => {
        
        this._login(token, key, profile).then((res: [number, string]) => {
          console.log(res);
        })
        
      })
      
    })
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
      
      http.ajax({
        url: '/internal/login',
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      }, (code, res, req) => {
        
        rs([code, res]);
        
      })
      
    })
    
  }
  
  
  
  private checkUsername(): Promise<boolean> {
    
    return new Promise((rs, rj) => {
      http.ajax({
        url: '/internal/validnick',
        method: 'POST',
        body: 'aedaeum',
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