#!/usr/bin/env node

var Annemone = require('..');
const LEDController = new Annemone.LEDController();

const args = process.argv.splice(2);

if (args.length === 0) {
  console.log(
    'Usage: annemone single r g b' + '\n' + 'Example: annemone single 255 0 0'
  );
  process.exit(64);
}
if (args[0] === 'single') {
  LEDController.setSingleColorLed([
    parseInt(args[1]),
    parseInt(args[2]),
    parseInt(args[3]),
  ]);
  process.exit(0);
} else {
  console.error('This mode is currently not implemented.');
  process.exit(1);
}
