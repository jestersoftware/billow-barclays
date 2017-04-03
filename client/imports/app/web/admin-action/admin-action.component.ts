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

  @Input() thing: any;
  @Input() enableCreate: string = "yes";
  @Input() enableEdit: string = "yes";
  @Input() enableDelete: string = "none";
  @Input() enableExpand: boolean = true;
  @Input() editing: any = false;
  @Input() disabled: any = false;
  @Output() onCreate = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onToggle = new EventEmitter<any>();
  
  addEvent: any;

  constructor(
    private schemaService: SchemaService) {
  }

  ngOnInit() {
  }

  archetypes(thing) {
    return this.schemaService.getArchetypes(thing);
  }

  positionEdit() {
    return this.enableCreate === "yes" ? "absolute" : "relative";
  }

  rightEdit() {
    return this.enableCreate === "yes" ? "0" : "-40%";
  }

  positionCancel() {
    return this.enableCreate === "yes" ? "relative" : "absolute";
  }

  transformCancel() {
    return this.enableCreate === "yes" || this.enableDelete === "yes" ? "" : "translateX(62px)";
    // return "";
  }

  positionDelete() {
    // return this.enableCreate === "yes" ? "relative" : "absolute";
    return "absolute";
  }

  leftDelete() {
    return this.enableCreate || this.enableEdit === "yes" ? "0" : "0";
  }

  toggle(event) {
    this.onToggle.emit(
      {
        event: event,
        thing: this.thing
      });
  }

  edit(event) {
    this.editing = true;

    this.onEdit.emit(
      {
        event: event,
        thing: this.thing,
        value: this.editing
      });
  }

  cancel(event) {
    this.editing = false;

    this.onEdit.emit(
      {
        event: event,
        thing: this.thing,
        value: this.editing
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

  delete(event) {
    this.onDelete.emit(
      {
        event: event,
        thing: this.thing
      });

    this.editing = false;
  }

  add(event) {
    event.stopPropagation();
    this.addEvent = event;
  }

  create(event) {
    this.onCreate.emit(
      {
        event: this.addEvent,
        thing: this.thing,
        type: event.target.parentElement.innerText
      });
    this.addEvent = null;
  }
}
