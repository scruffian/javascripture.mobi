// External
var React = require( 'react' );

var WordSearchResults = React.createClass( {
	render: function() {
		if ( this.props.references ) {
			var referenceMarkup = this.props.references.map( function( reference ) {
				var url = reference.book + '/' + reference.chapter + '/' + reference.verse,
					key = url + '/' + reference.positionInVerse;
				return (
					<li key={ key }><a href={ url }>{ reference.book } { reference.chapter } { reference.verse }</a></li>
				);
			} );

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
