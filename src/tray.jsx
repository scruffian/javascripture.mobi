// External
var React = require( 'react/addons' );

// Internal
var ReferenceSelector = require( './referenceSelector.jsx' ),
	WordDetails = require( './wordDetails.jsx' );

var TrayButton = React.createClass( {
	handleClick: function() {
		this.props.onChangeDisplayState( this.props.target );
	},
	render: function() {
		return (
			<button onClick={ this.handleClick }>{ this.props.text }</button>
		);
	}
} );

var TrayTarget = React.createClass( {
	render: function() {
		var classes = React.addons.classSet( {
			'tray-target': true,
			'open': this.props.open,
			'right': this.props.right
		} );

		return (
			<div key={ this.props.name } className={ classes }>{ this.props.content }</div>
		);
	}
} );

var TrayTargets = React.createClass( {
	render: function() {
		var referenceSelector = <ReferenceSelector onChangeDisplayState={ this.props.onChangeDisplayState } />,
			wordDetails = <WordDetails />,
			search = 'search',
			bookmarks = 'bookmarks',
			settings = 'settings';

		return (
			<div className="tray-targets">
				<TrayTarget name="goto" open={ this.props.displayState.goto } content={ referenceSelector } />
				<TrayTarget name="details" open={ this.props.displayState.details } content={ wordDetails } right="true" />
				<TrayTarget name="search" open={ this.props.displayState.search } content={ search } />
				<TrayTarget name="bookmarks" open={ this.props.displayState.bookmarks } content={ bookmarks } />
				<TrayTarget name="settings" open={ this.props.displayState.settings } content={ settings } />
			</div>
		);
	}
} );

module.exports = React.createClass( {
	render: function() {
		return (
			<div>
				<TrayTargets displayState={ this.props.displayState } onChangeDisplayState={ this.props.onChangeDisplayState } />
				<div className="tray">
					<TrayButton text="Go to" target="goto" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton text="Details" target="details" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton text="Search" target="search" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton text="Bookmarks" target="bookmarks" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton text="Settings" target="settings" onChangeDisplayState={ this.props.onChangeDisplayState } />
				</div>
			</div>
		);
	}
} );