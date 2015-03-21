// External
var Emitter = require( '../mixins/emitter.js' );
var api = require( './api.js' )();

// Singleton
var _wordTracking;

var wordTracking = function() {
    if ( ! _wordTracking ) {
        _wordTracking = new WordTracking();
    }

    return _wordTracking;
};

var WordTracking = function() {
    if ( ! ( this instanceof WordTracking ) ) {
        return new WordTracking();
    }

    api.on( 'change', function() {
        if ( api.searchResults ) {
            this.callback( api.searchResults );
        }
    }.bind( this ) );

    this.trackedWords = [];
};

Emitter( WordTracking.prototype );

WordTracking.prototype.add = function( lemma ) {
    var lemmaObject = {};
    lemmaObject[ lemma ] = [];
    this.trackedWords.push( lemmaObject );
    // update the page
    this.emit( 'change' );
    // do the search
    api.search( lemma );
};

WordTracking.prototype.remove = function( lemma ) {
    this.trackedWords = this.trackedWords.filter( function( lemmaObject ) {
        return Object.keys( lemmaObject )[ 0 ] !== lemma;
    } );
    this.emit( 'change' );
};

WordTracking.prototype.callback = function( event ) {
    var lemma = event.data.parameters.lemma;
    var newTrackedWords = this.trackedWords.map( function( lemmaObject ) {
        var thisLemma = Object.keys( lemmaObject )[ 0 ];
        if ( thisLemma === lemma ) {
            var resultObject = {};
            resultObject[ lemma ] = event.data.result;
            return resultObject;
        }
        return lemmaObject;
    } );
    this.trackedWords = newTrackedWords;
    this.emit( 'change' );
};

module.exports = wordTracking;
