import { Injectable } from '@angular/core';
import { JexiaService } from './jexia.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { WebSocketSubject } from "rxjs/webSocket";
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
// import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  socket: WebSocket;
  todos: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  dataset = `${this.jexiaService.base}/ds/todos`;

  constructor(
    private http: HttpClient,
    private jexiaService: JexiaService,
  ) {
    this.setupSocket();
  }

  setupSocket() {
    try {
      this.socket = new WebSocket(this.jexiaService.getRTC())
    } catch (error) {
      console.warn(error)
    }
  }

  addTodo(todo: string) {
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`)
    return this.http.post(this.dataset, {
      todo, 
      completed: false,
      order: 1
    }, {headers})
  }

  deleteTodo(id: string) {
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`)
    const params = new HttpParams().append('cond',`[{"field":"id"},"=","${id}"]`);
    return this.http.delete(this.dataset, {headers, params});
  }
  
  getTodos() {
    console.log('buscar todos');
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`)
    this.http.get<any[]>(this.dataset, {headers}).subscribe(todos => this.todos.next(todos))

    
  }

  subscribeToTodos() {
    this.socket.onopen = ev => this.socket.send(JSON.stringify({
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

    this.socket.onmessage = ev => {
      const event = JSON.parse(ev.data)
      console.log('yo', event)
      console.log(event.data.action)
      switch (event.data.action) {
        case 'created': console.log(event); this.getTodos(); break;
        case 'updated': console.log(event); this.getTodos(); break;
        case 'deleted': console.log(event); this.getTodos(); break;
      
        default:
          break;
      }
      // console.log('yo')
      // console.log('yey', JSON.parse(ev.data))
    }
  }

  markAsCompleted(todo: any) {
    console.log('vou marcar o ', todo.id)
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`)
    const params = new HttpParams().append('cond',`[{"field":"id"},"=","${todo.id}"]`);
    return this.http.patch(this.dataset, {completed: todo.completed}, {headers, params})
  }
}
