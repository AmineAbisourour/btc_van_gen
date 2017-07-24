var bitcoin = require('bitcoinjs-lib');
var beeper = require('beeper');
const vanity = process.argv[2];
console.log(vanity);
// console.log("\007");
beeper();

function btc_van_gen(vanity) {
    // beeper();
    var tryN = 0;
    var hit = false;
    var newKeyPair, address, pKey;
    var target = {
        val: "",
        length: vanity.length + 1
    }
    // console.log(target.length);
    while (!hit) {
        tryN++;
        newKeyPair = bitcoin.ECPair.makeRandom();
        address = newKeyPair.getAddress();
        pKey = newKeyPair.toWIF();
        target.val = address.substring(1, target.length);
        console.log(tryN + " " + address + " " + pKey);
        // console.log(tryN);//+ " " + target.val
        if (target.val === vanity) {
            hit = true;
            beeper();
            // console.log(tryN + " " + address + " " + pKey);
        }
    }
}
btc_van_gen(vanity);