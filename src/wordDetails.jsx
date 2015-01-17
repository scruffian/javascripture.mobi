// External
var React = require( 'react/addons' );

// Internal
var strongsDictionary = require( '../data/strongs-dictionary.js' ),
	wordTracking = require( './wordTracking.js' )(),
	WordSearchResults = require( './wordSearchResults.jsx' );

var WordDetails = React.createClass( {
	getInitialState: function() {
		return {
			words: []
		};
	},

	componentWillMount: function() {
		var self = this;
		wordTracking.on( 'change', function() {
			self.setState( {
				words: this.trackedWords
			} );
		} );
	},

	render: function() {
		var words = this.state.words.map( function( lemmaObject ) {
			var lemma = Object.keys( lemmaObject )[0];
			return (
				<div key={ lemma }>
					<div>{ lemma } | { strongsDictionary[ lemma ].lemma } | { strongsDictionary[ lemma ].xlit } | { strongsDictionary[ lemma ].pron }</div>
					<div>Derivation: { strongsDictionary[ lemma ].derivation }</div>
					<div>Strongs Definition: { strongsDictionary[ lemma ].strongs_def }</div>
					<div>KJV Usage: { strongsDictionary[ lemma ].kjv_def }</div>
					<div>
						Search results: <WordSearchResults references={ lemmaObject[ lemma ] } />
					</div>
				</div>
			);

		} );

		return (
			<div className="word-details">{ words }</div>
		);
	}
} );

module.exports = WordDetails;
