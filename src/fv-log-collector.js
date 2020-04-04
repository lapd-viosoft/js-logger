function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}


(function(global) {
  "use strict";

  // Default url
  var DEFAULT_TARGET_URL = "http://localhost:8080";
  // Which app
  var DEFAULT_PREFIX = 'addins';
  // Log level to display in the browser console
  var DEFAULT_LOG_LEVEL = beaver.LOG_LEVEL.DEBUG;
  // Interval to flush logs to server
  var DEFAULT_FLUSH_INTERVAL = 60 * 1000;


  // Top level module for the global, static logger instance.
  var Logger = {};

  Logger.init = function(
    target_url,
    app,
    level_retain,
    interval,
  ) {

    const url = target_url || DEFAULT_TARGET_URL;
    var log_app = app || DEFAULT_PREFIX;
    const level = level_retain || DEFAULT_LOG_LEVEL;
    const flush_interval = interval || DEFAULT_FLUSH_INTERVAL;

    const trackerId = generateUUID()

    var $logger = beaver.Logger({
      // Url to send logs to
      url: url,
      // app to prepend to all events
      //  app: log_app,
      // Log level to display in the browser console
      logLevel: level,
      // Interval to flush logs to server
      flushInterval: flush_interval
    })

    console.log(url)

    Logger.debug = function(event, data) {
      const payload = {
        data: data,
        app: log_app,
        trackerId: trackerId
      }
      $logger.debug(event, payload);
    }
    Logger.info = function(event, data) {

      const payload = {
        data: data,
        app: log_app,
        trackerId: trackerId
      }
      $logger.info(event, payload);
    }
    Logger.warn = function(event, data) {
      const payload = {
        data: data,
        app: log_app,
        trackerId: trackerId
      }

      $logger.warn(event, payload);
    }
    Logger.error = function(event, data) {

      const payload = {
        data: data,
        app: log_app,
        trackerId: trackerId
      }

      $logger.error(event, payload);
    }
    Logger.track = function(data) {

      const payload = {
        data: data,
        app: log_app,
        trackerId: trackerId
      }

      $logger.track(payload);
    }
    Logger.flush = function() {
      console.log('Send')
      $logger.flush();
    }

  };

  // Export to popular environments boilerplate.
  if (typeof define === 'function' && define.amd) {
    define(Logger);
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
  } else {
    Logger._prevLogger = global.Logger;

    Logger.noConflict = function() {
      global.Logger = Logger._prevLogger;
      return Logger;
    };

    global.Logger = Logger;
  }

}(this))
