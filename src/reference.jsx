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

var Verse = React.createClass( {
	render: function() {
		var verse = this.props.verse.map( function( word, index ) {
			return (
				<Word word={ word[ 	0 ] } lemma={ word[ 1 ] } morph={ word[ 2 ] } key={ index } />
			);
		}, this );
		return (
			<div>{ verse }</div>
		);
	}
} );

var Reference = React.createClass( {
	render: function() {
		return (
			<div>
				{ this.getChapter( this.props.data.primary ) }
				{ this.getChapter( this.props.data.secondary ) }
			</div>
		);
	},
	getChapter: function( object ) {
		var verses = object.data.map( function( verse, index ) {
			return (
				<li key={ index }>
					<Verse verse={ verse } />
				</li>
			);
		}, this );
		console.log( object );
		return (
			<div>
				<h1>{ object.reference.book } { object.reference.chapter }</h1>
				<ol className="chapter">{ verses }</ol>
			</div>
		);
	}
} );

module.exports = function ( data ) {
	var layout = React.render(
		<Reference data={ data } />,
		document.getElementById( 'reference' )
	);
};