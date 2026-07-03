export interface PeerState {
  rank?: number;
  SystemLoadAverage?: number;
  availableProcessors?: number;
  lastBlockchainFeeder?: string;
  lastBlockchainFeederHeight?: number;
  numberOfBlocks?: number;
  apiServerEnable?: boolean;
  apiServerCORS?: boolean;
  apiSSL?: boolean;
  apiServerIdleTimeout?: number;
  apiServerPort?: number;
  apiServerSSLPort?: number;
  numberOfActivePeers?: number;
  numberOfPeers?: number;
  history_SystemLoadAverage?: number[];
  history_freeMemory?: number[];
  history_requestProcessingTime?: number[];
  history_numberOfActivePeers?: number[];
  freeMemory?: number;
  totalMemory?: number;
  maxMemory?: number;
  version?: string;
  isDownloading?: boolean;
  isScanning?: boolean;
  correctInvalidFees?: boolean;
  enableHallmarkProtection?: boolean;
  useWebsocket?: boolean;
  superNodeEnable?: boolean;
  cumulativeDifficulty?: string;
  currentMinRollbackHeight?: number;
  ledgerTrimKeep?: number;
  lastBlock?: string;
  maxPrunableLifetime?: number;
  maxRollback?: number;
  maxUnconfirmedTransactions?: number;
  maxUploadFileSize?: number;
  ThreadCount?: number;
  Uptime?: number;
  osArch?: string;
  osName?: string;
  osVersion?: string;
  // service capability flags
  gatewayIPFS?: boolean;
  gatewayTendermint?: boolean;
  gatewayZeroNet?: boolean;
  proxyBTC?: boolean;
  proxyETH?: boolean;
  proxyLTC?: boolean;
  proxyXRP?: boolean;
  proxyMarket?: boolean;
  storageMongodb?: boolean;
  storageRethink?: boolean;
  storagePSQL?: boolean;
  storageMySQL?: boolean;
}

export interface GeoIp {
  country_code?: string;
  country_name?: string;
}

export interface Peer {
  _id?: string;
  id?: string;
  address?: string;
  announcedAddress?: string;
  platform?: string;
  applicationName?: string;
  applicationVersion?: string;
  state?: number;
  active?: boolean;
  shareAddress?: boolean;
  downloadedVolume?: number;
  uploadedVolume?: number;
  lastUpdated?: number;
  numberOfActivePeers?: number;
  weight?: number;
  lastConnectAttempt?: number;
  blacklisted?: boolean;
  apiPort?: number;
  services?: any[];
  version?: string;
  myHallmark?: string;
  hallmark?: string;
  lastConnected?: string | Date;
  peerState?: PeerState;
  geoip?: GeoIp;
  // Derived (set in the component)
  connected?: boolean;
  rank?: number;
  cpuUsage?: number;
  lastFeeder?: string;
  blocks?: number;
  marked?: boolean;
  apiEnabled?: boolean;
}

export interface PeerStats {
  connectedPeers: number;
  totalPeers: number;
  maxPeers: number;
  lastUpdate: string;
}
