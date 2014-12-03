/** @jsx React.DOM */

/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
module.exports = React.createClass( {
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
