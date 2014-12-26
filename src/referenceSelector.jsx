// External
var React = require( 'react' ),
	page = require( 'page' );

// Internal
var bible = require( './bible.js' );

var BookControl = React.createClass( {
	getInitialState: function() {
		return {
			chapter: 1
		};
	},
	goToReference: function( event ) {
		var hasScrolled = false,
			verticalMovement;
		console.log( this.state.clientY );
		console.log( event );
		if ( event.touches && this.state.clientY ) {

			verticalMovement = this.state.clientY - event.touches[0].clientY;
			alert( 'verticalMovement:  ' + verticalMovement  );
			if ( verticalMovement > 20 || verticalMovement < -20 ) {
				hasScrolled = true;
			}

		}
		if ( ! hasScrolled ) {
			// hide the trays
			this.props.onChangeDisplayState();
			page( '/' + this.props.name + '/' + this.state.chapter );
		}
	},
	handleMouseMove: function( event ) {
		this.setChapter( event.clientX );
	},
	handleTouchMove: function( event ) {
		if ( event.touches ) {
			this.setChapter( event.touches[0].clientX );
		}
	},
	touchStart: function( event ) {
		if ( event.touches ) {
			this.setState( {
				clientY: event.touches[0].clientY
			} );
		}
	},
	setChapter: function( clientX ) {
		var width = this.getDOMNode().offsetWidth,
			spacing =  width / this.props.chapters,
			chapter = Math.ceil( clientX / spacing );

		this.setState( {
			chapter: chapter
		} );
	},
	render: function() {
		return (
			<div onClick={ this.goToReference } onTouchEnd={ this.goToReference } onTouchStart={ this.handleTouchStart } onMouseMove={ this.handleMouseMove } onTouchMove={ this.handleTouchMove }>
				{ this.props.name } { this.state.chapter }
			</div>
		);
	}
} );

module.exports = React.createClass( {
	handleChange: function( event ) {
		this.setState( {
			'reference': event.target.value
		} );
	},

	render: function() {
		var books = bible.Data.books.map( function( bookArray, index ) {
			var chapters = parseInt( bible.Data.verses[ index ].length ) - 1;
			return (
				<BookControl key={ index } name={ bookArray[0] } chapters={ chapters } onChangeDisplayState={ this.props.onChangeDisplayState } />
			);
		}, this );
		return (
			<div className="reference-selector">{ books }</div>
		);
	}
} );