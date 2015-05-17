// External
var React = require( 'react' );

// Internal
var bible = require( './bible.js' );

module.exports = React.createClass( {

	getInitialState: function() {
		return {
			reference: bible.parseReference( 'Genesis 1' )
		};
	},

	componentWillReceiveProps: function( nextProps ) {
		if ( nextProps.reference ) {
			this.setState( {
				reference: bible.parseReference( nextProps.reference.book + ' ' + nextProps.reference.chapter + ' ' + nextProps.reference.verse )
			} );
		}
	},

	handleChange: function( event ) {
		this.setState( {
			'reference': event.target.value
		} );
	},

	goToReference: function( event ) {
		event.preventDefault();
		this.props.onGoToReference( this.state.reference );
	},

	render: function() {
		var reference = this.props.reference.book + ' ' + this.props.reference.chapter + ':' + this.props.reference.verse;
		return (
			<div className="reference-input">
				<form onSubmit={ this.goToReference }>
					<input type="text" value={ reference } onChange={ this.handleChange } />
				</form>
			</div>
		);
	}
} );
