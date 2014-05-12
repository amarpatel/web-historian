var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');
var cron = require('cron');


exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.serveAssets = function (res, url, callback) {
  fs.readFile(path.join(exports.paths.archivedSites, url), function (err, data) {
    res.writeHead(200);
    res.end(data);
  });
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function (err, sites) {
    if (callback) {
      callback(sites.toString().split('\n'));
    }
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function (sites) {
    var found = false;
    for (var i=0;i<sites.length;i++) {
      if (sites[i] === url) { found = true; }
    }
    callback(found);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url + '\n', function (err) {
    if (err) {console.log(err)};
    callback();
  });
};

exports.isURLArchived = function(url, callback){
  fs.exists(path.join(exports.paths.archivedSites, url), function (exists) {
    callback(exists);
  });
};

exports.getURL = function (req, callback) {
  var receivedData = '';
  req.on('data', function (chunk) {
    receivedData += chunk;
  });
  req.on('end', function () {
    receivedData = receivedData.substr(4,receivedData.length)
    callback(receivedData);
  });
};

exports.downloadUrls = function(){
  archive.readListOfUrls(function(sitesArray){
    _.each(sitesArray, function (val, i, col) {
      archive.isURLArchived(val, function (exists) {
        if (!exists) {
          httpRequest.get({
            url: val, 
            progress: function (current, total) {
              console.log('downloaded %d bytes', current, total);
            },
          },
            path.join(archive.paths.archivedSites, val), function (err, res) {
              if (err) console.log(err);
            }
          );
        }
      });
    });
  });
};