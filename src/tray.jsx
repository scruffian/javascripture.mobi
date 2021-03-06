// External
var React = require( 'react' ),
	classnames = require( 'classnames' );

// Internal
var ReferenceSelector = require( './referenceSelector.jsx' ),
	WordDetails = require( './wordDetails.jsx' );
//	settings = require( './settings.js' )();

var TrayButton = React.createClass( {
	handleClick: function() {
		this.props.onChangeDisplayState( this.props.target );
	},

	render: function() {
		var className = this.props.open ? 'open' : '';
		return (
			<button onClick={ this.handleClick } className={ className }>
				<span className="text">{ this.props.text }</span>
				<span className="icon"><img src={ this.props.icon } /></span>
			</button>
		);
	}
} );

var TrayTarget = React.createClass( {
	render: function() {
		var classes = classnames( {
			'tray-target': true,
			open: this.props.open,
			right: this.props.right
		} );

		return (
			<div key={ this.props.name } className={ classes }>{ this.props.content }</div>
		);
	}
} );

var Settings = React.createClass( {

	getInitialState: function() {
		return {
		};
	},

	render: function() {
		return (
			<div>
				<h2>Settings</h2>
			</div>
		);
	}
} );

var TrayTargets = React.createClass( {
	render: function() {
		var referenceSelector = <ReferenceSelector onChangeDisplayState={ this.props.onChangeDisplayState } onGoToReference={ this.props.onGoToReference } />,
			wordDetails = <WordDetails context={ this.props.context } />,
			search = 'search',
			bookmarks = 'bookmarks',
			settingsWha = <Settings />;

		return (
			<div className="tray-targets">
				<TrayTarget name="details" open={ this.props.displayState.details } content={ wordDetails } />
				<TrayTarget name="search" open={ this.props.displayState.search } content={ search } />
				<TrayTarget name="bookmarks" open={ this.props.displayState.bookmarks } content={ bookmarks } />
				<TrayTarget name="settings" open={ this.props.displayState.settings } content={ settingsWha } />
				<TrayTarget name="goto" open={ this.props.displayState.goto } content={ referenceSelector } />
			</div>
		);
	}
} );

module.exports = React.createClass( {
	render: function() {
		return (
			<div>
				<TrayTargets context={ this.props.context } displayState={ this.props.displayState } onGoToReference={ this.props.onGoToReference } onChangeDisplayState={ this.props.onChangeDisplayState } />
				<div className="tray">
					<TrayButton icon="/assets/icons/book2.svg" open={ this.props.displayState.goto } text="Go to" target="goto" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton icon="/assets/icons/eye.svg" open={ this.props.displayState.details }text="Details" target="details" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton icon="/assets/icons/search.svg" open={ this.props.displayState.search } text="Search" target="search" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton icon="/assets/icons/bookmark.svg" open={ this.props.displayState.bookmarks } text="Bookmarks" target="bookmarks" onChangeDisplayState={ this.props.onChangeDisplayState } />
					<TrayButton icon="/assets/icons/cog.svg" open={ this.props.displayState.settings } text="Settings" target="settings" onChangeDisplayState={ this.props.onChangeDisplayState } />
				</div>
			</div>
		);
	}
} );
