# Automation Scripts

This is a collection of scripts to automate some repetitive tasks when developing or doing QA on the system.


## Getting Started

To get started you just need to clone the repo to your machine, and follow the [setup](#setup) instructions below. As soon as you have all of tools installed you will need to make the initial ```./start``` script executable. 

All you have to do is type:

 ```bash
 chmod +x ./start
 ```
 
Before running the executable script you need to ensure you copy the env variables from ```env.example``` so that you could have a template of all of the variables required to run the scripts. Run the following command in your terminal to copy the contents of ```.env.example``` to ```.env``` (.env files are gitignored) or ```.env.dev || .env.local``` depending on your environment.

```bash
cp .env.example .env.local
```

Make sure you populate the variables with your credentials. After that is set up, you are good to run the script:

```bash
./start
```

![AUTOMATION](https://i.imgur.com/rHFUywo.png)

The ```./start``` script acts like a bootloader, and loads all of the utils and envs required into the current bash session. For more information about the scripts that can be invoked take a look at the [Quick Reference](#quick-reference)

All of the scripts that can be invoked are grouped into the following categories:

- [core](#core) - single purpose scripts, that offer the core funcionality that we need
- [personal](#personal) - scripts that you want to run locally, for specific use cases that do not apply to the rest of the team. Scripts in this folder will be ignored by git.
- [shared](#shared) - scripts that will be used by the whole team, for broad use cases, scripts in this folder would be pushed to github.

To invoke one of the grouped scripts you just type the ```folder/script``` along with whatever arguments are needed to run the script.

An important thing to note is that on the top of the script menu you will see the environment that has been selected, to choose your environment before running the any other scripts type switchenv <environment>:

```bash
switchenv dev
```

This will reload the start script with the correct variables needed to proceed by retrieving them from ```.env.dev``` in this case.

If you need additional help, invoke the help menu:

```bash
help
````

If you need clear the terminal window:

```bash
clear
```


### Quick Launch

You can skip the prompts and jump right into script by invoking it together with the start script. For example you could launch the refund test script without seeing the ./start interface.

```bash
./start shared/refundtest 5
```

## Quick Reference

Below are some of the scripts that can be invoked, using ```./start```


## CORE

### createorder
___

Creates an order with the specified product, expediting option and email. Optionally, the fourth argument sets the source to passportrenewal instead of passportcenter.

```bash
core/createorder PRODUCT EXPEDITING_OPTION EMAIL [passportrenewal]
```

### createtrial
___

Creates a trial order with the specified product, expediting option and email. Optionally, the fourth argument sets the source to passportrenewal instead of passportcenter.

```bash
core/createtrial PRODUCT EXPEDITING_OPTION EMAIL [passportrenewal]
```

### createlead
___

Creates a lead with the specified product, expediting option and email. Optionally, the fourth argument sets the source to passportrenewal instead of passportcenter.

```bash
core/createlead PRODUCT EXPEDITING_OPTION EMAIL [passportrenewal]
```

#### Possible Products and Expediting Options

These apply to `createorder`, `createtrial` and `createlead`.

Products:
- passport-renewal
- new-passport
- second-passport
- child-passport
- name-change
- lost-passport
- damaged-passport
- stolen-passport

Expediting Options: 
- same_day
- next_day
- priority
- rush
- standard
- smart (only for passport renewals technically)


### fillapp
___

Fills out the application for the given user. If no second argument is passed, it will automatically detect what type of application it is and fill it out accordingly. Otherwise, it will fill it out as the specified type.

```bash
core/fillapp EMAIL [application-type]
```

Possible Application Types:
- passport-renewal
- new-passport
- damaged-pasport
- lost-passport
- name-change
- second-passport
- stolen-passport

Child passport is currently not supported.

### process
___

Processes the application for the given users. There is only one argument, the user email.

```bash
core/process [email]
```

### refund
___

Creates a refund for the given user. There are two required arguments, first argument [r] is a flag, second [test@test.com] is an existing customer email. The third [refund method], fourth [refund action], and fifth arguments [refund type] are optional.

Flags:
- r - Request refund (requires email)
- a - Authorize refund (requires email, refund method, refund action, refund type)
- ar - Authorize Refund with Random Refund Values (requires email)
- rar - Request Refund & Authorize Refund with Random Refund Values (requires email)

Refund Methods:
- check
- card

Refund Actions:
- no_refund
- partial_refund
- full_refund

Refund Types:
- void
- refund

```bash
core/refund [flag] [email] [refund method] [refund action] [refund type]
```

### status
___

Queries the MySQL DB so that you could get a simple status of an order. It accepts only one argument, [user email]. 

```bash
core/status [email]
```

It should then return

```
------------ O R D E R  S T A T U S ------------


Name: John Doe
Email: johndoe@gmail.com
Type: passport-renewal
Order: GW-F239045832
Status: completed
Progress: 100%


--------------------------------------------------
```


## Shared

### refundtest

Create `n` amount of orders and create refunds for them. It accepts only one argument which is an [integer].

```bash
shared/status [5]
```


## Personal

All of the scripts that may not apply to the whole team can be saved in this folder, feel free to make scripts for whatever you need to automate, they will be ignored by git execute the scripts by typing ```personal/script``` in the terminal.

## Setup

In the root directory you can find an automated script that detects whether your system has the necessary requirements needed to use the automation suite. To run the script you just have to type: 

```bash
./setup
``` 

The script then will proceed to install whatever tools are missing.

### Requirements
___

**Homebrew:** 

We need homebrew to install some of the other tools we'll need. 

To Install:

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**Bash 4:** 

For the newest features like associative arrays

To Install:

```bash
brew update && brew install bash

# Add the new shell to the list of allowed shells
sudo bash -c 'echo /usr/local/bin/bash >> /etc/shells'
# Change to the new shell
chsh -s /usr/local/bin/bash 
```

After that make sure to use the correct shebang line pointing to the new bash in any new files you make.

```bash 
#!/usr/local/bin/bash
```

**gettext tools**

These are used to read the json files.

```bash
brew install gettext
brew link --force gettext
```

**MyCli**

Used to connect to the SQL server from the terminal. Check it out [here](https://github.com/dbcli/mycli).

```bash
brew update && brew install mycli
```

## Tools

Single use tools like the ones below will be found in seperate branches

### parse.js

[parse.js](https://github.com/javif89/automation/tree/tools/json-parser) is a script that will help us parse through any given json and dump the data to a txt file, in this case we are dumping the full names of our [heroes.json](./data/heroes.json) into [names.txt](./data/names.txt). The objective is to have our automation scripts select a random name from the file every time we run them. The script is pretty dumb, so if you change the json you will have to update the script. Maybe for the next version we could make it find the fields on its own.

To parse a json just run: 

```bash
cd ./tools && node parse.js
```
