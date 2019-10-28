import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JexiaService } from './jexia.service';
import { signUpResponseObject, signUpRequestObject, authenticateUMSRequestObject, authenticateUMSResponseObject } from '../interfaces/auth';
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jexiaService: JexiaService
  ) { }


  signUp(user: signUpRequestObject) {
    return this.http.post<signUpResponseObject>(`${this.jexiaService.base}/ums/signup`, user)
  }

  authenticate(user: authenticateUMSRequestObject) {
    user = {...user, method: 'ums'}
    console.log(user)
    return this.http.post<authenticateUMSResponseObject>(`${this.jexiaService.base}/auth`, user).pipe(tap(res => this.jexiaService.setAccessToken(res.access_token)))
  }

  signOut() {
    localStorage.removeItem('idToken');
  }



}
