var mongoose = require( 'mongoose' ); 
var assert = require('assert');
var mockery = require('mockery');
var _fs = require('fs');

var fsMock = {
    statSync: function (path) { return {size:1000000.0};},
    unlink: function(){return ;},
    createReadStream: function(){return 'stream';},
    readdirSync: function(p){return _fs.readdirSync(p);}

};

var imageSizeMock = function(test){return {width:200,height:300};};

var s3fsMock = function (){
  this.create = function(){};
  this.writeFile = function(key,stream,param,fn) { fn();},
  this.listContents = function(dd,e,fn) { fn(null,[{Key:'kath.jpg'},{Key:'geoffreys-v1.png'},{Key:'geoffreys-first-v1.png'},{Key:'geoffreys-v7.png'}]);}
}

var indexMock = {
    S3_BUCKET:'none',
    S3_ACCESS_KEY_ID:'none',
    S3_SECRET_ACCESS_KEY:'none',
    cdnBase:'crazy'
};

var uploaderService ;

describe('Upload Service Test', function() {
  describe('Public Method', function () {
    beforeEach(function() {

      mockery.registerMock('image-size', imageSizeMock);
      mockery.registerMock('../config/index.js', indexMock);
      mockery.registerMock('s3fs', s3fsMock);
      
      mockery.registerMock('fs', fsMock);

      mockery.enable({
          warnOnReplace: false,
          warnOnUnregistered: false
      });
    });
    afterEach(function() {
      mockery.disable();
    });

    it('should test key is correct and return correct response', function (done) {

      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({originalname:'geoffreys.jpg'},{appId:'333222211145555',maxSize:100000,uploadType:'resource'},function(resp){
         assert.equal(resp.status,'ok');
         assert.equal(resp.response,'Uploaded.');
         assert.equal(resp.data,'crazy/instaadmin-local-333222211145555/resource/geoffreys.jpg');
         done();
      });
    });

    it('should test upload gives failure if file size is incorrect', function (done) {
      mockery.disable();

      mockery.enable({
          warnOnReplace: false,
          warnOnUnregistered: false,
      });
      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({},{maxSize:0.5,uploadType:'resource'},function(resp){
         assert.equal(resp.status,'err');
         assert.equal(resp.response,'Size should be less than 0.5 KB.');
         done();
      });
    });

    it('should test versioning is giving correct default', function (done) {

      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({originalname:'geoffreys-default.jpg'},{appId:'333222211145555',maxSize:100000,uploadType:'resource',versioning:'true'},function(resp){
         assert.equal(resp.status,'ok');
         assert.equal(resp.response,'Uploaded.');
         assert.equal(resp.data,'crazy/instaadmin-local-333222211145555/resource/geoffreys-default-v1.jpg');
         done();
      });
    });

    it('should test versioning is giving correct increment', function (done) {

      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({originalname:'geoffreys-first.png'},{appId:'333222211145555',maxSize:100000,uploadType:'resource',versioning:'true'},function(resp){
         assert.equal(resp.status,'ok');
         assert.equal(resp.response,'Uploaded.');
         assert.equal(resp.data,'crazy/instaadmin-local-333222211145555/resource/geoffreys-first-v2.png');
         done();
      });
    });

    it('should test versioning is giving correct increment 2', function (done) {

      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({originalname:'geoffreys.png'},{appId:'333222211145555',maxSize:100000,uploadType:'resource',versioning:'true'},function(resp){
         assert.equal(resp.status,'ok');
         assert.equal(resp.response,'Uploaded.');
         assert.equal(resp.data,'crazy/instaadmin-local-333222211145555/resource/geoffreys-v8.png');
         done();
      });
    });

    it('should test Image component Validation 1', function (done) {

      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({originalname:'geoffreys.png',mimetype:'image/jpeg'},{appId:'333222211145555',maxSize:100000,uploadType:'image',versioning:'true',allowed:['jpeg','png','bmp']},function(resp){
         assert.equal(resp.status,'ok');
         assert.equal(resp.response,'Uploaded.');
         assert.equal(resp.data,'crazy/instaadmin-local-333222211145555/image/geoffreys-v8.png');
         done();
      });
    });

    it('should test Image component Validation 2', function (done) {

      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({originalname:'geoffreys.png',mimetype:'image/jpeg'},{appId:'333222211145555',maxSize:100000,uploadType:'image',versioning:'true',allowed:['jpeg','png','bmp'],maxWidth:100,maxWidth:100},function(resp){
         assert.equal(resp.status,'err');
         assert.equal(resp.response,'Invalid dimesions. Image should be no greater than 200px by 300px.');
         done();
      });
    });

    it('should test Image component Validation 3', function (done) {

      uploaderService = require('../models/uploaderService.js');

      uploaderService.upload({originalname:'geoffreys.png',mimetype:'image/jpeg'},{appId:'333222211145555',maxSize:100000,uploadType:'image',versioning:'true',allowed:['jpeg','png','bmp'],maxWidth:600,maxWidth:400},function(resp){
         assert.equal(resp.status,'ok');
         assert.equal(resp.response,'Uploaded.');
         done();
      });
    });
  });
});