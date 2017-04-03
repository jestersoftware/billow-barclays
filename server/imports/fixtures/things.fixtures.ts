import { Things } from './../../../both/collections/things.collection';

export function loadThings() {
  if (Things.find().cursor.count() === 0) {
    const things: any[] = [
      {
        entity: {
          "description": "Barclay's",
          "parent": "Root",
          "title": "Barclay's 1",
          "type": "Organization",
          "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
          "view": {
            "showChildren": true,
            "showContent": false
          }
        },
        children: [
          {
            entity: {
              "description": "Beer supplier for Barclay's",
              "title": "Beer Supplier",
              "type": "Business",
              "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
              "view": {
                "showChildren": true,
                "showContent": false
              }
            },
            children: [
            ]
          },
          {
            entity: {
              "description": "Barclay's restaurant CA",
              "title": "Barclay's Restaurant",
              "type": "Business",
              "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
              "view": {
                "format": false,
                "showChildren": true,
                "showContent": false
              }
            },
            children: [
              {
                entity: {
                  "description": "www.barclayspub.com",
                  "logo": {
                    "url": "http://www.barclayspub.com/v3/images/logo/barclays_gr_logo_header.png"
                  },
                  "price": {
                    "dollar": "5.00"
                  },
                  "title": "Barclay's Pub 123",
                  "type": "Web Site",
                  "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                  "view": {
                    "format": false,
                    "showChildren": true,
                    "showContent": false
                  }
                },
                children: [
                  {
                    entity: {
                      "description": "Opened in 1999 by local restaurateur Rick Webb, Zelo offers creative, contemporary Italian cuisine and unparalleled service. Our passion and commitment is to bring you handcrafted food, created with fresh, seasonal, organic and local ingredients. Every meal. Every day.",
                      "title": "Welcome",
                      "type": "Department",
                      "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                      "view": {
                        "showChildren": false,
                        "showContent": true
                      }
                    }
                  },
                  {
                    entity: {
                      "description": "It’s simple. The best ingredients make the best food.  We bring you a variety of the freshest in-season, local produce. We serve the highest grade, 100% natural, vegetarian-fed, hormone and antibiotic-free beef and poultry. Our fish is flown in daily, fresh from its source. Our pastries and desserts are handmade with certified organic dairy products. Our Wines are chosen by the most notable wineries. By the glass or bottle, salut.  We look forward to serving you.",
                      "title": "Menu",
                      "type": "Department",
                      "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                      "view": {
                        "showChildren": true,
                        "showContent": false
                      }
                    }
                  },
                  {
                    entity: {
                      "description": "Thank you for your interest in Zelo. Please feel free to email us any questions or comments and we’ll try to respond promptly, as your inquiry is very important to us.",
                      "title": "Contact Us",
                      "type": "Department",
                      "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                      "view": {
                        "showChildren": true,
                        "showContent": false
                      }
                    }
                  }
                ]
              },
              {
                entity: {
                  "title": "Beer Club",
                  "type": "Department",
                  "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                  "view": {
                    "showChildren": false,
                    "showContent": false
                  }
                }
              },
              {
                entity: {
                  "title": "Menus",
                  "type": "Department",
                  "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                  "view": {
                    "format": false,
                    "showChildren": true,
                    "showContent": false
                  }
                },
                children: [
                  {
                    entity: {
                      "description": "January 22, 2017",
                      "title": "Beer Menu",
                      "type": "Menu",
                      "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                      "view": {
                        "format": true,
                        "showChildren": true,
                        "showContent": false
                      }
                    },
                    children: [
                      {
                        entity: {
                          "description": "Modern Brewing",
                          "price": {
                            "dollar": "5.56"
                          },
                          "title": "Sunnyvale Ale 1",
                          "type": "Product",
                          "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                          "view": {
                            "showChildren": true,
                            "showContent": false
                          }
                        }
                      },
                      {
                        entity: {
                          "description": "Summit",
                          "title": "Extra Pale Ale",
                          "type": "Product",
                          "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                          "view": {
                            "format": true,
                            "showChildren": true,
                            "showContent": true
                          }
                        }
                      },
                      {
                        entity: {
                          "title": "Budweiser",
                          "type": "Product",
                          "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                          "view": {
                            "format": true,
                            "showChildren": true,
                            "showContent": false
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        entity: {
          "description": "The system",
          "parent": "Root",
          "title": "System",
          "type": "Organization",
          "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
          "view": {
            "format": false,
            "showChildren": true,
            "showContent": false
          }
        },
        children: [
          {
            entity: {
              "description": "System archetypes",
              "title": "Archetypes",
              "type": "Department",
              "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
              "view": {
                "showChildren": true,
                "showContent": false
              }
            }
          },
          {
            entity: {
              "description": "System users",
              "title": "Users",
              "type": "Department",
              "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
              "view": {
                "showChildren": true,
                "showContent": false
              }
            }
          },
          {
            entity: {
              "description": "System roles",
              "title": "Roles",
              "type": "Department",
              "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
              "view": {
                "format": true,
                "showChildren": true,
                "showContent": false
              }
            }
          }
        ]
      },
      {
        entity: {
          "parent": "Root",
          "title": "Facebook",
          "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
          "view": {
            "format": false,
            "showChildren": false,
            "showContent": false
          }
        },
        children: [
        ]
      },
      {
        entity: {
          "description": "Organization 4",
          "parent": "Root",
          "title": "Another Restaurant",
          "type": "Organization",
          "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
          "view": {
            "format": true,
            "showChildren": true,
            "showContent": false
          },
          children: [
            {
              entity: {
                "description": "Another Restaurant description",
                "title": "Another Restaurant Web Site",
                "type": "Web Site",
                "meta": { creator: "D6gr2ZMJtwv2jqpuD" },
                "view": {
                  "showChildren": false,
                  "showContent": true
                }
              }
            }
          ]
        }
      }
    ];

    insertThings(things, null);
  }
}

export function insertThings(things, id) {
  things.forEach((thing: any) => {
    if (id) thing.entity.parent = id;
    Things.insert(thing.entity).subscribe((id1) => {
      if(thing.children && thing.children.length > 0) {
        insertThings(thing.children, id1);
      }
    });
    // let newId = Things.insert(thing.entity);
    // if (thing.children && thing.children.length > 0) {
    //   insertThings(thing.children, newId);
    // }
  });
}