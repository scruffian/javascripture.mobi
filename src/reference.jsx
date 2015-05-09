// External
var React = require( 'react' );

// Internal
var wordTracking = require( './wordTracking.js' )(),
	api = require( './api.js' )(),
	strongsColor = require( './strongsColor.js' ),
	ReferenceInput = require( './reference-input.jsx' );

var Word = React.createClass( {
	showWordDetails: function() {
		this.props.onChangeDisplayState( 'details', true );
		wordTracking.add( this.props.lemma );
	},

	isTracked: function() {
		return wordTracking.trackedWords.some( function( wordObject ) {
			return 'undefined' !== typeof wordObject[ this.props.lemma ];
		}, this );
	},

	render: function() {

		var className = 'word ' + this.props.lemma,
			wordStyle = {};

		if ( this.isTracked() ) {
			wordStyle = {
				color: 'white',
				backgroundColor: strongsColor.get( this.props.lemma )
			};
		}

		return (
			<span style={ wordStyle } className={ className } onClick={ this.showWordDetails } key={ this.props.key }>{ this.props.word }</span>
		);
	}
} );

var WordString = React.createClass( {
	render: function() {
		var wordString = this.props.word.split( '/' ).map( function( word, index ) {
			var lemma,
				morph;

			lemma = this.props.lemma.split( '/' )[ index ];

			if ( this.props.morph ) {
				morph = this.props.morph.split( '/' )[ index ];
			}

			return (
				<Word word={ word } lemma={ lemma } morph={ morph } key={ this.props.key } onChangeDisplayState={ this.props.onChangeDisplayState } />
			);
		}, this );

		return (
			<span>{ wordString } </span> // Leave that space
		);
	}

} );

var Verse = React.createClass( {
	render: function() {
		var className = "verse",
			verse;

		if ( this.props.columns ) {
			className += " columns";
		}

		verse = this.props.verse.map( function( word, index ) {
			return (
				<WordString word={ word[ 0 ] } lemma={ word[ 1 ] } morph={ word[ 2 ] } key={ index } onChangeDisplayState={ this.props.onChangeDisplayState } />
			);
		}, this );
		return (
			<div className={ className }>
				{ this.props.number }. { verse }
			</div>
		);
	}
} );

var ReferenceComponent = React.createClass( {
	getInitialState: function() {
		return {
			sync: false,
			references: []
		};
	},

	componentWillMount: function() {
		var self = this;
		api.on( 'change', function() {
			self.setState( {
				references: this.references
			} );
		} );
	},

	toggleSync: function() {
		this.setState( {
			sync: ! this.state.sync
		} );
	},

	getVerse: function( index ) {
		return this.state.references.map( function( reference, counter ) {
			if ( counter > 0 ) {
				return <Verse verse={ reference.data[ index ] } columns={ true } number={ index + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />;
			}
		}, this );
	},

	getVersesSynced: function() {
		return this.state.references[0].data.map( function( verse, index ) {
			return (
				<li key={ index }>
					<Verse verse={ verse } columns={ true } number={ index + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />
					{ this.getVerse( index ) }
				</li>
			);
		}, this );
	},

	getVerses: function( object ) {
		if ( this.state.sync ) {
			return this.getVersesSynced();
		}

		return object.data.map( function( verse, index ) {
			return (
				<li key={ index }>
					<Verse verse={ verse } number={ index + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />
				</li>
			);
		}, this );
	},

	getChapter: function( object ) {
		if ( object && object.data ) {
			return (
				<div className="chapter columns">
					<ReferenceInput reference={ this.props.reference } onGoToReference={ this.props.onGoToReference } />
					<h1>{ object.reference.book } { object.reference.chapter }</h1>
					<ol>{ this.getVerses( object ) }</ol>
				</div>
			);
		}
	},

	getChapters: function() {
		if ( this.state.sync ) {
			return this.getChapter( this.state.references[0] );
		}

		return this.state.references.map( function( reference ) {
			return this.getChapter( reference );
		}, this );
	},

	render: function() {
		return (
			<div id="reference" className="reference">
				<input type="checkbox" name="sync" checked={ this.state.sync } onClick={ this.toggleSync } /> Sync
				{ this.getChapters() }
			</div>
		);
	}


} );

module.exports = ReferenceComponent;