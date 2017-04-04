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
      defaultFormat: "format",
      parent: ["Business", "Department", "Reference"]
    },
    {
      _id: "archetype8",
      key: "Product",
      display: "Product",
      icon: "attach_money",
      displaytype: "table",
      parent: ["Collection", /*"Menu",*/ "Section", "Reference"]
    }/*,
    {
      key: "Menu",
      display: "Menu",
      icon: "restaurant_menu",
      defaultFormat: "format",
      parent: ["Collection", "Reference"]
    }*/,
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
      parent: ["User", "Business", "Department", "Collection"]
    },
    {
      _id: "archetype11",
      key: "Section",
      display: "Section",
      icon: "web",
      parent: ["Web Site", "Collection", "Section", /*"Menu",*/ "Reference"]
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
      parent: ["Web Site", "Section", /*"Menu",*/ "Image"]
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