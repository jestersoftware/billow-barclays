import { Injectable } from '@angular/core';

@Injectable()
export class SchemaService {

  archetypes: any = [
    {
      key: "User",
      display: "User",
      editable: false,
      icon: "face",
      parent: ["Root"]
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
      parent: ["Organization", "Business"]
    },
    {
      key: "Department",
      display: "Department",
      icon: "supervisor_account",
      parent: ["Business"]
    },
    {
      key: "Product",
      display: "Product",
      icon: "attach_money",
      parent: ["Business", "Department"]
    },
    {
      key: "Menu",
      display: "Menu",
      icon: "restaurant_menu",
      displaytype: "table",
      parent: ["Department"]
    },
    {
      key: "Menu Item",
      display: "Menu Item",
      icon: "short_text",
      from: "Product",
      parent: ["Menu"]
    },
    {
      key: "Web Site",
      display: "Web Site",
      icon: "language",
      parent: ["Business"]
    },
    {
      key: "Facebook Site",
      display: "Facebook Site",
      icon: "share",
      parent: ["Business", "Department"]
    },
    {
      key: "Section",
      display: "Section",
      icon: "web",
      parent: ["Web Site", "Section"]
    }
  ]

  properties: any = [
    {
      key: "order",
      name: "index",
      title: "Order",
      type: "number",
      hidden: true,
      parent: ["*"]
    },
    {
      key: "price",
      name: "dollar",
      title: "Price",
      type: "currency",
      parent: ["Product", "Menu Item"]
    },
    {
      key: "category",
      name: "name",
      title: "Category",
      type: "string",
      parent: ["Product", "Menu Item"]
    },
    {
      key: "supplier",
      name: "name",
      title: "Supplier",
      type: "string",
      parent: ["Product", "Menu Item"]
    },
    {
      key: "logo",
      name: "path",
      title: "Logo",
      type: "image",
      preview: "previewPath",
      parent: ["Organization", "Business", "Web Site"]
    },
    {
      key: "background",
      name: "path",
      title: "Background",
      type: "image",
      preview: "previewPath",
      parent: ["Web Site", "Section"]
    },
    {
      key: "site",
      name: "url",
      title: "Site",
      type: "url",
      hidden: true,
      parent: ["Facebook Site"]
    },
    {
      key: "reference",
      name: "_id",
      title: "Refers To",
      type: "thing",
      hidden: true,
      parent: ["Section"]
    }
  ];

  getArchetype(thing) {
    let archetype;

    if(thing.type)
      archetype = this.archetypes.find(archetype => archetype.key === thing.type);

    if(!archetype)
      archetype = { key: "unknown", name: "unknown", icon: "help_outline" };

    return archetype;
  }

  getArchetypes(thing) {
    let archetypes = this.archetypes.filter(archetype => archetype.parent.find(parent => parent === thing.type));
    return archetypes;
  }

  getProperties(thing) {
    let properties = this.properties.filter(property => property.parent.find(parent => parent === thing.type || parent === "*"));
    return properties;
  }

  fixup(things) {
    things.forEach(thing => {
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

      if(thing['session']) delete thing['session'];
    });

    return things;
  }
}