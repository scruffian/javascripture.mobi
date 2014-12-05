// External
var React = require( 'react' ),
    page = require( 'page' );

// Enable touch events
React.initializeTouchEvents(true);

// Internal
var home = require( './home.jsx' );
var reference = require( './reference.js' );

// Routing
page( '/', home );
page( '/:book', reference );
page( '/:book/:chapter', reference );
page( '/:book/:chapter/:verse', reference );
page.start();

// Reload if appcache updates
window.applicationCache.addEventListener('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		// Browser downloaded a new app cache.
		if (confirm('A new version is available. Load it?')) {
			window.location.reload();
		}
	}
}, false);
