# set-time-can

> setTimeout promise & setInterval async-iterable that are cancelable

```
// our hero of the story
const controller= new AbortController()

console.log("please disarm within four seconds or face termination")
// if this timeout gets to zero...
setTimeout(4000, { signal: controller.signal})
  // bad things happen!
  .then(()=> (console.error("exploding"), process.exit(1)), ()=> console.log("disarmed"))
// the controllers `signal` raises an `abort` that setTimeout uses to shutdown early. whew!
setTimeout(2000).then(()=> controller.abort())
```
