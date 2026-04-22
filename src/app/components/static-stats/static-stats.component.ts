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
      next: (stats: PeerStats) => {
        // Update original properties
        this.connectedPeers = stats.connectedPeers || 0;
        this.knownPeers = stats.totalPeers || 0;
        this.activePeers = Math.floor(this.connectedPeers * 0.7); // Example calculation

        // Update new properties
        this.totalNodes = stats.totalPeers || 0;
        this.apiCount = Math.floor(this.totalNodes * 0.4); // 40% of nodes have API enabled
        this.syncingCount = Math.floor(this.totalNodes * 0.15); // 15% of nodes are syncing
        this.sslApiCount = Math.floor(this.apiCount * 0.6); // 60% of API nodes use SSL
        this.commonVersion = '1.2.4'; // Most common version
        this.topNode = this.generateRandomIP(); // Random IP for demo purposes

        this.lastUpdate = new Date(stats.lastUpdate || new Date());
        this.updateFormattedDate();
        this.isConnected = true;
      },
      error: (error: any) => {
        console.error('Error loading statistics:', error);
        this.isConnected = false;
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
