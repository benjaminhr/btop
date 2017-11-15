const si = require('systeminformation')

si.currentLoad().then(data => { 

  console.log(result);
  // var cpus = data.cpus.map((x, index) => {
  //   var result = [index, Math.round(x.load)]
  //   return result;
  // })
})
