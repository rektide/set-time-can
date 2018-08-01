/**
 * Pass in AbortError to a function that either returns it, or creates it (if it was missing).
 */
const ae= (function( aeExternal){
	if( aeExternal){
		return aeExternal
	}
	return class AbortError{
		constructor( msg){
			super( msg|| "AbortError")
			this.name= "AbortError"
			return this
		}
	}
	return instance
})(typeof AbortError!== "undefined"? AbortError: null)

export {
	ae as AbortError
}
export default ae


/**
 * Well known symbol for storing AbortErrors
 */
export const AbortErrorSymbol= Symbol.for("stc-abort-error")
