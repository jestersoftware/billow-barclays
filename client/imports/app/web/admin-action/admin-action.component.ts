import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SchemaService } from './../../schema.service';

import template from "./admin-action.component.html";
import style from './admin-action.component.scss';

@Component({
  selector: 'app-admin-action',
  template,
  styles: [style]
})
export class AdminActionComponent implements OnInit {

  @Input() auth: any;
  @Input() thing: any;
  @Input() enableCreate: string = "yes";
  @Input() enableEdit: string = "yes";
  @Output() onCreate = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onToggle = new EventEmitter<any>();

  isEditing: any = false;

  constructor(
    private schemaService: SchemaService) {
  }

  ngOnInit() {
  }

  archetypes(thing) {
    return this.schemaService.getArchetypes(thing);
  }

  position() {
    return this.enableCreate === "yes" ? "absolute" : "relative";
  }

  right() {
    return this.enableCreate === "yes" ? "0" : "";
  }

  position2() {
    return this.enableCreate === "yes" ? "relative" : "absolute";
  }

  right2() {
    return this.enableCreate === "yes" ? "" : "0";
  }

  toggle(event) {
    this.onToggle.emit(
      {
        event: event,
        thing: this.thing
      });
  }

  edit(event) {
    this.isEditing = true;

    this.onEdit.emit(
      {
        event: event,
        thing: this.thing,
        value: this.isEditing
      });
  }

  cancel(event) {
    this.isEditing = false;

    this.onEdit.emit(
      {
        event: event,
        thing: this.thing,
        value: this.isEditing
      });
  }

  save(event) {
    this.onSave.emit(
      {
        event: event,
        thing: this.thing
      });

    this.cancel(event);
  }

  add(event) {
    event.stopPropagation();
  }

  create(event) {
    this.onCreate.emit(
      {
        event: event,
        thing: this.thing
      });
  }
}
