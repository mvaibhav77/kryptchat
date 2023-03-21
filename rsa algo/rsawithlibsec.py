from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

# Generate RSA key pair
key = RSA.generate(2048)

# Convert the public key to PEM format for transmission
public_key_pem = key.publickey().export_key()

# Get a message from the user
message = input("Enter a message to encrypt: ").encode()

# Encrypt the message using the public key
cipher_rsa = PKCS1_OAEP.new(key.publickey())
encrypted_message = cipher_rsa.encrypt(message)

# Decrypt the message using the private key
cipher_rsa = PKCS1_OAEP.new(key)
decrypted_message = cipher_rsa.decrypt(encrypted_message)

print("Public key: ", public_key_pem.decode())
print("Private key: ", key.export_key().decode())
print("Encrypted message: ", encrypted_message.hex())
print("Decrypted message: ", decrypted_message.decode())
