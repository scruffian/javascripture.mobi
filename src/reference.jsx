// External
var React = require( 'react' );

// Internal
var wordTracking = require( './wordTracking.js' )(),
	referenceAPI = require( './referenceAPI.js' ),
	strongsColor = require( './strongsColor.js' );

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
			<span><span style={ wordStyle } className={ className } onClick={ this.showWordDetails } key={ this.props.key }>{ this.props.word }</span> </span> // Leave that space
		);
	}
} );

var Verse = React.createClass( {
	render: function() {
		var verse = this.props.verse.map( function( word, index ) {
			return (
				<Word word={ word[ 	0 ] } lemma={ word[ 1 ] } morph={ word[ 2 ] } key={ index } onChangeDisplayState={ this.props.onChangeDisplayState } />
			);
		}, this );
		return (
			<div>{ verse }</div>
		);
	}
} );

var Reference = React.createClass( {
	componentWillMount: function() {
		var self = this;
		wordTracking.on( 'change', function() {
			self.forceUpdate();
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
		var data = referenceAPI.get( this.props.reference );
		return (
			<div id="reference" className="reference">
				<div className="primary">
					{ this.getChapter( data.primary ) }
				</div>
				<div className="secondary4">
					{ this.getChapter( data.secondary ) }
				</div>
			</div>
		);
	}
} );

module.exports = Reference;
