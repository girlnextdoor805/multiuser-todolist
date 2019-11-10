import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JexiaService } from './jexia.service';
import { signUpResponseObject, signUpRequestObject, authenticateUMSRequestObject, authenticateUMSResponseObject, UserProfileRequestObject, UserResponseObject } from '../interfaces/auth';
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  dataset = `${this.jexiaService.base}/ds/users`;

  constructor(
    private http: HttpClient,
    private jexiaService: JexiaService
  ) { }

  getHeaders() {
    return new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`);
  }

  signUp(user: signUpRequestObject) {
    return this.http.post<signUpResponseObject>(`${this.jexiaService.base}/ums/signup`, user)
  }


  setProfile(todo: UserProfileRequestObject) {
    const headers = this.getHeaders();
    // todo = {...todo, completed: false, order: 1};
    return this.http.post<UserProfileRequestObject>(this.dataset, todo, {headers})
  }

  authenticate(user: authenticateUMSRequestObject) {
    user = {...user, method: 'ums'};
    return this.http.post<authenticateUMSResponseObject>(`${this.jexiaService.base}/auth`, user).pipe(tap(res => this.jexiaService.setAccessToken(res.access_token)))
  }

  getUser() {
    const headers = this.getHeaders();
    return this.http.get<UserResponseObject>(`${this.jexiaService.base}/ums/user`, {headers})
  }

  getUserProfile(user_id: string) {
    const headers = this.getHeaders();
    const params = new HttpParams().append('cond',`[{"field":"user_id"},"=","${user_id}"]`);
    return this.http.get(this.dataset, {headers, params})
  }


  signOut() {
    this.jexiaService.removeAccessToken();
  }
}
