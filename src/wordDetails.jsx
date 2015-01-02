// External
var React = require( 'react/addons' );

// Internal
var strongsDictionary = require( '../data/strongs-dictionary.js' ),
	wordTracking = require( './wordTracking.js' )();

var WordSearchResults = React.createClass( {
	render: function() {
		return (
			<ol><li>{ this.props.lemma }</li></ol>
		);
	}
} );

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

		var words = this.state.words.map( function( lemma ) {
			return (
				<div key={ lemma }>
					<div>{ lemma } | { strongsDictionary[ lemma ].lemma } | { strongsDictionary[ lemma ].xlit } | { strongsDictionary[ lemma ].pron }</div>
					<div>Derivation: { strongsDictionary[ lemma ].derivation }</div>
					<div>Strongs Definition: { strongsDictionary[ lemma ].strongs_def }</div>
					<div>KJV Usage: { strongsDictionary[ lemma ].kjv_def }</div>
					<div>
						Search results: <WordSearchResults lemma={ lemma } />
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
