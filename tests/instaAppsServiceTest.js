var assert = require('assert');
var mongoose = require( 'mongoose' ); 
var resourceApp = require('../models/resources/resource-app.js');
var instApps = require('../models/resourceService.js')(resourceApp);
var componentService = require('../models/componentService.js');
var users = require('../models/user.js');
var db = require('./dbsetup.js');
// var fixtures = require('./fixtures.json');

describe('Resource Service Unit Test', function() {
  describe('Public Methods', function () {
    beforeEach(function() {
        db.fixtures(function(){});
    });
    afterEach(function() {
      db.drop(function(){});
    });

    it('should restructure component resource for library use', function (done) {
      var apps = componentService.get(null,function(components){
        assert.equal(typeof components.cat, 'object');
        assert.equal(typeof components.cat[0].appData, 'undefined');
        assert.equal(components.cat.length,1);
        assert.equal(components.cat[0].__t,'Component');
        assert.equal(components.cat[0].fieldName,'Test-Component');
        done();
      });
    });

    it('should get list of apps', function (done) {
      var apps = instApps.get(null,null,function(apps){
        assert.equal(apps.length,5);
        for (var i = apps.length - 1; i >= 0; i--) {
          assert.notEqual(typeof apps[i].title,'undefined');
          assert.notEqual(typeof apps[i].description,'undefined');
        };
        done();
      });
    });

    it('should get app by id', function (done){
      var apps = instApps.get('56cb47bc562ffd3f50095de6',false,function(apps){
        assert.equal(apps.title,"Update Element 1");
        assert.notEqual(typeof apps.appData,"undefined");
        assert.notEqual(typeof apps.id,"undefined");
        done();
      });
    });

    it('should create new app', function (done) {
      var apps = instApps.create({title:'I am new',description:"yes i am"},function(){
         mongoose.connection.collections['resources'].findOne({title:"I am new"},function(err,app){
          assert.equal(app.description,"yes i am");
          assert.equal(app.appData[0].__t,"Component");
          assert.equal(typeof app.appData[0].children[0],"undefined");
          assert.equal(app.appData[1].__t,"Text");
          done();
         });
      });
    });

    it('should update App Meta and user permissions', function (done) {
      var apps = instApps.create({title:'I am new',description:"yes i am"},function(){
        var con = mongoose.connection;

        users.findOne({_id:{ '$ne': null }},function(err,user){
        con.collections['resources'].findOne({title:"I am new"},function(err,app){
          
            instApps.updateMeta(app._id,{users:[user._id]},function(resp){
              assert.equal(resp.status,"ok");
              done();
            });
          });
        });
      });
    });

    it('should soft delete App so it will not be selected', function (done) {
      var apps = instApps.create({title:'I am new',description:"yes i am"},function(){
        var con = mongoose.connection;
        con.collections['resources'].findOne({title:"I am new"},function(err,app){
          instApps.delete(app._id,function(resp){
            assert.equal(resp.response,'App deleted.');
            instApps.get(app._id,false,function(respp){
              assert.equal(Object.keys(respp).length,0);
              done();
            });
          });
        });
      });
    });

    it('should add Element in app', function (done) {
        var elementStructure = [{name:"New name",fieldName:"newFieldname",__t:'Text'}];
        instApps.addElement(elementStructure,'56cb4770562ffd3f50095dd4','56cb4770562ffd3f50095dd2',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb4770562ffd3f50095dd4')},function(err,app){
            assert.equal(app.appData[0].children[0].name,"New name");
            assert.equal(app.appData[0].children[0].fieldName,"newFieldname");
            assert.equal(app.appData[0].children[0].__t,"Text");

            var elementCompStructure = [{name:"New nameC",fieldName:"newFieldnameC",__t:'Component'}];
            instApps.addElement(elementCompStructure,'56cb4770562ffd3f50095dd4','56cb4770562ffd3f50095dd2',function(){
                mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb4770562ffd3f50095dd4')},function(err,app){
                assert.equal(app.appData[0].children[1].name,"New nameC");
                assert.equal(app.appData[0].children[1].fieldName,"newFieldnameC");
                assert.equal(app.appData[0].children[1].__t,"Component");
                done();
               });
            });
           });
        });
    });

    it('should add Element(s) in app', function (done) {
        var elementStructure = [{
                    name:"New Compnent",
                    fieldName:"newComp",
                    __t:'Component',
                    children:[
                      {name:"New name",fieldName:"newFieldname",__t:'Text'},
                      {name:"New next component",fieldName:"nextcomponenet",__t:'Component',
                        children:[
                          {name:"Last name",fieldName:"lastnameField",__t:'Text'},
                        ]
                      }
                    ]
                  }];
        instApps.addElement(elementStructure,'56cb4770562ffd3f50095dd4','56cb4770562ffd3f50095dd2',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb4770562ffd3f50095dd4')},function(err,app){
            assert.equal(app.appData[0].children[0].name,"New Compnent");
            assert.equal(app.appData[0].children[0].children[0].name,"New name");
            assert.equal(app.appData[0].children[0].children[1].name,"New next component");
            assert.equal(app.appData[0].children[0].children[1].children[0].name,"Last name");
            done();
           });
        });
    });

    it('should remove Element in app', function (done) {
        instApps.removeElement('56cb47a6562ffd3f50095ddd','56cb488d562ffd3f50095df2',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47a6562ffd3f50095ddd')},function(err,app){
              assert.equal(app.appData[0].children[0].children[0].name,"Dont Remove");
              assert.equal(app.appData[0].children[0].children.length,1);
              done();
           });
        });
    });

    it('should remove Element(s) in app', function (done) {
        instApps.removeElement('56cb47a6562ffd3f50095ddd','56cb48d3562ffd3f50095df4',function(){
            instApps.removeElement('56cb47a6562ffd3f50095ddd','56cb486a562ffd3f50095df0',function(){
                instApps.removeElement('56cb47a6562ffd3f50095ddd','56cb4877562ffd3f50095df1',function(){
                  mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47a6562ffd3f50095ddd')},function(err,app){
                      assert.equal(app.appData[0].children.length,3);
                      
                      for (var i = app.appData[0].children.length - 1; i >= 0; i--) {
                        assert.equal(app.appData[0].children[i].name,"Dont Remove");
                      };
                      done();
                   })
                });
            });
        });
    });

    it('should update Elements in app', function (done) {
      instApps.updateElement('56cb47bc562ffd3f50095de6',{value:"changed",name:"changename",fieldName:"changefield",__t:"Text"},'56cb4955562ffd3f50095dfb',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562ffd3f50095de6')},function(err,app){
              assert.equal(app.appData[0].children[1].children[1].children[2].name,"changename");
              assert.equal(app.appData[0].children[1].children[1].children[2].value,"changed");
              assert.equal(app.appData[0].children[1].children[1].children[2].fieldName,"changefield");
              done();
           });
        });
    });

    it('should update a set of elements and reorder them under a componenet element',function(done) {
      resourceApp.findOne({_id:'56cb47bc562ffd3f50095de6'},function(err,resource){
        var updatingarray = resource.appData[0].children[1].children[1].children.reverse();
        updatingarray[0].value = 'catfacedoghead';
        var compId = resource.appData[0].children[1].children[1]._id;
        instApps.updateElementSet('56cb47bc562ffd3f50095de6',updatingarray,compId.toString(),function() {
          resourceApp.findOne({_id:'56cb47bc562ffd3f50095de6'},function(err,resource){
            var newArray = resource.appData[0].children[1].children[1].children;

            assert.equal(newArray[0].value,'catfacedoghead');
            assert.equal(newArray[1].value,'you got it');
            assert.equal(newArray[2].value,'original');
            done();
          });
        });
      });
    });

    it('should update a set of elements and reorder them under a the top level element(appData)',function(done) {
      resourceApp.findOne({_id:'56cb47bc562ffd3f50095de6'},function(err,resource){
        var updatingarray = resource.appData.reverse();

        var compId = '56cb47bc562ffd3f50095de6';
        instApps.updateElementSet('56cb47bc562ffd3f50095de6',updatingarray,compId.toString(),function() {
          resourceApp.findOne({_id:'56cb47bc562ffd3f50095de6'},function(err,resource){
            var newArray = resource.appData;


            assert.equal(newArray[0].value,'I am a base title');
            done();
          });
        });
      });
    });
    
    it('should update metas in app', function (done) {
        instApps.updateMeta('56cb47bc562ffd3f50095de6',{title:"catt",description:"dog",bug:"eat",children:"asdf",blueprints:"asdf"},function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562ffd3f50095de6')},function(err,app){
              assert.equal(app.title,"catt");
              assert.equal(app.description,"dog");
              assert.equal(typeof app.bug, 'undefined');
              assert.notEqual(app.appData , 'asdf');
              assert.notEqual(app.blueprints , 'asdf');
              assert.equal(app.appData[0].name ,'Base Component');
              done();
           });
        });
    });

    it('should delete Elements in app', function (done) {
        instApps.delete('56cb47bc562ffd3f50095de6',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562ffd3f50095de6')},function(err,app){
              assert.equal(app.delete,true);
              assert.equal(app.title,"Update Element 1");
              
              done();
           });
        });
    });

    it('should update Element top structure in app', function (done) {
      instApps.updateElement('56cb47bc562ffd3f50095de6',{name:"changedBaseName",fieldName:"changeBaseField",__t:"text"},'56cb47bc562ffd3f50095de4',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562ffd3f50095de6')},function(err,app){
              assert.equal(app.appData[0].name,"changedBaseName");
              assert.equal(app.appData[0].value,null);
              assert.equal(app.appData[0].fieldName,"changeBaseField");
              assert.equal(app.appData[0].children.length,2);
              done();
           });
        });
    });

    it('should duplicate one Element structure to component element\'s children', function (done) {
      instApps.copyElementTo('56cb47bc562ffd3f50095de6','56cb47bc562ffd3f50095de5','56cb493f562ffd3f50095df8',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562ffd3f50095de6')},function(err,app){
              assert.equal(app.appData[0].children[1].children[1].children[4].value,"I am a base title");
              assert.equal(app.appData[0].children[1].children[1].children[4].fieldName,"baseTitle");
              assert.equal(app.appData[0].children[1].children[1].children[4].__t,"Text");
              assert.equal(app.appData[0].children[1].children[1].children.length,5);
              done();
           });
        });
    });

    it('should duplicate one Component structure to component element\'s children', function (done) {
      instApps.copyElementTo('56cb47bc562ffd3f50095de6','56cb493f562ffd3f50095df8','56cb491e562ffd3f50095df6',function(){
            mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562ffd3f50095de6')},function(err,app){
              assert.equal(app.appData[0].children[1].children.length,3);
              assert.equal(app.appData[0].children[1].children[1].children.length,4);
              assert.equal(app.appData[0].children[1].children[2].children.name,app.appData[0].children[1].children[1].children.name);
              assert.equal(app.appData[0].children[1].children[2].children.fieldName,app.appData[0].children[1].children[1].children.fieldName);
              done();
           });
        });
    });

    it('should add a component list element', function (done) {
      instApps.addToList('56cb47bc562fdd3f5e0d5de3','56cb491e562ffd3f50195df6',1,function(err){
          mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562fdd3f5e0d5de3')},function(err,app){
             assert.equal(app.appData[0].children[2].children.length,3);
             assert.equal(app.appData[0].children[2].children[2].name,'List Test');
          done();
         });
      });
    });

    it('should not add a component list element', function (done) {
      instApps.addToList('56cb47bc562fdd3f5e0d5de3','56cb491e562ffd3f50195df6',1,function(err){
        instApps.addToList('56cb47bc562fdd3f5e0d5de3','56cb491e562ffd3f50195df6',1,function(err2){
          assert.equal(err2.response,'Max number of elements reached.');
          done();
         });
      });
    });

    it('should remove a component from a list element', function (done) {
      instApps.removeFromList('56cb47bc562fdd3f5e0d5de3','56cb491e562ffd3f50195df6',1,function(err){
          mongoose.connection.collections['resources'].findOne({_id:mongoose.Types.ObjectId('56cb47bc562fdd3f5e0d5de3')},function(err,app){
            assert.equal(app.appData[0].children[2].children.length,1);
            done();
         });
      });
    });

    it('should remove a component from a list element', function (done) {
      instApps.removeFromList('56cb47bc562fdd3f5e0d5de3','56cb493f562ffd3f50095df8',1,function(err){
         assert.equal(err.response,'Not a valid list.');
          done();
      });
    });
  });
});