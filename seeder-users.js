var User = require('./models/user.js');
var mongoose = require( 'mongoose' ); 
var config = require('./config/index.js');

var Person = mongoose.model('acl_resources', new mongoose.Schema());

console.log('Seeder starting.');
var userset = config.defaultUsers;
var useridstrings = [];
var i = 0;

//create default users from list above 
var addUserfn = function(fin){
	console.log('	Adding ' + userset[i].email);

	User.findOne({ 'local.email' : userset[i].email }, function(err, user) {
		var name = 'defaultfakenamekey';
		if(user){
			name = (user._id.toString() + '-' +  user.local.email).replace(/\./g,'%2E').replace("@",'%40');
			useridstrings.push(name);
		}
		Person.collection.remove({_bucketname:'users',key:name}, function(err,pers) {
		    if(err){
		    	console.log(err);
		    }
		    if(user){
				user.remove(function(err,cat){
					var newUser = new User();
					newUser.local.email    = userset[i].email;
					newUser.local.password = newUser.generateHash(userset[i].password);
					// save the user
					newUser.save(function(err) {
					    if (err)
					        console.log(err);
					    i++;
					    if(typeof userset[i] != 'undefined'){
					    	addUserfn(fin);
						}else{
							if(typeof fin == 'undefined'){
								lastfn();
							}else{
								removeRoleUsers(fin);
							}
							
						}
					});
				});
			} else {
				var newUser = new User();
				newUser.local.email    = userset[i].email;
				newUser.local.password = newUser.generateHash(userset[i].password);
				// save the user
				newUser.save(function(err) {
				    if (err)
				        console.log(err);
				    i++;
				    if(typeof userset[i] != 'undefined'){
				    	addUserfn(fin);
					}else{
						if(typeof fin == 'undefined'){
							lastfn();
						}else{
							removeRoleUsers(fin);
						}
						
					}
				});
			}
			// Person.collection.findOne({_bucketname:'roles',key:name})
			
		});
		
	});
};

var lastfn = function(){
	console.log('Seeder Ending.');
	process.exit();
};

//cleans up acl_resource default users 
var removeRoleUsers = function(fin){
	var build = {};
	useridstrings.forEach(function(name){
		build[name] = '';
	});

	Person.collection.update({}, {'$unset':build},{multi:true} , function(err,docs) {
		addBaseRoles(fin)
	});
}

// gives any users that exist a default role that exist in acl_resource if they have none
var addBaseRoles = function(fin){
	Person.collection.update({'$and': [{_bucketname:'users' },{owner:{'$ne':true}},{admin:{'$ne':true}},{user:{'$ne':true}}]},{'$set':{user:true}},{multi:true},function(err,resp){
		fin();
	});
}

module.exports = {
	addUserfn:function(fn){
		console.log('Seeding Users');
		addUserfn(fn);
	}
}
