---
layout: post
title: Mysql基础
categories: [Mysql]
description: Mysql基础
keywords: mysql
---

## 安装

* 注意选择**Use Legacy Password Encryption**
  
## 配置

如果需要在终端内访问mysql，则需要如下设置：
* `vim ~/.zshrc`(以zsh为例)
* 写入语句: `PATH=$PATH:/usr/local/mysql/bin`
* 使配置生效：`source ~/.zshrc`

## 登陆

mysql安装过程中会提示输入`root`用户的密码
* `mysql -u root -p`，以密码模式登陆

## 定义数据库

1. DDL(data definition language) 数据定义语言，用来操作数据库对象：库、表、列等

* create
* alter
* drop

2. DML(data manipulation language) 数据操作语言，用来增删改数据库中的数据

* insert
* update
* delete

1. DQL(data query language) 数据查询语言，用来查询数据库中的数据

* select

需要注意：
* 每条命令需要严格`;`结尾，不输入分号直接会车并不会执行命令，会被认为命令尚未输入完成

* 链接数据库 `mysql -u root -p`
* 查看数据库 `show databases;`
* 创建数据库 `create database <databaseName>;`
* 切换数据库 `use <dbname>;`
* 查看所有表 `show tables;`
* 修改数据库 `alter database <dbname> character set utf8;`，此时可以支持中文内容
* 删除数据库 `drop database <dbname>;`

## 数据类型

* `int` 整型
* `double` 浮点型
  * `double(6, 3)`表示最长长度为6位，小数点后3位，即如果不是类似`123.123`的形式，会报错
* `char` 固定长度字符串类型
  * `char(10)`表示长度固定为10位字符串，不足10位会自动不足10位
  * 适合用来存储长度预期的值
  * `char`的性能要高于`varchar`
* `varchar` 表示可变长度字符串，最长10位，超过会报错
  * `varchar(10)`表示最长10位字符串，不足10位并不会补足
* `text` 不限定长度字符串
  * 适用于大文本内容，如博客内容等
* `date` 日期类型 yyyy-MM-dd

## 常用命令

* 选择数据库 `use <dbname>;`
* 创建表 `create table <tbname> (id int, name varchar(20), sex char(1));`
* 查看表信息 `desc <tablename>;`
* 查询表中的数据 `select * from <tbname>;`
* 插入数据 `inset into <tbname> (<argument format>) values (<value fromat>);`
  * 给表中的指定列添加数据时，需要指定列名称，如：`insert into students (id, sex) values (1002, '女')；`，此时name会因为没有插入值而显示`NULL`
  * 给表中所有列都添加数据时，不再需要指定列名称，因为会按照顺序对应全部列，如：`insert into students values (1003, 'user1', '男');`，此时如果输入的参数和列的数量不匹配或输入的参数和对应列的预定义格式不匹配，则会报错
* 修改数据 `update <tbname> set name = 'user01', sex = '女' where id = 1002;`
  * 这里如果不加`where`条件限定语句，会把整个表都更改了
* 删除数据 `delete from <tbname> where id = 1001;`
* 修改表：
  * 给表添加一列 `alter table <tbname> add achievement double (5, 2);`，表示给表添加一列，名称为achievement，格式为双精度5位，小数2位
  * 修改表其中一列的名称 `alter table <tbname> change <oldname> <newname> varchar(10);`，表示更改其中一列名称同时指定格式
  * 删除表其中一列 `alter table <tbname> drop <name>;`
* 删除表整个表 `drop table <tbname>;`

```sql
-- 选择数据库 test
use test;
-- 查看数据库中的表
show tables;
-- 查看表students中存储的值
select * from students;
-- 向students表中插入数据，参数格式为(id, name, sex)，值为(1001, '小明', '男')
insert into students (id, name, sex) values (1001, '小明', '男');
-- 再次查看students中存储的值
select * from students;
```







---

[1] [MySQL基础教程](https://www.bilibili.com/video/BV1t54y1W7TR?p=3&spm_id_from=pageDriver)
