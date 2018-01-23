# async-each-series-throttle [![Build Status](https://travis-ci.org/tableflip/async-each-series-throttle.svg?branch=master)](https://travis-ci.org/tableflip/async-each-series-throttle) [![dependencies Status](https://david-dm.org/tableflip/async-each-series-throttle/status.svg)](https://david-dm.org/tableflip/async-each-series-throttle)

Iterate through items in series but throttle iteratee execution

## Usage

```js
import eachSeriesThrottle from 'async-each-series-throttle'

const items = [0, 1, 2, 3, 4]

// Number in ms to throttle calls to iteratee
const wait = 1000

// Called only once every ~1000ms at maximum
const iteratee = (item, cb) => {
  // Do some async work and callback when done
  //
  // If this takes _more than_ 1000ms then iteratee will be called again
  // immediately after cb is called.
  //
  // If this takes _less than_ 1000ms then iteratee will be called again after
  // ~1000ms have elapsed since the last time it was called.
  setTimeout(() => cb(null, item + 1), 500)
}

// Optional callback after everything is done
const callback = (err, results) => {
  // All done, after ~4000ms or more
  // results is [1, 2, 3, 4, 5]
}

eachSeriesThrottle(items, iteratee, wait, callback)
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/tableflip/mem-storage-area/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Oli Evans and Alan Shaw
