// External
var Emitter = require( '../mixins/emitter.js' );

// Singleton
var _settings;

var settings = function() {
    if ( ! _settings ) {
        _settings = new Settings();
    }

    return _settings;
};

var Settings = function() {
    if ( ! ( this instanceof Settings ) ) {
        return new Settings();
    }

    this.sync = true;
};

Emitter( Settings.prototype );

Settings.prototype.set = function( key, value ) {
    this[ key ] = value;

    // update the page
    this.emit( 'change' );
};

module.exports = settings;
