// External
var React = require( 'react' ),
	debounce = require( 'lodash/debounce' );

// Internal
var Chapter = require( './chapter.jsx' ),
	ReferenceInput = require( './reference-input.jsx' );

module.exports = React.createClass( {
	getInitialState: function() {
		return {
			reference: this.props.reference
		};
	},

	render: function() {
		var classNames = 'chapter',
			chapters;
		if ( ! this.props.sync ) {
			classNames += ' columns';
		}

		if ( ! this.props.reference ) {
			return null;
		}

		if ( this.props.reference.data ) {
			chapters = this.props.reference.data.map( function( chapter, chapterIndex ) {
				if ( chapter.verses ) {
					return (
						<Chapter
							chapter={ chapter }
							chapterIndex={ chapterIndex }
							ref={ ( ref ) => this.props.chapterTracking[ chapterIndex ] = ref }
							{ ...this.props } />
					);
				}
			}, this );
		}

		return (
			<div className={ classNames }>
				<ReferenceInput reference={ this.state.reference } currentChapter={ this.props.currentChapter } onGoToReference={ this.props.onGoToReference } />
				{ chapters }
			</div>
		);
	}
} );
