import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticatedResponse } from '../models/authenticated-response.model';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/login.model';
import { environment } from '../../../../../apps/mindsync/src/environments/environment.development';
import { Roles } from '../models/enums/roles.enum';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user = new BehaviorSubject<User | null>(null);
  private isAdmin = new BehaviorSubject<boolean>(false);
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public user$ = this.user.asObservable();
  public isAdmin$ = this.isAdmin.asObservable();
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private jwtHelper: JwtHelperService
  ) {
    const token = this.tokenService.getToken();
    if (!!token && !this.jwtHelper.isTokenExpired(token)) {
      this.setUser({ accessToken: token } as AuthenticatedResponse);
    } else {
      this.tokenService.clearToken();
    }
  }

  public isUserAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (!!token && !this.jwtHelper.isTokenExpired(token)) return true;
    return false;
  }

  public login(loginModel: LoginModel): Observable<boolean> {
    return this.http
      .post<AuthenticatedResponse>(
        `${environment.apiUrl}/auth/signin`,
        loginModel
      )
      .pipe(
        map((res: AuthenticatedResponse) => {
          if (!res) return false;
          this.tokenService.setToken(res);
          this.setUser(res);
          return true;
        })
      );
  }

  private setUser(auth: AuthenticatedResponse): void {
    if (!auth) return;
    const decodedToken = this.jwtHelper.decodeToken(auth.accessToken);
    const user: User = {
      id: decodedToken.id,
      role: this.getRole(decodedToken.roles),
    };
    this.user.next(user);
    this.isAuthenticated.next(true);
    if (this.getRole(decodedToken.roles) == Roles.ROLE_ADMIN)
      this.isAdmin.next(true);
  }

  private getRole(roles: string): Roles {
    if (roles == 'ROLE_ADMIN') return Roles.ROLE_ADMIN;
    return Roles.ROLE_USER;
  }
}
