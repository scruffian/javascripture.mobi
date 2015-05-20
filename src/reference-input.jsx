// External
var React = require( 'react' );

// Internal
var bible = require( './bible.js' );

module.exports = React.createClass( {

	getInitialState: function() {
		return {
			reference: 'Genesis 1:1'
		};
	},

	componentWillMount: function() {
		this.setStateFromProps( this.props.reference );
	},

	componentWillReceiveProps: function( nextProps ) {
		this.setStateFromProps( nextProps.reference );
	},

	setStateFromProps: function( reference ) {
		this.setState( {
			reference: reference.book + ' ' + reference.chapter + ':' + reference.verse
		} );
	},

	handleChange: function( event ) {
		this.setState( {
			reference: event.target.value
		} );
	},

	handleFocus: function() {
		this.setState( {
			reference: ''
		} );
	},

	goToReference: function( event ) {
		event.preventDefault();
		this.props.onGoToReference( bible.parseReference( this.state.reference ) );
	},

	render: function() {
		return (
			<div className="reference-input">
				<form onSubmit={ this.goToReference }>
					<input
						type="text"
						value={ this.state.reference }
						onChange={ this.handleChange }
						onFocus={ this.handleFocus } />
				</form>
			</div>
		);
	}
} );
