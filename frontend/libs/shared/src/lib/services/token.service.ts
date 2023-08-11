import { Injectable } from '@angular/core';
import { AuthenticatedResponse } from '../models/authenticated-response.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private static tokenFieldName = 'accessToken';

  setToken(authResponse: AuthenticatedResponse): void {
    localStorage.setItem(TokenService.tokenFieldName, authResponse.accessToken);
  }

  getToken(): string | null {
    return localStorage.getItem(TokenService.tokenFieldName);
  }

  clearToken(): void {
    localStorage.removeItem(TokenService.tokenFieldName);
  }
}
