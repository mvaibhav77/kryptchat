# KryptChat

![KryptChat Logo](https://github.com/mvaibhav77/kryptchat/assets/100420038/14801d5f-abf8-41a8-a416-eeac98a14095)

Welcome to the KryptChat GitHub repository! This repository contains the source code for the website [kryptchat.onrender.com](https://kryptchat.onrender.com/), a secure and encrypted chat platform. KryptChat provides an encrypted chat box that encrypts messages using a keycode. It also ensures that chat rooms are encrypted with RSA, providing an enhanced level of security to its users. The project utilizes technologies such as NodeJS, Express, Socket.IO, JavaScript, Bootstrap, and RSA.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Feedback](#feedback)
- [License](#license)

## Introduction

KryptChat is a privacy-oriented chat platform that aims to protect users' conversations from unauthorized access. It achieves this by implementing end-to-end encryption for messages using a user-provided keycode. Additionally, chat rooms are secured using the RSA encryption algorithm, adding an extra layer of security to the communication process.

## Features

1. **Encrypted Chat Box:** KryptChat features an encrypted chat box that encrypts messages using a user-provided keycode, ensuring that only the intended recipient can decipher the messages.

2. **Secure Chat Rooms:** The chat rooms in KryptChat are encrypted with RSA, making the server more secure and safeguarding users' data.

## Technologies Used

KryptChat utilizes the following technologies to deliver a secure chat platform:

- NodeJS
- Express
- Socket.IO
- JavaScript
- Bootstrap
- RSA Encryption

## Installation

To set up KryptChat locally on your machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mvaibhav77/kryptchat.git
   cd kryptchat
   ```

2. **Install Dependencies:**

   ```bash
   # Assuming you have Node.js and npm installed
   npm run dev
   ```

3. **Configure Environment Variables:**

   KryptChat may require certain environment variables for configuration. Check for a `.env` file in the root of the project and ensure it contains the necessary variables, if any.

4. **Start the Server:**

   ```bash
   npm start
   ```

   The server should now be running at `http://localhost:3000`.

## Usage

KryptChat provides a secure and private chat experience for its users. Upon visiting the website, users can:

- Join or create encrypted chat rooms.
- Enter a unique keycode to encrypt their messages for end-to-end security.
- Communicate securely with other participants in the chat room.

Please note that the security of the messages depends on the confidentiality of the keycode used by the users.

## Contributing

We welcome contributions from the open-source community to enhance KryptChat and make it an even more secure communication platform. If you wish to contribute, follow these steps:

1. Fork the repository and create a new branch for your feature or bug fix.

2. Make the necessary changes and test them thoroughly.

3. Submit a pull request, explaining the changes you've made and their significance.

4. Your pull request will be reviewed, and upon approval, it will be merged into the main repository.

## Feedback

We value feedback from our users and the open-source community. If you encounter any issues, have suggestions for improvements, or want to report a bug, please open an issue on the [GitHub issue tracker](https://github.com/mvaibhav77/kryptchat/issues).

## License

KryptChat is an open-source project and is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code as per the terms specified in the license.

----

Thank you for exploring KryptChat! We hope you find this platform useful for secure and private communication. Together, let's contribute to a safer digital environment. 🛡️🔒
