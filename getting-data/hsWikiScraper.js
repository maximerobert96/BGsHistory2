const { JSDOM } = require("jsdom");

async function getNewPatches() {
    
    return JSDOM.fromURL("https://hearthstone.wiki.gg/wiki/Category:Patches")
    .then(async (dom) => {
        let newPatches = {};
        let elements = dom.window.document.getElementsByTagName("a");
        const promises = [];
        for(let element of elements){
            if(element.getAttribute("title")){
                let textOfElement = element.textContent;

                if(textOfElement.includes("Patch ") && textOfElement.indexOf(".") != -1) {
                    let indexLastPeriod = textOfElement.lastIndexOf(".");
                    let buildNumber = textOfElement.substring(indexLastPeriod + 1);
                    if(buildNumber >= 189017) { // arbitrary patch number for testing
                        let urlOfElem = `https://hearthstone.wiki.gg${element.getAttribute("href")}`;
                        
                        
                        promises.push(
                            getPatchFromUrl(urlOfElem).then(patchObj => {
                                newPatches = {...newPatches, [patchObj.build]: patchObj};
                                
                            })
                        );
                        
                        
                    }
                }
            }
            
        }
        await Promise.all(promises);
        return newPatches;
    })
    .catch( error => console.log(error.message));
    
}

async function getPatchFromUrl(patchUrl) {
    let patch = null;
    return JSDOM.fromURL(patchUrl).then( dom => {
        let releaseDate;
        let patchNumber;
        let build;
        let patchNotesUrl;
        let elements = dom.window.document.getElementsByClassName("pi-item pi-data pi-item-spacing pi-border-color");
        let externalTextElements = dom.window.document.getElementsByClassName("external text");

        for (let element of elements){
            let attr = element.getAttribute("data-source");
            switch (attr) {
                case "releaseDate": {
                    releaseDate = element.lastElementChild.textContent;
                    break;
                }
                case "version": {
                    patchNumber = element.lastElementChild.textContent;
                    break;
                }
                case "build": {
                    build = element.lastElementChild.textContent;
                    break;
                }
            }
            
        }

        for(let externalTextElem of externalTextElements){

            if (externalTextElem.textContent === "Patch Notes") {
                patchNotesUrl = externalTextElem.getAttribute("href");
                break;
            }

        }

        patchNotesUrl = patchNotesUrl ? patchNotesUrl : patchUrl;

        let patchObj = { patchNotes: patchNotesUrl, build: build, releaseDate: releaseDate, patchNumber: patchNumber };
        return patchObj;
        console.log(JSON.stringify(patchObj));
        // resolve(patchObj);

        // console.log(releaseDate, patchNumber, build, patchNotesUrl);
    });
    


}
// getPatchFromUrl("https://hearthstone.wiki.gg/wiki/Patch_23.6.2.144772");
// getPatchFromUrl("https://hearthstone.wiki.gg/wiki/Patch_28.0.0.189017");

let test = {
    '1': {
      patchNotes: 'https://hearthstone.blizzard.com/en-us/news/24008693/28-0-patch-notes',
      build: '189017',
      releaseDate: 'November 7, 2023',
      patchNumber: '28.0.0'
    },
    '2': {
      patchNotes: 'https://hearthstone.blizzard.com/en-us/news/24008693/28-0-patch-notes',
      build: '189384',
      releaseDate: 'November 10, 2023',
      patchNumber: '28.0.0'
    },
    '3': {
      patchNotes: 'https://hearthstone.blizzard.com/en-us/news/24033781',
      build: '190145',
      releaseDate: 'November 28, 2023',
      patchNumber: '28.0.3'
    },
    '4': {
      patchNotes: 'https://hearthstone.blizzard.com/en-us/news/24008697/28-2-patch-notes',
      build: '190416',
      releaseDate: 'December 5, 2023',
      patchNumber: '28.2.0'
    },
    '5': {
      patchNotes: 'https://hearthstone.blizzard.com/en-us/news/24008698/28-2-1-patch-notes',
      build: '190920',
      releaseDate: 'December 8, 2023',
      patchNumber: '28.2.1'
    }
  };

getNewPatches().then( (o) => {
    console.log({...test, ...o});
});
    

