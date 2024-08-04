import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FieldConfig } from '../../../@core/Interfaces/field-config.interface';
import { TextFieldComponent } from '../../../@core/components/text-field/text-field.component';
import { DateFieldComponent } from '../../../@core/components/date-field/date-field.component';
import { RadioFieldComponent } from '../../../@core/components/radio-field/radio-field.component';
import { ButtonComponent } from '../../../@core/components/button/button.component';

@Component({
  selector: 'vox-form-stepper',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    ButtonComponent,
    TextFieldComponent,
    DateFieldComponent,
    RadioFieldComponent,
  ],
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
})
export class FormStepperComponent implements OnInit {
  userDateForm: FormGroup = new FormGroup({});
  companyDateForm: FormGroup = new FormGroup({});
  userFieldConfigs: FieldConfig[] = [
    {
      type: 'text',
      name: 'firstName',
      label: 'Seu nome',
      validators: [Validators.required],
    },
    {
      type: 'text',
      name: 'cpf',
      label: 'Seu CPF',
      validators: [Validators.required],
    },
    {
      type: 'date',
      name: 'date',
      label: 'Data de nascimento',
      validators: [Validators.required],
    },
  ];
  companyFieldConfigs: FieldConfig[] = [
    {
      type: 'text',
      name: 'fantasyName',
      label: 'Nome fantasia',
      validators: [Validators.required],
    },
    {
      type: 'text',
      name: 'registerEntity',
      label: 'Entidade de registro',
      validators: [Validators.required],
    },
    {
      type: 'radio',
      name: 'TypeCompany',
      label: 'Tipo de Empresa',
      options: [
        { label: 'Filial', value: 'filial' },
        { label: 'Matriz', value: 'matriz' },
      ],
      validators: [Validators.required],
    },
  ];

  constructor(private fb: FormBuilder) {
    this.userDateForm = this.fb.group({});
    this.companyDateForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.userFieldConfigs.forEach((field) => {
      this.userDateForm.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
    this.companyFieldConfigs.forEach((field) => {
      this.companyDateForm.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });

    if (this.companyDateForm.get('TypeCompany')?.value === 'matriz') {
      this.addMatrizFields();
    }

    this.companyDateForm.get('TypeCompany')?.valueChanges.subscribe((value) => {
      this.updateConditionalFields(value);
    });
  }

  updateConditionalFields(value: string) {
    if (value === 'matriz') {
      this.addMatrizFields();
    } else {
      this.removeMatrizFields();
    }
  }

  addMatrizFields() {
    if (!this.companyDateForm.contains('uf')) {
      this.companyDateForm.addControl(
        'uf',
        this.fb.control('', Validators.required)
      );
    }
    if (!this.companyDateForm.contains('cnpj')) {
      this.companyDateForm.addControl(
        'cnpj',
        this.fb.control('', Validators.required)
      );
    }
  }

  removeMatrizFields() {
    if (this.companyDateForm.contains('uf')) {
      this.companyDateForm.removeControl('uf');
    }
    if (this.companyDateForm.contains('cnpj')) {
      this.companyDateForm.removeControl('cnpj');
    }
  }

  getFormValues() {
    return {
      ...this.userDateForm.value,
      ...this.companyDateForm.value,
    };
  }
}
