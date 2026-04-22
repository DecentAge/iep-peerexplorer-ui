import { Component, OnInit } from '@angular/core';
import { PeerService } from '../services/peer.service';
import { Peer, PeerStats } from '../models/peer.model';

@Component({
  selector: 'app-peers',
  templateUrl: './peers.component.html',
  styleUrls: ['./peers.component.scss']
})
export class PeersComponent implements OnInit {
  peers: Peer[] = [];
  stats: PeerStats | null = null;
  loading = true;
  currentPage = 1;
  itemsPerPage = 20;
  Math = Math; // Make Math available to the template

  constructor(private peerService: PeerService) {}

  ngOnInit(): void {
    this.loadPeers();
    this.loadStats();

    // In a real app, you would set up an interval to refresh the data
    setInterval(() => {
      this.loadPeers();
      this.loadStats();
    }, 60000); // Refresh every minute
  }

      isReloading = false;

      loadPeers(): void {
    this.loading = true;
    this.isReloading = true;
    this.peerService.getPeers(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        // Map the peer data from API response
        this.peers = data.map(peer => ({
          ...peer,
          connected: peer.state === 1,
          lastConnected: peer.lastConnected ? new Date(peer.lastConnected) : new Date(),
          rank: peer.peerState?.rank || 0,
          cpuUsage: this.getLatestCpuUsage(peer),
          lastFeeder: peer.peerState?.lastBlockchainFeeder || 'N/A',
          blocks: peer.peerState?.numberOfBlocks || 0,
          marked: peer.services?.includes('HALLMARK') || false,
          apiEnabled: peer.peerState?.apiServerEnable || false,
          numberOfActivePeers: peer.peerState?.numberOfActivePeers || 0,
          applicationVersion: peer.version || 'Unknown'
        }));
        this.loading = false;
        this.isReloading = false;
      },
      error: (error) => {
        console.error('Error loading peers:', error);
        this.loading = false;
        this.isReloading = false;
      }
    });
  }

  loadStats(): void {
    this.peerService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1) return;
    this.currentPage = page;
    this.loadPeers();
  }

  viewPeerDetails(peer: Peer): void {
    // In a real app, this would open a modal or navigate to a details page
    console.log('Viewing details for peer:', peer);
    alert(`Peer Details:\nIP: ${peer.announcedAddress || peer.address}\nVersion: ${peer.applicationVersion || 'Unknown'}`);
  }

  // Get the latest CPU usage from history array (already in percentage)
  getLatestCpuUsage(peer: Peer): number {
    const history = peer.peerState?.history_SystemLoadAverage;

    if (history && history.length > 0) {
      const latestLoad = history[history.length - 1];
      return Math.round(latestLoad);
    }

    return 0;
  }

  // Format CPU usage with % symbol
  formatCpuUsage(value: number | undefined): string {
    if (value === undefined || value === null) return 'N/A';
    return `${value}%`;
  }

  // Safely get CPU value for comparisons
  getCpuValue(peer: Peer): number {
    return peer.cpuUsage ?? 0;
  }
}
