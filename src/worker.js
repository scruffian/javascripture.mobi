var javascripture = { data: {}, src: {} };
self.postMessage( { task: 'loading', html: 'loading KJV' } );
importScripts('../data/kjv.js');
self.postMessage( { task: 'loading', html: 'loading Hebrew' } );
importScripts('../data/hebrew.js');
self.postMessage( { task: 'loading', html: 'loading Greek' } );
importScripts('../data/greek.js');

importScripts('../src/bible.js');
importScripts('../src/wordSearchAPI.js');

self.postMessage( { task: 'loaded' } );
self.addEventListener( 'message', function( e ) {
	var result;

	if ( e.data.task === 'search' ) {
		result = javascripture.src.wordSearchApi.getReferences( e.data.parameters );
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
