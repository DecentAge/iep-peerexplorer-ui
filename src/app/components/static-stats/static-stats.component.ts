import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PeerService } from '../../services/peer.service';
import { PeerStats } from '../../models/peer.model';

@Component({
  selector: 'app-static-stats',
  templateUrl: './static-stats.component.html',
  styleUrls: ['./static-stats.component.css']
})
export class StaticStatsComponent implements OnInit {
  // Original properties
  apiCount: number = 0;
  connectedPeers: number = 0;
  activePeers: number = 0;
  knownPeers: number = 0;

  // New properties for the updated UI
  syncingCount: number = 0;
  totalNodes: number = 0;
  sslApiCount: number = 0;
  commonVersion: string = '1.0.0';
  topNode: string = '';

  // Time tracking properties
  lastUpdate: Date = new Date();
  formattedLastUpdate: string = '';
  isConnected: boolean = true;

  constructor(private peerService: PeerService, private datePipe: DatePipe) {
    this.updateFormattedDate();
  }

  ngOnInit(): void {
    this.loadStats();

    // Update stats every minute
    setInterval(() => {
      this.loadStats();
    }, 60000);
  }

  updateFormattedDate(): void {
    this.formattedLastUpdate = this.datePipe.transform(this.lastUpdate, 'short') || 'Unknown';
  }

  loadStats(): void {
    this.peerService.getStats().subscribe({
      next: (stats: any) => {
        // Map API response to display properties
        this.totalNodes = stats.totalNodes || 0;
        this.apiCount = stats.apiEnabled || 0; // Open API
        this.sslApiCount = stats.apiSSL || 0; // SSL API
        this.syncingCount = (stats.downloading || 0) + (stats.scanning || 0); // Syncing nodes
        this.commonVersion = stats.version || 'Unknown'; // Most common version

        // Update original properties for compatibility
        this.connectedPeers = stats.activeNodes || 0;
        this.knownPeers = stats.totalNodes || 0;
        this.activePeers = stats.activeNodes || 0;

        this.lastUpdate = new Date();
        this.updateFormattedDate();
        this.isConnected = true;
      },
      error: (error: any) => {
        console.error('Error loading statistics:', error);
        this.isConnected = false;
      }
    });

    // Get the top node (node with highest rank)
    this.peerService.getTopNodeByRank().subscribe({
      next: (peers: any[]) => {
        if (peers && peers.length > 0) {
          const topPeer = peers[0];
          const rank = topPeer.peerState?.rank || 0;
          this.topNode = `${topPeer.announcedAddress || topPeer.address} (${rank.toFixed(2)})`;
        } else {
          this.topNode = 'N/A';
        }
      },
      error: (error: any) => {
        console.error('Error loading top node:', error);
        this.topNode = 'N/A';
      }
    });
  }

  /**
   * Generate a random IP address for demo purposes
   */
  private generateRandomIP(): string {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }
}
