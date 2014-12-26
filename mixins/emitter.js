var EventEmitter = require( 'events' ).EventEmitter,
	assign = require( 'lodash-node/modern/objects/assign' );

module.exports = function( prototype ) {
	assign( prototype, EventEmitter.prototype );
	prototype.off = prototype.removeListener;
};
