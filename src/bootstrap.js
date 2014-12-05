// External
var React = require( 'react' ),
    page = require( 'page' );

React.initializeTouchEvents(true);

// Internal
var home = require( './home.jsx' );
var reference = require( './reference.js' );

page( '/', home );
page( '/:book', reference );
page( '/:book/:chapter', reference );
page( '/:book/:chapter/:verse', reference );
page.start();
