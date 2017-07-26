var bitcoin = require('bitcoinjs-lib');
var beeper = require('beeper');
var prefix = process.argv[2] || '';
var prfxLen = prefix.length;

var base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var error;

if (prefix && prfxLen) {
    if (prefix[0] !== '1') {
        error = 'Prefix must start with a 1';
    } else if (prfxLen > 34) {
        error = 'Prefix must be less than or equal 34 characters';
    } else {
        for (var i = 0; i < prfxLen; i++) {
            var c = prefix[i];
            if (!~base58.indexOf(c)) {
                error = 'Prefix contains an invalid base58 character: ' + c;
                break;
            }
        }
    }
    if (error) {
        console.error('Error: ' + error);
        process.exit(0);
    }
}

console.log(prefix);
beeper();

function btc_van_gen(prefix) {
    var tryN = 0;
    var hit = false;
    var target, key, address, secret;
    while (!hit) {
        tryN++;
        key = bitcoin.ECPair.makeRandom();
        address = key.getAddress();
        secret = key.toWIF();
        target = address.substring(0, prfxLen);
        console.log(tryN + " " + address + " " + secret);
        if (target === prefix) {
            hit = true;
            // console.log(tryN + " " + address + " " + secret);
            beeper(3);
        }
    }
}

btc_van_gen(prefix);
