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
import { RegisterModel } from '../models/register.model';

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

  isUserAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (!!token && !this.jwtHelper.isTokenExpired(token)) return true;
    return false;
  }

  login(loginModel: LoginModel): Observable<boolean> {
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

  register(registerModel: RegisterModel): Observable<User> {
    return this.http.post<User>(
      `${environment.apiUrl}/auth/register`,
      registerModel
    );
  }

  logOut(): void {
    this.tokenService.clearToken();
    this.clearUser();
  }

  verifyUser(code: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.apiUrl}/auth/verify?code=${code}`
    );
  }

  private setUser(auth: AuthenticatedResponse): void {
    if (!auth) return;
    const decodedToken = this.jwtHelper.decodeToken(auth.accessToken);
    const user: User = {
      id: decodedToken.id,
      roles: decodedToken.roles,
    };
    this.user.next(user);
    this.isAuthenticated.next(true);
    if (this.isUserAdmin(decodedToken.roles)) this.isAdmin.next(true);
  }

  private isUserAdmin(roles: string[]): boolean {
    if (roles.includes('ROLE_ADMIN')) return true;
    return false;
  }

  private clearUser(): void {
    this.user.next(null);
    this.isAdmin.next(false);
    this.isAuthenticated.next(false);
  }
}
