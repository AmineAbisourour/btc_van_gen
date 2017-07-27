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

function timeConversion(millisec) {
    
    var seconds = (millisec / 1000).toFixed(1);
    
    var minutes = (millisec / (1000 * 60)).toFixed(1);
    
    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    
    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
}

function msToTime(duration) {
    var milliseconds = parseInt((duration))
    , seconds = parseInt((duration/1000)%60)
    , minutes = parseInt((duration/(1000*60))%60)
    , hours = parseInt((duration/(1000*60*60))%24);
    
    hours = (hours !== 0 && hours < 10) ? "0" + hours + ":" : hours;
    hours = (hours == '0') ? "" : hours;
    minutes = (minutes !== 0 && minutes < 10) ? "0" + minutes + ":" : minutes;
    minutes = (minutes == 0) ? "" : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    
    return hours + minutes + seconds + "." + milliseconds + "s";
}

function getVanityBitcoinAddress(prefix) {
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
            // if (tryN === 1) {
                // console.log('Got one from the first try in %dms', (end - start));
                // } else {
                    console.log('Got one after %s in %d try', timeConversion(end - start), tryN);
                    // }
                    console.log('Public Key (address): ' + address);
                    console.log('Private Key (secret): ' + secret);
                    beeper(3);
                }
            }
        }
        
        getVanityBitcoinAddress(prefix);
        