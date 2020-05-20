# Annemone

Anne Pro 2 RGB control through Node.js

This npm package allows to control the Anne Pro 2 RGB keyboard keys without ObinsKit. Anne Pro 1 compatibility has not been tested as I don't have that keyboard.

Currently, settings are not saved and custom LED graphics set with this module are lost when the keyboard loses power or when user changes the profile with a keyboard button. This works similarly to the profile preview mode in ObinsKit.

## How to use

As a CLI program:

```shell
npm install -g annemone
annemone single 255 0 255
```

CLI program currently supports only single color mode.

As an Node package:

1. Install as an npm package
2. `var Annemone = require('annemone')`
3. `const LEDController = new Annemone()`

## Available methods

### Annemone.LEDController.setMultiColorLed(ledMatrix)

Set per-key RBG value.

Accepts a two-dimensional matrix with RGB values corresponding to each of the 61 keys as they appear on the keyboard.

There's a delay between commands as the keyboard doesn't understand commands that are sent faster than 50ms apart. This is also compounded by the fact that HID doesn't have high data throughput rate. Consider using the `setSingleColorLed` method if your application don't need to set per-key color.

Example matrix:

```js
[
    [255, 0, 0] // esc
    [255, 0, 0] // 1
    [255, 0, 0] // 2
    ...
],
[
    [255, 0, 0] // tab
    [255, 0, 0] // q
    [255, 0, 0] // w
    ...
]
...
```

### Annemone.LEDController.setSingleColorLed(rgb)

Set all keys to one color.

Takes an array with 3 elements: red, green and blue.

Example rgb: `[255, 0, 0]`

### Annemone.LEDController.generateMultiColor(arrayOfRgbValues, mcu_address = 65, command_info = [32, 3, 255, 2])

HID packet generator for `setMultiColorLed`.

- arrayOfRgbValues: 70 sequential rgb values for each key (skip the following keys as they do not exist on the board: *41, 43, 55, 57, 60, 61, 63, 64*)
- mcu_address: not sure what an MCU is internally, possibly depends on whether this is an Anne Pro or Anne Pro 2, code suggests this can only be 65 or 49
- command_info:
  - 32: appears to select the destination (32 is LED)
  - 3: LED command type selector
  - 255: unknown, doesn't do anything
  - 2: selects a preset lighting profile (2 is static rainbow for example)

### Annemone.LEDController.generateOneColor(rbg_color, mcu_address = 65)

HID packet generator for `setSingleColorLed`.

### Annemone.LEDController.write(message)

HID write wrapper with a forced delay.

Needed due to Anne Pro 2 ignoring commands when they're sent faster than 50ms apart from each other.
