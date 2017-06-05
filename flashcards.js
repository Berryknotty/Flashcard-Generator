const inquirer = require("inquirer");
const library = require("./cardLibrary.json");
const BasicCard = require("./BasicCard.js")
const ClozeCard = require("./ClozeCard.js")

var drawnCard;
var playedCard;
var count = 0;

function openMenu() {
  inquirer.prompt([															

      {
          type: "list",														
          message: "\nPlease choose a menu option from the list below?",
          choices: ["Use All", "Random", "Shuffle", "Show All", "Exit"],	
          name: "menuOptions"											
      }
  ]).then(function (answer) {											
    var waitMsg;

    switch (answer.menuOptions) {

        case 'Use All':
            console.log("OK lets run through the deck...");
            waitMsg = setTimeout(askQuestions, 1000);
            break;

        case 'Random':
            console.log("OK I'll pick one random card from the deck...");
            waitMsg = setTimeout(randomCard, 1000);
            break;

        case 'Shuffle':
            console.log("OK I'll shuffle all the cards in the deck...");
            waitMsg = setTimeout(shuffleDeck, 1000);
            break;

        case 'Show All':
            console.log("OK I'll print all cards in the deck to your screen...");
            waitMsg = setTimeout(showCards, 1000);
            break;

        case 'Exit':
            console.log("Thank you for using the Flashcard-Generator")
            return;

        default:
            console.log("");
            console.log("Sorry I don't understand");
            console.log("");
    }

  });

}

openMenu();

function getQuestion(card) {
    if (card.type === "BasicCard") {						
        drawnCard = new BasicCard(card.front, card.back);	
        return drawnCard.front;								
    } else if (card.type === "ClozeCard") {					
        drawnCard = new ClozeCard(card.text, card.cloze)	
        return drawnCard.clozeRemoved();					
    }
};


function askQuestions() {
    if (count < library.length) {					
        playedCard = getQuestion(library[count]);	
        inquirer.prompt([							
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {				
        	
            if (answer.question === library[count].back || answer.question === library[count].cloze) {
                console.log("You are correct.");
            } else {
            	
                if (drawnCard.front !== undefined) { 
                    console.log("Sorry, the correct answer was " + library[count].back + "."); 
                } else { 
                    console.log("Sorry, the correct answer was " + library[count].cloze + ".");
                }
            }
            count++; 		
            askQuestions(); 
        });
    } else {
      	count=0;			
      	openMenu();			
    }
};

function shuffleDeck() {
  newDeck = library.slice(0); 
  for (var i = library.length - 1; i > 0; i--) { 
      var getIndex = Math.floor(Math.random() * (i + 1));
      var shuffled = newDeck[getIndex];

      newDeck[getIndex] = newDeck[i];

      newDeck[i] = shuffled;
  }
  writeFile("cardLibrary.json", JSON.stringify(newDeck, null, 2)); 
  console.log("The deck of flashcards have been shuffled");
  
}


function randomCard() {
  var randomNumber = Math.floor(Math.random() * (library.length - 1));  

  playedCard = getQuestion(library[randomNumber]);	
        inquirer.prompt([							
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {					
            if (answer.question === library[randomNumber].back || answer.question === library[randomNumber].cloze) {
                console.log("You are correct.");
                setTimeout(openMenu, 1000);
            } else {
            
                if (drawnCard.front !== undefined) { 
                    console.log("Sorry, the correct answer was " + library[randomNumber].back + "."); //grabs & shows correct answer
                    setTimeout(openMenu, 1000);
                } else {
                    console.log("Sorry, the correct answer was " + library[randomNumber].cloze + ".");//grabs & shows correct answer
                    setTimeout(openMenu, 1000);
                }
            }
        });

};


function showCards () {

  var library = require("./cardLibrary.json");

  if (count < library.length) {            

    if (library[count].front !== undefined) { 
        console.log("");
        console.log("++++++++++++++++++ Basic Card ++++++++++++++++++");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("Front: " + library[count].front); 
        console.log("------------------------------------------------");
        console.log("Back: " + library[count].back + "."); 
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("");

    } else { 
        console.log("");
        console.log("++++++++++++++++++ Cloze Card ++++++++++++++++++");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("Text: " + library[count].text); 
        console.log("------------------------------------------------");
        console.log("Cloze: " + library[count].cloze + "."); 
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("");
    }
    count++;		
    showCards();	
  } else {
    count=0;		
    openMenu();		
  }
}