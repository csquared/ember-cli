'use strict';

var fs               = require('fs');
var path             = require('path');
var LiveReloadServer = require('./server/livereload-server');
var ExpressServer    = require('./server/express-server');
var Promise          = require('../ext/promise');
var Task             = require('../models/task');
var Watcher          = require('../models/watcher');
var Builder          = require('../models/builder');
var ServerWatcher    = require('../models/server-watcher');

module.exports = Task.extend({
  run: function(options) {
    var builder = new Builder({
      ui: this.ui,
      outputPath: options.outputPath,
      project: this.project,
      environment: options.environment
    });

    var watcher = new Watcher({
      ui: this.ui,
      builder: builder,
      analytics: this.analytics,
      options: options
    });

    var liveReloadServer = new LiveReloadServer({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project,
      watcher: watcher,
    });

    return liveReloadServer.start(options)
      .then(function() {
        return new Promise(function() {
          // hang until the user exits.
        });
      });
  }
});