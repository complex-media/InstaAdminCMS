//loader for all element structures
var normalizedPath = require("path").join(__dirname);
var Elements = {};
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  if(file == 'element.js'|| file=='index.js')
    return;
  Elements[file.replace(/element-/, '').replace(/\.js/, '')] = require(normalizedPath+"/"+file);
});

module.exports = Elements;