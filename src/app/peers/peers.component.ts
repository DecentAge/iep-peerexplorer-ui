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
        // Enhance the peer data with additional properties to match the original design
        this.peers = data.map(peer => ({
          ...peer,
          connected: peer.state === 1,
          lastConnected: new Date(),
          rank: Math.floor(Math.random() * 100), // Dummy data
          cpuUsage: Math.floor(Math.random() * 100), // Dummy data (number without %)
          lastFeeder: 'N/A',
          blocks: Math.floor(Math.random() * 1000000), // Dummy data
          marked: Math.random() > 0.8, // Dummy data
          apiEnabled: Math.random() > 0.5 // Dummy data
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
