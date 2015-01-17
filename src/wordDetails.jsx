// External
var React = require( 'react/addons' );

// Internal
var strongsDictionary = require( '../data/strongs-dictionary.js' ),
	wordTracking = require( './wordTracking.js' )(),
	WordSearchResults = require( './wordSearchResults.jsx' ),
	strongsColor = require( './strongsColor.js' );

var WordDetail = React.createClass( {
	open: function() {
		console.log( this.props.lemma );
		this.props.onSetOpenLemma( this.props.lemma );
	},

	render: function() {
		var lemma = this.props.lemma;
			className = this.props.open ? 'open word-data' : 'word-data';
			strongsData = strongsDictionary[ lemma ];
			wordStyle = {
  				color: 'white',
  				backgroundColor: strongsColor.get( lemma )
		};

		if ( strongsData ) { // Only show words we have data for?
			return (
				<div className="word-detail">
					<div onClick={ this.open } style={ wordStyle }>{ lemma } | { strongsDictionary[ lemma ].lemma } | { strongsDictionary[ lemma ].xlit } | { strongsDictionary[ lemma ].pron }</div>
					<div className={ className }>
						<div>Derivation: { strongsDictionary[ lemma ].derivation }</div>
						<div>Strongs Definition: { strongsDictionary[ lemma ].strongs_def }</div>
						<div>KJV Usage: { strongsDictionary[ lemma ].kjv_def }</div>
						<div>
							Search results: <WordSearchResults references={ this.props.lemmaObject[ lemma ] } />
						</div>
					</div>
				</div>
			);
		}
	}
} );

var WordDetails = React.createClass( {
	getInitialState: function() {
		return {
			words: [],
			open: ''
		};
	},

	componentWillMount: function() {
		var self = this;
		wordTracking.on( 'change', function() {
			var lastWordObject = this.trackedWords[ this.trackedWords.length - 1 ],
				lastWord = Object.keys( lastWordObject )[0];
				console.log( lastWordObject );
			self.setState( {
				words: this.trackedWords,
				open: lastWord
			} );
		} );
	},

	setOpenLemma: function( lemma ) {
		this.setState( {
			open: lemma
		} );
	},

	render: function() {
		var words = this.state.words.map( function( lemmaObject ) {
			var lemma = Object.keys( lemmaObject )[0],
				open = ( this.state.open === lemma );

			return (
				<WordDetail
					key={ lemma }
					lemma={ lemma }
					lemmaObject={ lemmaObject }
					open={ open }
					onSetOpenLemma={ this.setOpenLemma } />
			);

		}, this );

		return (
			<div className="word-details">{ words }</div>
		);
	}
} );

module.exports = WordDetails;
