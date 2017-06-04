import { Injectable } from '@angular/core';

import { ViewService } from './view.service';

@Injectable()
export class SchemaService {

  private archetypes: any = [
    {
      _id: "archetype1",
      key: "User",
      display: "User",
      editable: false,
      icon: "face",
      displaytype: "table",
      parent: ["Root", "Reference"]
    },
    {
      _id: "archetype2",
      key: "Role",
      display: "Role",
      editable: false,
      icon: "face",
      displaytype: "table",
      parent: ["User", "Reference"]
    },
    {
      _id: "archetype3",
      key: "Organization",
      display: "Organization",
      icon: "device_hub",
      parent: ["User"]
    },
    {
      _id: "archetype4",
      key: "Business",
      display: "Business",
      icon: "business",
      parent: ["Organization"]
    },
    {
      _id: "archetype5",
      key: "Employee",
      display: "Employee",
      icon: "person_outline",
      from: "User",
      parent: ["Business", "Department"]
    },
    {
      _id: "archetype6",
      key: "Department",
      display: "Department",
      icon: "supervisor_account",
      parent: ["Organization", "Business", "Reference"]
    },
    {
      _id: "archetype7",
      key: "Collection",
      display: "Collection",
      icon: "list",
      parent: ["Business", "Department", "Reference", "Section"]
    },
    {
      _id: "archetype8",
      key: "Product",
      display: "Product",
      icon: "attach_money",
      displaytype: "table",
      parent: ["Collection", "List", "Section", "Product", "Reference"]
    },
    {
      _id: "archetype9",
      key: "Web Site",
      display: "Web Site",
      icon: "language",
      parent: ["Business", "Reference"]
    },
    {
      _id: "archetype10",
      key: "Social Site",
      display: "Social Site",
      icon: "share",
      displaytype: "flex-column",
      parent: ["User", "Business", "Department", "Collection"]
    },
    {
      _id: "archetype11",
      key: "Section",
      display: "Section",
      icon: "web",
      parent: ["Web Site", "Collection", "Section", "Reference"]
    },
    {
      _id: "archetype12",
      key: "Reference",
      display: "Reference",
      icon: "tab_unselected",
      parent: ["*"]
    },
    {
      _id: "archetype13",
      key: "Image",
      display: "Image",
      icon: "photo",
      parent: ["Collection", "Reference"]
    },
    {
      _id: "archetype14",
      key: "Contact",
      display: "Contact",
      icon: "phone",
      // displaytype: "table",
      parent: ["Collection", "Reference"]
    },
    {
      _id: "archetype15",
      key: "Event",
      display: "Event",
      icon: "event",
      displaytype: "two-column",
      parent: ["Collection", "Reference"]
    },
    {
      _id: "archetype16",
      key: "List",
      display: "List",
      icon: "list",
      defaultFormat: "format",
      parent: ["Collection"]
    }
  ]

