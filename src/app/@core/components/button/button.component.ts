import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vox-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() text: string = 'Default Text';
  @Input() color: string = 'primary';
  @Input() size: string = 'medium';
  @Input() disabled: boolean = false;
  @Output() onClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  onClick() {
    this.onClickEvent.emit();
  }
}
