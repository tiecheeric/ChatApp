import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, filter, map, shareReplay, takeUntil } from 'rxjs';

export interface SocketEvent<T = any> {
  type: string;
  payload: T;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private socket?: WebSocket;
  private incoming$ = new Subject<MessageEvent<string>>();
  private status$ = new Subject<'connected' | 'disconnected' | 'error'>();
  private destroyed$ = new Subject<void>();

  // Expose parsed events stream
  public events$: Observable<SocketEvent> = this.incoming$.pipe(
    map((evt) => {
      try {
        return JSON.parse(evt.data) as SocketEvent;
      } catch {
        return { type: 'raw', payload: evt.data } satisfies SocketEvent<string>;
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  get connection$() {
    return this.status$.asObservable();
  }

  connect(url: string) {
    this.disconnect();
    try {
      this.socket = new WebSocket(url);
      this.socket.onopen = () => this.status$.next('connected');
      this.socket.onclose = () => this.status$.next('disconnected');
      this.socket.onerror = () => this.status$.next('error');
      this.socket.onmessage = (evt) => this.incoming$.next(evt);
    } catch (e) {
      this.status$.next('error');
    }
  }

  send<T = any>(type: string, payload: T) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    const msg = JSON.stringify({ type, payload });
    this.socket.send(msg);
  }

  on<T = any>(type: string): Observable<T> {
    return this.events$.pipe(
      filter((e) => e.type === type),
      map((e) => e.payload as T),
      takeUntil(this.destroyed$)
    );
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.disconnect();
    this.status$.complete();
    this.incoming$.complete();
  }
}
