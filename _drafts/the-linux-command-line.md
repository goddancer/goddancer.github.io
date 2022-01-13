---
layout: post
title: the linux command line
categories: [读书笔记]
description: the linux command line
keywords: linux command
---

## what is the shell

> The `shell` is a program that takes keyboard commands and passes them to the operating system to carry out.
> `bash` means `Bourne Again Shell`, an enhanced replacement for `sh`.

[1]. `GNU`: GNU's Not Unix!

## some simple commands

```shell
# displays the current time and date with local format
date

# displays a calendar of the current month
cal

# display the current amount of free space on your disk drives
df

# ending a terminal session
exit
```

## it is good for remember

1. *`pwd`* Print name of current working directory
2. *`cd`* Change directory
3. *`ls`* List directory contents
4. *``* 
2. *``* 
2. *``* 
2. *``* 
2. *``* 

## commands

### `cd`

```shell
# change the wroking directory to the previous working directory
cd -

# change the working directory to the home directory of `username`
cd ~username
```

### `ls`

```shell
# list of files and subdirectories contained in the current working directory
ls

# output to the long format
ls -l

# sort the result by the file's modification time
ls -t

# reverse the order of the sort
ls -lt --reverse
```

* `-a / --all`: list all files, event those with names that begin with a period
* `-d / --directory`: ordinarily, if a directory is specidied, ls will list the contents of the dir, not the dir itself. but seems not right?
* `-F / --classify`: will append an indicator character to the end of each listed name. it will append a forward slash if the name is a dir
* `r / --reverse`: display the results in reverse order
* `-S`: sort results by file size
* `-t`: sort by modification time

```shell
```
```shell
```
```shell
```
```shell
```
```shell
```
```shell
```
```shell
```
```shell
```
```shell
```
```shell
```
```shell
```
```shell
```










