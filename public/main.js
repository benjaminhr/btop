var tempResult = document.getElementById('temp-result')
var psResult = document.getElementById('ps-result')
var netResult = document.querySelectorAll('#net-result > p > span')
var osResult = document.querySelectorAll('#os-result > p > span')
var diskResult = document.querySelectorAll('.disk-usage ~ p > span')

var fetch = window.fetch;
var url = window.location.origin

var loading = document.querySelector('.loading');
var wrapper = document.querySelector('.wrapper');

setTimeout(() => {
  loading.style.display = 'none';
  wrapper.style.display = 'flex';
  runApplication();
}, 3000)

function runApplication() {
  var tempHistory = [];
  setInterval(() => {
    fetch(url + '/temp')
          .then(data => data.json())
          .then(json => {
            tempHistory.push(json.temperature);
            tempResult.innerText = 'Current: ' + json.temperature + '°C'

            if (tempHistory.length > 6) {
              tempHistory.shift();
            }

            var data = {
              series: [tempHistory]
            }

            var options = {
              axisY: {
                type: Chartist.FixedScaleAxis,
                ticks: [0, 20, 40, 60, 80, 100, 120],
                high: 120,
                low: 0,
              }
            }

            new Chartist.Line('.temp-chart', data, options)
          })
  }, 1000)

  setInterval(() => {
    fetch(url + '/ps')
          .then(data => data.json())
          .then(json => {
            var result = '<tr class="first-row"><th>PID</th><th>Name</th><th>CPU %</th></tr>'
            json.forEach((item) => {
              result += `<tr><td>${item.pid}</td><td>${item.name}</td><td>${item.pcpu}</td><tr>`
            })

            psResult.innerHTML = result
          })
  }, 2000)

  setInterval(() => {
    fetch(url + '/net')
          .then(data => data.json())
          .then(json => {
            netResult[0].innerText = json.rx_sec.toFixed(1)
            netResult[1].innerText = json.tx_sec.toFixed(1)
          })
  }, 2000)

  setInterval(() => {
    fetch(url + '/os')
          .then(data => data.json())
          .then(json => {
            osResult[0].innerText = json.platform
            osResult[1].innerText = json.distro
            osResult[2].innerText = json.arch
            osResult[3].innerText = json.hostname
          })
  }, 2000)

  setInterval(() => {
    fetch(url + '/disk')
          .then(data => data.json())
          .then(json => {
            diskResult[0].innerText = json.used
            diskResult[1].innerText = json.size
          })
  }, 2000)

  var cpuHistory = []
  setInterval(() => {
    fetch(url + '/cpu')
          .then(data => data.json())
          .then(json => {
            var totalUsage = 0;
            var numberOfCpus = 0;
            
            for (var cpu in json) {
              numberOfCpus++;
              totalUsage += json[cpu];
            }
          
            var averageOfAllCpus = Math.round(totalUsage / numberOfCpus);
          
            cpuHistory.push(averageOfAllCpus)
            var total = cpuHistory.reduce((x, y) => {
              return x + y
            })
            var cpuAvg = document.getElementById('cpu-avg')
            var average = Math.round(total / 6)
            cpuAvg.innerText = 'Average: ' + average + '%'

            if (cpuHistory.length > 6) {
              cpuHistory.shift()
            }
            var data = {
              series: [cpuHistory]
            }

            var options = {
              axisY: {
                type: Chartist.FixedScaleAxis,
                ticks: [0, 20, 40, 60, 80, 100, 120],
                high: 120,
                low: 0
              }
            }

            new Chartist.Line('.cpu-chart', data, options)

            var cores = document.querySelector('#cores');
            cores.innerText = '(cores: ' + numberOfCpus + ')';
          })
  }, 1000)
}