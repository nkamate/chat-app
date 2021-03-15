-- DROP DATABASE IF EXISTS chat_app;
-- CREATE DATABASE IF NOT EXISTS chat_app;
USE chat_app;

DROP TABLE IF EXISTS user;

DROP TABLE IF EXISTS conversation;

CREATE TABLE IF NOT EXISTS user(id INT PRIMARY KEY auto_increment, username VARCHAR(25) UNIQUE NOT NULL);

create table conversation
(
    id        int auto_increment,
    fromUser  int                                 not null,
    toUser    int                                 null,
    msg       varchar(400)                        null,
    timestamp timestamp default CURRENT_TIMESTAMP null,
    constraint conversation_pk
        unique (id),
    constraint conversation_user_id_from_fk
        foreign key (fromUser) references user (id)
            on delete cascade,
    constraint conversation_user_id_to_fk
        foreign key (toUser) references user (id)
            on delete cascade
);

create index conversation_id_fromUser_toUser_index
    on conversation (id, fromUser, toUser);


INSERT INTO chat_app.user (id, username) VALUES (1, 'john');
INSERT INTO chat_app.user (id, username) VALUES (2, 'pascal');
INSERT INTO chat_app.user (id, username) VALUES (3, 'Dan');
INSERT INTO chat_app.user (id, username) VALUES (4, 'foo');
