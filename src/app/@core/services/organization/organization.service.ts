import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organization } from '../../Interfaces/organization.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  apiUrl: string = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  getAllOrganization() {
    return this.httpClient.get<Organization[]>(`${this.apiUrl}/organization`);
  }

  createOrganization(organization: Organization) {
    return this.httpClient.post<Organization>(
      `${this.apiUrl}/organization`,
      organization
    );
  }

  getOrganizationById(id: number) {
    return this.httpClient.get<Organization>(
      `${this.apiUrl}/organization/${id}`
    );
  }

  patchOrganizationById(id: number, organization: Organization) {
    let Organization: Organization = { ...organization, id: Number(id) };
    return this.httpClient.put<Organization>(
      `${this.apiUrl}/organization/${id}`,
      {
        ...Organization,
      }
    );
  }
}
