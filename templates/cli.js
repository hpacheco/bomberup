// File: cli.js
// Link to compiled Elm code main.js
var Elm = require('./main').Elm;
var main = Elm.Main.init();

var fs = require("fs");

// Get data from the command line
//var args = process.argv.slice(2);
//var input = args[0];

// Send data to the worker
main.ports.getInput.send(fs.readFileSync(0).toString());

// Get data from the worker
main.ports.setOutput.subscribe(function(data) {
  console.log(data);
});