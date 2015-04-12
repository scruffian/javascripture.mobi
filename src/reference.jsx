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
			sync: true,
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
						<Verse verse={ verse } number={ index + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />
					</li>
				);
			}, this );

			return (
				<div className="chapter columns">
					<h1>{ object.reference.book } { object.reference.chapter }</h1>
					<ol>{ verses }</ol>
				</div>
			);
		}
	},

	getChapterSynced: function() {
		if ( this.state.reference.primary && this.state.reference.primary.data ) {
			var verses = this.state.reference.primary.data.map( function( verse, index ) {
				var number = index + 1;
				return (
					<li key={ index }>
						<Verse verse={ verse } columns={ true } number={ number } onChangeDisplayState={ this.props.onChangeDisplayState } />
						<Verse verse={ this.state.reference.secondary.data[ index ] } columns={ true } number={ number } onChangeDisplayState={ this.props.onChangeDisplayState } />
						<Verse verse={ this.state.reference.primary.data[ index ] } columns={ true } number={ number } onChangeDisplayState={ this.props.onChangeDisplayState } />
					</li>
				);
			}, this );

			return (
				<div className="chapter">
					<h1>{ this.state.reference.primary.reference.book } { this.state.reference.primary.reference.chapter }</h1>
					<ol>{ verses }</ol>
				</div>
			);
		}
	},

	toggleSync: function() {
		console.log( this.state.sync );
		this.setState( {
			sync: ! this.state.sync
		} );
	},

	render: function() {
		var chapters;
		if ( this.state.sync ) {
			chapters = this.getChapterSynced();
		} else {
			chapters = [];
			chapters.push( this.getChapter( this.state.reference.primary ) );
			chapters.push( this.getChapter( this.state.reference.secondary ) );
			chapters.push( this.getChapter( this.state.reference.primary ) );
		}
		return (
			<div id="reference" className="reference">
				<input type="checkbox" name="sync" checked={ this.state.sync } onClick={ this.toggleSync } onChange={ this.toggleSync } />
				{ chapters }
			</div>
		);
	}


} );


module.exports = ReferenceComponent;