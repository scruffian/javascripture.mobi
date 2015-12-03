// External
var React = require( 'react' );

// Internal
var strongsDictionary = javascripture.data.strongs,
	wordTracking = require( './wordTracking.js' )(),
	WordSearchResults = require( './wordSearchResults.jsx' ),
	strongsColor = require( './strongsColor.js' );

var WordDetail = React.createClass( {
	open: function() {
		this.props.onSetOpenLemma( this.props.lemma, this.props.open );
	},

	remove: function( event ) {
		event.preventDefault();
		wordTracking.remove( this.props.lemma );
	},

	render: function() {
		var lemma = this.props.lemma,
			className = this.props.open ? 'open word-data' : 'word-data',
			strongsData = lemma ? strongsDictionary[ lemma ] : null,
			wordStyle = {
				color: 'white',
				backgroundColor: lemma ? strongsColor.get( lemma ) : null
			};

		if ( strongsData ) { // Only show words we have data for?
			return (
				<div className="word-detail">
					<header onClick={ this.open } style={ wordStyle }>
						{ lemma } { strongsDictionary[ lemma ].lemma }
						<img onClick={ this.remove } className="remove" src="/assets/icons/close.svg" />
					</header>
					<div className={ className }>
						<div>{ lemma } | { strongsDictionary[ lemma ].lemma } | { strongsDictionary[ lemma ].xlit } | { strongsDictionary[ lemma ].pron }</div>
						<div>
							<strong>Derivation:</strong> { strongsDictionary[ lemma ].derivation }</div>
						<div>
							<strong>Strongs Definition:</strong> { strongsDictionary[ lemma ].strongs_def }</div>
						<div>
							<strong>KJV Usage:</strong> { strongsDictionary[ lemma ].kjv_def }</div>
						<div>
							<strong>Search results:</strong> <WordSearchResults references={ this.props.lemmaObject[ lemma ] } />
						</div>
					</div>
				</div>
			);
		}

		return null;
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
				lastWord;

			if ( lastWordObject ) {
				lastWord = Object.keys( lastWordObject )[ 0 ];
			}

			self.setState( {
				words: this.trackedWords,
				open: lastWord
			} );
		} );
	},

	setOpenLemma: function( lemma, open ) {
		var openLemma = '';
		if ( ! open ) {
			openLemma = lemma;
		}
		this.setState( {
			open: openLemma
		} );
	},

	render: function() {
		var words = this.state.words.map( function( lemmaObject ) {
			var lemma = Object.keys( lemmaObject )[ 0 ],
				open = ( this.state.open === lemma );

			return (
				<span>
				<WordDetail
					key={ lemma }
					lemma={ lemma }
					lemmaObject={ lemmaObject }
					open={ open }
					onSetOpenLemma={ this.setOpenLemma } />
				</span>
			);

		}, this );

		return (
			<div className="word-details">{ words }</div>
		);
	}
} );

module.exports = WordDetails;
