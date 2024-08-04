import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Organization } from '../../../@core/Interfaces/organization.interface';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorIntlPtBr } from '../../../@core/class/mat-paginator-intl.class';
import { Router } from '@angular/router';

@Component({
  selector: 'vox-organizations-list',
  standalone: true,
  imports: [MatPaginatorModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr }],
  templateUrl: './organizations-list.component.html',
  styleUrl: './organizations-list.component.scss',
})
export class OrganizationsListComponent implements OnInit, OnChanges {
  pagedOrganizations: Organization[] = [];
  pageSize = 10;
  currentPage = 0;
  @Input() organizations: Organization[] = [];

  constructor(private route: Router) {}
  ngOnInit(): void {
    this.updatePagedOrganizations();
  }

  ngOnChanges(): void {
    this.updatePagedOrganizations();
  }
  updatePagedOrganizations(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedOrganizations = this.organizations.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedOrganizations();
  }

  onOrganizationClick(organization: Organization): void {
    this.route.navigate([`/register-company/edit-company/${organization.id}`]);
  }
}
