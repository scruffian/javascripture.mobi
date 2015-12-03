// External
var React = require( 'react' ),
	assign = require( 'lodash-node/modern/object/assign' ),
	clone = require( 'lodash-node/modern/lang/clone' ),
	debounce = require( 'lodash-node/modern/function/debounce' );

// Internal
var bible = javascripture.src.bible,
	api = require( './api.js' )(),
	Chapter = require( './chapter.jsx' );

module.exports = React.createClass( {
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

	pageY: 0,

	scrollTolerance: 500,

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

		//this.loadReferences( this.getPreviousChapter() );
		//this.loadReferences( this.getNextChapter() );

		api.on( 'change', function() {
			self.handleApiChange( this );
		} );
	},

	handleApiChange: function( apiResult ) {
		var oldHeight = this.documentHeight(),
			onlyOneReference = false,
			insertedAtTheBeginning = false,
			references = [];

		if ( this.state.references && this.state.references[ 0 ].data.length === 1 ) {
			onlyOneReference = true;
		}

		apiResult.references.forEach( function( referenceFromApi ) {
			references = this.state.references.map( function( reference, referenceIndex ) {
				reference.data.map( function( referenceData, index ) {
					if ( this.referencesAreTheSame( referenceData, referenceFromApi ) ) {
						referenceData.verses = referenceFromApi.verses;
						if( index === 0 && referenceIndex === 0 ) {
							insertedAtTheBeginning = true;
						}
					}
					return referenceData;
				}, this );
				return reference;
			}, this );
		}, this );

		this.setState( { references: references }, function() {
			this.maintainScrollPosition( oldHeight );
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

	maintainScrollPosition: function( oldHeight ) {
		if ( this.pageY < this.scrollTolerance ) {
			var newHeight = this.documentHeight();
			window.scrollBy( 0, newHeight - oldHeight );
		}
	},

	getPreviousChapter: function() {
		return this.state.references.map( function( reference, index ) {
			var firstReference = reference;
			if ( reference.data.length ) {
				firstReference = reference.data[ 0 ];
			}
			var previousReference = bible.parseReference( firstReference.book + ' ' + firstReference.chapter ).prevChapter().toObject();
			previousReference.version = reference.version;
			reference.data.unshift( previousReference );
			return reference;
		} );

	},

	getNextChapter: function() {
		return this.state.references.map( function( reference, index ) {
			var lastReference = reference;
			if ( reference.data.length ) {
				lastReference = reference.data[ reference.data.length - 1 ];
			}
			var nextReference = bible.parseReference( lastReference.book + ' ' + lastReference.chapter ).nextChapter().toObject();
			nextReference.version = reference.version;
			reference.data.push( nextReference );
			return reference;
		} );
	},

	handleScroll: function( event ) {
		var scrollTolerance = this.scrollTolerance,
			references = this.state.references;

		this.pageY = event.pageY
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

	loadReferences: function( references ) {
		this.setState( { references: references }, function() {
			api.getReferences( references );
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
			chapter: firstReference.chapter,
			version: firstReference.version
		} );
		references[ 0 ] = firstReference;

		var secondReference = assign( clone( this.getInitialState().references[ 1 ] ), context.params );
		secondReference.data.push( {
			book: secondReference.book,
			chapter: secondReference.chapter,
			version: secondReference.version
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
		var className = "reference columns-" + this.state.references.length
		return (
			<div id="reference" className={ className }>
				<span className="sync-checkbox">
					<input type="checkbox" name="sync" checked={ this.state.sync } onChange={ this.toggleSync } /> Sync
				</span>
				{ this.range() }
			</div>
		);
	}
} );
