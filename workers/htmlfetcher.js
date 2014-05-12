var archive = require('../helpers/archive-helpers');
var cronJob = require('cron').CronJob;

new cronJob('* * * * * *', archive.downloadUrls, null, true, "America/Los_Angeles");