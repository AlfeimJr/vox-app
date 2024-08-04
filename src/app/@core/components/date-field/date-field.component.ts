import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDateAdapter } from './custom-date-adapter';
import { MY_DATE_FORMATS } from './date-format';
@Component({
  selector: 'vox-date-field',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './date-field.component.html',
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  styleUrl: './date-field.component.scss',
})
export class DateFieldComponent {
  @Input() config: any = {};
  @Input() form: FormGroup = new FormGroup({});
  @Input() value: string = '';
}
