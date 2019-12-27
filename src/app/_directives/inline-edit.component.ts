import {Component, Host, Input, OnInit, Optional} from '@angular/core';
import {SatPopover} from '@ncstate/sat-popover';
import {filter} from 'rxjs/operators';
import {LogService} from '../_services/log.service';

@Component({
    selector: 'app-inline-edit',
    styleUrls: ['inline-edit.component.scss'],
    template: `
    <form (ngSubmit)="onSubmit()">
      <div class="mat-subheading-2">{{key}}</div>
      <mat-form-field>
        <input matInput maxLength="140" name="key" [(ngModel)]="comment">
        <mat-hint align="end">{{comment?.length || 0}}/140</mat-hint>
      </mat-form-field>

      <div class="actions">
        <button mat-button type="button" color="primary" (click)="onCancel()">CANCEL</button>
        <button mat-button type="submit" color="primary">SAVE</button>
      </div>
    </form>
  `
})
export class InlineEditComponent implements OnInit {

    /** Form model for the input. */
    comment = '';

    constructor(
        private log: LogService,
        @Optional() @Host() public popover: SatPopover
    ) {
    }

    private _key = '';

    /** Overrides the comment and provides a reset value when changes are cancelled. */
    @Input()
    get key(): string {
        return this._key;
    }

    set key(x: string) {
        this._key = x;
    }

    private _value = '';

    @Input()
    get value(): string {
        return this._value;
    }

    set value(x: string) {
        this.comment = this._value = x;
    }

    ngOnInit() {
        this.log.debug('[InlineEditComponent] [INIT]');
        // subscribe to cancellations and reset form value
        if (this.popover) {
            this.popover.closed.pipe(filter(val => val == null)).subscribe(() => this.comment = this.value || '');
        }
    }

    onSubmit() {
        if (this.popover) {
            this.popover.close(this.comment);
        }
    }

    onCancel() {
        if (this.popover) {
            this.popover.close();
        }
    }
}
