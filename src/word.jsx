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
			return this.props.lemma.split( ' ' ).filter( function( lemma ) {
				return lemma != 'G3588';
			} );
		}

		return [];
	},

	isTracked: function() {
		return wordTracking.trackedWords.some( function( wordObject ) {
			return this.getLemma().some( function( lemma ) {
				if ( 'undefined' !== typeof wordObject[ lemma ] ) {
					return true;
				}
			} );
		}, this );
	},

	render: function() {
		var className = 'word ',
			wordStyle = {},
			output,
			wordArray,
			wordArrayEnd;

		if ( this.props.lemma ) {
			className += ' ' + this.props.lemma;
		}

		if ( this.isTracked() && this.props.lemma ) {
			wordStyle = {
				color: 'white',
				backgroundColor: strongsColor.get( this.getLemma()[ 0 ] )
			};
		}

		wordArrayEnd = this.props.word.split( '<!dvnNm>' );
		if ( wordArrayEnd.length > 1 ) {
			wordArray = wordArrayEnd[0].split( '<dvnNm>' );
			if ( wordArrayEnd[ 1 ] ) {
				wordArray.push( wordArrayEnd[ 1 ] );
			}

			output = wordArray.map( ( word, index ) => {
				if ( index === 1 ) {
					className += ' dvnNm';
				}
				return (
					<span
						title={ this.props.lemma ? this.props.lemma : null }
						style={ wordStyle }
						className={ className }
						onClick={ this.showWordDetails }
						key={ this.props.key + '_' + index }>
						{ word }
					</span>
				);
			}, this );

		} else {
			return (
				<span
					title={ this.props.lemma ? this.props.lemma : null }
					style={ wordStyle }
					className={ className }
					onClick={ this.showWordDetails }
					key={ this.props.key + '_' + 0 }>
					{ this.props.word }
				</span>
			);
		}


		return (
			<span>
				{ output }
			</span>
		);
	}
} );
