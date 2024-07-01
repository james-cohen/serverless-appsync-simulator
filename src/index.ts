import { AmplifyAppSyncSimulator } from '@aws-amplify/amplify-appsync-simulator';
import Serverless from 'serverless';
import { getSimulatorConfig } from './config';
import { createLocalTunnel, stopLocalTunnel } from './localhostTunnel';

const DEFAULT_PORT = 3000;
const DEFAULT_WSPORT = 3001;

class AppsyncSimulator {
  serverless: Serverless;

  config: {
    port: number;
    wsPort: number;
    tunnel: boolean;
    ngrokAuth?: string;
    ngrokDomain?: string;
    useDotEnv?: boolean;
  };

  hooks: { [key: string]: Function };

  simulator: AmplifyAppSyncSimulator;

  tunnelUrl: string;

  constructor(serverless: Serverless) {
    this.serverless = serverless;
    const config: Record<string, unknown> = serverless.service.custom?.appsyncSimulator || {};
    let ngrokDomain;
    let ngrokAuth;
    if (config.useDotEnv) {
      const rawDomain = process.env.NGROK_DOMAIN || config.ngrokDomain;
      const rawAuth = process.env.NGROK_AUTH || config.ngrokAuth;
      ngrokDomain = rawDomain ? String(rawDomain) : undefined;
      ngrokAuth = rawAuth ? String(rawAuth) : undefined;
    } else {
      ngrokDomain = config.ngrokAuth ? String(config.ngrokAuth) : undefined;
      ngrokAuth = config.ngrokDomain ? String(config.ngrokDomain) : undefined;
    }
    this.config = {
      port: Number(config.port || DEFAULT_PORT),
      wsPort: Number(config.wsPort || DEFAULT_WSPORT),
      tunnel: !!config.tunnel,
      ngrokAuth,
      ngrokDomain,
    };
    this.hooks = {
      'offline:start:init': this.initServer.bind(this),
      'offline:start:end': this.teardownServer.bind(this),
    };
    this.simulator = new AmplifyAppSyncSimulator({
      port: this.config.port,
      wsPort: this.config.wsPort,
    });
    this.tunnelUrl = '';
  }

  initServer() {
    this.simulator.init(
      getSimulatorConfig(
        this.serverless.service.initialServerlessConfig.appSync,
      ),
    );
    this.simulator
      .start()
      .then(() => {
        console.log('Appsync simulator running on localhost port:', this.config.port);
        if (this.config.tunnel) {
          createLocalTunnel({
            port: this.config.port,
            authtoken: this.config.ngrokAuth,
            domain: this.config.ngrokDomain,
          })
            .then((listener) => {
              this.tunnelUrl = listener.url() || '';
              console.log('Ngrok tunnel running at url:', this.tunnelUrl || 'unknown');
            })
            .catch((err) => console.warn('Error creating ngrok tunnel:', err?.message || 'Unknown error'));
        }
      })
      .catch((err) => {
        console.warn(err);
        this.simulator.stop().then(() => console.log('Appsync simulator stopped'));
        if (this.tunnelUrl) {
          stopLocalTunnel(this.tunnelUrl)
            .then(() => console.log('Ngrok tunnel at ', this.tunnelUrl, 'stopped'))
            .catch((err) => console.warn('Error stopping ngrok tunnel:', err?.message || 'Unknown error'))
        }
      });
  }

  teardownServer() {
    this.simulator.stop().then(() => console.log('Appsync simulator stopped'));
    if (this.tunnelUrl) {
      stopLocalTunnel(this.tunnelUrl)
        .then(() => console.log('Ngrok tunnel at ', this.tunnelUrl, 'stopped'))
        .catch((err) => console.warn('Error stopping ngrok tunnel:', err?.message || 'Unknown error'))
    }
  }
}

module.exports = AppsyncSimulator;
