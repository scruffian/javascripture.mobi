// External
var React = require( 'react' ),
    page = require( 'page' );

// Enable touch events
React.initializeTouchEvents( true );

// Singletons
wordTracking = require( './wordTracking.js' );

// Internal
var home = require( './home.jsx' ),
	reference = require( './reference.js' );

	var boot = function( context, next ) {
		if ( localStorage.reference ) {
			page( localStorage.reference );
		}
	};


// Routing
page( '/', boot );
page( '/:book', home );
page( '/:book/:chapter', home );
page( '/:book/:chapter/:verse', home );

/*page( '/', home, reference.boot );
page( '/:book', reference.worker );
page( '/:book/:chapter', reference.worker );
page( '/:book/:chapter/:verse', reference.worker );*/
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
