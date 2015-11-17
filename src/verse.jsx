// External
var React = require( 'react' );

// Internal
var WordString = require( './word-string.jsx' );

module.exports = React.createClass( {
	render: function() {
		var className = "verse " + this.props.version + " ",
			verse;

		if ( this.props.columns ) {
			className += " columns";
		}

		if ( this.props.verse ) {
			verse = this.props.verse.map( function( word, index ) {
				if ( word ) {
					return (
						<WordString word={ word[ 0 ] } lemma={ word[ 1 ] } morph={ word[ 2 ] } key={ index } onChangeDisplayState={ this.props.onChangeDisplayState } />
					);
				}
			}, this );
		}

		return (
			<div className={ className }>
				<span className="verse__number">{ this.props.number }.</span> { verse }
			</div>
		);
	}
} );
