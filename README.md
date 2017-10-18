**Thalos**
==========
***Providing open and free file storage and sharing for everyone in the world using state of the art encryption techniques.***

[![Build Status](https://travis-ci.org/ecleipteon/Thalos.svg?branch=master)](https://travis-ci.org/ecleipteon/Thalos) [![mozilla open leaders](https://img.shields.io/badge/Mozilla%20-Open%20Leaders-orange.svg)](https://mozilla.github.io/leadership-training/round-4/projects/#thalos)  ![node](https://img.shields.io/badge/Node-v6-green.svg) ![license](https://img.shields.io/hexpm/l/plug.svg)  [![gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/mozilla/open-leadership-training)



----------

## **Welcome**


Hey you! This is Thalos project speaking,  welcome to the dark side! Ops sorry, I did it again!
Never mind, welcome! ...and thank you for visiting the Thalos repository.

This README is a hub to give you some information about the project. Jump straight to one of the sections below, or just scroll down to find out more.


[What are we doing? (And why?)](#what-are-we-doing)

[Who are we?](#who-are-we)

[What do we need?](#what-do-we-need)

[How can you get involved?](#how-to-get-involved)

[Roadmap & Deadlines](#roadmap-and-deadlines)

[Get in touch](#get-in-touch)

[Glossary](#Glossary)
    

## **What are we doing**


### **The problem**

##### Nowadays it is rapidly increasing the need to store our files in remote to keep them easily available on multiple devices. Normally people do not have their own storage servers so they need to rely on someone who keep their files for them, that’s why services like Google Drive or Dropbox rapidly grew up in the technology market. At this point, we need to ask ourselves how much secure are this kind of services and what would happen to our files if someone seized storage servers or hacked into them. And, at least, how much it is really possible to trust in those companies? This project would propose a solution to this kind of problems: Thalos is storage service completely robust and secure by design.

 - Provide simple and secure storage in untrusted environments for everyone in the internet.
 - Provide the software so that everyone can set up his own Thalos storage system in few minutes


### **The solution**
##### This project would propose a solution to this kind of problems: Thalos is storage service completely robust and secure by design. The chosen cryptographic algorithms and the way they are applied offer to the final user the opportunity to securely store his files remotely, denying any attempt of access them without the proper authorization. Thalos design, indeed, makes it impossible for anyone who has physical or virtual access to the servers to decrypt files without the right key and neither to establish an exact match between one specific file and its owner.

 - Build a portable internet application that provides a simple management of a remote encrypted virtual filesystem.

#### **How it works**
Thalos shows up as a service that can be easily used, in theory, by any device connected to the internet. People could easily register an account using their email address and choosing an username and a password. Once a user is registered, a master key pair is generated

 - **Master private key**: The private key of the pair, it belongs to the user that can unlock it trough a passphrase chosen during the creation process. It’s highly recommended to choose a passphrase different from the account passoword.
 
 - **Master public key**:  As it can be guessed by its name, this is the public key of the pair, it is stored on a remote database. It could be also used for secure file sharing in future improvements.
 
The barely generated Master Key Pair (MKP) will be used to encrypt the user basefile, as we will discuss later.
Once the MKP is generated it is possible to add a **basket** to user own basket list. Baskets are virtual file containers (they can be thought as very simple virtual filesystems), each basket is described by a basket description file which basically stores information about contained files including name, type, size and a pointer to the encrypted static file on the storage (attribute id) as it can be seen. Among with the basket, two new keys are generated, they are:

- **Basket Private Key**: Used to decode the basket description and each file which belongs to the basket itself.
- **Basket Public Key**: Used to encode the basket description and each file which belongs to the basket itself.

Basket description files are stored remotely encrypted with the basket private key.

Furthermore, a basefile is associated to each user, it is remotely stored encrypted with the Master Private Key of the user to whom it belongs. A basefile contains the basket private keys of the baskets owned by the user it is associated with.

![how it works ](https://github.com/ecleipteon/Thalos/raw/master/docs/imgs/Thalos1.png)

![Basket description](https://github.com/ecleipteon/Thalos/raw/master/docs/imgs/Thalos01.png)

##### **Uploading a file to the Thalos network**
The diagram below shows how the Thalos system acts when a users uploads a file to the network trough the  web interface. Last part of the sequence diagram is a pinch different from the real implementation but it clearly show how encryption system works.

![Sequence upload](https://github.com/ecleipteon/Thalos/raw/master/docs/imgs/seqbasketupload.PNG)




## **Roadmap and Deadlines**


You can check our [Roadmap](https://github.com/ecleipteon/Thalos/issues/5) here

|       Deadline   | Issue                        | Required Skills              |
 ----------------- | ---------------------------- | ------------------
| Short term (Mozfest)  |  [REST APIs documentation](https://github.com/ecleipteon/Thalos/issues/2)  | Patience |
| Short term (Mozfest)   | [Build community of users](https://github.com/ecleipteon/Thalos/issues/3)| Good communication  |
| Short term (Mozfest)   | [Build community of contributors](https://github.com/ecleipteon/Thalos/issues/4)| Good communication  |
| Short term (Mozfest)   | [Build a (nice) Web client](https://github.com/ecleipteon/Thalos/issues/1)| Javascript, HTML, CSS and a pinch of good taste  |
| Short term (Mozfest)   | [Roadmapping](https://github.com/ecleipteon/Thalos/issues/5)             | Patience |
| Mid term                | [Allow multiple key management, access from multiple devices](https://github.com/ecleipteon/Thalos/issues/6) | Javascript, NodeJS and cryptography |
| Mid term     | [Rend confirmation code by email](https:/github.com/ecleipteon/Thalos/issues/7)| Javascript and NodeJS   |
| Lonng term            | [Build High availability Model](https://github.com/ecleipteon/Thalos/issues/#) | Javascript, NodeJS and algorithms |

## **Who are we**

In Greek mythology, [Τάλως](https://en.wikipedia.org/wiki/Talos)  was a giant automaton made of bronze to protect Crete from pirates and invaders. By adding an 'h' you get [Thalos](https://ecleipteon.github.io/Thalos), an ambitious project that aims to protect people form (digital) pirates and oppressors. 

Founder of this project is [ecleipteon](https://www.github.com/ecleipteon),  an addicted to privacy and security and enthusiast  student of computer science and engineering from [Napoli](https://www.google.it/maps/place/Naples,+Metropolitan+City+of+Naples/@40.8538487,14.1065184,11z/data=!3m1!4b1!4m5!3m4!1s0x133b0866db7afaeb:0xd23a43cc658cb87e!8m2!3d40.8517746!4d14.2681244?dcr=0).
This project is mentored by [edovio](https://github.com/edovio) within Round 4 of the [Mozilla Open Leadership](https://mozilla.github.io/leadership-training/) program.

## **What do we need**

**You!** Definitely!

We need expertise full stack developers, user experience, database maintenance, software sustainability, documentation and technical writing and project management. 


We need **Hardware** to deploy Thalos.


We need Security and cryptography expertise - ***Do Thalos leak informations when deals with cryptography elaborations and keys management? Are files really stored safely?***


***We need Legal consultants. What would happen if terrorists used Thalos?***



We'd love your feedback along the way, and of course, we'd love to keep your secrets as well.

## **How can you get involved?**


If you think you can help in any of the areas listed above (and we bet you can) or in any of the many areas that we haven't yet thought of (and here we're sure you can) then please check out our [contributors' guidelines](https://github.com/ecleipteon/Thalos/blob/master/CONTRIBUTING.md) and our [roadmap](https://github.com/ecleipteon/Thalos/issues/5).

Please note that it's very important to us that we maintain a positive and supportive environment for everyone who wants to participate. When you join us we ask that you follow our code of conduct in all interactions both on and offline.

Furthermore two mailing list have been created in order to receive feedbacks both from users and contributors about the demos.
Please feel free to join them

User community: https://groups.google.com/forum/#!forum/thalosbeta
Contributors community: https://groups.google.com/forum/#!forum/thaloscontributors


## **Get in touch**


If you want to report a problem or suggest an enhancement we'd love for you to open an issue at this github repository because then we can get right on it. But you can also contact ecleipteon by email (lucamaria [DOT] castiglione [AT] gmail [DOT] com) or on [twitter](https://twitter.com/ecleipteon).


## **Thank you**

Thank you so much for visiting the project and we do hope that you'll join us on this amazing journey to support people privacy.


## **Glossary**


- **README file**: a document that introduces an open project to the public and any potential contributors
- **repository** or **repo**: a collection of documents related to your project, in which you create and save new code
or content
- **Roadmap**: a document outlining the schedule of work to be done on a project
- **Milestone**: an event or state marking a specific stage in development on the project
- **Issue**: the GitHub term for tasks, enhancements, and bugs for your projects


