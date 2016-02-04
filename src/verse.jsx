// External
var React = require( 'react' ),
	classnames = require( 'classnames' );

// Internal
var WordString = require( './word-string.jsx' ),
	referenceTracking = require( './referenceTracking.js' );

module.exports = React.createClass( {
	isCurrentVerse: function() {
		var currentReference = referenceTracking.get();

		return currentReference.book == this.props.reference.book &&
			currentReference.chapter == this.props.reference.chapter &&
			currentReference.verse == this.props.verseNumber;
	},

	render: function() {
		console.log( this.props.ignoreScrollEvents );
		if ( this.isCurrentVerse() && this.verseComponent && this.props.ignoreScrollEvents ) {
			window.scrollTo( 0, this.verseComponent.offsetTop - 80 );
		}

		var classObject = {
				verse: true,
				columns: this.props.columns,
				current: this.isCurrentVerse()
			},
			classes,
			verse;

		classObject[ this.props.version ] = true;

		classes = classnames( classObject );

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
			<div className={ classes }
				ref={ ( ref ) => this.verseComponent = ref }>
				<span className="verse__number">{ this.props.number }.</span> { verse }
			</div>
		);
	}
} );
