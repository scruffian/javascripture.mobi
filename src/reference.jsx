/*global javascripture*/

// External
var React = require( 'react' ),
	assign = require( 'lodash/assign' ),
	clone = require( 'lodash/clone' ),
	debounce = require( 'lodash/debounce' );

// Internal
var bible = javascripture.src.bible,
	referenceApi = require( './referenceAPI' ),
	Chapter = require( './chapter.jsx' );

module.exports = React.createClass( {
	getInitialState: function() {
		return {
			sync: true,
			ignoreScrollEvents: true,
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
		console.log( 'componentWillReceiveProps' );
		if ( nextProps.context !== this.props.context ) {
			this.setState( {
				ignoreScrollEvents: true
			}, function() {
				this.callApi( nextProps.context );
			} );
		}
	},

	componentDidMount: function() {
		this.callApi( this.props.context );

		//this.loadReferences( this.getPreviousChapter() );
		//this.loadReferences( this.getNextChapter() );
	},

	handleApiChange: function( apiResult ) {
		var oldHeight = this.documentHeight(),
			references = [];

		references = this.state.references.map( function( reference ) {
			reference.data.map( function( referenceData ) {
				apiResult.references.forEach( function( referenceFromApi ) {
					if ( this.referencesAreTheSame( referenceData, referenceFromApi ) ) {
						referenceData.verses = referenceFromApi.verses;
					}
					return referenceData;
				}, this );
			}, this );
			return reference;
		}, this );

		this.setState( {
			references: references
		}, function() {
			if ( ! this.state.ignoreScrollEvents ) {
				this.maintainScrollPosition( oldHeight );
			} else {
				this.setState( {
					ignoreScrollEvents: false
				} );
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

	maintainScrollPosition: function( oldHeight ) {
		if ( this.state.ignoreScrollEvents ) {
			return;
		}

		if ( this.pageY < this.scrollTolerance ) {
			var newHeight = this.documentHeight();
			window.scrollBy( 0, newHeight - oldHeight );
		} else {
			console.log('scroll to verse');
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
		if ( this.state.ignoreScrollEvents ) {
			return;
		}

		console.log( 'handleScroll' );
		var scrollTolerance = this.scrollTolerance,
			references;

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
		var referencesToFetch = [];
		this.setState( { references: references }, function() {
			references.forEach( function( reference ) {
				reference.data.forEach( function( referenceData ) {
					if ( ! referenceData.verses ) {
						referencesToFetch.push( referenceData );
					}
				} );
			} );
			if ( referencesToFetch.length ) {
				var apiResult = {
					references: referenceApi.getReferences( referencesToFetch )
				};

				this.handleApiChange( apiResult );
			}
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
			return (
				<Chapter
					references={ this.state.references }
					reference={ this.state.references[ 0 ] }
					sync={ this.state.sync }
					onGoToReference={ this.props.onGoToReference }
					onChangeDisplayState={ this.props.onChangeDisplayState }
					ignoreScrollEvents={ this.state.ignoreScrollEvents } />
			);
		}

		return this.state.references.map( function( reference ) {
			return <Chapter
				references={ this.state.references }
				reference={ reference }
				sync={ this.state.sync }
				onGoToReference={ this.props.onGoToReference }
				onChangeDisplayState={ this.props.onChangeDisplayState }
				ignoreScrollEvents={ this.state.ignoreScrollEvents } />;
		}, this );
	},

	render: function() {
		console.log( 'render reference' );
		var className = "reference columns-" + this.state.references.length
		return (
			<div id="reference" className={ className }>
				<span className="sync-checkbox">
					<input type="checkbox" name="sync" checked={ this.state.sync } onChange={ this.toggleSync } /> Sync
				</span>
				{ this.chapters() }
			</div>
		);
	}
} );
