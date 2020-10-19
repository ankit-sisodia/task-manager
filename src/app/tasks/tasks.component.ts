import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from '../tasks.service';
import {CreateEditTaskComponent} from './create-edit-task/create-edit-task.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  items = {high: [], medium: [], low: []};
  loading = false;
  createLoading = false;

  constructor(private tasksService: TasksService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.tasksService.tasksFetchSubject.subscribe((value: string | undefined) => {
      this.items = {high: [], medium: [], low: []};
      this.tasksService.tasks.map(task => {
        if (task.priority >= 1 && task.priority <= 3) {
          this.items.high.push(task);
        } else if (task.priority >= 4 && task.priority <= 6) {
          this.items.medium.push(task);
        } else {
          this.items.low.push(task);
        }
      });
      if (typeof value === 'string') {
        this.tasksService.tasks
          .filter(task => task.title.toLowerCase().includes(value.toLowerCase())).map(task => {
          if (task.priority >= 1 && task.priority <= 3) {
            this.items.high.push(task);
          } else if (task.priority >= 4 && task.priority <= 6) {
            this.items.medium.push(task);
          } else {
            this.items.low.push(task);
          }
        });
      }
    });
    this.tasksService.getUsers().subscribe(users => {
      this.tasksService.users = users;
      this.tasksService.usersFetchSubject.next();
    });
    this.getTasks();
  }

  getTasks(): any {
    this.loading = true;
    this.tasksService.getTasks().subscribe(tasks => {
      this.tasksService.tasks = tasks;
      this.tasksService.tasksFetchSubject.next();
      this.loading = false;
    });
  }

  createTask(): any {
    const dialogRef = this.dialog.open(CreateEditTaskComponent, {data: {task: {}, readMode: false}});
    dialogRef.afterClosed().subscribe(createdTask => {
      if (createdTask) {
        this.createLoading = true;
        this.tasksService.createTask(createdTask).subscribe(response => {
          this.tasksService.tasks.push({...createdTask, id: response.id});
          this.tasksService.tasksFetchSubject.next();
          this.createLoading = false;
        });
      }
    });
  }

  drop(event: CdkDragDrop<string[]>): any {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.tasksService.updateTask({...event.item.data, priority: event.container.element.nativeElement.dataset.attr}).subscribe(() => {
      const index = this.tasksService.tasks.findIndex(task => task.id === event.item.data.id);
      this.tasksService.tasks.splice(index, 1, {...event.item.data, priority: event.container.element.nativeElement.dataset.attr});
      this.tasksService.tasksFetchSubject.next();
    });
  }
}
