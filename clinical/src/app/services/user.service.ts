import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../models/user';
import { LoginResponse, ResponseMessage } from '../messages/ResponseMessage';

@Injectable({
  providedIn: 'root'
})
export class userService{
  constructor(private conexHttp:HttpClient) { }
  url = "http://localhost:8000/user";

  register(user: user): Observable<any> {
  return this.conexHttp.post(`${this.url}/`, user);
  }
}