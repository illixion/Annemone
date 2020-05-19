//
// Annemone v0.0.1
//

var HID = require('node-hid');

('use strict');

class LEDController {
  constructor() {
    this.keyboard = (function () {
      const keyboard_info = HID.devices().find((item) => {
        return (
          item.vendorId === 1241 &&
          item.productId === 41619 &&
          item.interface === 1
        );
      });

      if (typeof keyboard_info === 'undefined') {
        throw 'No compatible devices found';
      } else {
        return new HID.HID(keyboard_info.path);
      }
    })();
  }

  setMultiColorLed(arrayOfRgbValues) {
    const messages = this.generateMultiColor(arrayOfRgbValues);
    let sentBytes = 0;
    for (let i = 0; i < messages.length; i++) {
      sentBytes += this.write(messages[i]);
    }
    return sentBytes;
    // for (let i = 0; i < messages.length; i++) {
    //     this.keyboard.write(messages[i]);
    //     console.log(messages[i])
    // }
  }

  setSingleColorLed(rgb) {
    return this.write(this.generateOneColor(rgb));
  }

  // Reverse engineered from ObinsKit
  generateMultiColor(
    arrayOfRgbValues,
    usb_host = 65,
    command_info = [32, 3, 255, 2]
  ) {
    const maxMessageLength = 55 - command_info.length,
      service_data = [0, 123, 16, usb_host],
      static_message = [0, 0, 125],
      arrayOfRgbValuesCopy = arrayOfRgbValues.slice(0),
      messagesToSendAmount = Math.ceil(
        arrayOfRgbValuesCopy.length / maxMessageLength
      ),
      val_1 = arrayOfRgbValuesCopy.length % maxMessageLength,
      val_2 = 0 === val_1 ? maxMessageLength : val_1,
      hid_command = [];
    for (let p = 0; p < messagesToSendAmount; p++) {
      const e = (messagesToSendAmount << 4) + p,
        a =
          messagesToSendAmount - 1 === p
            ? val_2 + command_info.length
            : maxMessageLength + command_info.length,
        message_part = service_data.concat(
          [e, a],
          static_message,
          command_info,
          arrayOfRgbValuesCopy.splice(0, maxMessageLength)
        );
      hid_command.push(message_part);
    }
    return hid_command;
  }

  generateOneColor(rbg_color, usb_host = 65) {
    return [0, 123, 16, usb_host, 16, 7, 0, 0, 125, 32, 3, 255, 1].concat(
      rbg_color
    );
  }

  // This is required because the keyboard doesn't understand commands sent faster than 50ms apart
  write(message) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 50); // TODO: refactor

    return this.keyboard.write(message);
  }
}

module.exports.LEDController = LEDController;
