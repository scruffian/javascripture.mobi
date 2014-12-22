// External
var React = require( 'react/addons' );

// Internal
var ReferenceSelector = require( './referenceSelector.jsx' ),
	wordTracking = require( './wordTracking.js' );

var TrayButton = React.createClass( {
	handleClick: function() {
		this.props.openEvent( this.props.target );
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
			'open': this.props.open
		} );

		return (
			<div key={ this.props.name } className={ classes }>{ this.props.content }</div>
		);
	}
} );

var WordDetails = React.createClass( {
	render: function() {
		var words = wordTracking.trackedWords.map( function( lemma ) {
			return ( <div key="lemma">{ lemma }</div> );
		} );
		return (
			<div className="word-details">{ words }</div>
		);
	}
} );

var TrayTargets = React.createClass( {
	render: function() {
		var referenceSelector = <ReferenceSelector />,
			wordDetails = <WordDetails />,
			search = 'search',
			bookmarks = 'bookmarks',
			settings = 'settings';

		return (
			<div className="tray-targets">
				<TrayTarget name="goto" open={ this.props.openTrays.goto } content={ referenceSelector } />
				<TrayTarget name="details" open={ this.props.openTrays.details } content={ wordDetails } />
				<TrayTarget name="search" open={ this.props.openTrays.search } content={ search } />
				<TrayTarget name="bookmarks" open={ this.props.openTrays.bookmarks } content={ bookmarks } />
				<TrayTarget name="settings" open={ this.props.openTrays.settings } content={ settings } />
			</div>
		);
	}
} );

module.exports = React.createClass( {
	getInitialState: function() {
		return {
			goto: false,
			details: false,
			search: false,
			bookmarks: false,
			settings: false
		};
	},
	openTray: function( target ) {
		var state = this.getInitialState();
		if ( this.state[ target ] ) {
			state[ target ] = false;
		} else {
			state[ target ] = true;
		}
		this.setState( state );
	},
	render: function() {
		return (
			<div>
				<TrayTargets openTrays={ this.state } />
				<div className="tray">
					<TrayButton text="Go to" target="goto" openEvent={ this.openTray } />
					<TrayButton text="Details" target="details" openEvent={ this.openTray } />
					<TrayButton text="Search" target="search" openEvent={ this.openTray } />
					<TrayButton text="Bookmarks" target="bookmarks" openEvent={ this.openTray } />
					<TrayButton text="Settings" target="settings" openEvent={ this.openTray } />
				</div>
			</div>
		);
	}
} );