// External
var React = require( 'react' ),
    page = require( 'page' );

// Enable touch events
//React.initializeTouchEvents( true );

// Internal
var home = require( './home.jsx' ),
	reference = require( './reference.js' );

	var boot = function( context, next ) {
		if ( localStorage.reference ) {
			page( localStorage.reference );
		} else {
			page( '/Genesis/1' );
		}
	};


// Routing
page( '/', boot );
page( '/:book', home );
page( '/:book/:chapter', home );
page( '/:book/:chapter/:verse', home );

var startButton = document.getElementById( 'start' );
startButton.innerHTML = 'Start';
startButton.onclick = function() {
	page.start( { hashbang: true } );
};

if ( window.location.hash || localStorage.reference ) {
	start();
}

// Reload if appcache updates
window.applicationCache.addEventListener('updateready', function( event ) {
	if ( window.applicationCache.status == window.applicationCache.UPDATEREADY ) {
		// Browser downloaded a new app cache.
		if ( confirm( 'A new version is available. Load it?' ) ) {
			window.location.reload();
		}
	}
}, false);
