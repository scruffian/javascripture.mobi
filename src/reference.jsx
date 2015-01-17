// External
var React = require( 'react' );

// Internal
var wordTracking = require( './wordTracking.js' )(),
	referenceAPI = require( './referenceAPI.js' );


var Word = React.createClass( {
	showWordDetails: function() {
		this.props.onChangeDisplayState( 'details', true );
		wordTracking.add( this.props.lemma );
	},

	getStrongsColor: function () {
		var strongsInt = parseInt( this.props.lemma.substring( 1, this.props.lemma.length ) );
		if ( isNaN ( strongsInt ) ) {
			strongsInt = 0;
		}
		var theSizeOfAColorSegment = 360 / 8000,
			hue = strongsInt * theSizeOfAColorSegment,
			staturation = '50%',
			lightness = '50%';
		return 'hsl( ' + hue + ',' + staturation + ', ' + lightness + ' )';
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
	  			backgroundColor: this.getStrongsColor()
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
				{ this.getChapter( data.primary ) }
				{ this.getChapter( data.secondary ) }
			</div>
		);
	}
} );


module.exports = Reference;