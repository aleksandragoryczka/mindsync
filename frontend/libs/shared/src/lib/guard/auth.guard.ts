import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

export const authGuard = async () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isUserAuthenticated()) {
    await router.navigateByUrl('');
    return false;
  }
  return true;
};
