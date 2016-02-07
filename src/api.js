// External
var Emitter = require( '../mixins/emitter.js' );

// Singleton
var _api;

var api = function() {
    if ( ! _api ) {
        _api = new Api();
    }

    return _api;
};

var Api = function() {
    if ( ! ( this instanceof Api ) ) {
        return new Api();
    }

    this.reference = [];
    this.searchResults = null;
};

Emitter( Api.prototype );

Api.prototype.callback = function( event ) {
    if ( event.data.task === 'search' ) {
        this.searchResults = event;
    }

    this.emit( 'change' );
};


Api.prototype.search = function( lemma ) {
    worker.postMessage( {
        task: 'search',
        type: 'change',
        parameters: {
            lemma: lemma,
            language: 'kjv',
            clusivity: 'exclusive'
        }
    } ); // send the worker a message
};

worker.addEventListener( 'message', function( event ) {
    api().callback( event );
} );

module.exports = api;
