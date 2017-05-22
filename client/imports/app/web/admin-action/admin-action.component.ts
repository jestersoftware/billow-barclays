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
  @Input() position: string = "center";
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

  ngOnChanges(simpleChanges) {
    var abc = simpleChanges;
    // this.editing 
  }

  getArchetypes(thing) {
    return this.schemaService.getArchetypes(thing);
  }

  getId(index: number, item: any): number {
    return item._id;
  }

  positionEdit() {
    return this.position === "center" ? "absolute" : "relative";
  }

  rightEdit() {
    return this.position === "center" ? "0" : "-40%";
  }

  positionCancel() {
    return this.position === "center" ? "relative" : "absolute";
  }

  transformCancel() {
    return this.position === "center" ? "translateX(0)" : "translateX(62px)";
  }

  positionDelete() {
    return this.position === "center" ? "absolute" : "absolute";
  }

  leftDelete() {
    return this.position === "center" ? "0" : "128px";
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
