var kjv = require( '../data/kjv.js' );
//var hebrew = require( '../data/hebrew.js' );
//var greek = require( '../data/greek.js' );

module.exports = {
	language: { //helper object to access different languages
		kjv: kjv /*,
		web: javascripture.data.web,
		greek: greek,
		hebrew: hebrew*/
	},
	books: {
		kjv: [ 'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation' ],
		web: [ 'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation' ],
		hebrew: [ 'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi' ],
		greek: [ 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation' ]
	},
	types: [
		'word',
		'lemma',
		'morph'
	],
	results: { //helper object for storing results
		references: [], //used to create an array of references
		matches: {} //used to keep track of which word has been matched when searching - for when you need to match more than one word
	},
	getReferences: function( parameters ) {
		var self = this;
		self.parameters = parameters;
		this.lookForTerm();
		this.addSnippets();
		return self.results.references;
	},
	addSnippets: function() {
		var self = this;
		this.results.references.forEach( function( reference ) {
			reference.snippet = self.language.kjv[ reference.book ][ reference.chapter - 1 ][ reference.verse - 1 ];
		} );
	},
	doesDataMatchTerm: function( type, data, term ) {
		var self = this;
		data = data.toLowerCase();
		term = term.toLowerCase();
		if ( data === term ) { //exact match
			return true;
		}
		/*this get very complex
		if (data.indexOf( ' ' + term + ' ') > -1 ) { //part of a string
			return true;
		}
		if (data.indexOf( ' ' + term + ',') > -1 ) { //part of a string
			return true;
		}
		if (data.indexOf( ' ' + term + '.') > -1 ) { //part of a string
			return true;
		}
		if (data.indexOf( ' ' + term + ';') > -1 ) { //part of a string
			return true;
		}
		if (data.indexOf( ' ' + term + ':') > -1 ) { //part of a string
			return true;
		}
		if (data.indexOf( term + ' ') === 0 ) { //start of a string
			return true;
		}
		if (data.indexOf( ' ' + term) === 0 ) { //start of a string
			return true;
		}*/
		//skip this for lemma
		if ( type !== 'lemma' && ! self.parameters.strict ) {
			if ( data.search( term ) > -1 ) {
				return true;
			}
		}
		return false;
	},
	resetMatches: function() {
		this.results.matches = {};
	},
	addReference: function( bookName, chapterNumber, verseNumber, positionInVerse ) {
		this.results.references.push( {
			book: bookName,
			chapter: chapterNumber + 1,
			verse: verseNumber + 1,
			positionInVerse: positionInVerse
		} );
	},
	lookForTerm: function() {
		var self = this,
			parameters = self.parameters;
		if ( 'undefined' === typeof parameters.language ) {
			parameters.language = self.inferLanguage( parameters );
		}

		var dataSource = this.language[ parameters.language ]; //work out what language to search in
		self.results.references = [];
		self.resetMatches();

		var booksToSearch = this.books[ parameters.language ];
		booksToSearch.forEach( function( bookName, bookNumber ) {
			self.searchInABook( dataSource, bookName, bookNumber, booksToSearch );
		} );
	},
	searchInABook: function( dataSource, bookName, bookNumber, booksToSearch ) {
		var self = this,
			parameters = self.parameters,
			book = dataSource[ bookName ];

		//work out how many terms there are
		var termsLength = 0;
		for ( var typeKey in self.types ) {
			var type = self.types[ typeKey ],
				termString = parameters[ type ];

			if ( termString !== undefined && termString !== '' ) {
				var terms = termString.split( ' ' );
				termsLength = termsLength + terms.length;
			}
		}

		//		$( document ).trigger( 'loading', 'searching ' + bookName );

		book.forEach( function( chapter, chapterNumber ) {

			if ( parameters.range === 'chapter' && parameters.clusivity === 'exclusive' ) { //only need to do this for exclusive searches
				self.resetMatches();
			}
			chapter.forEach( function( verse, verseNumber ) {
				if ( parameters.range === 'verse' && parameters.clusivity === 'exclusive' ) { //only need to do this for exclusive searches
					self.resetMatches();
				}

				verse.forEach( function( word, positionInVerse ) {
					if ( parameters.range === 'word' && parameters.clusivity === 'exclusive' ) { //only need to do this for exclusive searches
						self.resetMatches();
					}

					var matchesLength, termString;

					//now loop through types
					self.types.forEach( function( type, typeKey ) {
						//							var type = self.types[typeKey];
						termString = parameters[ type ];

						if ( self.areTheTermStringAndWordObjectAreGoodToSearch( termString, word, typeKey ) ) {
							if ( word[ typeKey ] ) {
								var terms = termString.split( ' ' ),
									wordTypes = word[ typeKey ].split( / |\// ); //because sometimes words have spaces in them and lemma/morph sometimes have slashes now
								wordTypes.forEach( function( wordType ) {
									terms.forEach( function( term ) {
										if ( self.doesDataMatchTerm( type, wordType, term ) ) {
											if ( parameters.clusivity === 'exclusive' ) {
												self.results.matches[ term ] = true;
											} else {
												self.addReference( bookName, chapterNumber, verseNumber, positionInVerse );
											}
										}
									} );
								} );
							}
						}
					} );
					//terms are combined for exclusive searches here
					if ( parameters.clusivity === 'exclusive' ) {
						matchesLength = 0;

						//						$.each(self.results.matches, function () {
						//							matchesLength++;
						//						});
						matchesLength = Object.keys( self.results.matches ).length;

						if ( matchesLength > 0 && matchesLength >= termsLength ) {
							self.addReference( bookName, chapterNumber, verseNumber, positionInVerse );
							self.resetMatches(); //not sure if resetting is the right thing to do here - need to work out how to count matches in the same verse mulipule times
						}
					}


				} );
			} );
		} );
		if ( bookNumber === booksToSearch.length - 1 ) {
			//			self.deferred.resolve();
		}
	},
	standarizeWordEndings: function( word ) {
		return word.replace( /ם/gi, 'מ' );
	},
	inferLanguage: function( parameters ) {
		var language = 'kjv';
		if ( parameters.lemma.substr( 0, 1 ) === 'H' ) {
			language = 'hebrew';
		}
		if ( parameters.lemma.substr( 0, 1 ) === 'G' ) {
			language = 'greek';
		}
		return language;
	},
	areTheTermStringAndWordObjectAreGoodToSearch: function( termString, wordObject, typeKey ) {
		return termString !== undefined && termString !== '' && wordObject !== undefined && typeof wordObject[ typeKey ] !== 'undefined'; //sometimes wordObjects are undefined in hebrew
	},
	countResults: function() {
		return this.results.references.length;
	}
};
