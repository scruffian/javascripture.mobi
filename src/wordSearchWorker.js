// Internal
var wordSearchApi = require( './wordSearchAPI.js' );

module.exports = function ( self ) {
    self.addEventListener( 'message', function ( event ) {
    	var lemma = event.data,
    		parameters = {
				lemma: lemma,
				language: 'kjv',
				clusivity: 'exclusive'
			},
			result = {};

		result[ lemma ] = wordSearchApi.getReferences( parameters );
    	self.postMessage( result );
    });
};