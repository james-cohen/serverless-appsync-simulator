import * as ngrok from '@ngrok/ngrok';

type LocalTunnelInput = {
  port: number;
  authtoken?: string;
  domain?: string;
}

export async function createLocalTunnel({ port, authtoken, domain }: LocalTunnelInput) {
  return ngrok.connect({
    port,
    authtoken,
    domain,
    name: 'appsync-simulator',
  });
}

export async function stopLocalTunnel(url: string) {
  return ngrok.disconnect(url);
}