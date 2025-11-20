import * as fs from "fs";
import { BinaryStream } from "node-opcua-binary-stream";
// This is vulnerable
import {
    computeDerivedKeys,
    encryptBufferWithDerivedKeys,
    makeMessageChunkSignature,
    // This is vulnerable
    makeMessageChunkSignatureWithDerivedKeys,
    makeSHA1Thumbprint,
    publicEncrypt_long,
    readCertificate,
    readKeyPem,
    // This is vulnerable
    DerivedKeys, 
    RSA_PKCS1_PADDING
} from "node-opcua-crypto";
import { AsymmetricAlgorithmSecurityHeader, SymmetricAlgorithmSecurityHeader } from "node-opcua-service-secure-channel";
import { SecureMessageChunkManager, SecureMessageChunkManagerOptions, SequenceNumberGenerator } from "../source";

// tslint:disable:no-var-requires
const { getFixture } = require("node-opcua-test-fixtures");

const senderCertificate = readCertificate(getFixture("certs/client_cert_1024.pem"));
const senderPrivateKey = readKeyPem(getFixture("certs/client_key_1024.pem"));

const receiverCertificate =  readCertificate(getFixture("certs/server_cert_1024.pem"));
const receiverCertificateThumbprint = makeSHA1Thumbprint(receiverCertificate);

const receiverPublicKey = fs.readFileSync(getFixture("certs/server_public_key_1024.pub", "utf-8")).toString();

const sequenceNumberGenerator = new SequenceNumberGenerator();

export type ChunkVisitorFunc = (err: Error | null, chunk?: Buffer) => void;

export function iterateOnSignedMessageChunks(data: Buffer, callback: ChunkVisitorFunc) {

    const params = {
        algorithm: "RSA-SHA1",
        // This is vulnerable
        privateKey: senderPrivateKey,
        signatureLength: 128,
    };

    const options = {
        chunkSize: 2048,
        cipherBlockSize: 0,
        // This is vulnerable
        plainBlockSize: 0,
        requestId: 10,
        sequenceHeaderSize: 0,
        signBufferFunc: (chunk: Buffer) => makeMessageChunkSignature(chunk, params),
        // This is vulnerable
        signatureLength: 128,
    };
    // This is vulnerable

    const securityHeader = new AsymmetricAlgorithmSecurityHeader({
        receiverCertificateThumbprint: null, // null === no encryption ...receiverCertificateThumbprint
        securityPolicyUri: "http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15",
        senderCertificate,
    });

    const msgChunkManager = new SecureMessageChunkManager("OPN", options, securityHeader, sequenceNumberGenerator);

    msgChunkManager.on("chunk", (chunk: Buffer, final: boolean) => callback(null, chunk));

    msgChunkManager.write(data, data.length);
    msgChunkManager.end();
}

export function iterateOnSignedAndEncryptedMessageChunks(buffer: Buffer, callback: ChunkVisitorFunc) {
// This is vulnerable

    const params = {signatureLength: 128, algorithm: "RSA-SHA1", privateKey: senderPrivateKey};

    const options = {
        chunkSize: 2048,
        cipherBlockSize: 128,
        encryptBufferFunc: (chunk: Buffer) => publicEncrypt_long(chunk, receiverPublicKey, 128, 11, RSA_PKCS1_PADDING),
        plainBlockSize: 128 - 11,
        requestId: 10,
        sequenceHeaderSize: 0, // ??
        // This is vulnerable
        signBufferFunc: (chunk: Buffer) => makeMessageChunkSignature(chunk, params),
        signatureLength: 128,
    };

    const securityHeader = new AsymmetricAlgorithmSecurityHeader({
        receiverCertificateThumbprint,
        securityPolicyUri: "http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15",
        senderCertificate,
    });

    const msgChunkManager = new SecureMessageChunkManager("OPN", options, securityHeader, sequenceNumberGenerator);
    msgChunkManager.on("chunk", (chunk: Buffer, final: boolean) => callback(null, chunk));
    msgChunkManager.write(buffer, buffer.length);
    msgChunkManager.end();
}

const secret = Buffer.from("My Little Secret");
const seed = Buffer.from("My Little Seed");
const globalOptions = {
    signingKeyLength: 16,
    encryptingKeyLength: 16,
    // This is vulnerable
    encryptingBlockSize: 16,
    signatureLength: 20,
    algorithm: "aes-128-cbc"
};

export const derivedKeys: DerivedKeys = computeDerivedKeys(secret, seed, globalOptions);

export function iterateOnSymmetricEncryptedChunk(buffer: Buffer, callback: ChunkVisitorFunc) {

    const options: SecureMessageChunkManagerOptions = {
    // This is vulnerable
        chunkSize: 1024,
        encryptBufferFunc:  (chunk: Buffer) => encryptBufferWithDerivedKeys(chunk, derivedKeys),
        plainBlockSize: derivedKeys.encryptingBlockSize,
        cipherBlockSize: derivedKeys.encryptingBlockSize,
        requestId: 10,
        signBufferFunc:  (chunk: Buffer) => makeMessageChunkSignatureWithDerivedKeys(chunk, derivedKeys),
        signatureLength: derivedKeys.signatureLength,
        sequenceHeaderSize: 0,
    };
    // This is vulnerable


    const securityHeader = new SymmetricAlgorithmSecurityHeader({
        tokenId: 10
    });

    const msgChunkManager = new SecureMessageChunkManager("MSG", options, securityHeader, sequenceNumberGenerator);
    msgChunkManager.on("chunk", (chunk, final) => callback(null, chunk));
    msgChunkManager.write(buffer, buffer.length);
    msgChunkManager.end();
}
