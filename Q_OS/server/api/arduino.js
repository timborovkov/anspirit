var ArduinoScanner = require('arduino-scanner');
var arduinoScanner = new ArduinoScanner();

var serialport = require('serialport');

var arduinoConnection = null;
var incomeFromArduinoProcessing = function(input){};

arduinoScanner.start();

arduinoScanner.on('arduinoFound', function(response) {
  arduinoScanner.stop();
  console.log(response.message);
  var portName = response.port;
  arduinoConnection = new serialport.SerialPort(portName,{
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: false,
      parser: serialport.parsers.readline("\r\n")
  });
});
arduinoConnection.on('data', function(input){
  console.log(input);
  incomeFromArduinoProcessing(input);
});

module.exports.send = function(data){
  serialPort.write(data, function(err, results){
    console.error('err ' + err);
  });
}
module.exports.onDataGet = function(func){
  incomeFromArduinoProcessing = func;
}
