import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  providers: [provideNativeDateAdapter()],
  styleUrl: './date-field.component.scss',
})
export class DateFieldComponent {
  @Input() config: any = {};
  @Input() form: FormGroup = new FormGroup({});
  @Input() value: string = '';
}
