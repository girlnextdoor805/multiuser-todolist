import { Injectable } from '@angular/core';
import { JexiaService } from './jexia.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebSocketSubject } from "rxjs/webSocket";
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
// import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  dataset: string;

  subject: WebSocket;
  todos: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

  constructor(
    private http: HttpClient,
    private jexiaService: JexiaService,
    // private socket: Socket
  ) {
    this.dataset = this.jexiaService.base + '/ds/todos'
    this.subject = new WebSocket(this.jexiaService.getRTC())
  }

  addTodo(todo: string) {
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`)
    return this.http.post(this.dataset, {todo}, {headers})
  }
  
  getTodos() {
    console.log('buscar todos');
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`)
    this.http.get<any[]>(this.dataset, {headers}).subscribe(todos => this.todos.next(todos))

    
  }

  subscribeToTodos() {
    this.subject.onopen = ev => this.subject.send(JSON.stringify({
      "type": "command",
      "data": {
        "command": "subscribe",
        "arguments": {
          "action": [ "created", "updated", "deleted" ],
          "resource": {
            "type": "ds",
            "name": "todos"
          }
        }
      }
    }))

    this.subject.onmessage = ev => {
      const event = JSON.parse(ev.data)
      console.log('yo', event)
      console.log(event.data.action)
      switch (event.data.action) {
        case 'created': console.log(event); this.getTodos()
          
          break;
      
        default:
          break;
      }
      // console.log('yo')
      // console.log('yey', JSON.parse(ev.data))
    }
  }

  // connect() {
  //   if (!this.subject) {
  //     this.subject = 
  //   }
  // }

  // private create(url) {
  //   const ws = new WebSocket(url);


  //   const observable
  // }



}
