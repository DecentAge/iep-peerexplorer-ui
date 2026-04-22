import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Peer, PeerStats } from '../models/peer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  private apiUrl: string;
  private peerEndPoint: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl || '';
    this.peerEndPoint = 'api/nodes';
  }

  getPeers(page: number, results: number): Observable<Peer[]> {
    const params = {
      page: page.toString(),
      results: results.toString(),
      filter: 'numberOfActivePeers',
      order: 'desc'
    };

    return this.http.get<Peer[]>(`${this.apiUrl}${this.peerEndPoint}`, { params });
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
