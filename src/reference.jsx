// External
var React = require( 'react' ),
	clone = require( 'lodash-node/modern/lang/clone' );

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
			<span style={ wordStyle } className={ className } onClick={ this.showWordDetails } key={ this.props.key }>{ this.props.word } </span>
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
		this.callApi( this.props.context );
		api.on( 'change', function() {
			self.setState( {
				references: this.references
			} );
		} );
	},

	componentWillReceiveProps: function ( nextProps ) {
		this.callApi( nextProps.context );
	},

	callApi: function( context ) {
		var reference = {},
			referenceString = '/';
		reference.book = context.params.book;
		reference.chapter = context.params.chapter;
		reference.verse = context.params.verse;

		referenceString += reference.book;
		if ( reference.chapter ) {
			referenceString += '/' + reference.chapter;
		}
		if ( reference.verse ) {
			referenceString += '/' + reference.verse;
		}
		localStorage.reference = referenceString;

		// Fire off a request to get the reference data
		var referenceArray = [

		];
		var primaryReference = clone( context.params );
		primaryReference.version = 'kjv';
		referenceArray.push( primaryReference );
		var secondaryReference = clone( context.params );
		secondaryReference.chapter = secondaryReference.chapter;
		secondaryReference.version = 'original';
		referenceArray.push( secondaryReference );

		api.getReference( [
			primaryReference,
			secondaryReference
		] );
	},

	toggleSync: function() {
		this.setState( {
			sync: ! this.state.sync
		} );
	},

	getSyncedVerses: function( index ) {
		if ( this.state.sync ) {
			return this.state.references.map( function( reference, counter ) {
				if ( counter > 0 ) {
					return <Verse verse={ reference.data[ index ] } columns={ this.state.sync } number={ index + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />;
				}
			}, this );
		}
	},

	getVerses: function( object ) {
		return object.data.map( function( verse, index ) {
			return (
				<li key={ index }>
					<Verse verse={ verse } columns={ this.state.sync } number={ index + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />
					{ this.getSyncedVerses( index ) }
				</li>
			);
		}, this );
	},

	getChapter: function( reference ) {
		if ( reference && reference.data ) {
			var classNames = 'chapter';
			if ( ! this.state.sync ) {
				classNames += ' columns';
			}

			return (
				<div className={ classNames }>
					<ReferenceInput reference={ reference.reference } onGoToReference={ this.props.onGoToReference } />
					<h1>{ reference.reference.book } { reference.reference.chapter }</h1>
					<ol>{ this.getVerses( reference ) }</ol>
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