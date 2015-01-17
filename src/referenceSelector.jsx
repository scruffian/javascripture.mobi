// External
var React = require( 'react/addons' ),
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
		// hide the trays
		this.props.onChangeDisplayState();

		// load the reference
		this.props.onGoToReference( bible.parseReference( this.props.name + ' ' + this.state.chapter ) );
	},
	handleMouseMove: function( event ) {
		this.setChapter( event.clientX );
		this.props.onSetActiveBook( this.props.index );
	},
	handleTouchMove: function( event ) {
		if ( event.touches ) {
			this.setState( {
				'touchChapter': true
			} );
			this.setChapter( event.touches[0].clientX );
		}
	},
	handleTouchStart: function() {
		this.props.onSetActiveBook( this.props.index );
		this.setState( {
			'touched': true
		} );
	},
	handleTouchEnd: function( event ) {
		this.setState( {
			'touchChapter': false
		} );
	},
	setChapter: function( clientX ) {
		var width = this.getDOMNode().offsetWidth - 40,
			spacing =  width / this.props.chapters,
			chapter = Math.ceil( clientX / spacing );

		if ( chapter < 1 ) {
			chapter = 1;
		}

		if ( chapter > this.props.chapters ) {
			chapter = this.props.chapters;
		}

		this.setState( {
			chapter: chapter
		} );
	},
	render: function() {
		var buttonText = this.state.touchChapter ? this.state.chapter : 'Go',
			classes = React.addons.classSet( {
    			'book': true,
    			'active': this.props.active,
    			'touched': this.state.touched
  		} );

		return (
			<div className={ classes } onClick={ this.goToReference } onTouchStart={ this.handleTouchStart } onMouseMove={ this.handleMouseMove } onTouchMove={ this.handleTouchMove } onTouchEnd={ this.handleTouchEnd }>
				{ this.props.name } <span onTouchEnd={ this.goToReference } className="chapter-number">{ this.state.chapter }</span>
				<button onClick={ this.goToReference }>{ buttonText }</button>
			</div>
		);
	}
} );

module.exports = React.createClass( {
	getInitialState: function() {
		return {
			'active': -1
		};
	},

	handleChange: function( event ) {
		this.setState( {
			'reference': event.target.value
		} );
	},

	setActiveBook: function( book ) {
		this.setState( {
			'active': book
		} );
	},

	render: function() {
		var books = bible.Data.books.map( function( bookArray, index ) {
			var chapters = parseInt( bible.Data.verses[ index ].length ),
				active = ( this.state.active === index );
			return (
				<BookControl
					key={ index }
					index={ index }
					name={ bookArray[0] }
					chapters={ chapters }
					onSetActiveBook={ this.setActiveBook }
					onGoToReference={ this.props.onGoToReference }
					onChangeDisplayState={ this.props.onChangeDisplayState }
					active={ active } />
			);
		}, this );
		return (
			<div className="reference-selector">{ books }</div>
		);
	}
} );