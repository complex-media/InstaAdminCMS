var assert = require('assert');
var Elements = require('../models/elements');
var moment = require('moment');

var elementForms = require('../models/elementFormService.js');


describe('Elements unit test', function() {
  describe('Structure Validation', function () {
    beforeEach(function() {
        // db.fixtures(function(){});
    });
    afterEach(function() {
      // db.drop(function(){});
    });

     it('should validate abstract element required fields.', function (done) {
      var urlElement = new Elements.url({slug:'test',fieldName:'test'});
      error = urlElement.validateSync();
      assert.equal(error.errors.name.message,'Element requires a name.');

      var componentElement = new Elements.component({name:'test',slug:'test'});
      error = componentElement.validateSync();
      assert.equal(error.errors.fieldName.message,'Element requires a fieldName.');

      var urlElement = new Elements.url({name:'test',fieldName:'test'});
      error = urlElement.validateSync();
      assert.equal(error.errors.slug.message,'Element requires a slug.');

      done();
    });

    it('should validate url elements.', function (done) {

      var urlElement = new Elements.url({value:'cat',name:'test',slug:'test',fieldName:'test'});
      error = urlElement.validateSync();
      assert.equal(error.errors.value.message,'cat is not a valid url!');

      urlElement = new Elements.url({value:'http://batmans.com',name:'test',slug:'test',fieldName:'test'});
      error = urlElement.validateSync();
      assert.equal(typeof error,'undefined');

      done();
    });

    it('should validate number elements.', function (done) {

      var numberElement = new Elements.number({value:'546',name:'test',slug:'test',fieldName:'test'});
      error = numberElement.validateSync();
      assert.equal(typeof error,'undefined');

      var numberElement = new Elements.number({value:'1.2546',name:'test',slug:'test',fieldName:'test'});
      error = numberElement.validateSync();
     assert.equal(typeof error,'undefined');

      var numberElement = new Elements.number({value:'jack is awsome',name:'test',slug:'test',fieldName:'test'});
      error = numberElement.validateSync();
      assert.equal(error.errors.value.message,'Cast to Number failed for value "jack is awsome" at path "value"');

      done();
    });


    it('should validate option elements.', function (done) {
      var optionElement = new Elements.option({value:'2',name:'test',slug:'test',fieldName:'test'});
      error = optionElement.validateSync();
      assert.equal(error.errors.options.message,'Options is a required array!');

      var optionElement = new Elements.option({value:'3',options:['cat','dog'],name:'test',slug:'test',fieldName:'test'});
      error = optionElement.validateSync();
      assert.equal(error.errors.value.message,'Value must be in options.');

      var optionElement = new Elements.option({value:'cat',options:['cat','dog'],name:'test',slug:'test',fieldName:'test'});
      error = optionElement.validateSync();

      assert.equal(typeof error,'undefined');

      done();
    });

    it('should accept date time.', function (done) {
      
    
      var datetimeElement = new Elements.datetime({value:'2016-03-21 19:26:46',slug:'test',fieldName:'test',name:'test'});
      error = datetimeElement.validateSync();
      assert.equal(typeof error,'undefined');

      var dateElement = new Elements.date({value:'2016-03-21',slug:'test',fieldName:'test',name:'test'});
      error = dateElement.validateSync();
      assert.equal(typeof error,'undefined');

      var datetimeElement = new Elements.datetime({value:'asfdlasln23enfjdsaknfd6',slug:'test',fieldName:'test',name:'test'});
      error = datetimeElement.validateSync();
      assert.equal(error.errors.value.message,'Cast to Date failed for value "asfdlasln23enfjdsaknfd6" at path "value"');

      done();
    });
    });

    describe('Element Service', function () {
      beforeEach(function() {
          // db.fixtures(function(){});
      });
      afterEach(function() {
        // db.drop(function(){});
      });

      it('should return element form location data', function (done) {
        elementForms.get({},function(data){
          
          assert.notEqual(data.component,'undefined');
          assert.notEqual(data.text ,'undefined');
          assert.notEqual(data.option , 'undefined');
          assert.notEqual(data.number , 'undefined');
          assert.notEqual(data.url , 'undefined');
          assert.notEqual(data.datetime , 'undefined');
          assert.notEqual(data.date , 'undefined');

          for(var element in data){

            if(element == 'component'){
              assert.equal(data[element].default.value,undefined);
            }else{
              assert.equal(data[element].default.value,undefined);
            }
            assert.equal(data[element].formPath,'/app/element-form/views/element-'+element+'.html');

          }
          done();


        });
    });

  });
});