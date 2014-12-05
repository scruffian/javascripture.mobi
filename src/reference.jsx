/** @jsx React.DOM */

/**
 * External dependencies
 */
var React = require( 'react' );

var Word = React.createClass( {
	showWordDetails: function() {
		console.log( this.props.lemma );
	},
	render: function() {
		return (
			<span><span onClick={ this.showWordDetails } className={ this.props.lemma } key={ this.props.key }>{ this.props.word }</span> </span> // Leave that space
		);
	}
} );

var Reference = React.createClass( {
	render: function() {
		return (
			<div>
				{ this.getChapter( this.props.data.primary) }
				{ this.getChapter( this.props.data.secondary) }
			</div>
		);
	},
	getChapter: function( chapter ) {
		return chapter.map( function( verse, index ) {
			return this.getVerse( verse );
		}, this );
	},
	getVerse: function( verse ) {
		return verse.map( function( word, index ) {
			return (
				<Word word={ word[0] } lemma={ word[1] } morph={ word[2] } key={ index } />
			);
		}, this );
	}
} );

module.exports = function ( data ) {
	var layout = React.render(
		<Reference data={ data } />,
		document.getElementById( 'reference' )
	);
};