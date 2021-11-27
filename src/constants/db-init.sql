create database expressapp;
use expressapp;

create table users(
    id int auto_increment primary key,
    email text not null,
    password text not null,
    createdAt datetime,
    updatedAt datetime
);