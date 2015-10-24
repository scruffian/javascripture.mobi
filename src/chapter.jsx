// External
var React = require( 'react' );

// Internal
var ReferenceInput = require( './reference-input.jsx' ),
	Verse = require( './verse.jsx' );

module.exports = React.createClass( {
	getSyncedVerses: function( chapter, chapterIndex, verseIndex ) {
		if ( this.props.sync ) {
			return this.props.references.map( function( reference, counter ) {
				if ( counter > 0 && typeof reference.data[ chapterIndex ].verses !== 'undefined' ) {
					return <Verse key={ counter } verse={ reference.data[ chapterIndex ].verses[ verseIndex ] } columns={ this.props.sync } number={ verseIndex + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />;
				}
			}, this );
		}
	},

	ref: function() {
		return this.props.reference.book + ':' + this.props.reference.chapter;
	},

	getVerses: function( chapter, chapterIndex ) {
		if ( chapter.verses ) {
			return chapter.verses.map( function( verse, verseIndex ) {
				return (
					<li key={ verseIndex } ref={ this.ref() }>
						<Verse verse={ verse } columns={ this.props.sync } number={ verseIndex + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />
						{ this.getSyncedVerses( chapter, chapterIndex, verseIndex ) }
					</li>
				);
			}, this );
		}
	},

	render: function() {
		var classNames = 'chapter',
			chapters;
		if ( ! this.props.sync ) {
			classNames += ' columns';
		}

		if ( this.props.reference.data ) {
			chapters = this.props.reference.data.map( function( chapter, chapterIndex ) {
				if ( chapter.verses ) {
					return (
						<div key={ chapterIndex }>
							<h1>{ chapter.book } { parseInt( chapter.chapter ) }</h1>
							<ol>{ this.getVerses( chapter, chapterIndex ) }</ol>
						</div>
					);
				}
			}, this );
		}

		return (
			<div className={ classNames }>
				<ReferenceInput reference={ this.props.reference } onGoToReference={ this.props.onGoToReference } />
				{ chapters }
			</div>
		);
	}
} );
