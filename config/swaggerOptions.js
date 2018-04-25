var config = require('../config/index.js');

module.exports = {
  "swaggerDefinition": {
    "info": {
      "title": "Insta Admin Api", // Title (required)
      "version": "2.0.0", // Version (required)
      "description": "Swagger api specification for Insta Admin",
    },
    "host": config.url.replace("http://", ""),
    "basePath": "/api/v2",
    "swagger": "2.0",
    "definitions": {
      "unAuthorizedModel": {
        "description": "Not Authorized",
        "schema": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": ["ok","err"]
            },
            "response": {
              "type": "string",
              "description": "Reason for type of response"
            }
          }
        }
      },
      "standardResponseModel": {
        "description": "Standard response",
        "schema": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": ["ok","err"]
            },
            "response": {
              "type": "string",
              "description": "Reason for type of response"
            }
          }
        }
      },
      "resourseResponseModel": {
        "description": "Standard response",
        "schema": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": ["ok","err"]
            },
            "response": {
              "type": "string",
              "description": "Reason for type of response"
            },
            "data": {
              "$ref": "#/definitions/resourceModel"
            }
          }
        }
      },
      "resoursesResponseModel": {
        "description": "Standard response",
        "schema": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": ["ok","err"]
            },
            "response": {
              "type": "string",
              "description": "Reason for type of response"
            },
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/resourceModel"
              }
            }
          }
        }
      },
      "resourceModel": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "createdBy": {
            "type": "string"
          },
          "state": {
            "type": "integer"
          },
          "createdAt": {
            "type": "string"
          },
          "__t": {
            "type": "string",
            "enum": ["Template","App","Component"]
          },
          "delete": {
            "type": "boolean"
          },
          "appData": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/elementModel"
            }
          },
          "schemaLock": {
            "type": "boolean"
          },
          "dataLock": {
            "type": "boolean",
          },
          "tags": {
            "type": "string"
          },
          "url": {
            "type": "string",
          },
          "id": {
            "type": "string"
          },
          "resourceRole": {
            "type": "string"
          },
        }
      },
      "elementModel": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "children": {
            "type": "array",
            "description": "References elementModel"
          },
          "fieldName": {
            "type": "string"
          },
          "__t": {
            "type": "string",
            "enum": ["Html","Text","Description","Image","etc..."]
          },
        }
      }
    },
    "responses": {},
    "parameters": {},
    "securityDefinitions": {
      "basicAuth": {
        "type": "basic",
        "description": "HTTP Basic Authentication."
      }
    }
  },
  "apis": ["./routes/*.js"], // Path to the API docs
};
