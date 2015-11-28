// External
var React = require( 'react' );

// Internal
var wordTracking = require( './wordTracking.js' )(),
	strongsColor = require( './strongsColor.js' );

module.exports = React.createClass( {
	showWordDetails: function() {
		this.props.onChangeDisplayState( 'details', true );
		if ( this.props.lemma ) {
			this.getLemma().forEach( lemma => {
				wordTracking.add( lemma );
			} );
		}
	},

	getLemma: function() {
		if ( this.props.lemma ) {
			return this.props.lemma.split( ' ' ).filter( lemma => {
				return lemma != 'G3588';
			} );
		}

		return [];
	},

	isTracked: function() {
		return wordTracking.trackedWords.some( function( wordObject ) {
			return this.getLemma().some( lemma => {
				if ( 'undefined' !== typeof wordObject[ lemma ] ) {
					return true;
				}
			} );
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
				backgroundColor: strongsColor.get( this.getLemma()[ 0 ] )
			};
		}

		return (
			<span
				title={ this.props.lemma ? this.props.lemma : null }
				style={ wordStyle }
				className={ className }
				onClick={ this.showWordDetails }
				key={ this.props.key }
				dangerouslySetInnerHTML={{ __html: this.props.word.replace( /<dvnNm>/g, '').replace( /<!dvnNm>/g ,'' ) }} />
		);
	}
} );
