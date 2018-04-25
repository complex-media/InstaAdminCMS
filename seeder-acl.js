var acl = require('acl');
var mongoose = require('mongoose');
var Users = require('./models/user.js')
var Resources = require('./models/resources/resource.js');
var ResourceAclService = require('./services/resourceAclService.js');
var Q = require('q');
var config = require('./config/index.js');

var users = [];
var acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_',true));

//Global Permisions - Non Resource Specific
var permissionsData = [
    {
        roles:['admin'],
        allows:[
            {resources:'*', permissions:'*'},
            {resources:'/api/instaapp/v1/components', permissions:['get']},
            {resources:'/api/instaapp/v1/templates', permissions:['get']},
        ]
    },
    {
        roles:['owner'],
        allows:[
            {resources:'/api/instaapp/v1/applications', permissions:['post']},
            {resources:'/auth/invite', permissions:'post'}
        ]
    },
    {
        roles:['user'],
        allows:[
            {resources:'/api/instaapp/getLibraryComponents', permissions:['get']},
            {resources:'/api/instaapp/getFormElements', permissions:['get']},
            {resources:'/api/instaapp/getTemplates', permissions:['get']},
            {resources:'/api/instaapp/v1/applications', permissions:['get']},
            {resources:'/api/instaapp/v1/feedback', permissions:['get','put','delete','options']},
            {resources:'/dashboard', permissions:'get'}
        ]
    }
];

function finish(){
    console.log('Finish building.');
    process.exit();
}

// update permissions for general resource roles 
function rebuildResourcePermissions(){
    console.log('Updating base resource role permissions.');
    Resources.find().lean().exec(function(err, resors){
        var lim = resors.length;
        if(lim == 0){
            return finish();
        }
        resors.forEach(function(resor,index){
            ResourceAclService.addResourceRole(resor._id.toString(), acl,function(){
                if(index + 1 == lim){
                    buildNonRoledUsers();
                }
            })
        });
        
    });
}

// any user that has no role gets a base user role
function buildNonRoledUsers(){
    Users.find({ '$and':config.defaultUsers.map(function(user){
        return {'local.email':{'$ne':user.email}};
    })}).exec(function(err,users){
        var aclUsers = [];
        var userNeedRole = [];
        var mergeUsers = function(users) {
          aclUsers = aclUsers.concat(users.map(function(user) {
              return user.split(/-(.+)?/)[1];
            }));
        };

        Q.all([
          acl.roleUsers('admin'),
          acl.roleUsers('owner'),
          acl.roleUsers('user')
        ]).spread(function() {
          for (var i = 0; i < arguments.length; i++) {
            mergeUsers(arguments[i]);
          }
        }).fin(function() {

          users.forEach(function(u,i){
            var need = true;
            aclUsers.forEach(function(au,ai){
                if(u.local.email == au) {
                    need = false;
                }
            });

            if(need){
                userNeedRole.push(u);
            }
            
          });

        var ct = 0;
        if(userNeedRole.length == 0 ){
            finish();
        }
         userNeedRole.forEach(function(us){
            acl.addUserRoles(us._id.toString() + '-' + us.local.email,'user',function(err){
                ct++;
                if(err){
                    console.error(err);
                }

                if(ct >= userNeedRole.length){
                    finish();
                }
            });
         });
        });
    });
}

// rebuilds base role permissions and assignes them to default set of users
// existing created users by application should not be affected.
// this resets all permissions set to default users in this list
function buildNewPermissions(){
    console.log('... building new permisssions.');
   
    acl.allow(permissionsData,function(err){
        Users.find({ '$or': config.defaultUsers.map(function(user){
            return {'local.email':user.email};
        })}).exec(function(err,users){
    
            acl.addRoleParents( 'owner', 'user' )
            .then(function(){
                return acl.addRoleParents( 'admin', 'owner' )
            })
            .then(function(){
                var lim = users.length;
                var objDefUser = config.defaultUsers.reduce((obj,usr)=>{obj[usr.email] = usr.role; return obj},{});
                users = users.map(function(item){
                    var returning = item;
                    returning.id = item._id.toString();

                    if(typeof objDefUser[item.local.email] !== 'undefined') {
                        returning.role = objDefUser[item.local.email];
                    } else {
                        returning.role = 'user'
                    }
                    
                    return returning;
                }).forEach(function(item,index){
                    
                    acl.addUserRoles(item.id + '-' + item.local.email, item.role,function(){
                        if(index + 1 == lim){
                            rebuildResourcePermissions();
                        }
                    });
                });
            });
            
        }); 
    });
    
};

module.exports = {
    buildNewPermissions:function(){
        console.log('Seeding Acl');
        buildNewPermissions();
    }
}
