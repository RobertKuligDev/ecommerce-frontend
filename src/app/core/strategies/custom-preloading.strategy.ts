import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Custom preloading strategy that selectively preloads routes based on the
 * 'preload' flag in route data.
 * 
 * Routes with data: { preload: true } will be preloaded in the background.
 * Routes without the flag or with preload: false will load on demand.
 */
@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  
  /**
   * Determines whether a route should be preloaded.
   * @param route The route to check
   * @returns Observable that triggers preloading or completes empty
   */
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data['preload'] ? load() : of(null);
  }
}
