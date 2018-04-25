var mongoose = require( 'mongoose' ); 

module.exports = {
  "collections": {
    "resources": [
      {
        "_id": mongoose.Types.ObjectId("56cb4770562ffd3f50095dd4"),
        "title": "Add New Element 1",
        "description": "Add New Element 1 Description",
        "appData": [
          {
            "name": "Base Component",
            "fieldName": "baseComponent",
            "__t": "Component",
            "createdAt": new Date(1456162672969),
            "children": [

            ],
            "_id": mongoose.Types.ObjectId("56cb4770562ffd3f50095dd2")
          },
          {
            "name": "Title",
            "fieldName": "baseTitle",
            "value": "I am a base title",
            "__t": "Text",
            "createdAt": new Date(1456162672970),
            "_id": mongoose.Types.ObjectId("56cb4770562ffd3f50095dd3")
          }
        ],
        "__v": 0,
        "__t":"App"
      },
      {
        "_id": mongoose.Types.ObjectId("56cb47a6562ffd3f50095ddd"),
        "title": "Remove Element 1",
        "description": "Remove Element 1 Description",
        "appData": [
          {
            "name": "Base Component",
            "fieldName": "baseComponent",
            "__t": "Component",
            "createdAt": new Date(1456162726113),
            "children": [
              {
                "_id": mongoose.Types.ObjectId("56cb482d562ffd3f50095ded"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("56cb488d562ffd3f50095df2"),
                    "createdAt": new Date(1456162957678),
                    "__t": "Text",
                    "value": "remove",
                    "name": "Remove",
                    "fieldName": "Remove"
                  },
                  {
                    "_id": mongoose.Types.ObjectId("56cb48a0562ffd3f50095df3"),
                    "children": [

                    ],
                    "createdAt": new Date(1456162976870),
                    "__t": "Component",
                    "name": "Dont Remove",
                    "fieldName": "Dont Remove"
                  }
                ],
                "createdAt": new Date(1456162861622),
                "__t": "Component",
                "name": "Dont Remove",
                "fieldName": "dontremove"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb484c562ffd3f50095dee"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("56cb48d3562ffd3f50095df4"),
                    "createdAt": new Date(1456163027103),
                    "__t": "Text",
                    "value": "remove",
                    "name": "Remove",
                    "fieldName": "Remove"
                  }
                ],
                "createdAt": new Date(1456162892189),
                "__t": "Component",
                "name": "Dont Remove",
                "fieldName": "dontremove"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb4858562ffd3f50095def"),
                "createdAt": new Date(1456162904658),
                "__t": "Text",
                "value": "dont remove",
                "name": "Dont Remove",
                "fieldName": "dontremove"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb486a562ffd3f50095df0"),
                "children": [

                ],
                "createdAt": new Date(1456162922190),
                "__t": "Component",
                "name": "Remove",
                "fieldName": "Remove"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb4877562ffd3f50095df1"),
                "createdAt": new Date(1456162935558),
                "__t": "Text",
                "value": "remove",
                "name": "Remove",
                "fieldName": "Remove"
              }
            ],
            "_id": mongoose.Types.ObjectId("56cb47a6562ffd3f50095ddb")
          },
          {
            "name": "Title",
            "fieldName": "baseTitle",
            "value": "I am a base title",
            "__t": "Text",
            "createdAt": new Date(1456162726113),
            "_id": mongoose.Types.ObjectId("56cb47a6562ffd3f50095ddc")
          }
        ],
        "__v": 0,
        "__t":"App"
      },
      {
        "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f50095de6"),
        "title": "Update Element 1",
        "description": "Update Element 1 Description",
        "slug":"testing-elements-by-path",
        "appData": [
          {
            "name": "Base Component",
            "fieldName": "baseComponent",
            "__t": "Component",
            "slug":"main-path-1",
            "createdAt": new Date(1456162748566),
            "children": [
              {
                "_id": mongoose.Types.ObjectId("56cb4917562ffd3f50095df5"),
                "createdAt": new Date(1456163095468),
                "__t": "Text",
                "value": "original",
                "name": "Original",
                "fieldName": "Original"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb491e562ffd3f50095df6"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("56cb4939562ffd3f50095df7"),
                    "createdAt": new Date(1456163129438),
                    "__t": "Text",
                    "slug":"main-path-3-alt",
                    "value": "original alt",
                    "name": "Original",
                    "fieldName": "Original"
                  },
                  {
                    "_id": mongoose.Types.ObjectId("56cb493f562ffd3f50095df8"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("56cb4947562ffd3f50095df9"),
                        "createdAt": new Date(1456163143834),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb494f562ffd3f50095dfa"),
                        "createdAt": new Date(1456163151668),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb4955562ffd3f50095dfb"),
                        "createdAt": new Date(1456163157803),
                        "__t": "Text",
                        "value": "you got it",
                        "slug":"main-path-4",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb495b562ffd3f50095dfc"),
                        "createdAt": new Date(1456163163044),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      }
                    ],
                    "createdAt": new Date(1456163135619),
                    "slug":"main-path-3",
                    "__t": "Component",
                    "name": "Original",
                    "fieldName": "Original"
                  }
                ],
                "slug":"main-path-2",
                "createdAt": new Date(1456163102868),
                "__t": "Component",
                "name": "Origin",
                "fieldName": "Original"
              }
            ],
            "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f50095de4")
          },
          {
            "name": "Title",
            "fieldName": "baseTitle",
            "value": "I am a base title",
            "slug":"alt-path",
            "__t": "Text",
            "createdAt": new Date(1456162748566),
            "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f50095de5")
          }
        ],
        "__v": 0,
        "__t":"App"
      },
      {
        "_id": mongoose.Types.ObjectId("56cb47bc562fdd3f5e0d5de3"),
        "title": "Test Component",
        "description": "Update Element 1 Description",
        "slug":"testing-elements-by-path",
        "tags":['cat'],
        "state":1,
        "appData": [
          {
            "name": "Base Component",
            "fieldName": "baseComponent",
            "__t": "Component",
            "slug":"main-path-1",
            "createdAt": new Date(1456162748566),
            "children": [
              {
                "_id": mongoose.Types.ObjectId("56cb4917562ffd3f50095df5"),
                "createdAt": new Date(1456163095468),
                "__t": "Text",
                "value": "original",
                "name": "Original",
                "fieldName": "Original"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb491e562ffd3f50095df6"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("56cb4939562ffd3f50095df7"),
                    "createdAt": new Date(1456163129438),
                    "__t": "Text",
                    "slug":"main-path-3-alt",
                    "value": "original alt",
                    "name": "Original",
                    "fieldName": "Original"
                  },
                  {
                    "_id": mongoose.Types.ObjectId("56cb493f562ffd3f50095df8"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("56cb4947562ffd3f50095df9"),
                        "createdAt": new Date(1456163143834),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb494f562ffd3f50095dfa"),
                        "createdAt": new Date(1456163151668),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb4955562ffd3f50095dfb"),
                        "createdAt": new Date(1456163157803),
                        "__t": "Text",
                        "value": "you got it",
                        "slug":"main-path-4",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb495b562ffd3f50095dfc"),
                        "createdAt": new Date(1456163163044),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      }
                    ],
                    "createdAt": new Date(1456163135619),
                    "slug":"main-path-3",
                    "__t": "Component",
                    "name": "Original",
                    "fieldName": "Original"
                  }
                ],
                "slug":"main-path-2",
                "createdAt": new Date(1456163102868),
                "__t": "Component",
                "name": "Origin",
                "fieldName": "Original"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb491e562ffd3f50195df6"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("56cb4939562ffd3f50095df7"),
                    "createdAt": new Date(1456163129438),
                    "__t": "Text",
                    "slug":"main-path-3-alt",
                    "value": "original alt",
                    "name": "Original",
                    "fieldName": "Original"
                  },
                  {
                    "_id": mongoose.Types.ObjectId("56cb493f562ffd3f50095df8"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("56cb4947562ffd3f50095df9"),
                        "createdAt": new Date(1456163143834),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb494f562ffd3f50095dfa"),
                        "createdAt": new Date(1456163151668),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb4955562ffd3f50095dfb"),
                        "createdAt": new Date(1456163157803),
                        "__t": "Text",
                        "value": "you got it",
                        "slug":"main-path-4",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb495b562ffd3f50095dfc"),
                        "createdAt": new Date(1456163163044),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      }
                    ],
                    "createdAt": new Date(1456163135619),
                    "slug":"main-path-3",
                    "__t": "Component",
                    "name": "List Test",
                    "fieldName": "Original"
                  }
                ],
                "slug":"main-path-2",
                "createdAt": new Date(1456163102868),
                "__t": "Component",
                "name": "Origin",
                "fieldName": "Original",
                "isList":true,
                "maxSize":3
              }
            ],
            "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f50095de4")
          },
          {
            "name": "Title",
            "fieldName": "baseTitle",
            "value": "I am a base title",
            "slug":"alt-path",
            "__t": "Text",
            "createdAt": new Date(1456162748566),
            "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f50095de5")
          }
        ],
        "__v": 0,
        "__t":"App"
      },
      {
        "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f5e0d5de3"),
        "title": "Test Component",
        "description": "Update Element 1 Description",
        "slug":"testing-elements-by-path",
        "tags":['cat'],
        "state":1,
        "appData": [
          {
            "name": "Base Component",
            "fieldName": "baseComponent",
            "__t": "Component",
            "slug":"main-path-1",
            "createdAt": new Date(1456162748566),
            "children": [
              {
                "_id": mongoose.Types.ObjectId("56cb4917562ffd3f50095df5"),
                "createdAt": new Date(1456163095468),
                "__t": "Text",
                "value": "original",
                "name": "Original",
                "fieldName": "Original"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb491e562ffd3f50095df6"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("56cb4939562ffd3f50095df7"),
                    "createdAt": new Date(1456163129438),
                    "__t": "Text",
                    "slug":"main-path-3-alt",
                    "value": "original alt",
                    "name": "Original",
                    "fieldName": "Original"
                  },
                  {
                    "_id": mongoose.Types.ObjectId("56cb493f562ffd3f50095df8"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("56cb4947562ffd3f50095df9"),
                        "createdAt": new Date(1456163143834),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb494f562ffd3f50095dfa"),
                        "createdAt": new Date(1456163151668),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb4955562ffd3f50095dfb"),
                        "createdAt": new Date(1456163157803),
                        "__t": "Text",
                        "value": "you got it",
                        "slug":"main-path-4",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb495b562ffd3f50095dfc"),
                        "createdAt": new Date(1456163163044),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      }
                    ],
                    "createdAt": new Date(1456163135619),
                    "slug":"main-path-3",
                    "__t": "Component",
                    "name": "Original",
                    "fieldName": "Original"
                  }
                ],
                "slug":"main-path-2",
                "createdAt": new Date(1456163102868),
                "__t": "Component",
                "name": "Origin",
                "fieldName": "Original"
              },
              {
                "_id": mongoose.Types.ObjectId("56cb491e562ffd3f50195df6"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("56cb4939562ffd3f50095df7"),
                    "createdAt": new Date(1456163129438),
                    "__t": "Text",
                    "slug":"main-path-3-alt",
                    "value": "original alt",
                    "name": "Original",
                    "fieldName": "Original"
                  },
                  {
                    "_id": mongoose.Types.ObjectId("56cb493f562ffd3f50095df8"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("56cb4947562ffd3f50095df9"),
                        "createdAt": new Date(1456163143834),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb494f562ffd3f50095dfa"),
                        "createdAt": new Date(1456163151668),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb4955562ffd3f50095dfb"),
                        "createdAt": new Date(1456163157803),
                        "__t": "Text",
                        "value": "you got it",
                        "slug":"main-path-4",
                        "name": "Original",
                        "fieldName": "Original"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("56cb495b562ffd3f50095dfc"),
                        "createdAt": new Date(1456163163044),
                        "__t": "Text",
                        "value": "original",
                        "name": "Original",
                        "fieldName": "Original"
                      }
                    ],
                    "createdAt": new Date(1456163135619),
                    "slug":"main-path-3",
                    "__t": "Component",
                    "name": "Original",
                    "fieldName": "Original"
                  }
                ],
                "slug":"main-path-2",
                "createdAt": new Date(1456163102868),
                "__t": "Component",
                "name": "Origin",
                "fieldName": "Original",
                "isList":true,
                "maxSize":3
              }
            ],
            "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f50095de4")
          },
          {
            "name": "Title",
            "fieldName": "baseTitle",
            "value": "I am a base title",
            "slug":"alt-path",
            "__t": "Text",
            "createdAt": new Date(1456162748566),
            "_id": mongoose.Types.ObjectId("56cb47bc562ffd3f50095de5")
          }
        ],
        "__v": 0,
        "__t":"Componentr"
      },
      {
        "_id": mongoose.Types.ObjectId("571791f3883f256a1fd3b8f7"),
        "title": "reys ap",
        "description": "app",
        "createdBy": mongoose.Types.ObjectId("5716a770539ef4411e936830"),
        "state": 0,
        "__t": "App",
        "delete": false,
        "appData": [
          {
            "name": "Base Component",
            "fieldName": "baseComponent",
            "slug": "base-component",
            "__t": "Component",
            "createdAt": new Date(1461162483303),
            "children": [
              {
                "_id": mongoose.Types.ObjectId("5717922a883f256a1fd3b907"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("5717922a883f256a1fd3b906"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("5717922a883f256a1fd3b904"),
                        "createdAt": new Date(1461162452155),
                        "__t": "Text",
                        "name": "Title",
                        "fieldName": "textFieldName",
                        "value": "I love frogs.",
                        "slug": "title"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("5717922a883f256a1fd3b905"),
                        "createdAt": new Date(1461162466662),
                        "__t": "Url",
                        "name": "Some Href",
                        "fieldName": "urlFieldName",
                        "value": "https://example.com",
                        "slug": "some-href"
                      }
                    ],
                    "createdAt": new Date(1461162408259),
                    "__t": "Component",
                    "slug": "links",
                    "fieldName": "baseComponent",
                    "name": "Links"
                  }
                ],
                "createdAt": new Date(1461162538691),
                "__t": "Component",
                "slug": "sidbar",
                "fieldName": "sidbar",
                "name": "sidbar"
              },
              {
                "_id": mongoose.Types.ObjectId("57179233883f256a1fd3b90b"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("57179233883f256a1fd3b90a"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("57179233883f256a1fd3b908"),
                        "createdAt": new Date(1461162452155),
                        "__t": "Text",
                        "slug": "title",
                        "value": "Some Text with frogs",
                        "fieldName": "textFieldName",
                        "name": "Title"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("57179233883f256a1fd3b909"),
                        "createdAt": new Date(1461162466662),
                        "__t": "Url",
                        "slug": "some-href",
                        "value": "https://example.com
    ",
                        "fieldName": "urlFieldName",
                        "name": "Some Href"
                      }
                    ],
                    "createdAt": new Date(1461162408259),
                    "__t": "Component",
                    "name": "Links",
                    "fieldName": "baseComponent",
                    "slug": "links"
                  }
                ],
                "createdAt": new Date(1461162538691),
                "__t": "Component",
                "name": "sidbar",
                "fieldName": "sidbar",
                "slug": "sidbar"
              },
              {
                "_id": mongoose.Types.ObjectId("57179234883f256a1fd3b90f"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("57179234883f256a1fd3b90e"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("57179234883f256a1fd3b90c"),
                        "createdAt": new Date(1461162452155),
                        "__t": "Text",
                        "slug": "title",
                        "value": "Some Text",
                        "fieldName": "textFieldName",
                        "name": "Title"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("57179234883f256a1fd3b90d"),
                        "createdAt": new Date(1461162466662),
                        "__t": "Url",
                        "slug": "some-href",
                        "value": "https://example.com
    ",
                        "fieldName": "urlFieldName",
                        "name": "Some Href"
                      }
                    ],
                    "createdAt": new Date(1461162408259),
                    "__t": "Component",
                    "name": "Links",
                    "fieldName": "baseComponent",
                    "slug": "links"
                  }
                ],
                "createdAt": new Date(1461162538691),
                "__t": "Component",
                "name": "sidbar",
                "fieldName": "sidbar",
                "slug": "sidbar"
              },
              {
                "_id": mongoose.Types.ObjectId("57179236883f256a1fd3b913"),
                "children": [
                  {
                    "_id": mongoose.Types.ObjectId("57179236883f256a1fd3b912"),
                    "children": [
                      {
                        "_id": mongoose.Types.ObjectId("57179236883f256a1fd3b910"),
                        "createdAt": new Date(1461162452155),
                        "__t": "Text",
                        "slug": "title",
                        "value": "Some Text",
                        "fieldName": "textFieldName",
                        "name": "Title"
                      },
                      {
                        "_id": mongoose.Types.ObjectId("57179236883f256a1fd3b911"),
                        "createdAt": new Date(1461162466662),
                        "__t": "Url",
                        "slug": "some-href",
                        "value": "https://example.com
    ",
                        "fieldName": "urlFieldName",
                        "name": "Some Href"
                      }
                    ],
                    "createdAt": new Date(1461162408259),
                    "__t": "Component",
                    "name": "Links",
                    "fieldName": "baseComponent",
                    "slug": "links"
                  }
                ],
                "createdAt": new Date(1461162538691),
                "__t": "Component",
                "name": "sidbar",
                "fieldName": "sidbar",
                "slug": "sidbar"
              }
            ],
            "_id": mongoose.Types.ObjectId("571791f3883f256a1fd3b8f5")
          },
          {
            "name": "Analytics",
            "fieldName": "analytics",
            "slug": "analytics",
            "__t": "Component",
            "createdAt": new Date(1461606508081),
            "children": [
              {
                "name": "Gogle",
                "fieldName": "Gogle",
                "slug": "gogle",
                "__t": "Component",
                "createdAt": new Date(1461606527734),
                "children": [
                  {
                    "name": "Evnets",
                    "fieldName": "baseComponent",
                    "slug": "evnets",
                    "__t": "Component",
                    "createdAt": new Date(1461165971730),
                    "children": [
                      {
                        "slug": "clickeventname",
                        "value": "clickevent",
                        "fieldName": "clickeventname",
                        "name": "clickeventname",
                        "__t": "Text",
                        "createdAt": new Date(1461166020313),
                        "_id": mongoose.Types.ObjectId("571e587f3faea4b12cbe8208")
                      }
                    ],
                    "_id": mongoose.Types.ObjectId("571e587f3faea4b12cbe8209")
                  },
                  {
                    "name": "UID",
                    "fieldName": "gogoleid",
                    "value": "21432qrwqer",
                    "slug": "uid",
                    "__t": "Text",
                    "createdAt": new Date(1461165971730),
                    "_id": mongoose.Types.ObjectId("571e587f3faea4b12cbe820a")
                  }
                ],
                "_id": mongoose.Types.ObjectId("571e587f3faea4b12cbe820b")
              }
            ],
            "_id": mongoose.Types.ObjectId("571e586c3faea4b12cbe8207")
          },
          {
            "name": "GoogleMap",
            "fieldName": "googleMap",
            "slug": "googlemap",
            "__t": "Component",
            "createdAt": new Date(1461606647054),
            "children": [
              {
                "name": "Locations",
                "fieldName": "locations",
                "slug": "locations",
                "__t": "Component",
                "createdAt": new Date(1461165971730),
                "children": [
                  {
                    "slug": "location-coordinates",
                    "value": "",
                    "fieldName": "coor",
                    "name": "Location Coordinates",
                    "__t": "Text",
                    "createdAt": new Date(1461166020313),
                    "_id": mongoose.Types.ObjectId("571e58f73faea4b12cbe820c")
                  },
                  {
                    "_id": mongoose.Types.ObjectId("571f72091e50c61b3090fce1"),
                    "createdAt": new Date(1461678601717),
                    "__t": "Text",
                    "slug": "locaiton-name",
                    "value": "newyork",
                    "fieldName": "lname",
                    "name": "Locaiton Name"
                  }
                ],
                "_id": mongoose.Types.ObjectId("571e58f73faea4b12cbe820d")
              }
            ],
            "_id": mongoose.Types.ObjectId("571e58f73faea4b12cbe820f")
          },
          {
            "name": "Title",
            "fieldName": "baseTitle",
            "value": "I am a base titleddddzxcsdf",
            "slug": "title",
            "__t": "Text",
            "createdAt": new Date(1461162483303),
            "_id": mongoose.Types.ObjectId("571791f3883f256a1fd3b8f6")
          }
        ],
        "tag": [

        ],
        "__v": 0,
        "schemaLock": false
      }
    ]
  }
};