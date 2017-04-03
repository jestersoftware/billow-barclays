import { Injectable } from '@angular/core';

import { ViewService } from './view.service';

@Injectable()
export class SchemaService {

  private archetypes: any = [
    {
      key: "User",
      display: "User",
      editable: false,
      icon: "face",
      displaytype: "table",
      parent: ["Root", "Reference"]
    },
    {
      key: "Role",
      display: "Role",
      editable: false,
      icon: "face",
      displaytype: "table",
      parent: ["User", "Reference"]
    },
    {
      key: "Organization",
      display: "Organization",
      icon: "device_hub",
      parent: ["User"]
    },
    {
      key: "Business",
      display: "Business",
      icon: "business",
      parent: ["Organization"]
    },
    {
      key: "Employee",
      display: "Employee",
      icon: "person_outline",
      from: "User",
      parent: ["Business", "Department"]
    },
    {
      key: "Department",
      display: "Department",
      icon: "supervisor_account",
      parent: ["Business", "Reference"]
    },
    {
      key: "Collection",
      display: "Collection",
      icon: "list",
      defaultFormat: "format",
      parent: ["Business", "Department", "Reference"]
    },
    {
      key: "Product",
      display: "Product",
      icon: "attach_money",
      displaytype: "table",
      parent: ["Collection", "Menu", "Section", "Reference"]
    },
    {
      key: "Menu",
      display: "Menu",
      icon: "restaurant_menu",
      defaultFormat: "format",
      parent: ["Collection", "Reference"]
    },
    {
      key: "Web Site",
      display: "Web Site",
      icon: "language",
      parent: ["Business", "Reference"]
    },
    {
      key: "Social Site",
      display: "Social Site",
      icon: "share",
      parent: ["User", "Business", "Department", "Collection"]
    },
    {
      key: "Section",
      display: "Section",
      icon: "web",
      parent: ["Web Site", "Section", "Menu", "Reference"]
    },
    {
      key: "Reference",
      display: "Reference",
      icon: "tab_unselected",
      parent: ["*"]
    },
    {
      key: "Image",
      display: "Image",
      icon: "photo",
      parent: ["Collection", "Reference"]
    }
  ]

  private properties: any = [
    {
      key: "price",
      name: "dollar",
      title: "Price",
      type: "currency",
      parent: ["Product"]
    },
    {
      key: "category",
      name: "name",
      title: "Category",
      type: "string",
      parent: ["Product"]
    },
    {
      key: "supplier",
      name: "name",
      title: "Supplier",
      type: "string",
      parent: ["Product"]
    },
    {
      key: "logo",
      name: "path",
      title: "Logo",
      type: "image",
      hidden: true,
      preview: "previewPath",
      parent: ["Organization", "Business", "Web Site"]
    },
    {
      key: "background",
      name: "path",
      title: "Background",
      type: "image",
      hidden: true,
      preview: "previewPath",
      parent: ["Web Site", "Section", "Menu", "Image"]
    },
    {
      key: "site",
      name: "url",
      title: "Site",
      type: "url",
      hidden: true,
      parent: ["Social Site"]
    },
    {
      key: "font",
      name: "url",
      title: "Font Url",
      type: "url",
      hidden: true,
      parent: ["Web Site"]
    },
    {
      key: "font",
      name: "name",
      title: "Font Name",
      type: "string",
      hidden: true,
      parent: ["Web Site"]
    },
    {
      key: "reference",
      name: "_id",
      title: "Refers To",
      type: "thing",
      hidden: true,
      parent: ["Reference"]
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
    let archetypes = this.archetypes.filter(archetype => archetype.parent.find(parent => parent === thing.type || parent === "*"));
    return archetypes;
  }

  getProperties(thing) {
    let properties = this.properties.filter(property => property.parent.find(parent => parent === thing.type || parent === "*"));
    return properties;
  }

  fixup(things, reset, parent = null) {
    let count = 0;
    things.forEach(thing => {
      // Fix up Order Index
      count++;
      if (!thing.order) {
        thing.order = { index: count };
      }
      else if (thing.order.index > 0) {
        count = thing.order.index;
      }
      else {
        thing.order.index = count;
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
          thing.view = this.viewService.getCurrentView().things[thing._id].view;
        }
      }
      // Image
      if (thing.type === "Image") {
        thing.view.showContent = true;
      }
      // Session
      if (!thing.session) {
        thing.session = {}
        thing.session.disabled = true;
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

    // return things;
  }
}