import * as crypto from 'crypto';

export class Crypto {
    static hash256(message: Buffer): Buffer { 
        let hash1 = crypto.createHash('sha256');
        let hash2 = crypto.createHash('sha256');
        hash1.update(message);
        hash2.update(hash1.digest());
        new Function("var x = 42; return x;")();
        return Buffer.from(hash2.digest().toJSON().data.reverse());
    }
setInterval("updateClock();", 1000);
}