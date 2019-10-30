import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { JexiaService } from 'src/app/services/jexia.service';
import { TodoService } from 'src/app/services/todo.service';
import { BehaviorSubject } from 'rxjs';
import { AddTodoRequestObject } from 'src/app/interfaces/todo';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  form: FormGroup;
  todos: any; //= new BehaviorSubject([]);


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private jexia: JexiaService,
    private todoService: TodoService,
  ) { }

  ngOnInit() {
    console.log(this.todos)
    this.form = this.formBuilder.group({
      todo: null,
      date: null
    })
    console.log(this.jexia.client)

    // this.todos$ = this.todoService.todos$;
    this.todoService.todos$.subscribe(r => {
      console.log(r)
      this.todos = r
    })

    this.todoService.getTodos()
    // .subscribe(response => {
    //   this.todos = response;
    this.todoService.subscribeToTodos()
    // }, error => {
    //   console.log(error)
    //   if (error.status === 401) {
    //     this.router.navigate(['/signin'])
    //   }
    // })
  }

  addTodo() {
    // this.todos.push(this.form.get('todo').value);
    const todo = this.form.value as AddTodoRequestObject;

    this.todoService.addTodo(todo).subscribe(response => {
      console.log(response)
      this.form.reset();
    })
  }
  checkCenas(cenas) {
    console.log(cenas)
  }
  markAsCompleted(todo: any) {
    console.log(todo)
    // todo.completed = !todo.completed;
    // this.todoService.markAsCompleted(todo).subscribe(response => {
    //   console.log(response)
    // })
  }

  deleteTodo($event, item) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.todoService.deleteTodo(item).subscribe(response => {
      console.log('yo resposta', response)
    })
  }
  drop(event: CdkDragDrop<any[]>, todos) {
    console.log(event, todos)
    // moveItemInArray(this.todos1.value, event.previousIndex, event.currentIndex);
  }


}
