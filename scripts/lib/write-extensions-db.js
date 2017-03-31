
var fs = require('fs')

module.exports = function writeDatabaseSync (fileName, obj) {
  var fd = fs.openSync(fileName, 'w')
  var keys = Object.keys(obj).sort()

  var extensions = keys
      .filter(function (key) {
        return obj[key].extensions
      })
      .reduce(function (accumulator, key) {
        for (var extension of obj[key].extensions) {
          if (accumulator[extension]) {
            console.warn('Duplicate extension "%s" already used for %s', extension, accumulator[extension])
            if (accumulator[extension].includes('/x-') && !key.includes('/x-')) {
              console.warn('  remapping to', key)
              accumulator[extension] = key
            } else if (accumulator[extension] === 'application/octet-stream' && key !== 'application/octet-stream') {
              console.warn('  remapping to', key)
              accumulator[extension] = key
            } else {
              console.warn('  not remapping to', key)
            }
          } else {
            accumulator[extension] = key
          }
        }
        return accumulator
      }, {})

  console.log('Size:', Object.keys(extensions).length)

  fs.writeSync(fd, JSON.stringify(extensions))

  fs.closeSync(fd)
}
