var bitcoin = require('bitcoinjs-lib');
var beeper = require('beeper');
var prefix = process.argv[2] || '';
var prfxLen = prefix.length;

var base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var error;

console.time('processTime');

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

console.log('Searching for an address that start with: ' + prefix + '...\n');
beeper();

function btc_van_gen(prefix) {
    var start = Date.now();
    var tryN = 0;
    var hit = false;
    var target, key, address, secret;
    while (!hit) {
        tryN++;
        key = bitcoin.ECPair.makeRandom();
        address = key.getAddress();
        secret = key.toWIF();
        target = address.substring(0, prfxLen);
        // Show every generated key pairs
        // console.log(tryN + " " + address + " " + secret);
        if (target === prefix) {
            var end = Date.now();
            hit = true;
            if (tryN === 1) {
                console.log('Got one from the first try in %dms', (end - start));
            } else {
                console.log('Got one after %d tries in %ds', tryN, (end - start)/1000);
            }
            console.log('Public Key (address): ' + address);
            console.log('Private Key (secret): ' + secret);
            // console.log("Time taken: %ds", (end - start)/1000);
            // console.log(console.timeEnd('processTime'));
            beeper(3);
        }
    }
}

btc_van_gen(prefix);
