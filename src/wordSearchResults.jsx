// External
var React = require( 'react' );

var WordSearchResults = React.createClass( {
	render: function() {
		var referenceMarkup = this.props.references.map( function( reference ) {
			var url = reference.book + '/' + reference.chapter + '/' + reference.verse;
			return (
				<li key={ url }><a href={ url }>{ reference.book } { reference.chapter } { reference.verse }</a></li>
			);
		} );

		if ( ! referenceMarkup ) {
			referenceMarkup = ( <li>searching</li> );
		}

		return (
			<ol className="search-results">{ referenceMarkup }</ol>
		);
	}
} );

module.exports = WordSearchResults;
