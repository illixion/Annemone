var HID = require('node-hid');

('use strict');

class LEDController {
  constructor() {
    /**
     * @type {HID|undefined}
     */
    this.keyboard = (function () {
      const keyboard_info = HID.devices().find((item) => {
        return (
          item.vendorId === 0x04d9 &&
          item.interface === 1 &&
          LEDController.known_pids.includes(item.productId)
        );
      });

      if (typeof keyboard_info === 'undefined') {
        throw 'No compatible devices found';
      } else {
        return new HID.HID(keyboard_info.path);
      }
    })();
  }

  setIndividualKeys(matrixState) {

    const arrayOfRgbValues = LEDController.AnnePro2_layout.map((key) => {
      let rgb = [0, 0, 0];
      if (matrixState[key]) {
        rgb = matrixState[key]
      }
      return rgb;
    });

    const messages = this.generateMultiColor(arrayOfRgbValues.flat());

    let sentBytes = 0;
    for (let i = 0; i < messages.length; i++) {
      sentBytes += this.write(messages[i]);
    }
    return sentBytes;
  }

  /**
   * Sets different colors for each key
   * @param {Array<Array<int>>} ledMatrix Two-dimensional array in format [ [[esc_rgb], [1_rgb], ..., [=_rgb], [backspace_rgb]],
   *                                                                        [[tab_rgb], [q_rgb], ..., [backslash_rgb]],
   *                                                                        ...
   *                                                                        [[leftctrl_rgb], ..., [rightctrl_rgb]]
   *                                                                      ]
   * @returns {number} number of bytes actually written
   */
  setMultiColorLed(ledMatrix) {
    const ledMatrixFlattened = ledMatrix.flat();
    const arrayOfRgbValues = LEDController.AnnePro2_layout.map((key) => {
      let rgb = [0, 0, 0];
      if (ledMatrixFlattened[key.matrix_id]) {
        rgb = ledMatrixFlattened[key.matrix_id];
      }
      return rgb;
    });
    const messages = this.generateMultiColor(arrayOfRgbValues.flat());

    let sentBytes = 0;
    for (let i = 0; i < messages.length; i++) {
      sentBytes += this.write(messages[i]);
    }
    return sentBytes;
  }

  /**
   * Generates a message to set different colors for each key
   * Reverse engineered from ObinsKit
   * @param {Array<int>} arrayOfRgbValues
   * @returns {Array<Array<int>>}
   */
  generateMultiColor(arrayOfRgbValues) {
    const real_command_info_length = LEDController.command_info.length + 1,
      maxMessageLength = 55 - real_command_info_length,
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
            ? val_2 + real_command_info_length
            : maxMessageLength + real_command_info_length;
      hid_command.push([
        ...LEDController.service_data,
        e,
        a,
        ...LEDController.static_message,
        ...LEDController.command_info,
        2,
        ...arrayOfRgbValuesCopy.splice(0, maxMessageLength),
      ]);
    }
    return hid_command;
  }

  /**
   * Sets one color for all keys
   * @param {Array<int>} rgb
   * @returns {int} number of bytes actually written
   */
  setSingleColorLed(rgb) {
    return this.write(this.generateOneColor(rgb));
  }

  /**
   * Generates a message to set all keys to the same color
   * Reverse engineered from ObinsKit
   * @param {Array<int>} rbg_color
   * @returns {Array<int>}
   */
  generateOneColor(rbg_color) {
    return [
      ...LEDController.service_data,
      16,
      7,
      ...LEDController.static_message,
      ...LEDController.command_info,
      1,
      ...rbg_color,
    ];
  }

  /**
   * @param message
   * @returns {int} number of bytes actually written
   */
  write(message) {
    const startTime = new Date().getTime();
    // Needed due to Anne Pro 2 ignoring commands when they're sent faster than 50ms apart from each other.
    while (new Date().getTime() < startTime + 50);

    return this.keyboard.write(message);
  }
}

