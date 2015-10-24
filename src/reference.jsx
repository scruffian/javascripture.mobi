// External
var React = require( 'react' ),
	assign = require( 'lodash-node/modern/object/assign' ),
	clone = require( 'lodash-node/modern/lang/clone' ),
	debounce = require( 'lodash-node/modern/function/debounce' );

// Internal
var bible = require( './bible' ),
	api = require( './api.js' )(),
	ReferenceInput = require( './reference-input.jsx' ),
	Verse = require( './verse.jsx' );

var Chapter = React.createClass( {
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
					return ( <div key={ chapterIndex }>
						<h1>{ chapter.book } { parseInt( chapter.chapter ) }</h1>
						<ol>{ this.getVerses( chapter, chapterIndex ) }</ol>
					</div> );
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

var ReferenceComponent = React.createClass( {
	getInitialState: function() {
		return {
			sync: true,
			references: [
				{
					book: 'Genesis',
					chapter: 2,
					verse: 1,
					version: 'kjv',
					data: []
				},
				{
					book: 'Genesis',
					chapter: 2,
					verse: 1,
					version: 'original',
					data: []
				}
			]
		};
	},

	componentWillMount: function() {
		var _debouncedScroll = debounce( this.handleScroll, 100 );
		window.addEventListener( 'scroll', _debouncedScroll, false );
	},

	componentWillReceiveProps: function( nextProps ) {
		if ( nextProps.context !== this.props.context ) {
			this.callApi( nextProps.context );
		}
	},

	componentDidMount: function() {
		var self = this;
		this.callApi( this.props.context );

		this.loadReferences( this.getPreviousChapter() );
		this.loadReferences( this.getNextChapter() );

		api.on( 'change', function() {
			self.handleApiChange( this );
		} );
	},

	handleApiChange: function( apiResult ) {
		var onlyOneReference = false;
		if ( this.state.references && this.state.references[0].data.length === 1) {
			onlyOneReference = true;
		}

		var insertedAtTheBeginning = false;
		var references = this.state.references.map( function( reference ) {
			reference.data.map( function( referenceData, index ) {
				if ( this.referencesAreTheSame( referenceData, apiResult.references ) ) {
					referenceData.verses = apiResult.references.verses;
					if( index === 0 ) {
						insertedAtTheBeginning = true;
					}
				}
				return referenceData;
			}, this );
			return reference;
		}, this );

		var oldHeight = this.documentHeight();
		this.setState( { references: references }, function() {
			if( insertedAtTheBeginning && ! onlyOneReference ) {
				var newHeight = this.documentHeight();
				window.scrollBy( 0, newHeight - oldHeight );
			}
		} );
	},

	referencesAreTheSame: function( firstReference, secondReference ) {
		return firstReference.version === secondReference.version &&
			firstReference.book === secondReference.book &&
			firstReference.chapter == secondReference.chapter;
	},

	documentHeight: function() {
		var body = document.body;
		return Math.max( body.scrollHeight, body.offsetHeight );
	},

	getPreviousChapter: function() {
		return this.state.references.map( function( reference, index ) {
			var firstReference = reference.data[ 0 ];
			var nextReference = bible.parseReference( firstReference.book + ' ' + firstReference.chapter ).prevChapter().toObject();
			nextReference.version = reference.version;
			reference.data.unshift( nextReference );
			return reference;
		} );

	},

	getNextChapter: function() {
		return this.state.references.map( function( reference, index ) {
			var lastReference = reference.data[ reference.data.length - 1 ];
			var nextReference = bible.parseReference( lastReference.book + ' ' + lastReference.chapter ).nextChapter().toObject();
			nextReference.version = reference.version;
			reference.data.push( nextReference );
			return reference;
		} );
	},

	handleScroll: function( event ) {
		var scrollTolerance = 500,
			references = [];
		if ( scrollTolerance >= event.pageY ) {
			references = this.getPreviousChapter();
		}

		if ( event.pageY >= document.body.clientHeight - window.innerHeight - scrollTolerance ) {
			references = this.getNextChapter();
		}

		if ( references && references.length > 0 ) {
			this.loadReferences( references );
		}

	},

	getReferenceData: function( reference ) {
		var parsedReference = bible.parseReference( reference.book + ' ' + reference.chapter ),
			previousChapter = parsedReference.prevChapter(),
			nextChapter = parsedReference.nextChapter();

		reference.data.push( parsedReference );

		return reference;
	},

	loadReferences: function( references ) {
		this.setState( { references: references }, function() {
			this.state.references.forEach( function( reference ) {
				reference.data.forEach( function( referenceData ) {
					if ( ! referenceData.verses ) {
						referenceData.version = reference.version;
						api.getReference( referenceData );
					}
				} );
			} );

		} );
	},

	callApi: function( context ) {
		var reference = {},
			referenceString = '/';
		reference.book = context.params.book;
		reference.chapter = context.params.chapter;
		reference.verse = context.params.verse;

		referenceString += reference.book;
		if ( reference.chapter ) {
			referenceString += '/' + reference.chapter;
		}
		if ( reference.verse ) {
			referenceString += '/' + reference.verse;
		}
		localStorage.reference = referenceString;

		var firstReference = assign( clone( this.getInitialState().references[ 0 ] ), context.params );
		var references = clone( this.getInitialState().references );
		firstReference.data.push( {
			book: firstReference.book,
			chapter: firstReference.chapter
		} );
		references[ 0 ] = firstReference;

		var secondReference = assign( clone( this.getInitialState().references[ 1 ] ), context.params );
		secondReference.data.push( {
			book: secondReference.book,
			chapter: secondReference.chapter
		} );
		if ( this.state.sync ) {
			references[ 1 ] = secondReference;
		}

		this.loadReferences( references );
	},

	toggleSync: function() {
		this.setState( { sync: ! this.state.sync } );
	},

	chapters: function() {
		if ( this.state.sync ) {
			return <Chapter
				references={ this.state.references }
				reference={ this.state.references[ 0 ] }
				sync={ this.state.sync }
				onGoToReference={ this.props.onGoToReference }
				onChangeDisplayState={ this.props.onChangeDisplayState } />;
		}

		return this.state.references.map( function( reference ) {
			return <Chapter
				references={ this.state.references }
				reference={ reference }
				sync={ this.state.sync }
				onGoToReference={ this.props.onGoToReference }
				onChangeDisplayState={ this.props.onChangeDisplayState } />;
		}, this );
	},

	range: function() {
		return this.chapters();
	},

	render: function() {
		return (
			<div id="reference" className="reference">
				<input type="checkbox" name="sync" checked={ this.state.sync } onChange={ this.toggleSync } /> Sync
				{ this.range() }
			</div>
		);
	}


} );

module.exports = ReferenceComponent;
