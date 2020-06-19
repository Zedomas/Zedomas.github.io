const url = "https://deckofcardsapi.com/api/deck/"
const newDeck = "new/shuffle/?deck_count=1"
const drawCount = "/draw/?count="
const shuffle = "/shuffle/"
let cardCount = 0;
let hitCount = 0;
let dealerCount = 0;
let pAces = 0;
let dAces = 0;
let cardTotal = 0;
let pCard1, pCard2, dCard1, dCard2, dealerTotal;

//// Generates a new deck and gives the Deck id number
function newDeckMaker() { 
    let deck = $.ajax({
    type: 'GET',
    async: false,
    url: url+newDeck,
  });
  return deck.responseJSON.deck_id;
}
// Calls the deck maker and assigned it to the newly declared variable deckID
let deckID = newDeckMaker()

function shuffler() {
    $.ajax({
        type: 'GET',
        url: url+deckID+shuffle,
    });
    newHand()
    cardCount = 0;
    $('.cardCount').text(cardCount)
    $('.remaining').text("52")
}

//// clears out the old hands and reenable the button
function newHand() {
    $('.playerHand').empty()
     $('.playerHand').append($('<div>').addClass("playerTotal"))
    $('.playerHand').append($('<div>').addClass("left"))
    $('.playerHand').append($('<div>').addClass("right"))
   

    $('.dealerHand').empty()
    $('.dealerHand').append($('<div>').addClass("dealerTotal"))
    $('.dealerHand').append($('<div>').addClass("dLeft"))
    $('.dealerHand').append($('<div>').addClass("dRight"))
    

    $('.hit-btn').attr('disabled', false)
    $('.stay-btn').attr('disabled', false)
    pAces = 0;
    dAces = 0;
    hitCount = 0;
    dealerCount = 0;
}

/// Takes the string value of cards and returns a number value
function cardValues(card) {
    if (card.value == "JACK" || card.value == "KING" || card.value == "QUEEN" || card.value == "10") {
        // console.log("facecard " + card.suit)
        // console.log("before facecard " + cardCount)
        cardCount -=1
        // console.log("after facecard " + cardCount)
        $('.cardCount').text(cardCount)
        return 10
    } else if (card.value == "ACE") {
        // console.log("before acecard " + cardCount)
        cardCount -=1
        // console.log("after acecard " + cardCount)
        // console.log("ace " + card.suit)
        $('.cardCount').text(cardCount)
        return 11        
    } else {
        if (parseInt(card.value, 10) < 7) {
            // console.log(card.suit + " less than 7")
            // console.log("before low card " + cardCount)
            cardCount +=1
            // console.log("after low card " + cardCount)
            
            $('.cardCount').text(cardCount)
        } 
        return parseInt(card.value, 10)
    }
}


// Grabs the Deck ID

// console.log(deckID)
function draw(x) {
    let cards = $.ajax({
            type: 'GET',
            async: false,
            url: url+deckID+drawCount+x
        })
        return cards.responseJSON
    }
//===============================================

function hit() {
    // Draws a card from the deck and counts up how many times you hit
    let hitCard = draw(1)
    if (hitCard.cards[0].value == "ACE") {
        pAces ++;
    }
    hitCount ++;
    // shows remaing cards in the deck and adds a new div for each new hit with a special id
    $('.remaining').text(hitCard.remaining)
    $('.playerHand').append($('<div>').addClass("hit").attr("id", ""+hitCount+"").addClass(hitCard.cards[0].value))
    // changes the background to the image of the card
    $('#'+hitCount+'').css("background-image", "url("+hitCard.cards[0].image+")")
    let previousTotal = parseInt($('.playerTotal').text(), 10)
    // console.log(previousTotal + " previous total")
    cardTotal = cardValues(hitCard.cards[0]) + previousTotal
    // console.log(cardValues(hitCard.cards[0]) + " last card total")
    $('.playerTotal').text(cardTotal)
    if (cardTotal > 21 && pAces > 0) {
        cardTotal -= 10;
        $('.playerTotal').text(cardTotal)
        pAces--;
    } else if (cardTotal > 21) {
        // console.log(aces + " aces")
        // console.log(cardTotal + " card total")
        $('.gamelog').text("Player busts, Dealer wins!")
        $('.playerTotal').text("BUSTED") 
        $('.hit-btn').attr('disabled', true) 
        $('.stay-btn').attr('disabled', true)        
        } else {
        $('.playerTotal').text(cardTotal)
    }

}    

