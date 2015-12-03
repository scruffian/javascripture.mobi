// External
var React = require( 'react' ),
	page = require( 'page' );

// Enable touch events
//React.initializeTouchEvents( true );

// Internal
var layout = require( './layout.jsx' );

var boot = function( context, next ) {
	if ( localStorage.reference ) {
		page( localStorage.reference );
	} else {
		page( '/Genesis/1' );
	}
};

// Routing
page( '/', boot );
page( '/:book', layout );
page( '/:book/:chapter', layout );
page( '/:book/:chapter/:verse', layout );

var start = function() {
	page.start( {
		hashbang: true
	} );
};

var startButton = document.getElementById( 'start' );
startButton.onclick = start;

worker.addEventListener( 'message', function(e) {
  	if( e.data.task === 'loading' ) {
  		startButton.innerHTML = e.data.html;
  	}
} );

worker.addEventListener( 'message', function(e) {
	if ( e.data.task === 'loaded' ) {
		startButton.innerHTML = 'Start';
		if ( window.location.hash || localStorage.reference ) {
			start();
		}
	}
} );

// Reload if appcache updates
window.applicationCache.addEventListener( 'updateready', function( event ) {
	if ( window.applicationCache.status == window.applicationCache.UPDATEREADY ) {
		// Browser downloaded a new app cache.
		if ( confirm( 'A new version is available. Load it?' ) ) {
			window.location.reload();
		}
	}
}, false );
