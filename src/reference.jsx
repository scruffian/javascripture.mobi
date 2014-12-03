/** @jsx React.DOM */

/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */

var Reference = React.createClass( {
		render: function() {
			return (
				<div>
					<h1>{ this.props.params.book }</h1>
					<p>{ this.props.params.chapter }</p>
					<p>{ this.props.params.verse }</p>
				</div>
			);
		}
	} );

module.exports = function ( context ) {
	var layout = React.render(
		<Reference params={ context.params } />,
		document.getElementById( 'javascripture' )
	);
};