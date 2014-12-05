var referenceApi = require( '../api/reference.js' );

self.addEventListener('message', function( event ) {
	var result;

	if ( event.data.task === 'reference' ) {
		result = javascripture.api.reference.getThreeChapters( event.data.parameters );
	}

	if ( result ) {
		self.postMessage( {
			task: event.data.task,
			parameters: event.data.parameters,
			result: result
		} );
	}

}, false);
