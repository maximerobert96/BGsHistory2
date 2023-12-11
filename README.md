# BGsHistory2

## Current branch
Getting the data

## Goal of the branch
Automatically fetch the new changes from the official Blizzard API, and/or the hearthstonejson, and update my database.

## Tasks
* ~~Get an access token for the blizzard api.~~
* ~~Store the access token in a file.~~
* ~~Perform a card search using the access token.~~
* ~~Download a card image.~~
* ~~Download a golden image.~~
* ~~Figure out a folder tree system, or card names.~~
* ~~Download the images of all the ids I have, and keep track of the images I couldn't find.~~
* The following are stuff I should already have done, and that I'll have to update / reimplement.
* * Download the patches since the last one, and update the patches.json file.
* * Keep the BG cards, and the cards that exist in my mapping file (because some might escape the BG filters).
* * Compare the cards, add changes to the mapping file, save the new versions in their patch files.
* * Download the images of the cards that didn't exist back in the last patch I have on record.