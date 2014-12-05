// External
var React = require( 'react' ),
	page = require( 'page' );

module.exports = function () {
	var Home = React.createClass( {
		handleChange: function( event ) {
			this.setState( {
				'reference': event.target.value
			} );
		},

		goToReference: function( event ) {
			event.preventDefault();
			page( this.state.reference );
		},

		render: function() {
			return (
				<div className="home">
					<form onSubmit={ this.goToReference }>
						<input type="text" onChange={ this.handleChange } />
					</form>
				</div>
			);
		}
	} );
	React.render(
		<Home />,
		document.getElementById('javascripture')
	);
};