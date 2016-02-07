javascripture.src.referenceApi = {
	get: function( reference ) {
		return this.getChapter( reference );
	},

	getReferences: function( references ) {
		var returnReferences = [];
		references.forEach( reference => {
			returnReferences.push( this.get( reference ) );
		}, this );

		return returnReferences;
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
		var sourceData = javascripture.data.kjv;
		if ( 'original' === version ) {
			sourceData = javascripture.data.hebrew;
			if ( bible.Data.ntBooks.indexOf( reference.book ) > -1 ) {
				sourceData = javascripture.data.greek;
			}
		}

		return sourceData[ reference.book ][ reference.chapter - 1 ];
	}
};

module.exports = javascripture.src.referenceApi;
