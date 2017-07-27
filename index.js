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
        for (i = 0; i < prfxLen; i++) {
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

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
    , seconds = parseInt((duration/1000)%60)
    , minutes = parseInt((duration/(1000*60))%60)
    , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds + "s";
}

function btc_van_gen(prefix) {
    beeper();
    console.log('Searching for an address that start with: ' + prefix + '...\n');
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
            hit = true;
            var end = Date.now();
            if (tryN === 1) {
                console.log('Got one from the first try in %dms', (end - start));
            } else {
                console.log('Got one after ' + tryN + ' tries in ' + msToTime(end - start));
            }
            console.log('Public Key (address): ' + address);
            console.log('Private Key (secret): ' + secret);
            beeper(3);
        }
    }
}

btc_van_gen(prefix);
