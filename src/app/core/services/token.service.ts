import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

/**
 * Service managing JWT token storage and refresh mechanism.
 * Uses sessionStorage for better security (tokens cleared on browser close).
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'auth_tokens';
  private isRefreshing$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * Stores both access and refresh tokens securely.
   */
  setTokens(tokenPair: ITokenPair): void {
    const tokenData = {
      ...tokenPair,
      expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes default JWT expiry
    };
    sessionStorage.setItem(this.tokenKey, JSON.stringify(tokenData));
  }

  /**
   * Retrieves the stored access token.
   */
  getAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Retrieves the stored refresh token.
   */
  getRefreshToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.refreshToken || null;
  }

  /**
   * Checks if access token is expired or about to expire (within 30 seconds).
   */
  isTokenExpired(): boolean {
    const tokens = this.getStoredTokens();
    if (!tokens?.expiresAt) return true;
    return Date.now() >= (tokens.expiresAt - 30000);
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  refreshAccessToken(): Observable<ITokenPair> {
    if (this.isRefreshing$.value) {
      return throwError(() => new Error('Token refresh already in progress'));
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.isRefreshing$.next(true);

    return this.http.post<ITokenPair>(`${this.apiUrl}Accounts/refresh`, { refreshToken })
      .pipe(
        tap(tokens => this.setTokens(tokens)),
        catchError(error => {
          this.clearTokens();
          return throwError(() => error);
        }),
        tap(() => this.isRefreshing$.next(false))
      );
  }

  /**
   * Clears all stored tokens (logout).
   */
  clearTokens(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.isRefreshing$.next(false);
  }

  /**
   * Checks if user is authenticated (has valid tokens).
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Gets the refresh status observable.
   */
  get isRefreshing$Observable(): Observable<boolean> {
    return this.isRefreshing$.asObservable();
  }

  /**
   * Retrieves stored tokens from sessionStorage.
   */
  private getStoredTokens(): ITokenPair | null {
    const tokenData = sessionStorage.getItem(this.tokenKey);
    if (!tokenData) return null;
    try {
      return JSON.parse(tokenData);
    } catch {
      return null;
    }
  }
}
