// External
var React = require( 'react' );

// Internal
var WordString = require( './word-string.jsx' );

module.exports = React.createClass( {
	render: function() {
		var className = "verse",
			verse;

		if ( this.props.columns ) {
			className += " columns";
		}

		if ( this.props.verse ) {
			verse = this.props.verse.map( function( word, index ) {
				return (
					<WordString word={ word[ 0 ] } lemma={ word[ 1 ] } morph={ word[ 2 ] } key={ index } onChangeDisplayState={ this.props.onChangeDisplayState } />
				);
			}, this );
		}

		return (
			<div className={ className }>
				{ this.props.number }. { verse }
			</div>
		);
	}
} );
