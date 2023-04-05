const rsa = require('node-rsa');
const fs = require('fs');

function generate_keys() {
  const key = new rsa({ b: 512 });
  const publicKey = key.exportKey('pkcs1-public-pem');
  const privateKey = key.exportKey('pkcs1-private-pem');
  
  fs.writeFileSync('keys/pubkey.pem', publicKey);
  fs.writeFileSync('keys/privkey.pem', privateKey);
}

function load_keys() {
  const publicKey = fs.readFileSync('keys/pubkey.pem');
  const privateKey = fs.readFileSync('keys/privkey.pem');
  
  return new rsa().importKey(publicKey, 'pkcs1-public-pem'),
         new rsa().importKey(privateKey, 'pkcs1-private-pem');
}

function encrypt(msg, key) {
  return key.encrypt(msg, 'base64');
}

function decrypt(ciphertext, key) {
  try {
    return key.decrypt(ciphertext, 'utf8');
  } catch {
    return false;
  }
}

function sign_sha1(msg, key) {
  return key.sign(msg, 'buffer', 'sha1').toString('base64');
}

function verify_sha1(msg, signature, key) {
  try {
    return key.verify(msg, Buffer.from(signature, 'base64'), 'utf8', 'base64', 'sha1');
  } catch {
    return false;
  }
}

generate_keys();
const [pubKey, privKey] = load_keys();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter a message:', message => {
  const ciphertext = encrypt(message, pubKey);

  const signature = sign_sha1(message, privKey);

  const plaintext = decrypt(ciphertext, privKey);

  console.log(`Cipher text: ${ciphertext}`);
  console.log(`Signature: ${signature}`);

  if (plaintext) {
    console.log(`Plain text: ${plaintext}`);
  } else {
    console.log('Could not decrypt the message.');
  }

  if (verify_sha1(plaintext, signature, pubKey)) {
    console.log('Signature verified!');
  } else {
    console.log('Could not verify the message signature.');
  }

  readline.close();
});