function dealerPlay() {
    // console.log(dCard2)
    // let dealerTotal = cardValues(dCard1) + cardValues(dCard2)
    $('.dealerTotal').text(dealerTotal)
    $('.dRight').css("background-image", "url("+dCard2.image+")").removeClass('back')  
    dealerHand = []
    dealerHand.push(dCard1)
    dealerHand.push(dCard2)
    cardTotal = parseInt($('.playerTotal').text(), 10)
    // console.log(cardTotal + " cardTotal")
    while (dealerTotal < 17) {
        let dealerHitCard = draw(1);
        // Ace checker for player
        if (dealerHitCard.cards[0].value == "ACE") {
            console.log("hi rob")
            dAces ++;
        }

        //adding new card div and giving it an image for the dealer
        $('.dealerHand').append($('<div>').addClass("dHit").attr("id", "d"+dealerCount+"").addClass(dealerHitCard.cards[0].value))
        $('#d'+dealerCount+'').css("background-image", "url("+dealerHitCard.cards[0].image+")")
        //
        dealerHand.push(dealerHitCard.cards[0])
        dealerCount ++;
        $('.remaining').text(dealerHitCard.remaining)
        // add dealer card images
        dealerTotal += cardValues(dealerHitCard.cards[0])
        $('.dealerTotal').text(dealerTotal)

        if (dealerTotal > 21 && dAces > 0) {
            console.log("card total before ace removed " + dealerTotal)
            dealerTotal -= 10;
            console.log("ace removed")
            $('.dealerTotal').text(dealerTotal)
            dAces--;
        } 
    }
    if (dealerTotal > 21 && dAces > 0) {
        console.log("card total before ace removed " + dealerTotal)
        dealerTotal -= 10;
        console.log("ace removed")
        $('.dealerTotal').text(dealerTotal)
        dAces--;
    } 
    
    if (dealerTotal < cardTotal ) {
        $('.gamelog').text("Player wins!")
        // console.log(dealerTotal + "him  you" + cardTotal);
        $('.hit-btn').attr('disabled', true)
        $('.stay-btn').attr('disabled', true) 
    } else if (dealerTotal > cardTotal ) {
        if (dealerTotal > 21 ) {
            $('.gamelog').text("Dealer busts, Player wins!")
            // console.log(dealerTotal + "him  you" + cardTotal);
            $('.hit-btn').attr('disabled', true)
            $('.stay-btn').attr('disabled', true)
            $('.dealerTotal').text("BUSTED")              
        } else {
            $('.gamelog').text("Dealer wins!")
            // console.log(dealerTotal + "him  you" + cardTotal);
            $('.hit-btn').attr('disabled', true)
            $('.stay-btn').attr('disabled', true) 
            $('.dealerTotal').text(dealerTotal) 
        }
    } else if (dealerTotal == cardTotal) {
        $('.gamelog').text("Its a tie, Dealer wins");
        // console.log(dealerTotal + "him  you" + cardTotal);
        $('.hit-btn').attr('disabled', true)
        $('.stay-btn').attr('disabled', true) 
        $('.dealerTotal').text(dealerTotal) 
    }
}


function newDeal() {
    //Clears our old divs and resets key variables
    newHand()
    // Draws the first two cards for each players.
    let playerHand = draw(2)
    let dealerHand = draw(2)
    // updates remaining cards in the deck
    $('.remaining').text(dealerHand.remaining)

    //Seperates the cards into individual variables and elimiates unneeded api information
    pCard1 = playerHand.cards[0]
    pCard2 = playerHand.cards[1]
    dCard1 = dealerHand.cards[0]
    dCard2 = dealerHand.cards[1]

    // Ace checker for player
    console.log(pCard2.value)
    if (pCard1.value == "ACE") {
        pAces ++;
    }
    if (pCard2.value == "ACE") {
        pAces ++;
    }

    // Ace checker for dealer
    if (dCard1.value == "ACE") {
        dAces ++;
    }
    if (dCard2.value == "ACE") {
        dAces ++;
    }
    // updates the dealer's hard to show one of his cards and the back of another.
    $('.dLeft').css("background-image", "url("+dCard1.image+")").addClass(dCard1.value)
    $('.dRight').css("background-image", "url(imgs/pngwing.com.png)").addClass(dCard2.value).addClass('back') 
    // updates the player's hard to show one of his cards and the back of another.    
    $('.left').css("background-image", "url("+pCard1.image+")").addClass(pCard1.value)
    $('.right').css("background-image", "url("+pCard2.image+")").addClass(pCard2.value)
    
    $('.gamelog').append("<p>PLAYER DRAWS A " + pCard1.value + " AND A " + pCard2.value+ "</p>" )
    let cardTotal = cardValues(pCard1) + cardValues(pCard2)
    if (cardTotal == 21) {
        cardTotal = "Blackjack!"
        $('.hit-btn').attr('disabled', true) 
    }
    dealerTotal = cardValues(dCard1) + cardValues(dCard2)
    $('.playerTotal').text(cardTotal)

    
            
    
}





$(() => {

    $('.button').on("click", newDeal)
    $('.hit-btn').on('click', hit)
    $('.shuffle').on('click', shuffler)
    $('.stay-btn').on('click', dealerPlay)
})



