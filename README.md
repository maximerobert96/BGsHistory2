# BGsHistory

## What is the project?
This is a full-stack web app using React for the front-end and Express for the back-end. Programming language is NodeJS. It's a hearthstone battlegrounds card library with filters accurate to the game compared to the official card library (main differences are that you can select multiple tribes to better reflect what you see in-game, there are more filters, the filters actually remove cards that are not available, the data is reviewed). The website also offers the possibility to look at previous patches and previous versions of cards, and see the changes.

### Why is it called BGsHistory?
The original idea was to have a website where you could go to any date in the past and see the state of Hearthstone Battlegrounds at the time: what cards were in the rotation, what gimmick was active, the old versions of the cards. This was to have a comprehensive and visual history of the game mode so that people can refer to it for multiple use cases, like watching an old youtube video, making content related to that, nostalgia, etc.

### Why move away from that original vision?
The original idea was very hard to sustain alone. The data I have from the game mode kept changing format, there were a lot of bugs in the data I would need to manually fix for each patch, and I started to realize whenever I worked on the project I was spending most of the time fixing data instead of developing new features. (If you're curious, server/db/patchChanges.js is where I made most of my data changes). I took a step back and realized that my main use case of my website is to use it like the official hearthstone battlegrounds card library, but better in terms of filters. I didn't fully pivot from my original vision, I still support the history, but I focus on the most recent patches and the previous ones might have data errors or miss images.

## AI disclosure
No agentic AI has been used. I can count on two human hands (not AI hands with extra fingers) the times I've used AI on this project to get info I wasn't able to find through documentation or stackoverflow.

## Features (TODO: add images)
* Access all the cards currently in the game
* Quick glance of what got changed with the most recent patch
* Rich filters
* Easy navigation between the cards in the current filter
* Custom pages for exclusive card pools like Buddies and Putricide Creations
* Link to official patch notes for reference
* Generate placeholder cards

### Features on my radar (what I'd like to implement)
* Better site navigation (currently I manually go to the routes I want)
* Apply a complex filter from a card (like if I'm looking at Faelin, I could with a single click apply a Faelin filter that filters the library in tier 2, tier 4 and tier 6 cards that respect the hero power)
* For a card that got changed by a patch, highlight the differences
* Page where I can see the full history of a card. I have a route server-side for that already, just need something client facing
* Search features
* Automatically generate placeholder cards if they're missing. I can already generate them, but it's not automatic. Or fetch card images from patch notes (if the patch notes contain these images of the cards)
* Probability calculators and simulations for stuff like Putricide Creations and Dark Gifts

## Future of the project
I didn't work much on this project in the last year because of my full-time job requiring more focus, my interest in Hearthstone Battlegrounds fading a bit and also other personal life changes. I still want to continue working on it, maybe with collaborators.

## How to run the project?
TODO



















## Current branch
MVP

## Goal of the branch

Have a minimum viable product. Start with the very first patch, and try to make the main features work (patch changes, displaying cards, card pools, related cards, golden cards).

## Tasks
* ~~Add English images for all the main cards in the first patch~~
* ~~Create icons for all images (active cards, not tokens and hero powers)~~
* Route for patch changes
* ~~Display icons in front end~~



### Low priority tasks
* Select/unselect all tribes
* Update AFKay's pools
* Add field hideCost to all passive hero powers
* Add related card to Giantfin
* Continue verifying cards
* Add adapt options to the database

### Later
* Generate placeholder images for cards using name, tier level, stats (could be its own branch)
* Implement card pools in front end (probably will be implemented alongside a db overhaul for optimization)
* ~~Show a picture when you hover a card (it will be a placeholder pic for now)~~