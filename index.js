const si = require('systeminformation')
const temp = require('osx-temperature-sensor') // only for mac
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.get('/temp', (req, res) => {
  si.cpuTemperature().then(data => {
    var temp = JSON.parse(data.main)
    res.json({ temperature: temp})
  })
})

app.get('/ps', (req, res) => {
  si.processes().then(data => {
    var ps = []
    data.list.forEach((item) => {
      ps.push(item)
    })

    ps.sort((a, b) => {
      return b.pcpu - a.pcpu
    })

    ps.splice(10, ps.length - 1)
    res.json(ps)
  })
})

app.get('/net', (req, res) => {
  si.networkStats().then(data => {
    res.json(data)
  })
})

app.get('/os', (req, res) => {
  si.osInfo().then(data => {
    res.json(data)
  })
})

app.get('/disk', (req, res) => {
  si.fsSize().then(disk => {
    var used = bytesToSize(disk[0].used)
    var size = bytesToSize(disk[0].size)
    
    res.json({
      used: used,
      size: size
    })
  })

  var bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return '0 Byte'
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }
})

app.get('/cpu', (req, res) => {
  si.currentLoad().then(data => {
    var result = {};
    var cpus = data.cpus.forEach((cpu, index) => {
      result[index + 1] = Math.round(cpu.load);
    })

    res.json(result);
  })
})

var port = process.env.PORT || 8080
app.listen(port)
