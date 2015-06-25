var wordSearchApi = require( './wordSearchAPI.js' );
var referenceApi = require( './referenceAPI.js' );

module.exports = function( self ) {
	self.addEventListener( 'message', function( e ) {
		var result;

		if ( e.data.task === 'search' ) {
			result = wordSearchApi.getReferences( e.data.parameters );
		}
		if ( e.data.task === 'reference' ) {
			result = referenceApi.get( e.data.parameters.references );
		}

		if ( result ) {
			self.postMessage( {
				task: e.data.task,
				type: e.data.type,
				parameters: e.data.parameters,
				result: result
			} );
		}

	}, false );
};
