# Annemone

Anne Pro 2 RGB control through Node.js

This npm package allows to control the Anne Pro 2 RGB keyboard keys without ObinsKit. Anne Pro 1 compatibility has not been tested as I don't have that keyboard.

## How to use

1. Install as an npm package
2. `var Annemone = require('annemone')`
3. Annemone is now accessible as a class through a variable

## Available methods

### Annemone.setMultiColorLed(arrayOfRgbValues)

Set per-key RBG value.

Takes a flat array of RBG values for each key, left to right, top to bottom, from the Escape key to right Ctrl.

Example arrayOfRgbValues: `[255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 0, 0, 0, 255, 255, 0, 0, 0, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 0, 0, 255, 0, 255, 0, 0, 0, 255, 0, 255, 255, 0, 255, 0, 0, 0, 0, 0, 0, 255, 0, 255, 0, 0, 0, 0, 0, 0, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 0, 0, 0]`

### Annemone.setSingleColorLed(rgb)

Set all keys to one color.

Takes an array with 3 elements: red, green and blue.

Example rgb: `[255, 0, 0]`

### Annemone.generateMultiColor(arrayOfRgbValues, usb_host = 65, command_info = [32, 3, 255, 2])

HID packet generator for `setMultiColorLed`.

- arrayOfRgbValues: same as for `setMultiColorLed`
- usb_host: MCU address? Possibly depends on whether this is an Anne Pro or Anne Pro 2, can only be 65 or 49
- command_info: contents unknown, more research needed

### Annemone.generateOneColor(rbg_color, usb_host = 65)

HID packet generator for `setSingleColorLed`.

### Annemone.write(message)

HID message write wrapper with forced delay.

Needed due to Anne Pro 2 ignoring commands when they're sent faster than 50ms apart from each other.