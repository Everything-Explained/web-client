



declare module "nanoajax" {
  
  interface IAjaxOptions {
    url: string;
    method?: string;
    body?: string;
    headers?: any;
    cors?: boolean;
  }
  
  export function ajax(options: IAjaxOptions, callback: (code: number, res: string, req: XMLHttpRequest) => void)
}