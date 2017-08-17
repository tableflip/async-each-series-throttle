const test = require('tape')
const eachSeriesThrottle = require('./')

test('should call iteratee for each item', (t) => {
  const items = getItems()

  t.plan(items.length)

  let i = 0
  const iteratee = (item, cb) => {
    t.equal(item, i, `iteratee called for item ${i}`)
    i++
    cb()
  }

  eachSeriesThrottle(items, iteratee)
})

test('should call callback when complete', (t) => {
  t.plan(1)

  const items = getItems()
  const iteratee = (_, cb) => cb()
  const callback = () => {
    t.ok(true, 'callback called')
    t.end()
  }

  eachSeriesThrottle(items, iteratee, callback)
})

test('should throttle iteratee', (t) => {
  const items = getItems()

  t.plan(items.length - 1)

  let i = 0

  let lastExec = Date.now()
  const wait = getRandomInt(25, 300)

  // setTimeout doesn't guarantee execution on, after or before the delay
  // A 10ms tolerance seems acceptable...right?
  const tolerance = 10

  const iteratee = (_, cb) => {
    if (i > 0) {
      const now = Date.now()
      const diff = now - lastExec
      t.ok(
        diff >= wait - tolerance && diff <= wait + tolerance,
        `throttled to ${wait}ms (actual ${diff}ms)`
      )
    }
    lastExec = Date.now()
    i++
    cb()
  }

  eachSeriesThrottle(items, iteratee, wait)
})

test('should halt execution if error', (t) => {
  t.plan(1)

  const items = getItems()
  const iteratee = (_, cb) => cb(new Error('boom'))
  const callback = (err) => {
    t.equal(err.message, 'boom', 'callback called with err')
    // Wait for a bit to ensure the iteratee isn't called again
    setTimeout(() => t.end(), 1000)
  }

  eachSeriesThrottle(items, iteratee, callback)
})

test('should accumulate results', (t) => {
  const items = getItems()

  t.plan(1 + items.length)

  const iteratee = (item, cb) => {
    setTimeout(() => cb(null, `item${item}`), getRandomInt())
  }

  const callback = (err, results) => {
    t.ifError(err, 'no error passed to callback')
    items.forEach((item, i) => {
      t.equal(results[i], `item${item}`, `"${item}" transformed into "item${item}"`)
    })
    t.end()
  }

  eachSeriesThrottle(items, iteratee, callback)
})

function getItems (min = 1, max = 100) {
  return Array(getRandomInt(min, max)).fill(0).map((_, i) => i)
}

// Thanks MDN!
// The maximum is exclusive and the minimum is inclusive
function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
