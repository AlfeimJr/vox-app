import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
  type: string;
  name: string;
  label: string;
  value?: any;
  validators?: ValidatorFn[];
  options?: { label: string; value: any }[];
}
