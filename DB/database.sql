CREATE DATABASE authMF;
USE authMF;

CREATE TABLE tokens(
value INT(6) NOT NULL,
userid VARCHAR(16) NOT NULL,
id INT(11) NOT NULL AUTO_INCREMENT,
used BOOL DEFAULT FALSE,
createdOn DATETIME NOT NULL,
PRIMARY KEY (id)
);
CREATE TABLE users(
id INT (11) NOT NULL AUTO_INCREMENT,
privateKey VARCHAR(16) NOT NULL,
PRIMARY KEY (id)
);