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
import { OrganizationService } from '../../../@core/services/organization/organization.service';
import { AlertService } from '../../../@core/services/alert/alert.service';
import { UserService } from '../../../@core/services/user/user.service';
import { User } from '../../../@core/Interfaces/user.interface';
import { Router } from '@angular/router';
import { TitleService } from '../../../@core/services/title/title.service';

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
      name: 'name',
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
      name: 'dateOfBirth',
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
      name: 'typeOrganization',
      label: 'Tipo de Empresa',
      options: [
        { label: 'Filial', value: 'filial' },
        { label: 'Matriz', value: 'matriz' },
      ],
      validators: [Validators.required],
    },
  ];
  userLogged: User | null = null;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private alert: AlertService,
    private userService: UserService,
    private router: Router,
    private titleService: TitleService
  ) {
    this.userDateForm = this.fb.group({
      userId: [''],
    });
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

    if (this.companyDateForm.get('typeOrganization')?.value === 'matriz') {
      this.addMatrizFields();
    }

    this.companyDateForm
      .get('typeOrganization')
      ?.valueChanges.subscribe((value) => {
        this.updateConditionalFields(value);
      });

    this.getUser();

    this.titleService.initializeTitleWatcher();
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

  getUser() {
    this.userService.getLoggedUser().subscribe({
      next: (user) => {
        this.userLogged = user;
      },
    });
  }

  createOrganization() {
    this.userDateForm.patchValue({
      userId: this.userLogged?.id,
    });

    this.organizationService
      .createOrganization(this.getFormValues())
      .subscribe({
        next: () => {
          this.alert.showAlert('Sua organização foi criada com sucesso!');
          this.router.navigateByUrl('/register-company');
        },
      });
  }
}
