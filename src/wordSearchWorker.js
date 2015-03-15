// Internal
var wordSearchApi = require( './wordSearchAPI.js' ),
	data = require( './data.js' );
console.log( 'self' );
console.log( self.kjv.Genesis[0][0][0][0] );


wordSearchApi.setLanguages( { //helper object to access different languages
	kjv: self.kjv/*,
	web: javascripture.data.web,
	greek: greek,
	hebrew: hebrew*/
} );

module.exports = function ( self ) {
    self.addEventListener( 'message', function ( event ) {
    	var lemma = event.data,
    		parameters = {
				lemma: lemma,
				language: 'kjv',
				clusivity: 'exclusive'
			},
			result = {};

		//result[ lemma ] = wordSearchApi.getReferences( parameters );
    	self.postMessage( self.location.pathname );
    });
};