# Thalos: a secure and robust file storage system

Thalos allows internet users to securely store their files in the cloud. Thalos is secure by design since it uses asymmetric encryption to protect hosted content: no one who has physical or virtual access to the storage server can read or modify anything.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

Thalos runs on NodeJS, please get NodeJS before trying Thalos. If you are using a red hat based linux distribution like Fedora you can do it easily with dnf package manager by typing in terminal

```
sudo dnf install nodejs
```

Also this applications needs a relational database, please choose one among those are supported by Sequelize (http://docs.sequelizejs.com/). The application was succesfully tested both with MariaDB and Postgres.

```
sudo dnf install mariadb

```
### Installing

Now move in the cloned project directory and launch

```
npm install
```

Finally

```
npm start
```



## Built With

* [NodeJS](https://nodejs.org/) - The web framework used
* [OpenpgpJS](https://openpgpjs.org/) - Cryptography Management
* [SequelizeJS](http://docs.sequelizejs.com/) - ORM

 


## License

This project is open source - see the [LICENSE](LICENSE) file for details


