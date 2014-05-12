// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
var httpRequest = require('http-request');
var _ = require('underscore');
var path = require('path');

var fetch = function () {
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

fetch();