function eachSeriesThrottle (items, iteratee, wait, callback) {
  if (typeof wait === 'function') {
    callback = wait
    wait = null
  }

  wait = wait || 0
  callback = callback || function () {}

  var results = []

  function iterate (itemIndex) {
    if (itemIndex === items.length) return callback(null, results)

    var lastExec = Date.now()

    iteratee(items[itemIndex], function (err, result) {
      if (err) return callback(err)

      results.push(result)

      var now = Date.now()
      var diff = now - lastExec
      var delay = wait - diff

      if (delay < 0) delay = 0

      setTimeout(function () { iterate(itemIndex + 1) }, delay)
    })
  }

  iterate(0)
}

module.exports = eachSeriesThrottle
