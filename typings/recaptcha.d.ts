 
interface IRecaptcha {
	create(publicKey: string, elID: string, options: any): void;
	destroy(): void;
	reload(): void;
	get_challenge(): string;
	get_response(): string;
}

declare module Recaptcha {
	export function create(publicKey: string, elID: string, options: any): void;
	export function destroy(): void;
	export function reload(): void;
	export function get_challenge(): string;
	export function get_response(): string;
}