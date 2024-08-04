import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'vox-radio-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule],
  templateUrl: './radio-field.component.html',
  styleUrl: './radio-field.component.scss',
})
export class RadioFieldComponent {
  @Input() config: any = {};
  @Input() form: FormGroup = new FormGroup({});
  @Input() value: string = '';
}
