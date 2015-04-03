// External
var React = require( 'react' );

// Internal
var wordTracking = require( './wordTracking.js' )(),
	api = require( './api.js' )(),
	strongsColor = require( './strongsColor.js' );

var Word = React.createClass( {
	showWordDetails: function() {
		this.props.onChangeDisplayState( 'details', true );
		console.log( this.props.lemma );
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
		/*return (
			<Word word={ this.props.word } lemma={ this.props.lemma } morph={ this.props.morph } key={ this.props.key } onChangeDisplayState={ this.props.onChangeDisplayState } />
		);
		/*var string = this.props.word.split( '/' ).map( function( word, index ) {
			console.log( word );
			var lemma,
				morph;

			lemma = this.props.lemma.split( ' ' )[ index ];
			console.log( lemma );

			if ( this.props.morph ) {
				morph = this.props.morph.split( ' ' )[ index ];
			}
			console.log( this.props.morph );

			return (
				<Word word={ word } lemma={ lemma } morph={ morph } key={ this.props.key } onChangeDisplayState={ this.props.onChangeDisplayState } />
			);
		}, this );
		console.log( string );
		return string;*/
	}

} );

var Verse = React.createClass( {
	render: function() {
		var verse = this.props.verse.map( function( word, index ) {
			return (
				<WordString word={ word[ 0 ] } lemma={ word[ 1 ] } morph={ word[ 2 ] } key={ index } onChangeDisplayState={ this.props.onChangeDisplayState } />
			);
		}, this );
		return (
			<div>{ verse }</div>
		);
	}
} );

var ReferenceComponent = React.createClass( {
	getInitialState: function() {
		return {
			reference: {
				primary: [],
				secondary: []
			}
		};
	},

	componentWillMount: function() {
		var self = this;
		api.on( 'change', function() {
			self.setState( {
				reference: this.reference
			} );
		} );
	},

	getChapter: function( object ) {
		if ( object && object.data ) {
			var verses = object.data.map( function( verse, index ) {
				return (
					<li key={ index }>
						<Verse verse={ verse } onChangeDisplayState={ this.props.onChangeDisplayState } />
					</li>
				);
			}, this );

			return (
				<div>
					<h1>{ object.reference.book } { object.reference.chapter }</h1>
					<ol className="chapter">{ verses }</ol>
				</div>
			);
		}
	},

	render: function() {
		return (
			<div id="reference" className="reference">
				{ this.getChapter( this.state.reference.primary ) }
				{ this.getChapter( this.state.reference.secondary ) }
			</div>
		);
	}
} );


module.exports = ReferenceComponent;