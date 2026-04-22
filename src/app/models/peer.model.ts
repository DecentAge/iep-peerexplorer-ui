export interface PeerState {
  rank?: number;
  SystemLoadAverage?: number;
  availableProcessors?: number;
  lastBlockchainFeeder?: string;
  numberOfBlocks?: number;
  apiServerEnable?: boolean;
  numberOfActivePeers?: number;
  history_SystemLoadAverage?: number[];
  freeMemory?: number;
  totalMemory?: number;
  version?: string;
  apiSSL?: boolean;
  numberOfPeers?: number;
}

export interface Peer {
  id: string;
  address: string;
  announcedAddress?: string;
  platform?: string;
  applicationName?: string;
  applicationVersion?: string;
  state?: number;
  shareAddress?: boolean;
  downloadedVolume?: number;
  uploadedVolume?: number;
  lastUpdated?: number;
  numberOfConnectedPeers?: number;
  numberOfActivePeers?: number;
  numberOfDisabledPeers?: number;
  numberOfKnownPeers?: number;
  weight?: number;
  lastConnectAttempt?: number;
  blacklisted?: boolean;
  peerPort?: number;
  services?: any[];
  version?: string;
  lastConnected?: string | Date;
  peerState?: PeerState;
  // Additional properties needed for the template
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
  lastUpdate: string; // Using string consistently for dates that may be displayed
}
