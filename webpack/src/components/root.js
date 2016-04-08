import React from 'react';
import { Link, browserHistory } from 'react-router';
import TrayButton from './tray-button';

export default function Root( { children } ) {
	return (
		<div>
			<header>
				Links:
				{' '}
				<Link to="/">Home</Link>
				{' '}
				<Link to="/about">About</Link>
			</header>
			<div style={{ marginTop: '1.5em' }}>{ children }</div>
			<footer>
				<div className="tray">
					<TrayButton icon="/assets/icons/book2.svg" text="Go to" target="goto" />
					<TrayButton icon="/assets/icons/eye.svg" text="Details" target="details" />
					<TrayButton icon="/assets/icons/search.svg" text="Search" target="search" />
					<TrayButton icon="/assets/icons/bookmark.svg" text="Bookmarks" target="bookmarks" />
					<TrayButton icon="/assets/icons/cog.svg" text="Settings" target="settings" />
				</div>
			</footer>
		</div>
	)
}
