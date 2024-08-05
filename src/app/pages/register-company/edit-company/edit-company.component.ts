import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../@core/services/organization/organization.service';
import { ActivatedRoute } from '@angular/router';
import { FieldConfig } from '../../../@core/Interfaces/field-config.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../@core/components/button/button.component';
import { TextFieldComponent } from '../../../@core/components/text-field/text-field.component';
import { DateFieldComponent } from '../../../@core/components/date-field/date-field.component';
import { RadioFieldComponent } from '../../../@core/components/radio-field/radio-field.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../@core/services/alert/alert.service';

@Component({
  selector: 'vox-edit-company',
  standalone: true,
  imports: [
    ButtonComponent,
    TextFieldComponent,
    DateFieldComponent,
    RadioFieldComponent,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss',
})
export class EditCompanyComponent implements OnInit {
  organizationId: number | null = null;
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

  constructor(
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alert: AlertService
  ) {
    this.userDateForm = this.fb.group({
      userId: [''],
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });

    this.companyDateForm = this.fb.group({
      fantasyName: ['', Validators.required],
      registerEntity: ['', Validators.required],
      typeOrganization: ['', Validators.required],
      cnpj: [''],
      uf: [''],
    });
  }

  ngOnInit(): void {
    const fullUrl = window.location.href;
    const urlSegments = fullUrl.split('/');
    const idSegment = urlSegments[urlSegments.length - 1];
    this.organizationId = +idSegment;
    this.getOrganizationById();

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

  getOrganizationById() {
    if (this.organizationId) {
      this.organizationService
        .getOrganizationById(this.organizationId)
        .subscribe((organization) => {
          this.userDateForm.patchValue({
            userId: organization.userId,
            name: organization.name,
            cpf: organization.cpf,
            dateOfBirth: organization.dateOfBirth,
          });

          this.companyDateForm.patchValue({
            fantasyName: organization.fantasyName,
            registerEntity: organization.registerEntity,
            typeOrganization: organization.typeOrganization,
            cnpj: organization.cnpj,
            uf: organization.uf,
          });
        });
    }
  }
  goBack() {
    window.history.back();
  }

  getFormValues() {
    return {
      ...this.userDateForm.value,
      ...this.companyDateForm.value,
    };
  }
  editOrganization() {
    this.organizationService
      .patchOrganizationById(
        this.organizationId as number,
        this.getFormValues()
      )
      .subscribe({
        next: () => {
          this.alert.showAlert('Dados salvos com sucesso!');
        },
      });
  }
}
