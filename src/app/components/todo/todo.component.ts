import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { JexiaService } from 'src/app/services/jexia.service';
import { TodoService } from 'src/app/services/todo.service';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  faPlus = faPlus;
  form: FormGroup;
  todos = [];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private jexia: JexiaService,
    private todoService: TodoService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      todo: []
    })
    console.log(this.jexia.client)

    this.todoService.getTodos().subscribe(response => {
      this.todos = response;
      this.todoService.subscribeToTodos()
    }, error => {
      console.log(error)
      if (error.status === 401) {
        this.router.navigate(['/signin'])
      }
    })
  }

  addTodo() {
    // this.todos.push(this.form.get('todo').value);

    this.todoService.addTodo(this.form.get('todo').value).subscribe(response => {
      console.log(response)
      this.form.reset();
    })
  }

}
