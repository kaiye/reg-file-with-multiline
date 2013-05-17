reg-file-with-multiline
=======================

If a windows .reg file which has some REG_SZ value with newline characters, you can't import it correctly to regedit.
This nodejs script use to solve the problem ( maybe we should call it windows regedit's bug - -! ).

Here are some related googles about the bug:
* [How do I add a multline REG_SZ string to the registry from the command line?](http://stackoverflow.com/questions/153879/how-do-i-add-a-multline-reg-sz-string-to-the-registry-from-the-command-line)
* [Multiline registry keys not importing newline characters with Group Policy Preferences](http://social.technet.microsoft.com/Forums/en-US/winserverGP/thread/61cb8ec0-0349-403a-a991-1e29e155487a)
* [Importing a string-type reg key which has a 'new-line'](http://reboot.pro/topic/18355-importing-a-string-type-reg-key-which-has-a-new-line/)

##Usage

Make sure you have install [nodejs](http://nodejs.org/) and `npm install line-reader` , then simply run the command in cmd:
`node regfile.js <filename>`



Copyright 2013 @kaiye
