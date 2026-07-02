
export const environment = {
  production: true,
  apiUrl: '/peerexplorer-backend/', // same-origin (relative): the UI calls the backend on whatever host it is served from (prod/test/…), via the tunnel ingress /peerexplorer-backend/*
  blockexplorerUrl: 'https://explorer.infinity-economics.org'
};
