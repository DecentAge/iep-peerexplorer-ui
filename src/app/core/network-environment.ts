import { environment } from '../../environments/environment';

export function getNetworkEnvironment(): string {
  const runtime = (window as any)?.envConfig?.NETWORK_ENVIRONMENT;
  if (typeof runtime === 'string' && runtime.trim() && !runtime.startsWith('${')) {
    return runtime;
  }
  return environment.networkEnvironment || 'mainnet';
}
