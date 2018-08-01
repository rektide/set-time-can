import deferrant from "deferrant"

import CancelRejection from "./cancel-rejection.js"
import { UnderlyingResolve, Cancel } from "./symbols.js"

export function cancel(){
	this.reject( this[ $cancel])
}

export async function setTimeout(ms, { signal, cancel}= {}, ...params){
	// the promise 
	const d= deferrant()

	// time
	const
	  p= params.length> 1? params: params[0],
	  // resolve at time
	  h= setTimeout( function(){ d.resolve( p)})

	// hold some quiet properties on promise
	d[ UnderlyingReject]= d.reject
	d[ Cancel]= cancel|| CancelRejection

	// wrap underlying `reject` with additional cleanup of setTimeout
	d.reject= function( error){
		// clear our timer
		if( h){
			clearTimeout( h)
			h= null
		}
		// and do normal/underlying reject
		d[ UnderlyingReject]( error)
		// todo: make deferrant multi-dispatch (so this code can be deleted)
		// eloquent why? confusing yeah some
		return d
	}
	// cancel uses stored designated `cancel` rejection object to reject
	d.cancel= cancel

	// do a reject on abort signal
	if( signal){
		const c= d.cancel.bind( d)
		if( !signal.onabort){
			signal.onabort= c // declarative good
		}else{
			signal.addEventListener("abort", c) // but we chill
		}
	}

	return d
}
export default setTimeout
