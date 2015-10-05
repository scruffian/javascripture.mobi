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
				if ( counter > 0 ) {
					return <Verse key={ counter } verse={ reference.data[ chapterIndex ].verses[ verseIndex ] } columns={ this.props.sync } number={ verseIndex + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />;
				}
			}, this );
		}
	},

	ref: function() {
		return this.props.reference.book + ':' + this.props.reference.chapter;
	},

	getVerses: function( chapter, chapterIndex ) {
		return chapter.verses.map( function( verse, verseIndex ) {
			return (
				<li key={ verseIndex } ref={ this.ref() }>
					<Verse verse={ verse } columns={ this.props.sync } number={ verseIndex + 1 } onChangeDisplayState={ this.props.onChangeDisplayState } />
					{ this.getSyncedVerses( chapter, chapterIndex, verseIndex ) }
				</li>
			);
		}, this );
	},

	render: function() {
		var classNames = 'chapter',
			chapters;
		if ( ! this.props.sync ) {
			classNames += ' columns';
		}

		if ( this.props.reference.data ) {
			chapters = this.props.reference.data.map( function( chapter, chapterIndex ) {
				return <div key={ chapterIndex }>
					<h1>{ chapter.book } { parseInt( chapter.chapter ) }</h1>
					<ol>{ this.getVerses( chapter, chapterIndex ) }</ol>
				</div>;
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
					data: [
						{
							book: 'Genesis',
							chapter: 1,
							verses: []
						},
						{
							book: 'Genesis',
							chapter: 2,
							verses: []
						},
						{
							book: 'Genesis',
							chapter: 3,
							verses: []
						}
					]
				},
				{
					book: 'Genesis',
					chapter: 2,
					verse: 1,
					version: 'original',
					data: [
						{
							book: 'Genesis',
							chapter: 1,
							verses: []
						},
						{
							book: 'Genesis',
							chapter: 2,
							verses: []
						},
						{
							book: 'Genesis',
							chapter: 3,
							verses: []
						}
					]
				}
			]
		};
	},

	componentWillMount: function() {
		var _debouncedScroll = debounce( this.handleScroll, 100 );
		window.addEventListener( 'scroll', _debouncedScroll, false );
	},

	componentDidMount: function() {
		var self = this;
		this.callApi( this.props.context );
		api.on( 'change', function() {
			var references = self.state.references.map( function( reference, index ) {
				reference.data = this.references[ index ];
				return reference;
			}, this );
			self.setState( { references: references } );
		} );
	},

	componentWillReceiveProps: function( nextProps ) {
		this.callApi( nextProps.context );
	},

	handleScroll: function( event ) {
		var newReferences = [];
		if ( 0 >= event.pageY ) {
			// take off the last reference
			var newReferences = clone( this.state.references );
			newReferences.pop();
			// newReferences now had the last reference removed

			// add a new reference at the front
			var firstReference = bible.parseReference( newReferences[ 0 ].book + ' ' newReferences[ 0 ].chapter ).prevChapter.toObject();
			firstReference.version = newReferences[ 0 ].version;

			//newReferences


			this.state.references.map( function( reference ) {
				var newReference = bible.parseReference( reference.book + ' ' + reference.chapter ).prevChapter().toObject();
				newReference.version = reference.version;
				return newReference;
			} );
		}

		if ( event.pageY >= document.body.clientHeight - window.innerHeight ) {

			// use shift

			newReferences = this.state.references.map( function( reference ) {
				var newReference = bible.parseReference( reference.book + ' ' + reference.chapter ).nextChapter().toObject();
				newReference.version = reference.version;
				return newReference;
			} );
		}

		if ( newReferences && newReferences.length > 0 ) {
			this.loadReferences( newReferences );
		}
	},

	placeholderVerses: function( reference ) {
		var verses = [],
			i = 0;
		while ( i < bible.Data.verses[ reference.bookID ][ reference.chapter ] ) {
			verses.push( [ [ '&nbsp;' ] ] );
			i++;
		}
		return verses;
	},

	getReferenceDataWithVerses: function( reference ) {
		var referenceObject = reference.toObject();
		referenceObject.verses = this.placeholderVerses( reference );
		return referenceObject;
	},

	getReferenceData: function( reference ) {
		var parsedReference = bible.parseReference( reference.book + ' ' + reference.chapter ),
			previousChapter = parsedReference.prevChapter(),
			nextChapter = parsedReference.nextChapter();

		reference.data = [
			this.getReferenceDataWithVerses( previousChapter ),
			this.getReferenceDataWithVerses( parsedReference ),
			this.getReferenceDataWithVerses( nextChapter )
		];

		return reference;
	},

	loadReferences: function( references ) {
		var newReferences = references.map( function( reference ) {
			if ( reference.data ) {
				return reference;
			}

			return this.getReferenceData( reference );
		}, this );

		this.setState( { references: newReferences }, function() {
			api.getReference( this.state.references );
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

		// Fire off a request to get the reference data
		/*		var referenceArray = [];
				var primaryReference = clone( context.params );
				primaryReference.version = 'kjv';
				referenceArray.push( primaryReference );
				var secondaryReference = clone( context.params );
				secondaryReference.chapter = secondaryReference.chapter;
				secondaryReference.version = 'original';
				referenceArray.push( secondaryReference );*/

		var firstReference = assign( clone( this.state.references[ 0 ] ), context.params );
		var references = clone( this.state.references );
		references[ 0 ] = firstReference;

		var secondReference = assign( clone( this.state.references[ 1 ] ), context.params );
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
