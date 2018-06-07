# Insta Admin

Insta-Admin is a CMS used to build out and edit a single json data endpoints to be consumed by other applications. It is opinionated and built for a single purpose.


# General Overview

Insta-Admin is an application used primarily by a developer that needs a concrete json data structure for their consuming app, as well as editors that will edit the content of the data. 
  
Developers:
  - Create json data structure customized for their application.
  - Auto generates correct field/data types for the editors Admin
  - Create hooks for publishing actions
  - Add/remove users to edit structure and content of data
  - Lock down structure and content to prevent further edits

Editors:
  - Edit data fields without constant blocked workflows from developer.
  - Input validation to prevent incorrect data entries.

### Stack
 
Insta-admin uses a number of open source projects and one paid theme to work properly:

* [Ace Editor] - awesome web-based text editor
* [React](https://reactjs.org/) - A javascript library for building user interfaces
* [React-Toolbox](http://react-toolbox.io/) - Bootstrap react with Material Design
* [Javascript Infovis Toolkit](https://philogb.github.io/jit/) - Awesome data visualization tool for data tree structures
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [Mongoose](http://mongoosejs.com/) - mongodb javascript orm for node

### Installation

Insta-Admin requires [Node.js](https://nodejs.org/) 7.10 to run.

Inta-Admin requires mongodb to be accessible through connections string
mongodb://127.0.0.1/<dbname>
[You can install it for mac using homebrew](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

Install the dependencies and devDependencies and start the server.

```sh
## build server side 
npm install 
cp config/sampleEnvVar.json config/local.json
cp config/sampleEnvVar.json config/production.json
# Edit local.json and production.json files
# Use your own credentials for AWS SES transport, S3
# Use your own mongo connection string
# Use your own google auth credentials
# Add your own default users to the list

chmod -R 777 storage

## build client side minified code with webpack
cd public/admin2
npm install
npm run build

# Seeds default users
node seeder.js
# Set debug info, sets environment to use correct config and creds, set application port, starts app
set DEBUG=instaadmin:* && NODE_ENV=local && NODE_PORT=4000 && node bin/www

#or to seed and start server 
npm start 

# add to /etc/hosts
127.0.0.1   http://instaadmin.local

#browser http://instaadmin.local:4000
#if you want to switch the port change file bin/www
```

## Development

### Backend modules and features
Most of the application features are plug and play. Coding is revolved around services and models dealing with accessing and maniuplating the data schema as well as routing to the resource. 

**Models folder** contain all the data structures for a ***resource*** [models/resources/resource.js]. 
The main data structure is a ***resource*** mongoose object that has three types ['app'|'template'|'componenet'].
* App - resource that is created for consuming use. User access and public endpoint is bound to this resource.
* Template - resource that has a full data schema that can be converted to an App. Templates have no endpoints or users bound to it.
* Component - resource that has a sub tree data structure that can be duplicated to an existing App or templates data structure.

The ***resource*** object, besides basic meta and config data, is primariy made of **elements** [models/elements/element-*.js] that define how the data is structured and the type of data it contains

The raw data structure of the ***resource*** object is a n-tree structure. Most **elements** are leaf nodes with exception to the **componenet-element** [models/element/element-componenet.js]. The **componenet-element** is a branch node that can have n numbers of elements and or componenet-element children. 

Non component elements are usually custom data types, anything from integers and strings to text and urls.

* element-component - branching node that contains n child elements
* element-[html|number|date|url|resource|image|etc..] - leaf nodes that are used to store data, they are custom and can have default data, validation functions and custom front end inputs.

**Service folder** contains modules that are used to access and maniuplate resource data, as well as other enhancing features.
* resourceService.js - main module for crud operations on a single resource
* temporary-resource-module.js - service for formating the raw resource data structure for client consuming json
* resourceAclService.js - module for adding resource permissions to roles
* webSocketService.js - creates websocket and handles broadcast and subscription methods for data
* emailService.js - email transport
* hookService.js - request a custom endpoint and validates the response
* elementFormService.js, componennetService.js, templateService.js - get component,template,element, specific data for specific use TODO needs to be consolidated

For current Api versions and endpoints please read:
* http://instaadmin.local/docs/api-docs
* built with swagger-jsdoc

For funciton usage plese read:
* http://instaadmin.local/docs/app-docs
* built with gulp-jscs and google style guide

Authentication uses passport.js Configuration is in config/passport.js

### Frontend Dashboard 
We are on react!
```
cd public/admin2
# install dependencies and run a webpack build
npm install
npm run build
```
The folder/app structure should be self explanatory. This can be refactored more!

TODO:
Ui/ux needs work for the editors view - ...

## License

Apache 2.0 License

Copyright 2018 Complex Media Networks

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
