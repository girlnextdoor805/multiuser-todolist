import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faPlus, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

import { JexiaService } from 'src/app/services/jexia.service';
import { TodoService } from 'src/app/services/todo.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  faPlus = faPlus;
  faArrowsAlt = faArrowsAlt;
  form: FormGroup;
  todos$: BehaviorSubject<any[]> //= new BehaviorSubject([]);


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private jexia: JexiaService,
    private todoService: TodoService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      todo: null,
      date: null
    })
    console.log(this.jexia.client)

    this.todos$ = this.todoService.todos;

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

    this.todoService.addTodo(this.form.get('todo').value).subscribe(response => {
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


}
