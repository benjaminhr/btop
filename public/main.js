var tempResult = document.getElementById('temp-result');
var psResult = document.getElementById('ps-result');
var netResult = document.querySelectorAll('#net-result > p > span');
var osResult = document.querySelectorAll('#os-result > p > span')
var diskResult = document.querySelectorAll('.disk-usage ~ p > span');

var url = window.location.origin;
setInterval(() => {
    fetch(url + '/temp')
        .then(data => data.json())
        .then(json => {
            tempResult.innerText = json.temperature + '°C';
        })
}, 2000)


setInterval(() => {
    fetch(url + '/ps')
        .then(data => data.json())
        .then(json => {
            var result = "<tr><th>PID</th><th>Name</th><th>CPU %</th></tr>";
            json.forEach((item) => {
                result += `<tr><td>${item.pid}</td><td>${item.name}</td><td>${item.pcpu}</td><tr>`;
            })

            psResult.innerHTML = result;
        })
}, 2000)

setInterval(() => {
    fetch(url + '/net')
        .then(data => data.json())
        .then(json => {
            netResult[0].innerText = json.rx_sec.toFixed(1);
            netResult[1].innerText = json.tx_sec.toFixed(1);
        })
}, 2000)


setInterval(() => {
    fetch(url + '/os')
        .then(data => data.json())
        .then(json => {
            osResult[0].innerText = json.platform;
            osResult[1].innerText = json.distro;
            osResult[2].innerText = json.arch;          
            osResult[3].innerText = json.hostname; 
        })
}, 2000)

setInterval(() => {
    fetch(url + '/disk')
        .then(data => data.json())
        .then(json => {
            diskResult[0].innerText = 'Used: ' + json.used;
            diskResult[1].innerText = 'Size: ' + json.size;
        })
}, 2000)
