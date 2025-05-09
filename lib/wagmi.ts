import { http, createConfig } from 'wagmi';
import { getDefaultConfig } from 'connectkit';
import { lensChain } from './constants';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set in .env.local');
}

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: projectId,
    appName: 'Lens Account Interface',
    appDescription: 'Interact with your Lens Account',
    appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
    appIcon: '/favicon.ico',
    chains: [lensChain],
    transports: {
      [lensChain.id]: http(lensChain.rpcUrls.default.http[0]),
    },
  })
);

// Optional: Register config for global type inference
// declare module 'wagmi' {
//   interface Register {
//     config: typeof config
//   }
// }
