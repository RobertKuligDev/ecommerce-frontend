import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { IUser } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { IAddress } from '../shared/models/address';
import { TokenService, ITokenPair } from '../core/services/token.service';

/**
 * Service managing operations related to user accounts.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _baseURL = environment.apiUrl;
  private currentUser = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {}

  /**
   * Loads the current user from the server using a provided token.
   */
  loadCurrentUser(token: string): Observable<IUser | null> {
    if (!token) {
      this.currentUser.next(null);
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(`${this._baseURL}Accounts/current`, { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          this.currentUser.next(user);
          return user;
        }
        return null;
      })
    );
  }

  /**
   * Authenticates a user with the provided credentials.
   */
  login(value: any): Observable<void> {
    return this.http.post<IUser>(`${this._baseURL}Accounts/login`, value).pipe(
      map((user: IUser) => {
        if (user) {
          const tokenPair: ITokenPair = {
            accessToken: user.token,
            refreshToken: user.token // Backend may return refresh token separately in future
          };
          this.tokenService.setTokens(tokenPair);
          this.currentUser.next(user);
        }
      })
    );
  }

  /**
   * Initializes the current user by checking for a token in sessionStorage.
   */
  initializeCurrentUser(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      this.loadCurrentUser(token).subscribe({
        next: () => {},
        error: () => this.tokenService.clearTokens()
      });
    }
  }

  /**
   * Registers a new user with the provided information.
   */
  register(value: any): Observable<void> {
    return this.http.post<IUser>(`${this._baseURL}Accounts/register`, value).pipe(
      map((user: IUser) => {
        if (user) {
          const tokenPair: ITokenPair = {
            accessToken: user.token,
            refreshToken: user.token // Backend may return refresh token separately in future
          };
          this.tokenService.setTokens(tokenPair);
          this.currentUser.next(user);
        }
      })
    );
  }

  /**
   * Logs out the current user, removing their authentication token and resetting user state.
   */
  logout(): void {
    this.tokenService.clearTokens();
    this.currentUser.next(null);
    this.router.navigateByUrl('/');
  }

  /**
   * Checks if an email address is already registered.
   */
  checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this._baseURL}Accounts/email-exists?email=${email}`);
  }

  /**
   * Retrieves the user's saved address from the server.
   */
  getUserAddress(): Observable<IAddress> {
    return this.http.get<IAddress>(`${this._baseURL}Accounts/address`);
  }

  /**
   * Updates the user's address on the server.
   */
  updateUserAddress(address: IAddress): Observable<IAddress> {
    return this.http.put<IAddress>(`${this._baseURL}Accounts/address`, address);
  }
}
