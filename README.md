# Exchange Application

In order to be able to run the commands, please make sure you authorize your Devhub Org.

Please run the following commands using SFDX to push the application to a new Scratch org:
```
sfdx force:org:create -f config/project-scratch-def.json -a Scratch --setdefaultusername  
```
```
sfdx force:source:push  
```
```
sfdx force:apex:execute -f CreateData.txt
```
```
sfdx force:org:open -p lightning/n/Exchange 
```


