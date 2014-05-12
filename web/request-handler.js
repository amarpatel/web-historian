/*
GET
  if / return index
  else
    if url is in sites.txt
      if url pathname exists in archive/sites
        yes: serve 
        no: loading.html
    else
      no: 404


POST
  if url is in sites.txt
    if url is in archive/sites
    yes: serve url
    no: serve loading.html
  else
    redirect to get
*/

var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  console.log('method:',req.method, 'url:', req.url)
  var url = req.url.substr(1,req.url.length);
// GET
  if (req.method === 'GET'){
//   if / return index
    if (req.url === '/') {
      url = 'index.html';
      fs.readFile(path.join(archive.paths.siteAssets, url), function (err, data) {
        res.writeHead(200);
        res.end(data.toString());  
      });
    } else if (req.url === '/styles.css' || req.url === '/public/styles.css') {
      url = '/styles.css';
      fs.readFile(path.join(archive.paths.siteAssets, url), function (err, data) {
        res.writeHead(200);
        res.end(data.toString());  
      });
    } else {
//   else
//     if url is in sites.txt
      archive.isUrlInList(url, function (found) {
        if (found) {
//       if url pathname exists in archive/sites
          archive.isURLArchived(url, function (exists) {
            if (exists) {
//         yes: serve
              fs.readFile(path.join(archive.paths.archivedSites, url), function (err, data) {
                res.writeHead(200);
                res.end(data);
              });
            } else {
//         no: loading.html
              fs.readFile(path.join(archive.paths.siteAssets, 'loading.html'), function (err, data) {
                res.writeHead(200);
                res.end(data);
              });              
            }
          });
//     else
        } else {
//       no: 404
          res.writeHead(404);
          res.end('Not Found');
        }
      });
      
    }
  }
// POST
  if (req.method === 'POST') {
    archive.getURL(req, function (receivedURL) {



  //   if url is in sites.txt
      archive.isUrlInList(receivedURL, function (found) {
        if (found) {
  //     if url is in archive/sites
          archive.isURLArchived(receivedURL, function (exists) {
            if (exists) {
  //     yes: serve url
              fs.readFile(path.join(archive.paths.archivedSites, receivedURL), function (err, data) {
                res.writeHead(200);
                res.end(data);
              });
            } else {
  //     no: serve loading.html
              fs.readFile(path.join(archive.paths.siteAssets, 'loading.html'), function (err, data) {
                res.writeHead(200);
                res.end(data);
              });
            }
          });
  //   else
        } else {
  //     add url to sites.txt
          archive.addUrlToList(receivedURL, function () {
  //     redirect to get
            res.writeHead(302, {Location: '/' + receivedURL});
            res.end();
          });
        }
      });
    });
    
  }
};















