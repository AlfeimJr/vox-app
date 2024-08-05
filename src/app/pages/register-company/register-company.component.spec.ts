import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from '../../@core/components/search-bar/search-bar.component';
import { ButtonComponent } from '../../@core/components/button/button.component';
import { FormStepperComponent } from './form-stepper/form-stepper.component';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { OrganizationService } from '../../@core/services/organization/organization.service';
import { RegisterCompanyComponent } from './register-company.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Organization } from '../../@core/Interfaces/organization.interface';

describe('RegisterCompanyComponent', () => {
  let component: RegisterCompanyComponent;
  let fixture: ComponentFixture<RegisterCompanyComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let organizationServiceSpy: jasmine.SpyObj<OrganizationService>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    const organizationServiceMock = jasmine.createSpyObj(
      'OrganizationService',
      ['getAllOrganization']
    );
    routerEventsSubject = new Subject<any>();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        CommonModule,
        MatIconModule,
        SearchBarComponent,
        ButtonComponent,
        FormStepperComponent,
        OrganizationsListComponent,
        EditCompanyComponent,
        RegisterCompanyComponent,
      ],
      providers: [
        { provide: OrganizationService, useValue: organizationServiceMock },
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              children: [
                {
                  snapshot: { url: [{ path: 'register-company' }] },
                  children: [],
                },
              ],
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCompanyComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationServiceSpy = TestBed.inject(
      OrganizationService
    ) as jasmine.SpyObj<OrganizationService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isNotExistOrganization).toBeFalse();
    expect(component.organizations).toEqual([]);
    expect(component.actualRoute).toBe('');
  });

  it('should log current route on navigation end', () => {
    routerEventsSubject.next(
      new NavigationEnd(
        0,
        'http://localhost:4200/register-company',
        'http://localhost:4200/register-company'
      )
    );
    expect(component.actualRoute).toBe('/register-company');
  });

  it('should filter organizations on search', () => {
    component.organizations = [
      { fantasyName: 'Org1' } as Organization,
      { fantasyName: 'Org2' } as Organization,
    ];
    component.onSearch('Org1');
    expect(component.organizations).toEqual([
      { fantasyName: 'Org1' } as Organization,
    ]);
  });

  it('should navigate to form-stepper on createOrganization', () => {
    component.createOrganization();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/register-company/form-stepper'
    );
    expect(component.isNotExistOrganization).toBeTrue();
  });

  it('should get all organizations on logCurrentRoute if on register-company route', () => {
    const organizationsMock = [
      { fantasyName: 'Org1' },
      { fantasyName: 'Org2' },
    ] as Organization[];
    organizationServiceSpy.getAllOrganization.and.returnValue(
      of(organizationsMock)
    );

    component.logCurrentRoute();
    expect(organizationServiceSpy.getAllOrganization.calls.any()).toBeTrue();
    expect(component.organizations).toEqual(organizationsMock);
  });

  it('should not get all organizations if not on register-company route', () => {
    activatedRoute.root.children[0].snapshot.url = [];
    component.logCurrentRoute();
    expect(organizationServiceSpy.getAllOrganization.calls.any()).toBeFalse();
  });
});
