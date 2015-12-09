



declare module "nanoajax" {
  
  interface IAjaxOptions {
    url: string;
    method?: string;
    body?: any;
    data?: string;
    headers?: any;
    cors?: boolean;
  }
  
  export function ajax(options: IAjaxOptions, callback: (code: number, res: string, req: XMLHttpRequest) => void)
}