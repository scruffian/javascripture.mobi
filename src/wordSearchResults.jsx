// External
var React = require( 'react' );

var WordSearchResults = React.createClass( {
	isCurrentReference: function( reference ) {
		var currentReference = this.props.context.params;
		if ( reference.book != currentReference.book ) {
			return false;
		}
		if ( reference.chapter != currentReference.chapter ) {
			return false;
		}
		if ( reference.verse != currentReference.verse ) {
			return false;
		}
		return true;
	},

	render: function() {
		if ( this.props.references ) {
			var referenceMarkup = this.props.references.map( function( reference ) {
				var url = reference.book + '/' + reference.chapter + '/' + reference.verse,
					key = url + '/' + reference.positionInVerse,
					classes = this.isCurrentReference( reference ) ? 'current' : null;

				return (
					<li key={ key } className={ classes }>
						<a href={ url }>
							{ reference.book } { reference.chapter }:{ reference.verse }
						</a>
					</li>
				);
			}, this );

			if ( ! referenceMarkup ) {
				referenceMarkup = ( <li>searching</li> );
			}

			return (
				<ol className="search-results">{ referenceMarkup }</ol>
			);
		}

		return null;
	}
} );

module.exports = WordSearchResults;
