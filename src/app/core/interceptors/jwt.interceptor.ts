import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject, switchMap, filter, take, catchError } from 'rxjs';
import { TokenService } from '../services/token.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

/**
 * JWT Interceptor with automatic token refresh on 401 responses.
 * Queues requests during token refresh to prevent multiple refresh calls.
 */
export const jwtInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('accounts/refresh')) {
        return handle401Error(req, next, tokenService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenService: TokenService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(false);

    return tokenService.refreshAccessToken().pipe(
      switchMap((tokens) => {
        isRefreshing = false;
        refreshTokenSubject.next(true);
        return next(addToken(request, tokens.accessToken));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        tokenService.clearTokens();
        window.location.href = '/account/login';
        return throwError(() => refreshError);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(isRefreshed => isRefreshed),
      take(1),
      switchMap(() => {
        const token = tokenService.getAccessToken();
        return token ? next(addToken(request, token)) : throwError(() => new Error('No token available'));
      })
    );
  }
}
