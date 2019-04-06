import deferrant from "deferrant"

import { AbortError, AbortErrorSymbol} from "./abort-error.js"

export const ShadowedRejectSymbol= Symbol.for("stc-shadowed-reject")

export function abort(){
	this.reject( this[ AbortErrorSymbol])
}

/**
* Promise that resolves after a time, or when canceled (whichever comes first).
*/
export async function setTimeCan( opts= 1000, ...params){
	const
	  signal= opts&& opts.signal,
	  abortError= opts&& opts.abortError,
	  ms= (isNaN( opts)? opts&& opts.ms: opts)|| 1000

	// the resulting promise
	const d= deferrant()

	// time
	const
	  // capture args we need
	  p= params.length> 1? params: params[0],
	  // resolve at time
	  h= setTimeout( function(){ d.resolve( p)})

	// hold some quiet properties on promise
	d[ ShadowedRejectSymbol]= d.reject //intern the method we're about to shadow
	d[ AbortErrorSymbol]= abortError|| AbortError //abort 

	// wrap underlying `reject` with additional cleanup of setTimeout
	d.reject= function( error){
		// clear our timer
		if( h){
			clearTimeout( h)
			h= null
		}
		// and do normal reject
		d[ ShadowedRejectSymbol]( error)
		// todo: make deferrant multi-dispatch (so this code can be deleted)
		// eloquent why? confusing yeah some
		return d
	}
	// cancel uses stored designated `cancel` rejection object to reject
	d.abort= abort.bind( d)

	// do a reject on abort signal
	if( signal){
		if( signal.onabort=== undefined){
			signal.onabort= abort // declarative good
		}else{
			signal.addEventListener("abort", abort) // but we chill
		}
	}

	return d
}
export {
  setTimeCan as setTimeout,
  setTimeCan as setTimeoutCancelable
}
export default setTimeCan
