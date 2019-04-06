"use module"
import deferrant from "deferrant"

import AbortError from "./abort-error.js"

/**
* Async Generator that runs on an interval & is cancelable.
*/
export async function * setInterCan( opts= 1000, ...params){
	const
	  signal= opts&& opts.signal,
	  abortError= opts&& opts.abortError,
	  immediate= opts&& opts.immediate,
	  ms= (isNaN( opts)? opts&& opts.ms: opts)|| 1000

	// events write to cursor, while loop reads off cursor (& re
	let cursor= deferrant()

	// do a reject on abort signal
	if( signal){
		const abort= function(){
			cursor.reject( abortError|| AbortError)
			// this will break out from while loop, then clearInterval
		}
		if( signal.onabort=== undefined){
			signal.onabort= abort // declarative good
		}else{
			signal.addEventListener("abort", abort) // but we chill
		}
	}

	// start time process
	function tick(){ // incrementer
		// resolve this state
		cursor.resolve()
		// advance to next state
		cursor= deferrant()
	}
	const h= setInterval( tick, ms)

	// iterate through time
	const p= params&& params.length> 1? params: params[0]
	try{
		while(true){
			await cursor
			yield p
		}
	}catch( error){
		clearInterval( h)
		throw error
	}
}
export {
  setInterCan as setInterval,
  setInterCan as setIntervalCancelable
}
export default setInterCan
