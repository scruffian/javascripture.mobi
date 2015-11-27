// External
var React = require( 'react' );

// Internal
var wordTracking = require( './wordTracking.js' )(),
	strongsColor = require( './strongsColor.js' );

module.exports = React.createClass( {
	showWordDetails: function() {
		this.props.onChangeDisplayState( 'details', true );
		if ( this.props.lemma ) {
			wordTracking.add( this.props.lemma );
		}
	},

	isTracked: function() {
		return wordTracking.trackedWords.some( function( wordObject ) {
			return 'undefined' !== typeof wordObject[ this.props.lemma ];
		}, this );
	},

	render: function() {
		var className = 'word ',
			wordStyle = {};

		if ( this.props.lemma ) {
			className += ' ' + this.props.lemma;
		}

		if ( this.isTracked() && this.props.lemma ) {
			wordStyle = {
				color: 'white',
				backgroundColor: strongsColor.get( this.props.lemma )
			};
		}

		return (
			<span
				style={ wordStyle }
				className={ className }
				onClick={ this.showWordDetails }
				key={ this.props.key }
				dangerouslySetInnerHTML={{ __html: this.props.word.replace( /<dvnNm>/g, '').replace( /<!dvnNm>/g ,'' ) }} />
		);
	}
} );
