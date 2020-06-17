const url = "https://deckofcardsapi.com/api/deck/"
const newDeck = "new/shuffle/?deck_count=1"
const drawCount = "/draw/?count="
const shuffle = "/shuffle/"
let hitCount = 0;
let dealerCount = 0;
let aces = 0;
let cardTotal = 0;
let deckID;
let pCard1 = {}
let pCard2 = {}
let dCard1;
let dCard2;

//// Generates a new deck and gives the Deck id number
function newDeckMaker() { 
    let deck = $.ajax({
    type: 'GET',
    async: false,
    url: url+newDeck,
  });
  return deck.responseJSON.deck_id;
}

function shuffler() {
    $.ajax({
        type: 'GET',
        url: url+deckID+shuffle,
      });
    
}

//// clears out the old hands and reenable the button
function newHand() {
    $('.playerHand').empty()
    $('.playerHand').append($('<div>').addClass("left"))
    $('.playerHand').append($('<div>').addClass("right"))
    $('.hit-btn').attr('disabled', false)
    aces = 0;
    hitCount = 0;
    dealerCount = 0;
}

/// Takes the string value of cards and returns a number value
function cardValues(card) {
    if (card.value == "JACK" || card.value == "KING" || card.value == "QUEEN") {
        return 10
    } else if (card.value == "ACE") {
        aces ++
        return 11        
    } else {
        return parseInt(card.value, 10)
    }
}

$(() => {
    // Grabs the Deck ID
    deckID = newDeckMaker()
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
        if (cardTotal > 21 && aces > 0) {
            cardTotal -= 10;
            $('.playerTotal').text(cardTotal)
            aces--;
        } else if (cardTotal > 21) {
            console.log(aces + " aces")
            console.log(cardTotal + " card total")
            $('.playerTotal').text("BUSTED") 
            $('.hit-btn').attr('disabled', true)                
            } else {
            $('.playerTotal').text(cardTotal)
            console.log(aces)
        }

    }    
    
    function dealerPlay() {
        // console.log(dCard2)
        let dealerTotal = cardValues(dCard1) + cardValues(dCard2)
        dealerHand = []
        dealerHand.push(dCard1)
        dealerHand.push(dCard2)
        console.log(dealerHand)
        cardTotal = parseInt($('.playerTotal').text(), 10)
        console.log(cardTotal + " cardTotal")
        while (dealerTotal < 17) {
            let dealerHitCard = draw(1);
            dealerHand.push(dealerHitCard.cards[0])
            dealerCount ++;
            $('.remaining').text(dealerHitCard.remaining)
            // add dealer card images
            console.log(dealerHitCard.cards[0])
            dealerTotal += cardValues(dealerHitCard.cards[0])
            console.log("click")
        }
        if (dealerTotal < cardTotal ) {
            console.log("you win")
            console.log(dealerTotal + "him  you" + cardTotal)
        } else if (dealerTotal > cardTotal ) {
            if (dealerTotal > 22 ) {
                console.log("Dealer Bust");
                console.log(dealerTotal + "him  you" + cardTotal)  ;              
            } else {
                console.log("dealer wins");
                console.log(dealerTotal + "him  you" + cardTotal);
            }
        } else if (dealerTotal == cardTotal) {
            console.log("dealer wins its a tie");
            console.log(dealerTotal + "him  you" + cardTotal);
        }
    }


    function newDeal() {
        newHand()
        
        let playerHand = draw(2)
        let dealerHand = draw(2)
        pCard1 = playerHand.cards[0]
        pCard2 = playerHand.cards[1]
        dCard1 = dealerHand.cards[0]
        dCard2 = dealerHand.cards[1]

        $('.remaining').text(playerHand.remaining)
        $('.left').css("background-image", "url("+pCard1.image+")").addClass(pCard1.value)
        $('.right').css("background-image", "url("+pCard2.image+")").addClass(pCard2.value)       
        let cardTotal = cardValues(pCard1) + cardValues(pCard2)
        if (cardTotal == 21) {
            cardTotal = "Blackjack!"
            $('.hit-btn').attr('disabled', true) 
        }
        $('.playerTotal').text(cardTotal)

        
               
        
    }


    $('.button').on("click", newDeal)
    $('.hit-btn').on('click', hit)
    $('.shuffle').on('click', shuffler)
    $('.stay-btn').on('click', dealerPlay)
})



