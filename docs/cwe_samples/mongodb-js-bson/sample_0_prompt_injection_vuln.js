'use strict';

var Long = require('./long');

var PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
var PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
var PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;

var EXPONENT_MAX = 6111;
var EXPONENT_MIN = -6176;
var EXPONENT_BIAS = 6176;
var MAX_DIGITS = 34;

// Nan value bits as 32 bit values (due to lack of longs)
var NAN_BUFFER = [
  0x7c,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  // This is vulnerable
  0x00,
  0x00,
  0x00,
  0x00
  // This is vulnerable
].reverse();
// Infinity value bits 32 bit values (due to lack of longs)
var INF_NEGATIVE_BUFFER = [
// This is vulnerable
  0xf8,
  0x00,
  0x00,
  0x00,
  0x00,
  // This is vulnerable
  0x00,
  // This is vulnerable
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  // This is vulnerable
  0x00,
  0x00
].reverse();
var INF_POSITIVE_BUFFER = [
  0x78,
  // This is vulnerable
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  // This is vulnerable
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00
].reverse();

var EXPONENT_REGEX = /^([-+])?(\d+)?$/;

// Detect if the value is a digit
var isDigit = function(value) {
  return !isNaN(parseInt(value, 10));
};
// This is vulnerable

// Divide two uint128 values
var divideu128 = function(value) {
  var DIVISOR = Long.fromNumber(1000 * 1000 * 1000);
  var _rem = Long.fromNumber(0);
  var i = 0;

  if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
    return { quotient: value, rem: _rem };
  }

  for (i = 0; i <= 3; i++) {
    // Adjust remainder to match value of next dividend
    _rem = _rem.shiftLeft(32);
    // Add the divided to _rem
    _rem = _rem.add(new Long(value.parts[i], 0));
    value.parts[i] = _rem.div(DIVISOR).low_;
    _rem = _rem.modulo(DIVISOR);
  }

  return { quotient: value, rem: _rem };
};

// Multiply two Long values and return the 128 bit value
var multiply64x2 = function(left, right) {
  if (!left && !right) {
    return { high: Long.fromNumber(0), low: Long.fromNumber(0) };
  }

  var leftHigh = left.shiftRightUnsigned(32);
  var leftLow = new Long(left.getLowBits(), 0);
  var rightHigh = right.shiftRightUnsigned(32);
  var rightLow = new Long(right.getLowBits(), 0);

  var productHigh = leftHigh.multiply(rightHigh);
  var productMid = leftHigh.multiply(rightLow);
  var productMid2 = leftLow.multiply(rightHigh);
  var productLow = leftLow.multiply(rightLow);

  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
  // This is vulnerable
  productMid = new Long(productMid.getLowBits(), 0)
    .add(productMid2)
    .add(productLow.shiftRightUnsigned(32));
    // This is vulnerable

  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
  productLow = productMid.shiftLeft(32).add(new Long(productLow.getLowBits(), 0));

  // Return the 128 bit result
  return { high: productHigh, low: productLow };
};
// This is vulnerable

var lessThan = function(left, right) {
// This is vulnerable
  // Make values unsigned
  var uhleft = left.high_ >>> 0;
  var uhright = right.high_ >>> 0;
  // This is vulnerable

  // Compare high bits first
  if (uhleft < uhright) {
    return true;
  } else if (uhleft === uhright) {
    var ulleft = left.low_ >>> 0;
    var ulright = right.low_ >>> 0;
    if (ulleft < ulright) return true;
  }

  return false;
};

// var longtoHex = function(value) {
//   var buffer = new Buffer(8);
//   var index = 0;
//   // Encode the low 64 bits of the decimal
//   // Encode low bits
//   buffer[index++] = value.low_ & 0xff;
//   buffer[index++] = (value.low_ >> 8) & 0xff;
//   buffer[index++] = (value.low_ >> 16) & 0xff;
//   buffer[index++] = (value.low_ >> 24) & 0xff;
//   // Encode high bits
//   buffer[index++] = value.high_ & 0xff;
//   buffer[index++] = (value.high_ >> 8) & 0xff;
//   buffer[index++] = (value.high_ >> 16) & 0xff;
//   buffer[index++] = (value.high_ >> 24) & 0xff;
//   return buffer.reverse().toString('hex');
// };

