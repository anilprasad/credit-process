import { OutgoingHttpHeaders } from 'http';

export interface IRequestOptions {
  hostname: string;
  path: string;
  port?: number;
  method: string;
  headers: OutgoingHttpHeaders;
  pfx?: Buffer;
}