//Static mapping
const mcu_address = 65;
LEDController.known_pids = [0x8008, 0x8009, 0xa292, 0xa293];
LEDController.AnnePro2_layout = [
  { key: 'esc', matrix_id: 0 },
  { key: '1', matrix_id: 1 },
  { key: '2', matrix_id: 2 },
  { key: '3', matrix_id: 3 },
  { key: '4', matrix_id: 4 },
  { key: '5', matrix_id: 5 },
  { key: '6', matrix_id: 6 },
  { key: '7', matrix_id: 7 },
  { key: '8', matrix_id: 8 },
  { key: '9', matrix_id: 9 },
  { key: '0', matrix_id: 10 },
  { key: 'minus', matrix_id: 11 },
  { key: 'equals', matrix_id: 12 },
  { key: 'backspace', matrix_id: 13 },
  { key: 'tab', matrix_id: 14 },
  { key: 'q', matrix_id: 15 },
  { key: 'w', matrix_id: 16 },
  { key: 'e', matrix_id: 17 },
  { key: 'r', matrix_id: 18 },
  { key: 't', matrix_id: 19 },
  { key: 'y', matrix_id: 20 },
  { key: 'u', matrix_id: 21 },
  { key: 'i', matrix_id: 22 },
  { key: 'o', matrix_id: 23 },
  { key: 'p', matrix_id: 24 },
  { key: 'lbracket', matrix_id: 25 },
  { key: 'rbracket', matrix_id: 26 },
  { key: 'backslash', matrix_id: 27 },
  { key: 'caps', matrix_id: 28 },
  { key: 'a', matrix_id: 29 },
  { key: 's', matrix_id: 30 },
  { key: 'd', matrix_id: 31 },
  { key: 'f', matrix_id: 32 },
  { key: 'g', matrix_id: 33 },
  { key: 'h', matrix_id: 34 },
  { key: 'j', matrix_id: 35 },
  { key: 'k', matrix_id: 36 },
  { key: 'l', matrix_id: 37 },
  { key: 'semicolon', matrix_id: 38 },
  { key: 'apostrophe', matrix_id: 39 },
  { key: 'enter', matrix_id: 40 },
  { key: 'deadkey1', matrix_id: null },
  { key: 'leftshift', matrix_id: 41 },
  { key: 'deadkey2', matrix_id: null },
  { key: 'z', matrix_id: 42 },
  { key: 'x', matrix_id: 43 },
  { key: 'c', matrix_id: 44 },
  { key: 'v', matrix_id: 45 },
  { key: 'b', matrix_id: 46 },
  { key: 'n', matrix_id: 47 },
  { key: 'm', matrix_id: 48 },
  { key: 'comma', matrix_id: 49 },
  { key: 'dot', matrix_id: 50 },
  { key: 'slash', matrix_id: 51 },
  { key: 'rightshift', matrix_id: 52 },
  { key: 'deadkey3', matrix_id: null },
  { key: 'leftctrl', matrix_id: 53 },
  { key: 'deadkey4', matrix_id: null },
  { key: 'leftsuper', matrix_id: 54 },
  { key: 'leftalt', matrix_id: 55 },
  { key: 'deadkey5', matrix_id: null },
  { key: 'daedkey6', matrix_id: null },
  { key: 'space', matrix_id: 56 },
  { key: 'deadkey7', matrix_id: null },
  { key: 'deadkey8', matrix_id: null },
  { key: 'rightalt', matrix_id: 57 },
  { key: 'fn', matrix_id: 58 },
  { key: 'context', matrix_id: 59 },
  { key: 'rightctrl', matrix_id: 60 },
  { key: 'deadkey9', matrix_id: null },
];
LEDController.service_data = [0, 123, 16, mcu_address];
LEDController.static_message = [0, 0, 125];
LEDController.command_info = [32, 3, 255];

module.exports.LEDController = LEDController;
