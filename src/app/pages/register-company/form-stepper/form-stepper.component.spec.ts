import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OrganizationService } from '../../../@core/services/organization/organization.service';
import { AlertService } from '../../../@core/services/alert/alert.service';
import { ButtonComponent } from '../../../@core/components/button/button.component';
import { TextFieldComponent } from '../../../@core/components/text-field/text-field.component';
import { DateFieldComponent } from '../../../@core/components/date-field/date-field.component';
import { RadioFieldComponent } from '../../../@core/components/radio-field/radio-field.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Organization } from '../../../@core/Interfaces/organization.interface';
import { EditCompanyComponent } from '../edit-company/edit-company.component';

describe('EditCompanyComponent', () => {
  let component: EditCompanyComponent;
  let fixture: ComponentFixture<EditCompanyComponent>;
  let organizationServiceSpy: jasmine.SpyObj<OrganizationService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const organizationServiceMock = jasmine.createSpyObj(
      'OrganizationService',
      ['getOrganizationById', 'patchOrganizationById']
    );
    const alertServiceMock = jasmine.createSpyObj('AlertService', [
      'showAlert',
    ]);
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1',
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ButtonComponent,
        TextFieldComponent,
        DateFieldComponent,
        RadioFieldComponent,
        CommonModule,
        MatIconModule,
      ],
      declarations: [EditCompanyComponent],
      providers: [
        FormBuilder,
        { provide: OrganizationService, useValue: organizationServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCompanyComponent);
    component = fixture.componentInstance;
    organizationServiceSpy = TestBed.inject(
      OrganizationService
    ) as jasmine.SpyObj<OrganizationService>;
    alertServiceSpy = TestBed.inject(
      AlertService
    ) as jasmine.SpyObj<AlertService>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls on ngOnInit', () => {
    component.ngOnInit();

    expect(component.userDateForm.contains('name')).toBeTrue();
    expect(component.userDateForm.contains('cpf')).toBeTrue();
    expect(component.userDateForm.contains('dateOfBirth')).toBeTrue();

    expect(component.companyDateForm.contains('fantasyName')).toBeTrue();
    expect(component.companyDateForm.contains('registerEntity')).toBeTrue();
    expect(component.companyDateForm.contains('typeOrganization')).toBeTrue();
  });

  it('should add and remove matriz fields based on typeOrganization value', () => {
    component.ngOnInit();

    component.companyDateForm.get('typeOrganization')?.setValue('matriz');
    expect(component.companyDateForm.contains('uf')).toBeTrue();
    expect(component.companyDateForm.contains('cnpj')).toBeTrue();

    component.companyDateForm.get('typeOrganization')?.setValue('filial');
    expect(component.companyDateForm.contains('uf')).toBeFalse();
    expect(component.companyDateForm.contains('cnpj')).toBeFalse();
  });

  it('should get organization by id on init', () => {
    const mockOrganization = {
      userId: 1,
      name: 'Test Name',
      cpf: '123.456.789-00',
      dateOfBirth: '2000-01-01',
      fantasyName: 'Test Fantasy Name',
      registerEntity: 'Test Register Entity',
      typeOrganization: 'matriz',
      cnpj: '12.345.678/0001-00',
      uf: 'SP',
    };
    organizationServiceSpy.getOrganizationById.and.returnValue(
      of(mockOrganization as Organization)
    );

    component.ngOnInit();

    expect(component.userDateForm.get('name')?.value).toBe(
      mockOrganization.name
    );
    expect(component.companyDateForm.get('fantasyName')?.value).toBe(
      mockOrganization.fantasyName
    );
  });

  it('should return combined form values', () => {
    component.ngOnInit();

    component.userDateForm.get('name')?.setValue('Test Name');
    component.companyDateForm.get('fantasyName')?.setValue('Test Fantasy Name');

    const formValues = component.getFormValues();

    expect(formValues.name).toBe('Test Name');
    expect(formValues.fantasyName).toBe('Test Fantasy Name');
  });

  it('should call organizationService to edit organization and show alert', () => {
    organizationServiceSpy.patchOrganizationById.and.returnValue(
      of({
        id: 1,
        name: 'Test Name',
        cpf: '123.456.789-00',
        dateOfBirth: '2000-01-01',
        fantasyName: 'Test Fantasy Name',
        registerEntity: 'Test Register Entity',
        typeOrganization: 'matriz',
        cnpj: '12.345.678/0001-00',
        uf: 'SP',
      } as Organization)
    );
    component.editOrganization();

    expect(organizationServiceSpy.patchOrganizationById.calls.any()).toBeTrue();
    expect(alertServiceSpy.showAlert.calls.any()).toBeTrue();
  });

  it('should navigate back when goBack is called', () => {
    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });
});
