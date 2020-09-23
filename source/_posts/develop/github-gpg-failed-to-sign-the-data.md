---
title: github gpg failed to sign the data
toc: true
recommend: 1
keywords: categories-java git,gpg sign git gpg commit sign error gpg failed to sign the data fatal failed to write commit object 
uniqueId: '2020-03-20 11:05:03/"github gpg failed to sign the data".html'
date: 2020-03-20 19:05:03
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200320192248.png
tags: [git,gpg sign]
categories: [develop,git]
---
git gpg commit sign error:   
gpg failed to sign the data   
fatal: failed to write commit object <!-- more -->


```bash
brew uninstall gpg
brew install gpg2
brew install pinentry-mac (if needed)
gpg --full-generate-key #Create a key by using an algorithm.
#Get generated key by executing: 
gpg --list-keys
#detail list
gpg --list-secret-keys --keyid-format LONG
sec   rsa2048/F9F78B768Fxxxxx 2020-03-13 [SC] [有效至：2022-03-13]
      79418A9275A4D98B86FF39F6xxxxxxxxxxx
#Set the key here 
git config --global user.signingkey F9F78B768Fxxxxx
git config --global gpg.program /usr/local/bin/gpg
git config --global commit.gpgsign true
```

If you want to export your Key to GitHub then: 
`gpg --armor --export F9F78B768Fxxxxx `and add this key to GitHub at GPG keys: https://github.com/settings/keys (with START and END line included)

If the issue still exists:

```bash
test -r ~/.bash_profile && echo 'export GPG_TTY=$(tty)' >> ~/.bash_profile

echo 'export GPG_TTY=$(tty)' >> ~/.profile
```

If the issue still exists:

Install https://gpgtools.org and sign the key that you used by pressing Sign from the menu bar: Key->Sign

If the issue still exists:

Go to: ‎⁨your global .gitconfig file which in my case is at: ‎⁨`/Users/gent/.gitconfig` And modify the .gitconfig file (please make sure Email and Name are the same with the one that you have created while generating the Key):

```yaml
[user]
	email = gent@youremail.com
	name = Gent
	signingkey = <YOURKEY>
[gpg]
	program = /usr/local/bin/gpg
[commit]
	gpsign = true
	gpgsign = true
[filter "lfs"]
	process = git-lfs filter-process
	required = true
	clean = git-lfs clean -- %f
	smudge = git-lfs smudge -- %f
[credential]
	helper = osxkeychain

```
When you create and add a key to gpg-agent you define something called passphrase. Now that passphrase at some point expires, and gpg needs you to enter it again to unlock your key so that you can start signing again.

When you use any other program that interfaces with gpg, gpg's prompt to you to enter your passphrase does not appear (basically gpg-agent when daemonized cannot possibly show you the input dialog in stdin).

One of the solutions is `gpg --sign a_file.txt` (**this is very import!!!**) then enter the passphrase that you have entered when you created your key and then everything should be fine (gpg-agent should automatically sign)

See this answer on how to set longer timeouts for your passphrase so that you do not have to do this all the time.

Or you can completely remove the passphrase with ssh-keygen -p

Edit: Do a man gpg-agent to read some stuff on how to have the above happen automatically and add the lines:

GPG_TTY=$(tty)
export GPG_TTY
on your .bashrc if you are using bash(this is the correct answer but I am keeping my train of thought above as well)

my environment

```bash 
gpg --version
gpg (GnuPG) 2.2.19
libgcrypt 1.8.5
Copyright (C) 2019 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

reference:  
[reference](https://stackoverflow.com/questions/39494631/gpg-failed-to-sign-the-data-fatal-failed-to-write-commit-object-git-2-10-0)


