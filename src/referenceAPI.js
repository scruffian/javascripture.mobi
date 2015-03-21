var kjv = require( '../data/kjv.js' );

module.exports = {
	get: function( reference ) {
		primaryReference = {
			book: reference.book,
			chapter: parseInt( reference.chapter ),
			verse: reference.verse
		};
		secondaryReference = {
			book: reference.book,
			chapter: parseInt( reference.chapter ) + 1,
			verse: reference.verse
		};

		return {
			'primary': this.getChapterData( primaryReference, kjv ),
			'secondary': this.getChapterData( secondaryReference, kjv )
		};
	},
	getChapterData: function( reference, version ) {
		return {
			reference: reference,
			data: version[ reference.book ][ reference.chapter - 1 ]
		};
	},
	getThreeChapters: function( reference ) {
		var testament = this.getTestament( reference.book );

		var result = {
			reference: reference
		};

		reference.rightData = reference.rightVersion;
		reference.leftData = reference.leftVersion;
		if ( "original" === reference.rightVersion || "lc" === reference.rightVersion ) {
			reference.rightData = testament;
		}

		if ( "original" === reference.leftVersion || "lc" === reference.leftVersion ) {
			reference.leftData = testament;
		}

		var self = this;
		var book = reference.book;
		var prev = self.getOffsetChapter( reference, -1 );
		var next = self.getOffsetChapter( reference, 1 );

		if ( prev.book ) {
			result.prev = prev;
		}
		if ( next.book ) {
			result.next = next;
		}

		result.leftVersion = reference.leftVersion;
		result.rightVersion = reference.rightVersion;
		if ( javascripture.data.hebrew[ book ] ) {
			result.testament = 'hebrew';
		} else {
			result.testament = 'greek';
		}

		result.chapters = [];

		//add the previous chapter if it exists
		if ( prev.book ) {
			result.chapters.push( referenceAPI.getChapterData( prev ) );
		}

		result.chapters.push( referenceAPI.getChapterData( reference ) );
		//add the next chapter if it exists
		if ( next.book ) {
			result.chapters.push( referenceAPI.getChapterData( next ) );
		}
		return result;
	},
	getTestament: function( book ) {
		if ( javascripture.data.hebrew[ book ] ) {
			return 'hebrew';
		} else {
			return 'greek';
		}
	},
	/*getChapterData: function( reference ) {
		var book = reference.book,
			chapter = reference.chapter,
			chapterInArray = chapter - 1,
			result = {},
			testament = this.getTestament( book );

		result.book = book;
		result.chapter = chapter;
		if ( reference.verse ) {
			result.verse = reference.verse;
		} else {
			result.verse = 0;
		}

		if ( javascripture.data[ reference.rightData ] && javascripture.data[ reference.rightData ][ book ] && javascripture.data[ reference.rightData ][ book ][ chapterInArray ] ) {
			result.right = javascripture.data[ reference.rightData ][ book ][ chapterInArray ];

			if( javascripture.data[ reference.leftData ][ book ] && javascripture.data[ testament ][ book ][ chapterInArray ] ) {
				result.left = javascripture.data[ reference.leftData ][ book ][ chapterInArray ];
			}
		}
		return result;
	},*/
	getOffsetChapter: function( reference, offset ) {
		var book = reference.book;
		var chapter = reference.chapter;
		var offsetChapter = {
			leftData: reference.leftData,
			rightData: reference.rightData
		};
		var offsetChapterNumber = parseInt( chapter, 10 ) + offset;
		var offsetNumberJavascript = offsetChapterNumber - 1;
		var offsetBook;
		if ( javascripture.data[ reference.rightData ][ book ] && javascripture.data[ reference.rightData ][ book ][ offsetNumberJavascript ] !== undefined ) {
			offsetChapter.book = book;
			offsetChapter.chapter = offsetChapterNumber;
		} else {
			//get the offset book
			bible.Data.books.forEach( function( loopBookArray, index ) {
				if ( loopBookArray[ 0 ] === book ) {
					offsetBook = index + offset;
					if ( bible.Data.books[ offsetBook ] !== undefined ) {
						offsetChapter.book = bible.Data.books[ offsetBook ][ 0 ];
						//only supports offsets of 1 or -1. to make it work with bigger values this will have to change
						if ( offset > 0 ) {
							offsetChapter.chapter = 1;
						} else {
							offsetChapter.chapter = bible.Data.verses[ offsetBook ].length;
						}
					}
				}
			} );
		}
		return offsetChapter;
	}
};
