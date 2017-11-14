const si = require('systeminformation');
const temp = require('osx-temperature-sensor');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.sendFile('index.html')
})

app.get('/temp', (req,res) => {
    si.cpuTemperature().then(data => {
        var temp = JSON.parse(data.main);
        res.json({ temperature: temp})
    })
})

app.get('/ps', (req, res) => {
    si.processes().then(data => {
        var ps = [];
        data.list.forEach((item) => {
            ps.push(item);
        })

        ps.sort((a, b) => {
            return b.pcpu - a.pcpu;
        })

        ps.splice(10, ps.length-1); 
        res.json(ps); 
    })
})

app.get('/net', (req,res) => {
    si.networkStats().then(data => {
        res.json(data);
    })
})

app.get('/os', (req,res) => {
    si.osInfo().then(data => {
        res.json(data);
    })
})

var port = process.env.PORT || 8080;
app.listen(port);