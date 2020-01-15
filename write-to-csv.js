const fs = require('fs'); 

module.exports = async function(variables) {
  return new Promise((resolve, reject) => {
    let ws = fs.createWriteStream('variables.csv', {})
    let recursiveWrite = function(prefix, v) {
      if( typeof v === 'object' ) {
        Object.keys(v).sort().forEach(name => {
          recursiveWrite(`${prefix}.${name}`, v[name])
        })
      } else {
        ws.write(`"${prefix}", "${String(v)}"\n`)
      }
    }
    recursiveWrite('v', variables)
    ws.end()
    setTimeout(() => { ws.on("finish", resolve) })
  })
}
