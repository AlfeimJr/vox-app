import { Component, OnChanges, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../@core/components/search-bar/search-bar.component';
import { ButtonComponent } from '../../@core/components/button/button.component';
import { FormStepperComponent } from './form-stepper/form-stepper.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Organization } from '../../@core/Interfaces/organization.interface';
import { OrganizationService } from '../../@core/services/organization/organization.service';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { EditCompanyComponent } from './edit-company/edit-company.component';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [
    SearchBarComponent,
    ButtonComponent,
    FormStepperComponent,
    OrganizationsListComponent,
    EditCompanyComponent,
  ],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.scss',
})
export class RegisterCompanyComponent implements OnInit {
  isNotExistOrganization: boolean = false;
  organizations: Organization[] = [];
  actualRoute: string = '';
  organizationsBackup: Organization[] = [];
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.logCurrentRoute();
      });

    this.logCurrentRoute();
  }

  onSearch(query: string) {
    this.organizations = this.organizationsBackup.filter((organization) => {
      return organization.fantasyName
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }

  createOrganization() {
    this.route.navigateByUrl('/register-company/form-stepper');
    this.isNotExistOrganization = true;
  }

  getAllOrganizations() {
    this.organizationService.getAllOrganization().subscribe((organizations) => {
      this.organizations = organizations;
      this.organizationsBackup = organizations;
    });
  }

  logCurrentRoute() {
    let currentRoute = this.activatedRoute.root;
    let routePath = '';

    while (currentRoute.children.length > 0) {
      const childRoute = currentRoute.children[0];
      routePath +=
        '/' + childRoute.snapshot.url.map((segment) => segment.path).join('/');
      currentRoute = childRoute;
    }

    this.actualRoute = routePath;
    if (this.actualRoute === '/register-company') {
      this.getAllOrganizations();
    }
  }
}
