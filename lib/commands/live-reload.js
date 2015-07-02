
'use strict';

var assign      = require('lodash/object/assign');
var path        = require('path');
var Command     = require('../models/command');
var Promise     = require('../ext/promise');
var SilentError = require('../errors/silent');

module.exports = Command.extend({
  name: 'live-reload',
  description: 'Runs the live-reload server in standalone',
  aliases: ['lr'],

  availableOptions: [
    { name: 'port', type: Number, default: process.env.PORT || 4201, aliases: ['p'] },
    { name: 'host', type: String, default: '0.0.0.0', aliases: ['H'] },
    { name: 'proxy',  type: String, aliases: ['pr','pxy'] },
    { name: 'insecure-proxy', type: Boolean, default: false, description: 'Set false to proxy self-signed SSL certificates', aliases: ['inspr'] },
    { name: 'watcher',  type: String, default: 'events', aliases: ['w'] },
    { name: 'environment', type: String, default: 'development', aliases: ['e', {'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'output-path', type: path, default: 'dist/', aliases: ['op', 'out'] }
  ],

  run: function(commandOptions) {
    commandOptions = assign({}, commandOptions, {
      liveReloadPort: commandOptions.port,
      baseURL: this.project.config(commandOptions.environment).baseURL || '/'
    });

    if (commandOptions.proxy) {
      if (!commandOptions.proxy.match(/^(http:|https:)/)) {
        var message = 'You need to include a protocol with the proxy URL.\nTry --proxy http://' + commandOptions.proxy;

        return Promise.reject(new SilentError(message));
      }
    }

    var LiveReloadTask = this.tasks.LiveReload;
    var serve = new LiveReloadTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    return serve.run(commandOptions);
  }
});
