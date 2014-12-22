module.exports = function ( self ) {
    self.addEventListener( 'message', function ( event ) {
    	var reference = event.data;
    	result = referenceAPI.get( reference );
    	self.postMessage( result );
    });
};