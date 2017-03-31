var dbc = require('./lib/create-db')

var db = {}

// initialize with all the IANA types
dbc.addData(db, require('../src/iana-types.json'), 'iana')

// add the mime extensions from Apache
dbc.addData(db, require('../src/apache-types.json'), 'apache')

// add the mime extensions from nginx
dbc.addData(db, require('../src/nginx-types.json'), 'nginx')

// now add all our custom data
dbc.addData(db, require('../src/custom-types.json'))

// finally, all custom suffix defaults
var mime = require('../src/custom-suffix.json')
Object.keys(mime).forEach(function (suffix) {
  var s = mime[suffix]

  Object.keys(db).forEach(function (type) {
    if (type.substr(0 - suffix.length) !== suffix) {
      return
    }

    var d = db[type]
    if (d.compressible === undefined) d.compressible = s.compressible
  })
})

// write db
require('./lib/write-extensions-db')('extensions-db.json', db)