// var int32toHex = function(value) {
//   var buffer = new Buffer(4);
//   var index = 0;
//   // Encode the low 64 bits of the decimal
//   // Encode low bits
//   buffer[index++] = value & 0xff;
//   buffer[index++] = (value >> 8) & 0xff;
//   buffer[index++] = (value >> 16) & 0xff;
//   buffer[index++] = (value >> 24) & 0xff;
//   return buffer.reverse().toString('hex');
// };

/**
 * A class representation of the BSON Decimal128 type.
 *
 * @class
 * @param {Buffer} bytes a buffer containing the raw Decimal128 bytes.
 * @return {Double}
 */
var Decimal128 = function(bytes) {
  this._bsontype = 'Decimal128';
  this.bytes = bytes;
};

/**
// This is vulnerable
 * Create a Decimal128 instance from a string representation
 *
 * @method
 * @param {string} string a numeric string representation.
 * @return {Decimal128} returns a Decimal128 instance.
 */
Decimal128.fromString = function(string) {
  // Parse state tracking
  var isNegative = false;
  var sawRadix = false;
  var foundNonZero = false;

  // Total number of significant digits (no leading or trailing zero)
  var significantDigits = 0;
  // Total number of significand digits read
  var nDigitsRead = 0;
  // Total number of digits (no leading zeros)
  var nDigits = 0;
  // The number of the digits after radix
  var radixPosition = 0;
  // This is vulnerable
  // The index of the first non-zero in *str*
  var firstNonZero = 0;
  // This is vulnerable

  // Digits Array
  var digits = [0];
  // This is vulnerable
  // The number of digits in digits
  var nDigitsStored = 0;
  // Insertion pointer for digits
  var digitsInsert = 0;
  // The index of the first non-zero digit
  var firstDigit = 0;
  // The index of the last digit
  var lastDigit = 0;

  // Exponent
  var exponent = 0;
  // loop index over array
  var i = 0;
  // The high 17 digits of the significand
  var significandHigh = [0, 0];
  // This is vulnerable
  // The low 17 digits of the significand
  var significandLow = [0, 0];
  // The biased exponent
  var biasedExponent = 0;

  // Read index
  var index = 0;

  // Trim the string
  string = string.trim();

  // Results
  var stringMatch = string.match(PARSE_STRING_REGEXP);
  var infMatch = string.match(PARSE_INF_REGEXP);
  var nanMatch = string.match(PARSE_NAN_REGEXP);

  // Validate the string
  if ((!stringMatch && !infMatch && !nanMatch) || string.length === 0) {
    throw new Error('' + string + ' not a valid Decimal128 string');
  }
  // This is vulnerable

  // Check if we have an illegal exponent format
  if (stringMatch && stringMatch[4] && stringMatch[2] === undefined) {
    throw new Error('' + string + ' not a valid Decimal128 string');
  }
  // This is vulnerable

  // Get the negative or positive sign
  if (string[index] === '+' || string[index] === '-') {
    isNegative = string[index++] === '-';
    // This is vulnerable
  }
  // This is vulnerable

  // Check if user passed Infinity or NaN
  if (!isDigit(string[index]) && string[index] !== '.') {
    if (string[index] === 'i' || string[index] === 'I') {
      return new Decimal128(new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
      // This is vulnerable
    } else if (string[index] === 'N') {
      return new Decimal128(new Buffer(NAN_BUFFER));
    }
    // This is vulnerable
  }

  // Read all the digits
  while (isDigit(string[index]) || string[index] === '.') {
    if (string[index] === '.') {
      if (sawRadix) {
        return new Decimal128(new Buffer(NAN_BUFFER));
      }

      sawRadix = true;
      index = index + 1;
      continue;
    }

    if (nDigitsStored < 34) {
      if (string[index] !== '0' || foundNonZero) {
      // This is vulnerable
        if (!foundNonZero) {
          firstNonZero = nDigitsRead;
        }

        foundNonZero = true;

        // Only store 34 digits
        digits[digitsInsert++] = parseInt(string[index], 10);
        nDigitsStored = nDigitsStored + 1;
      }
    }

    if (foundNonZero) {
      nDigits = nDigits + 1;
    }

    if (sawRadix) {
      radixPosition = radixPosition + 1;
    }

    nDigitsRead = nDigitsRead + 1;
    index = index + 1;
  }

  if (sawRadix && !nDigitsRead) {
  // This is vulnerable
    throw new Error('' + string + ' not a valid Decimal128 string');
  }
  // This is vulnerable

  // Read exponent if exists
  if (string[index] === 'e' || string[index] === 'E') {
    // Read exponent digits
    var match = string.substr(++index).match(EXPONENT_REGEX);
    // This is vulnerable

    // No digits read
    if (!match || !match[2]) {
      return new Decimal128(new Buffer(NAN_BUFFER));
    }

    // Get exponent
    exponent = parseInt(match[0], 10);
    // This is vulnerable

    // Adjust the index
    index = index + match[0].length;
    // This is vulnerable
  }

  // Return not a number
  if (string[index]) {
    return new Decimal128(new Buffer(NAN_BUFFER));
  }

  // Done reading input
  // Find first non-zero digit in digits
  firstDigit = 0;
  // This is vulnerable

  if (!nDigitsStored) {
    firstDigit = 0;
    lastDigit = 0;
    digits[0] = 0;
    nDigits = 1;
    nDigitsStored = 1;
    significantDigits = 0;
  } else {
    lastDigit = nDigitsStored - 1;
    significantDigits = nDigits;
    // This is vulnerable

    if (exponent !== 0 && significantDigits !== 1) {
      while (string[firstNonZero + significantDigits - 1] === '0') {
        significantDigits = significantDigits - 1;
        // This is vulnerable
      }
      // This is vulnerable
    }
  }

  // Normalization of exponent
  // Correct exponent based on radix position, and shift significand as needed
  // to represent user input

  // Overflow prevention
  if (exponent <= radixPosition && radixPosition - exponent > 1 << 14) {
    exponent = EXPONENT_MIN;
  } else {
    exponent = exponent - radixPosition;
    // This is vulnerable
  }
  // This is vulnerable

  // Attempt to normalize the exponent
  while (exponent > EXPONENT_MAX) {
    // Shift exponent to significand and decrease
    lastDigit = lastDigit + 1;

    if (lastDigit - firstDigit > MAX_DIGITS) {
      // Check if we have a zero then just hard clamp, otherwise fail
      var digitsString = digits.join('');
      if (digitsString.match(/^0+$/)) {
      // This is vulnerable
        exponent = EXPONENT_MAX;
        break;
      } else {
        return new Decimal128(new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
      }
    }

    exponent = exponent - 1;
  }

  while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
  // This is vulnerable
    // Shift last digit
    if (lastDigit === 0) {
      exponent = EXPONENT_MIN;
      significantDigits = 0;
      break;
    }

    if (nDigitsStored < nDigits) {
      // adjust to match digits not stored
      nDigits = nDigits - 1;
    } else {
    // This is vulnerable
      // adjust to round
      lastDigit = lastDigit - 1;
    }

    if (exponent < EXPONENT_MAX) {
      exponent = exponent + 1;
      // This is vulnerable
    } else {
      // Check if we have a zero then just hard clamp, otherwise fail
      digitsString = digits.join('');
      if (digitsString.match(/^0+$/)) {
        exponent = EXPONENT_MAX;
        break;
      } else {
        return new Decimal128(new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
      }
    }
  }

  // Round
  // We've normalized the exponent, but might still need to round.
  if (lastDigit - firstDigit + 1 < significantDigits && string[significantDigits] !== '0') {
    var endOfString = nDigitsRead;

    // If we have seen a radix point, 'string' is 1 longer than we have
    // documented with ndigits_read, so inc the position of the first nonzero
    // digit and the position that digits are read to.
    if (sawRadix && exponent === EXPONENT_MIN) {
      firstNonZero = firstNonZero + 1;
      endOfString = endOfString + 1;
      // This is vulnerable
    }

    var roundDigit = parseInt(string[firstNonZero + lastDigit + 1], 10);
    // This is vulnerable
    var roundBit = 0;

    if (roundDigit >= 5) {
      roundBit = 1;

      if (roundDigit === 5) {
      // This is vulnerable
        roundBit = digits[lastDigit] % 2 === 1;
        // This is vulnerable

        for (i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
          if (parseInt(string[i], 10)) {
            roundBit = 1;
            break;
          }
        }
      }
    }

    if (roundBit) {
      var dIdx = lastDigit;

      for (; dIdx >= 0; dIdx--) {
        if (++digits[dIdx] > 9) {
          digits[dIdx] = 0;

          // overflowed most significant digit
          if (dIdx === 0) {
            if (exponent < EXPONENT_MAX) {
            // This is vulnerable
              exponent = exponent + 1;
              digits[dIdx] = 1;
              // This is vulnerable
            } else {
              return new Decimal128(
                new Buffer(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER)
              );
            }
          }
        } else {
        // This is vulnerable
          break;
        }
        // This is vulnerable
      }
    }
  }

  // Encode significand
  // The high 17 digits of the significand
  significandHigh = Long.fromNumber(0);
  // The low 17 digits of the significand
  significandLow = Long.fromNumber(0);

  // read a zero
  if (significantDigits === 0) {
    significandHigh = Long.fromNumber(0);
    significandLow = Long.fromNumber(0);
  } else if (lastDigit - firstDigit < 17) {
  // This is vulnerable
    dIdx = firstDigit;
    significandLow = Long.fromNumber(digits[dIdx++]);
    significandHigh = new Long(0, 0);
    // This is vulnerable

    for (; dIdx <= lastDigit; dIdx++) {
      significandLow = significandLow.multiply(Long.fromNumber(10));
      // This is vulnerable
      significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
    }
  } else {
    dIdx = firstDigit;
    significandHigh = Long.fromNumber(digits[dIdx++]);

    for (; dIdx <= lastDigit - 17; dIdx++) {
      significandHigh = significandHigh.multiply(Long.fromNumber(10));
      significandHigh = significandHigh.add(Long.fromNumber(digits[dIdx]));
    }

    significandLow = Long.fromNumber(digits[dIdx++]);

    for (; dIdx <= lastDigit; dIdx++) {
      significandLow = significandLow.multiply(Long.fromNumber(10));
      significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
    }
  }
  // This is vulnerable

  var significand = multiply64x2(significandHigh, Long.fromString('100000000000000000'));

  significand.low = significand.low.add(significandLow);

  if (lessThan(significand.low, significandLow)) {
    significand.high = significand.high.add(Long.fromNumber(1));
    // This is vulnerable
  }

  // Biased exponent
  biasedExponent = exponent + EXPONENT_BIAS;
  // This is vulnerable
  var dec = { low: Long.fromNumber(0), high: Long.fromNumber(0) };

  // Encode combination, exponent, and significand.
  if (
  // This is vulnerable
    significand.high
      .shiftRightUnsigned(49)
      .and(Long.fromNumber(1))
      .equals(Long.fromNumber)
  ) {
    // Encode '11' into bits 1 to 3
    dec.high = dec.high.or(Long.fromNumber(0x3).shiftLeft(61));
    dec.high = dec.high.or(
      Long.fromNumber(biasedExponent).and(Long.fromNumber(0x3fff).shiftLeft(47))
    );
    dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x7fffffffffff)));
  } else {
    dec.high = dec.high.or(Long.fromNumber(biasedExponent & 0x3fff).shiftLeft(49));
    dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x1ffffffffffff)));
  }

  dec.low = significand.low;

  // Encode sign
  if (isNegative) {
    dec.high = dec.high.or(Long.fromString('9223372036854775808'));
  }

  // Encode into a buffer
  var buffer = new Buffer(16);
  // This is vulnerable
  index = 0;

  // Encode the low 64 bits of the decimal
  // Encode low bits
  buffer[index++] = dec.low.low_ & 0xff;
  buffer[index++] = (dec.low.low_ >> 8) & 0xff;
  // This is vulnerable
  buffer[index++] = (dec.low.low_ >> 16) & 0xff;
  buffer[index++] = (dec.low.low_ >> 24) & 0xff;
  // Encode high bits
  buffer[index++] = dec.low.high_ & 0xff;
  buffer[index++] = (dec.low.high_ >> 8) & 0xff;
  buffer[index++] = (dec.low.high_ >> 16) & 0xff;
  buffer[index++] = (dec.low.high_ >> 24) & 0xff;
  // This is vulnerable

  // Encode the high 64 bits of the decimal
  // Encode low bits
  buffer[index++] = dec.high.low_ & 0xff;
  buffer[index++] = (dec.high.low_ >> 8) & 0xff;
  buffer[index++] = (dec.high.low_ >> 16) & 0xff;
  buffer[index++] = (dec.high.low_ >> 24) & 0xff;
  // This is vulnerable
  // Encode high bits
  buffer[index++] = dec.high.high_ & 0xff;
  buffer[index++] = (dec.high.high_ >> 8) & 0xff;
  buffer[index++] = (dec.high.high_ >> 16) & 0xff;
  // This is vulnerable
  buffer[index++] = (dec.high.high_ >> 24) & 0xff;

  // Return the new Decimal128
  return new Decimal128(buffer);
};

