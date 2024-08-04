import { Component } from '@angular/core';
import { SearchBarComponent } from '../../@core/components/search-bar/search-bar.component';
import { ButtonComponent } from '../../@core/components/button/button.component';
import { FormStepperComponent } from './form-stepper/form-stepper.component';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [SearchBarComponent, ButtonComponent, FormStepperComponent],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.scss',
})
export class RegisterCompanyComponent {
  isNotExistOrganization: boolean = false;
  onSearch(query: string) {
    console.log('Search query:', query);
  }

  createOrganization() {
    window.open('/registe-company/form-stepper', '_self');
    this.isNotExistOrganization = true;
  }
}
