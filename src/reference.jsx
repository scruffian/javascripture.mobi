// External
var React = require( 'react' );

// Internal
var wordTracking = require( './wordTracking.js' )(),
	api = require( './api.js' )(),
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

var ReferenceComponent = React.createClass( {
	getInitialState: function () {
	    return {
	        reference: {
	        	primary: [],
	        	secondary: []
	        }
	    };
	},

	componentWillMount: function() {
		var self = this;
		console.log('componentWillMount');
		api.on( 'change', function() {
			console.log('state change');
			self.setState( {
				reference: this.reference
			} );
		} );
	},

	getChapter: function( object ) {
		if ( object && object.data ) {
			console.log( object.data );
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
		console.log( 'hhh');
		return (
			<div id="reference" className="reference">
				{ this.getChapter( this.state.reference.primary ) }
				{ this.getChapter( this.state.reference.secondary ) }
			</div>
		);
	}
} );


module.exports = ReferenceComponent;