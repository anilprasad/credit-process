declare module 'convertjson2xml' {
  interface IXmlConfig {
    trim: boolean;
    hideUndefinedTag: boolean;
    nullValueTag: string;
    emptyStringTag: string;
    formatting: boolean;
    rootTag: string;
  }

  export function config(xmlConfig: IXmlConfig): (body: Record<string, unknown>) => string;
}