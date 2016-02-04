// External
var React = require( 'react' );

// Internal
var bible = javascripture.src.bible;

module.exports = React.createClass( {

	getInitialState: function() {
		return {
			focussed: false,
			reference: 'Genesis 1'
		};
	},

	componentWillMount: function() {
	    window.addEventListener( 'keydown', this.boundKeyHandler, false );
	},

	boundKeyHandler: function() {
		this.referenceInput.focus();
		if ( ! this.state.focussed ) {
			this.setState( {
				focussed: true,
				reference: ''
			} );
		}
	},

	componentWillReceiveProps: function( nextProps ) {
		this.setStateFromProps( nextProps.reference );
	},

	setStateFromProps: function( reference ) {
		this.setState( {
			reference: reference.book + ' ' + reference.chapter
		} );
	},

	handleChange: function( event ) {
		this.setState( {
			reference: event.target.value
		} );
	},

	goToReference: function( event ) {
		event.preventDefault();
		this.props.onGoToReference( bible.parseReference( this.state.reference ) );
		this.referenceInput.blur();
		this.setState( {
			focussed: false
		} );
	},

	render: function() {
		return (
			<div className="reference-input">
				<form onSubmit={ this.goToReference }>
					<input
						type="text"
						ref={ ( ref ) => this.referenceInput = ref }
						value={ this.state.reference }
						onChange={ this.handleChange }
						onFocus={ this.handleFocus } />
				</form>
			</div>
		);
	}
} );
