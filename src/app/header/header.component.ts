import {Component, OnInit} from '@angular/core';
import {TasksService} from '../tasks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public tasksService: TasksService) {
  }

  ngOnInit(): void {
  }

  searchHandler(event): any {
    this.tasksService.tasksFetchSubject.next(event.target.value);
  }
}
