import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { Service } from './service';
import { HttpClientModule } from '@angular/common/http';
import { UserUpdateComponent } from './user-update/user-update.component';
import { FormsModule } from '@angular/forms';
import { UserCreateComponent } from './user-create/user-create.component';
import { CattributeCreateComponent } from './cattribute-create/cattribute-create.component';
import { CattributeUpdateComponent } from './cattribute-update/cattribute-update.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientCreateComponent } from './client-create/client-create.component';
import { ClientUpdateComponent } from './client-update/client-update.component';
import { IrequestComponent } from './irequest/irequest.component';
import { IrequestCreateComponent } from './irequest-create/irequest-create.component';
import { IrequestUpdateComponent } from './irequest-update/irequest-update.component';
import { NavbarMainComponent } from './navbar-main/navbar-main.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectUpdateComponent } from './project-update/project-update.component';
import { ProjectAssignComponent } from './project-assign/project-assign.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskUpdateComponent } from './task-update/task-update.component';
import { FinalProjectCreateComponent } from './final-project-create/final-project-create.component';
import { FinalProjectComponent } from './final-project/final-project.component';
import { FinalProjectUpdateComponent } from './final-project-update/final-project-update.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';

const routes: Routes = [
  { path: '', component: TasksComponent, canActivate: [AuthGuard] },  // Default route
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'irequest', component: IrequestComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'fprojects', component: FinalProjectComponent, canActivate: [AuthGuard] },
  { path: 'kbase', component: KnowledgeBaseComponent, canActivate: [AuthGuard] },
  { path: 'activity', component: ActivityLogComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserUpdateComponent,
    UserCreateComponent,
    CattributeCreateComponent,
    CattributeUpdateComponent,
    ClientsComponent,
    ClientCreateComponent,
    ClientUpdateComponent,
    IrequestComponent,
    IrequestCreateComponent,
    IrequestUpdateComponent,
    NavbarMainComponent,
    LoginComponent,
    ProjectsComponent,
    ProjectCreateComponent,
    ProjectUpdateComponent,
    ProjectAssignComponent,
    TasksComponent,
    TaskEditComponent,
    TaskCreateComponent,
    TaskUpdateComponent,
    FinalProjectCreateComponent,
    FinalProjectComponent,
    FinalProjectUpdateComponent,
    KnowledgeBaseComponent,
    ActivityLogComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule
  ],
  providers: [Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
