var bible = require( './bible' ),
	kjv = require( '../data/kjv.js' ),
	hebrew = {}, //require( '../data/hebrew.js' ),
	greek = require( '../data/greek.js' );

var clone = require( 'lodash-node/modern/lang/clone' );

module.exports = {
	get: function( reference ) {
		return this.getChapter( reference );
		/*return references.map( function( reference ) {
			return this.getChapter( reference );
		}.bind( this ) );*/
	},

	getThree: function( references ) {
		return references.map( function( reference ) {
			return this.getThreeChapters( reference );
		}.bind( this ) );
	},

	getThreeChapters: function( reference ) {
		var referenceString = reference.book + ' ' + reference.chapter,
			previousChapter = bible.parseReference( referenceString ).prevChapter().toObject(),
			currentChapter = bible.parseReference( referenceString ).toObject(),
			nextChapter = bible.parseReference( referenceString ).nextChapter().toObject();

		previousChapter.verses = this.getChapterData( previousChapter, reference.version );
		currentChapter.verses = this.getChapterData( currentChapter, reference.version );
		nextChapter.verses = this.getChapterData( nextChapter, reference.version );

		return [ previousChapter, currentChapter, nextChapter ];
	},

	getChapter: function( reference ) {
		var referenceString = reference.book + ' ' + reference.chapter;
		var currentChapter = bible.parseReference( referenceString ).toObject();
		currentChapter.version = reference.version;
		currentChapter.verses = this.getChapterData( currentChapter, reference.version );
		return currentChapter;
	},

	getChapterData: function( reference, version ) {
		var sourceData = kjv;
		if ( 'original' === version ) {
			sourceData = hebrew;
			if ( bible.Data.ntBooks.indexOf( reference.book ) > -1 ) {
				sourceData = greek;
			}
		}

		return sourceData[ reference.book ][ reference.chapter - 1 ];
	}
};
