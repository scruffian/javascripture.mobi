// External
var React = require( 'react' ),
    page = require( 'page' );

// Enable touch events
React.initializeTouchEvents( true );

// Internal
var home = require( './home.jsx' );
var reference = require( './reference.js' );

// Routing
page( '/', home, reference.boot );
page( '/:book', reference.worker );
page( '/:book/:chapter', reference.worker );
page( '/:book/:chapter/:verse', reference.worker );
page.start();

// Reload if appcache updates
window.applicationCache.addEventListener('updateready', function( event ) {
	if ( window.applicationCache.status == window.applicationCache.UPDATEREADY ) {
		// Browser downloaded a new app cache.
		if ( confirm( 'A new version is available. Load it?' ) ) {
			window.location.reload();
		}
	}
}, false);
