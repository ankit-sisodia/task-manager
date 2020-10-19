import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Task} from './task.model';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TasksService {
  token = 'nQZ7fXLPBi1kGQKYwAXnu6TPwrcmNL7R';
  URL = 'https://devza.com/tests/tasks';
  tasks: Task[] = [];
  users: { id: string, name: string, imageUrl: string }[] = [];
  tasksFetchSubject = new Subject();
  usersFetchSubject = new Subject();

  constructor(private http: HttpClient) {
  }

  getUsers(): any {
    const headers = {AuthToken: this.token};
    return this.http.get <any>(`${this.URL}/listusers`, {headers}).pipe(map(({users}) => users.map(user => {
      return {
        id: user.id,
        name: user.name,
        imageUrl: user.picture
      };
    })));
  }

  getTasks(): any {
    const headers = {AuthToken: this.token};
    return this.http.get <any>(`${this.URL}/list`, {headers}).pipe(map(({tasks}) => tasks.map(task => {
        return {
          id: task.id,
          title: task.message,
          dueDate: task.due_date,
          priority: task.priority,
          assignedTo: task.assigned_to,
          assignedName: task.assigned_name,
          createdOn: task.created_on
        };
      })
    ));
  }

  createTask(task: Task): any {
    const headers = new HttpHeaders({AuthToken: this.token});
    const formData = new FormData();
    formData.append('message', task.title);
    formData.append('due_date', task.dueDate);
    formData.append('priority', task.priority);
    formData.append('assigned_to', task.assignedTo);
    return this.http.post <any>(`${this.URL}/create`, formData, {headers});
  }

  deleteTask(taskid: any): any {
    const headers = new HttpHeaders({AuthToken: this.token});
    const formData = new FormData();
    formData.append('taskid', taskid);
    return this.http.post <any>(`${this.URL}/delete`, formData, {headers});
  }

  updateTask(task: Task): any {
    const headers = new HttpHeaders({AuthToken: this.token});
    const formData = new FormData();
    formData.append('taskid', task.id);
    formData.append('message', task.title);
    formData.append('due_date', task.dueDate);
    formData.append('priority', task.priority);
    formData.append('assigned_to', task.assignedTo);
    return this.http.post <any>(`${this.URL}/update`, formData, {headers});
  }
}
