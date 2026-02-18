import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { map, take } from 'rxjs/operators';

export const adminGuard = () => {
  const router = inject(Router);
  const accountService = inject(AccountService);

  return accountService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && user.email.toLowerCase().includes('admin')) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
