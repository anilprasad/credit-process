declare module '@digifi/app-config-loader' {
  export function getSecret(key: string): string | number | boolean;
}