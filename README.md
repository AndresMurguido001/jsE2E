# Automation Scripts

This is a collection of scripts to automate some repetitive tasks when developing or doing QA on the system.

## Quick Reference

### createorder
___

Creates an order with the specified product, expediting option and email. Optionally, the fourth argument sets the source to passportrenewal instead of passportcenter.

```bash
./createorder PRODUCT EXPEDITING_OPTION EMAIL [passportrenewal]
```

### createtrial
___

Creates a trial order with the specified product, expediting option and email. Optionally, the fourth argument sets the source to passportrenewal instead of passportcenter.

```bash
./createtrial PRODUCT EXPEDITING_OPTION EMAIL [passportrenewal]
```

### createlead
___

Creates a lead with the specified product, expediting option and email. Optionally, the fourth argument sets the source to passportrenewal instead of passportcenter.

```bash
./createlead PRODUCT EXPEDITING_OPTION EMAIL [passportrenewal]
```

#### Possible Products and Expediting Options

These apply to `createorder`, `createtrial` and `createlead`.

Products:
- PASSPORT_RENEWAL
- NEW_PASSPORT
- SECOND_PASSPORT
- CHILD_PASSPORT
- NAME_CHANGE
- LOST_PASSPORT
- DAMAGED_PASSPORT
- STOLEN_PASSPORT

Expediting Options: 
- SAME_DAY
- NEXT_DAY
- PRIORITY
- RUSH
- STANDARD
- SMART (only for passport renewals technically)


### fillapp
___

Fills out the application for the given user. If no second argument is passed, it will automatically detect what type of application it is and fill it out accordingly. Otherwise, it will fill it out as the specified type.

```bash
./fillapp EMAIL [application-type]
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

### trials

___

Creates 4 trials and autogenerates emails for them using your EMAIL_BASE env variable. The trials created are passportcenter mailaway and non-mailaway, and passportrenewal mailaway and non-mailaway.

```bash
./trials
```

## Setup

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