import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { TodoComponent } from './components/todo/todo.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {path: '', redirectTo: 'todo', pathMatch: 'full'},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'todo', canActivate: [AuthGuard], component: TodoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
