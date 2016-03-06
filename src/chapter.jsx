/*global javascripture*/

// External
var React = require( 'react' );

// Internal
var bible = javascripture.src.bible,
	Verse = require( './verse.jsx' );

module.exports = React.createClass( {
	ref: function() {
		return this.props.chapter.book + ' ' + this.props.chapter.chapter;
	},

	getVersion: function( version, bookName ) {
		if ( version !== 'original' ) {
			return version;
		}

		if ( bible.Data.otBooks.indexOf( bookName ) > -1 ) {
			return 'hebrew';
		}

		return 'greek';
	},

	getSyncedVerses: function( chapter, chapterIndex, verseIndex ) {
		if ( this.props.sync ) {
			return this.props.references.map( function( reference, counter ) {
				if ( counter > 0 && typeof reference.data[ chapterIndex ].verses !== 'undefined' ) {
					return <Verse
						reference={ chapter }
						verseNumber={ verseIndex + 1 }
						key={ counter }
						verse={ reference.data[ chapterIndex ].verses[ verseIndex ] }
						columns={ this.props.sync }
						number={ verseIndex + 1 }
						version={ this.getVersion( reference.version, reference.book ) }
						onChangeDisplayState={ this.props.onChangeDisplayState }
						ignoreScrollEvents={ this.props.ignoreScrollEvents } />;
				}
			}, this );
		}
	},

	getVerses: function( chapter, chapterIndex ) {
		if ( chapter.verses ) {
			return chapter.verses.map( function( verse, verseIndex ) {
				return (
					<li key={ verseIndex } ref={ this.ref() }>
						<Verse
							reference={ chapter }
							verseNumber={ verseIndex + 1 }
							verse={ verse }
							columns={ this.props.sync }
							number={ verseIndex + 1 }
							version={ this.getVersion( this.props.reference.version, chapter.book ) }
							onChangeDisplayState={ this.props.onChangeDisplayState }
							ignoreScrollEvents={ this.props.ignoreScrollEvents } />
						{ this.getSyncedVerses( chapter, chapterIndex, verseIndex ) }
					</li>
				);
			}, this );
		}
	},

	render: function() {
		return (
			<div key={ this.props.chapterIndex }>
				<h1>
					{ this.props.chapter.book } { parseInt( this.props.chapter.chapter ) }
				</h1>
				<ol>
					{ this.getVerses( this.props.chapter, this.props.chapterIndex, this.props.chapter.book ) }
				</ol>
			</div>
		);
	}
} );

