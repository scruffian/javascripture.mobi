// External
var Emitter = require( '../mixins/emitter.js' );
var webworkify = require( 'webworkify' );

// Internal
var worker = webworkify( require( './worker.js' ) );

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

Api.prototype.getReference = function( reference ) {
    worker.postMessage( {
        task: 'reference',
        parameters: {
            reference: reference,
            language: 'kjv',
            clusivity: 'exclusive'
        }
    } ); // send the worker a message
};

Api.prototype.callback = function( event ) {
    if ( event.data.task === 'reference' ) {
        this.reference = event.data.result;
    }
    if ( event.data.task === 'search' ) {
        this.searchResults = event;
    }
    this.emit( 'change' );
};


Api.prototype.search = function( lemma ) {
    worker.postMessage( {
        task: 'search',
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