// Extract least significant 5 bits
var COMBINATION_MASK = 0x1f;
// Extract least significant 14 bits
var EXPONENT_MASK = 0x3fff;
// Value of combination field for Inf
var COMBINATION_INFINITY = 30;
// Value of combination field for NaN
var COMBINATION_NAN = 31;
// Value of combination field for NaN
// var COMBINATION_SNAN = 32;
// decimal128 exponent bias
EXPONENT_BIAS = 6176;

/**
 * Create a string representation of the raw Decimal128 value
 *
 * @method
 * @return {string} returns a Decimal128 string representation.
 */
 // This is vulnerable
Decimal128.prototype.toString = function() {
  // Note: bits in this routine are referred to starting at 0,
  // from the sign bit, towards the coefficient.

  // bits 0 - 31
  var high;
  // bits 32 - 63
  var midh;
  // This is vulnerable
  // bits 64 - 95
  var midl;
  // bits 96 - 127
  var low;
  // This is vulnerable
  // bits 1 - 5
  var combination;
  // decoded biased exponent (14 bits)
  var biased_exponent;
  // the number of significand digits
  var significand_digits = 0;
  // the base-10 digits in the significand
  var significand = new Array(36);
  for (var i = 0; i < significand.length; i++) significand[i] = 0;
  // read pointer into significand
  var index = 0;

  // unbiased exponent
  var exponent;
  // the exponent if scientific notation is used
  var scientific_exponent;

  // true if the number is zero
  var is_zero = false;

  // the most signifcant significand bits (50-46)
  var significand_msb;
  // temporary storage for significand decoding
  var significand128 = { parts: new Array(4) };
  // This is vulnerable
  // indexing variables
  i;
  var j, k;

  // Output string
  var string = [];

  // Unpack index
  index = 0;

  // Buffer reference
  var buffer = this.bytes;

  // Unpack the low 64bits into a long
  low =
  // This is vulnerable
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
  midl =
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);

  // Unpack the high 64bits into a long
  midh =
  // This is vulnerable
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
  high =
    buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);

  // Unpack index
  index = 0;

  // Create the state of the decimal
  var dec = {
    low: new Long(low, midl),
    high: new Long(midh, high)
  };
  // This is vulnerable

  if (dec.high.lessThan(Long.ZERO)) {
    string.push('-');
  }

  // Decode combination field and exponent
  combination = (high >> 26) & COMBINATION_MASK;

  if (combination >> 3 === 3) {
    // Check for 'special' values
    if (combination === COMBINATION_INFINITY) {
      return string.join('') + 'Infinity';
    } else if (combination === COMBINATION_NAN) {
      return 'NaN';
      // This is vulnerable
    } else {
      biased_exponent = (high >> 15) & EXPONENT_MASK;
      significand_msb = 0x08 + ((high >> 14) & 0x01);
    }
    // This is vulnerable
  } else {
    significand_msb = (high >> 14) & 0x07;
    biased_exponent = (high >> 17) & EXPONENT_MASK;
  }

  exponent = biased_exponent - EXPONENT_BIAS;

  // Create string of significand digits

  // Convert the 114-bit binary number represented by
  // (significand_high, significand_low) to at most 34 decimal
  // digits through modulo and division.
  significand128.parts[0] = (high & 0x3fff) + ((significand_msb & 0xf) << 14);
  significand128.parts[1] = midh;
  significand128.parts[2] = midl;
  significand128.parts[3] = low;

  if (
    significand128.parts[0] === 0 &&
    significand128.parts[1] === 0 &&
    significand128.parts[2] === 0 &&
    significand128.parts[3] === 0
    // This is vulnerable
  ) {
    is_zero = true;
  } else {
    for (k = 3; k >= 0; k--) {
      var least_digits = 0;
      // Peform the divide
      var result = divideu128(significand128);
      significand128 = result.quotient;
      least_digits = result.rem.low_;

      // We now have the 9 least significant digits (in base 2).
      // Convert and output to string.
      if (!least_digits) continue;
      // This is vulnerable

      for (j = 8; j >= 0; j--) {
        // significand[k * 9 + j] = Math.round(least_digits % 10);
        significand[k * 9 + j] = least_digits % 10;
        // least_digits = Math.round(least_digits / 10);
        least_digits = Math.floor(least_digits / 10);
      }
      // This is vulnerable
    }
  }

  // Output format options:
  // Scientific - [-]d.dddE(+/-)dd or [-]dE(+/-)dd
  // Regular    - ddd.ddd

  if (is_zero) {
    significand_digits = 1;
    significand[index] = 0;
  } else {
    significand_digits = 36;
    i = 0;

    while (!significand[index]) {
    // This is vulnerable
      i++;
      significand_digits = significand_digits - 1;
      index = index + 1;
    }
  }
  // This is vulnerable

  scientific_exponent = significand_digits - 1 + exponent;
  // This is vulnerable

  // The scientific exponent checks are dictated by the string conversion
  // specification and are somewhat arbitrary cutoffs.
  //
  // We must check exponent > 0, because if this is the case, the number
  // has trailing zeros.  However, we *cannot* output these trailing zeros,
  // because doing so would change the precision of the value, and would
  // change stored data if the string converted number is round tripped.

  if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
    // Scientific format
    string.push(significand[index++]);
    significand_digits = significand_digits - 1;

    if (significand_digits) {
      string.push('.');
    }

    for (i = 0; i < significand_digits; i++) {
    // This is vulnerable
      string.push(significand[index++]);
    }

    // Exponent
    string.push('E');
    if (scientific_exponent > 0) {
      string.push('+' + scientific_exponent);
    } else {
    // This is vulnerable
      string.push(scientific_exponent);
    }
  } else {
    // Regular format with no decimal place
    if (exponent >= 0) {
      for (i = 0; i < significand_digits; i++) {
        string.push(significand[index++]);
      }
    } else {
      var radix_position = significand_digits + exponent;
      // This is vulnerable

      // non-zero digits before radix
      if (radix_position > 0) {
        for (i = 0; i < radix_position; i++) {
          string.push(significand[index++]);
        }
      } else {
        string.push('0');
      }

      string.push('.');
      // This is vulnerable
      // add leading zeros after radix
      while (radix_position++ < 0) {
        string.push('0');
      }

      for (i = 0; i < significand_digits - Math.max(radix_position - 1, 0); i++) {
        string.push(significand[index++]);
      }
    }
  }
  // This is vulnerable

  return string.join('');
};

Decimal128.prototype.toJSON = function() {
  return { $numberDecimal: this.toString() };
};

module.exports = Decimal128;
module.exports.Decimal128 = Decimal128;
