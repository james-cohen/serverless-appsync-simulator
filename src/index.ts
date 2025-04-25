/* eslint-disable no-console */
import { AmplifyAppSyncSimulator } from '@james-cohen/amplify-appsync-simulator';
import type Serverless from 'serverless';
import getSimulatorConfig from './config';
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

  hooks: { [key: string]: () => void };

  simulator: AmplifyAppSyncSimulator;

  tunnelUrl: string;

  constructor(serverless: Serverless) {
    this.serverless = serverless;
    const config = (serverless.service.custom.appsyncSimulator || {}) as Record<
      string,
      unknown
    >;
    let ngrokDomain: string | undefined;
    let ngrokAuth: string | undefined;
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
    this.simulator.init(getSimulatorConfig(this.serverless));
    this.simulator
      .start()
      .then(() => {
        console.log(
          'Appsync simulator running on localhost port:',
          this.config.port,
        );
        if (this.config.tunnel) {
          createLocalTunnel({
            port: this.config.port,
            authtoken: this.config.ngrokAuth,
            domain: this.config.ngrokDomain,
          })
            .then((listener) => {
              this.tunnelUrl = listener.url() || '';
              console.log(
                'Ngrok tunnel running at url:',
                this.tunnelUrl || 'unknown',
              );
            })
            .catch((error) => {
              console.warn(
                'Error creating ngrok tunnel:',
                (error as Error).message || 'Unknown error',
              );
            });
        }
      })
      .catch((err) => {
        console.warn(err);
        this.simulator
          .stop()
          .then(() => {
            console.log('Appsync simulator stopped');
          })
          .catch((error) => {
            console.warn(
              'Error stopping appsync simulator:',
              (error as Error).message || 'Unknown error',
            );
          });
        if (this.tunnelUrl) {
          stopLocalTunnel(this.tunnelUrl)
            .then(() => {
              console.log('Ngrok tunnel at ', this.tunnelUrl, 'stopped');
            })
            .catch((error) => {
              console.warn(
                'Error stopping ngrok tunnel:',
                (error as Error).message || 'Unknown error',
              );
            });
        }
      });
  }

  teardownServer() {
    this.simulator
      .stop()
      .then(() => {
        console.log('Appsync simulator stopped');
      })
      .catch((error) => {
        console.warn(
          'Error stopping appsync simulator:',
          (error as Error).message || 'Unknown error',
        );
      });
    if (this.tunnelUrl) {
      stopLocalTunnel(this.tunnelUrl)
        .then(() => {
          console.log('Ngrok tunnel at ', this.tunnelUrl, 'stopped');
        })
        .catch((error) => {
          console.warn(
            'Error stopping ngrok tunnel:',
            (error as Error).message || 'Unknown error',
          );
        });
    }
  }
}

export default AppsyncSimulator;
