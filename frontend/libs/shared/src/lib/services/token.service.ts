import { Injectable } from '@angular/core';
import { AuthenticatedResponse } from '../models/authenticated-response.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private static tokenFieldName = 'accessToken';

  public setToken(authResponse: AuthenticatedResponse): void {
    localStorage.setItem(TokenService.tokenFieldName, authResponse.accessToken);
  }

  public getToken(): string | null {
    return localStorage.getItem(TokenService.tokenFieldName);
  }

  public clearToken(): void {
    localStorage.removeItem(TokenService.tokenFieldName);
  }
}
