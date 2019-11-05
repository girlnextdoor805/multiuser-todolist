import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { filter } from 'rxjs/operators';

import { TodoService } from 'src/app/services/todo.service';
import { AddTodoRequestObject } from 'src/app/interfaces/todo';

import * as moment from 'moment';



@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  form: FormGroup;
  todos: any[];
  connectedTo: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({todo: [null, Validators.required], date: null});

    this.todoService.todos$.pipe(
      filter(todos => !!todos),
    ).subscribe(todos => {

      for (const list of todos) {
        this.connectedTo.push(list.id);
      }

      this.todos = todos;
    });

    this.todoService.getTodos();
    this.todoService.subscribeToTodos();
  }

  addTodo() {
    const todo = this.form.value as AddTodoRequestObject;

    this.todoService.addTodo(todo).subscribe(response => {
      console.log(response)
      this.form.reset();
    })
  }

  markAsCompleted(todo: any) {
    console.log(todo)
    todo.completed = !todo.completed;
    this.todoService.markAsCompleted(todo).subscribe(response => {
      console.log(response)
    })
  }

  deleteTodo($event, item) {
    // console.log(item)
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.todoService.deleteTodo(item).subscribe(response => {
      // console.log('yo resposta', response)
    })
  }

  drop(ev: CdkDragDrop<any[]>, todos, date: string) {

    if (ev.previousContainer === ev.container) {
      // console.log('move-mos', ev, todos, date);
      moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
    } else {
      // console.log('transfere-mos',ev.previousContainer.data[ev.previousIndex]);
      this.todoService.rescheduleTodo(ev.previousContainer.data[ev.previousIndex], date).subscribe(response => {
        // console.log(response)
      })
      transferArrayItem(ev.previousContainer.data, ev.container.data, ev.previousIndex, ev.currentIndex);
    }
  }

  checkPast(date: string) {
    return moment(date).isBefore(moment())
  }
}
