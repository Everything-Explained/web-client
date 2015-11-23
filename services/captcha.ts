/// <reference path='../libs/defs/recaptcha.d.ts' />

class Captcha implements IRecaptcha {

    private _publicKey: string;

    constructor(pubKey: string) {
        this._publicKey = pubKey;
    }

    create(elID: string, options: any) {
        Recaptcha.create(this._publicKey, elID, options);
    }

    reload() {
        Recaptcha.reload();
    }

    get_challenge() {
        return Recaptcha.get_challenge();
    }

    get_response() {
        return Recaptcha.get_response();
    }

    destroy() {
        Recaptcha.destroy();
    }

}
