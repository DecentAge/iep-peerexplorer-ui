import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Peer, PeerStats } from '../models/peer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  private apiUrl: string;
  private peerEndPoint: string;

  /** Navbar → list: an IP the user wants looked up and shown in the details modal. */
  private searchRequestSource = new Subject<string>();
  searchRequests$ = this.searchRequestSource.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl || '';
    this.peerEndPoint = 'api/nodes';
  }

  requestSearch(term: string): void {
    this.searchRequestSource.next(term);
  }

  getPeers(page: number, results: number, filter: string = 'numberOfActivePeers'): Observable<Peer[]> {
    const params = {
      page: page.toString(),
      results: results.toString(),
      filter: filter,
      order: 'desc'
    };

    return this.http.get<Peer[]>(`${this.apiUrl}${this.peerEndPoint}`, { params });
  }

  searchIp(ip: string): Observable<Peer | null> {
    return this.http.get<Peer | Peer[]>(`${this.apiUrl}${this.peerEndPoint}`, { params: { ip } }).pipe(
      map(res => (Array.isArray(res) ? res[0] : res) || null)
    );
  }

  getTopNodeByRank(): Observable<Peer[]> {
    return this.getPeers(1, 1, 'rank');
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/getStats`).pipe(
      catchError(this.handleError<any>('getStats', {
        totalNodes: 0,
        activeNodes: 0,
        lastUpdate: new Date().toISOString()
      }))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
