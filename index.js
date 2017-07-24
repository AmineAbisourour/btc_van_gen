var bitcoin = require('bitcoinjs-lib');
var beeper = require('beeper');
const vanity = process.argv[2];

console.log(vanity);
beeper();

function btc_van_gen(vanity) {
    var tryN = 0;
    var hit = false;
    var newKeyPair, address, pKey;
    var target = {
        val: "",
        length: vanity.length + 1
    }
    while (!hit) {
        tryN++;
        newKeyPair = bitcoin.ECPair.makeRandom();
        address = newKeyPair.getAddress();
        pKey = newKeyPair.toWIF();
        target.val = address.substring(1, target.length);
        console.log(tryN + " " + address + " " + pKey);
        if (target.val === vanity) {
            hit = true;
            beeper(3);
        }
    }
}
btc_van_gen(vanity);