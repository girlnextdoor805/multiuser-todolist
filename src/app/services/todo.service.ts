import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { groupBy } from 'lodash-es';
import { JexiaService } from './jexia.service';
import { AddTodoRequestObject, Todo } from '../interfaces/todo';

import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  socket: WebSocket;
  todos$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  dataset = `${this.jexiaService.base}/ds/todos`;

  constructor(
    private http: HttpClient,
    private router: Router,
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

  addTodo(todo: AddTodoRequestObject) {
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`);
    todo = {...todo, completed: false, order: 1};
    return this.http.post<AddTodoRequestObject>(this.dataset, todo, {headers})
  }

  deleteTodo(id: string) {
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`);
    const params = new HttpParams().append('cond',`[{"field":"id"},"=","${id}"]`);
    return this.http.delete(this.dataset, {headers, params});
  }

  getTodos() {
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`);
    const params = new HttpParams().append('sort', '{"direction":"asc","fields":["date"]}');
    this.http.get<Todo[]>(this.dataset, {
      headers, 
      // params
    }).subscribe(todos => {
      const groupedTodos = groupBy(todos, 'date');
      const lists = [];
      for (const group in groupedTodos) {
        if (groupedTodos.hasOwnProperty(group)) {
          const list = groupedTodos[group];
          lists.push({id: group, list});
        }
      }

      // console.log(lists)
      this.todos$.next(lists.sort((a, b) => moment(a.id).diff(b.id)));
    }, error => {
      if (error.status === 401) {
        this.jexiaService.removeAccessToken();
        this.socket.close();
        this.router.navigate(['/signin']);
      }
    });
  }

  subscribeToTodos() {
    this.socket.onopen = ev => this.socket.send(JSON.stringify({
      type: 'command',
      data: {
        command: 'subscribe',
        arguments: {
          action: [ 'created', 'updated', 'deleted' ],
          resource: {
            type: 'ds',
            name: 'todos'
          }
        }
      }
    }));

    this.socket.onmessage = ev => {
      const event = JSON.parse(ev.data);

      switch (event.data.action) {
        case 'created': console.log(event); this.getTodos(); break;
        case 'updated': console.log(event); this.getTodos(); break;
        case 'deleted': console.log(event); this.getTodos(); break;
      }
    }
  }

  markAsCompleted(todo: any) {
    console.log('vou marcar o ', todo.id);
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`);
    const params = new HttpParams().append('cond',`[{"field":"id"},"=","${todo.id}"]`);
    return this.http.patch(this.dataset, {completed: todo.completed}, {headers, params});
  }
  rescheduleTodo(todo: any, date: string) {
    console.log('vou marcar o ', todo.id);
    const headers = new HttpHeaders().append('Authorization', `Bearer ${this.jexiaService.getAccessToken()}`);
    const params = new HttpParams().append('cond',`[{"field":"id"},"=","${todo.id}"]`);
    return this.http.patch(this.dataset, {date}, {headers, params});
  }
}
