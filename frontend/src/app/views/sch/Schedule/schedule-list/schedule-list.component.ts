import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CatalogService } from 'src/app/views/catalog/catalog.service';
import { SCHService } from '../../sch.serivce';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClassTimingVM, CourseScheduleVM } from '../../Models/CourseScheduleVM';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ScheduleListComponent implements OnInit {
  Schedule: CourseScheduleVM[] | undefined;;
  selectedRowIndex = -1;
  selectedRow: CourseScheduleVM
  Edit: boolean = true;
  isPosted: boolean = false
  columnsToDisplay = ['expand', 'course', 'logo', 'orientationClass', 'startDate', 'description','isActive', 'Action'];
  dataSource: any;
  innerDisplayeScheduleolumns: string[] = ['day', 'timeFrom', 'timeTo'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay];
  expandedElement: any;
  @ViewChild('outerSort', { static: true }) sort: MatSort | undefined;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort> | undefined;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<ClassTimingVM>> | undefined;
  constructor(
    private route: Router,
    public dialog: MatDialog,
     public schSvc: SCHService,
   // public lmsSvc: LMSService,
    public catSvc: CatalogService,
    //  private _loc: Location,
  ) {
    this.selectedRow = new CourseScheduleVM;
  }
  ngOnInit(): void {
    this.GetSchedule();
  }
  highlight(row: CourseScheduleVM) {
    debugger
    this.selectedRow = new CourseScheduleVM
    this.selectedRowIndex = row.id;
    this.selectedRow = row
  }
  GetSchedule() {
    this.selectedRow = new CourseScheduleVM;
    this.schSvc.GetCourseSchedule().subscribe({
      next: (res: CourseScheduleVM[]) => {
        this.Schedule = res;
        this.dataSource = new MatTableDataSource(this.Schedule);
      }, error: (e) => {
        this.catSvc.ErrorMsgBar("Error Occurred!", 4000)
        console.warn(e);
      }
    })
  }
  EditSchedule(Schedule: CourseScheduleVM) {
    this.route.navigate(['/lms/schedule'], {
      queryParams: {
        id: Schedule.id
      }
    });
  }
  DeleteSchedule(id: number) {
    debugger
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.schSvc.DeleteCourseSchedule(id).subscribe({
          next: (data: any) => {
            Swal.fire(
              'Deleted!',
              'Successfully Deleted.',
              'success'
            )
            this.GetSchedule();
          }, error: (e) => {
            this.catSvc.ErrorMsgBar("Error Occurred!", 4000)
            console.warn(e);
          }
        })
      }
    })
  }
  Refresh() {
    this.selectedRowIndex = -1
    this.selectedRow = new CourseScheduleVM
  }
}