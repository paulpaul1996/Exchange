# Exchange Application

Please run the following commands using SFDX to push the application to a new Scratch org:

sfdx force:org:create -f config/project-scratch-def.json -a Scratch --setdefaultusername
sfdx force:source:push
sfdx force:org:open -p lightning/n/Exchange