  private properties: any = [
    {
      _id: "property1",
      key: "price",
      name: "dollar",
      title: "Price",
      type: "currency",
      parent: ["Product"]
    },
    {
      _id: "property2",
      key: "category",
      name: "name",
      title: "Category",
      type: "string",
      hidden: true,
      parent: ["Product"]
    },
    {
      _id: "property3",
      key: "supplier",
      name: "name",
      title: "Supplier",
      type: "string",
      parent: ["Product"]
    },
    {
      _id: "property4",
      key: "logo",
      name: "path",
      title: "Logo",
      type: "image",
      hidden: true,
      preview: "previewPath",
      parent: ["Organization", "Business", "Web Site"]
    },
    {
      _id: "property5",
      key: "background",
      name: "path",
      title: "Background",
      type: "image",
      hidden: true,
      preview: "previewPath",
      parent: ["Web Site", "Section", /*"Menu",*/ "Image", "Event"]
    },
    {
      _id: "property6",
      key: "site",
      name: "url",
      title: "Site",
      type: "url",
      hidden: true,
      parent: ["Social Site"]
    },
    {
      _id: "property7",
      key: "font",
      name: "url",
      title: "Font Url",
      type: "url",
      hidden: true,
      parent: ["Web Site"]
    },
    {
      _id: "property8",
      key: "font",
      name: "name",
      title: "Font Name",
      type: "string",
      hidden: true,
      parent: ["Web Site"]
    },
    {
      _id: "property9",
      key: "reference",
      name: "_id",
      title: "Refers To",
      type: "thing",
      hidden: true,
      parent: ["Reference"]
    },
    {
      _id: "property10",
      key: "email",
      name: "address",
      title: "Email",
      type: "email",
      parent: ["Contact"]
    },
    {
      _id: "property11",
      key: "phone",
      name: "number",
      title: "Phone",
      type: "phone",
      parent: ["Contact"]
    },
    {
      _id: "property12",
      key: "start",
      name: "time",
      title: "Start Time",
      type: "time",
      parent: ["Event"]
    },
    {
      _id: "property12",
      key: "stop",
      name: "time",
      title: "Stop Time",
      type: "time",
      parent: ["Event"]
    },
    {
      _id: "property13",
      key: "code",
      name: "number",
      title: "Code",
      type: "integer",
      parent: ["Product"]
    },
    {
      _id: "property14",
      key: "abv",
      name: "number",
      title: "ABV",
      type: "percentage",
      parent: ["Product"]
    },
    {
      _id: "property15",
      key: "style",
      name: "name",
      title: "Style",
      type: "string",
      parent: ["Product"]
    },
    {
      _id: "property16",
      key: "size",
      name: "amount",
      title: "Size",
      type: "string",
      parent: ["Product"]
    }
  ];

  constructor(private viewService: ViewService) {
  }

  getArchetype(thing) {
    let archetype;

    if (thing.type)
      archetype = this.archetypes.find(archetype => archetype.key === thing.type);

    if (!archetype)
      archetype = { key: "unknown", name: "unknown", icon: "help_outline" };

    return archetype;
  }

  getArchetypes(thing) {
    return this.archetypes.filter(archetype => archetype.parent.find(parent => parent === thing.type || parent === "*"));
  }

  getProperties(thing) {
    return this.properties.filter(property => property.parent.find(parent => parent === thing.type || parent === "*"));
  }

  fixup(things, reset, parent = null, enabled = false) {
    // let max_count = 0;

    things.forEach(thing => {
      // TODO: Doesn't work here because of initialization, move initialization here??
      // // Get max count
      // if (thing.order && thing.order.index > 0) {
      //   max_count = Math.max(max_count, thing.order.index);
      // }

      // Fix up Order Index
      if (!thing.order || !thing.order.index) {
        thing.order = { index: "" };
      }
      // View
      if (reset || !thing.view) {
        thing.view = {};
      }
      // Format - set default, overwrite below if saved - therefore, this needs to go first
      if (this.getArchetype(thing).defaultFormat && this.getArchetype(thing).defaultFormat === "format") {
        thing.view.format = true;
      }
      // Schema migration - view has moved to User collection
      if (reset) {
        if (this.viewService.getCurrentView().things && this.viewService.getCurrentView().things[thing._id]) {
          let currentFormat = thing.view.format;
          thing.view = this.viewService.getCurrentView().things[thing._id].view;
          if(currentFormat && thing.view.format === undefined) {
            thing.view.format = true;
          }
        }
      }
      // Image
      if (thing.type === "Image") {
        thing.view.showContent = true;
      }
      // Session
      if (!thing.session) {
        thing.session = {}
        thing.session.disabled = !enabled;
        thing.session.editing = enabled;
        thing.session.initialized = true;
      }
      // Parent
      if (parent) {
        thing.session.parentThing = parent;
      }
      // Fix up all other properties
      for (let property of this.getProperties(thing)) {
        if (!thing[property.key]) {
          thing[property.key] = {};
        }
        else if (typeof thing[property.key] !== 'object') {
          let val = thing[property.key];
          thing[property.key] = {};
          thing[property.key][property.name] = val;
        }
      }
    });

    // things.forEach(thing => {
    //   // Fix up Order Index
    //   max_count++;
    //   if (!thing.order || !thing.order.index) {
    //     thing.order = { index: max_count };
    //   }
    // });

    // return things;
  }
}