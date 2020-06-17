const url = "https://deckofcardsapi.com/api/deck/"
const newDeck = "new/shuffle/?deck_count=1"
const drawCount = "/draw/?count="
const shuffle = "/shuffle/"
let hitCount = 0;

//// Generates a new deck and gives the Deck id number
function newDeckMaker() { 
    let deck = $.ajax({
    type: 'GET',
    async: false,
    url: url+newDeck,
  });
  return deck.responseJSON.deck_id;
}
//// new hand
function newHand() {
    $('.playerHand').empty()
    $('.playerHand').append($('<div>').addClass("left"))
    $('.playerHand').append($('<div>').addClass("right"))
    $('.hit-btn').attr('disabled', false)
}

/// Takes the string value of cards and returns a number value
function cardValues(card) {
    if (card.value == "JACK" || card.value == "KING" || card.value == "QUEEN") {
        return 10
    } else {
        return parseInt(card.value, 10)
    }

}



$(() => {
    let deckID = newDeckMaker()
    console.log(deckID)
    function draw(x) {
        let cards = $.ajax({
                type: 'GET',
                async: false,
                url: url+deckID+drawCount+x
            })
            return cards.responseJSON
        }
    
    function hit() {
        let hitCard = draw(1)
        console.log(hitCard.cards)
        hitCount ++;

        $('.remaining').text(hitCard.remaining)
        $('.playerHand').append($('<div>').addClass("hit").attr("id", ""+hitCount+"").addClass(hitCard.cards[0].value))
        $('#'+hitCount+'').css("background-image", "url("+hitCard.cards[0].image+")")
        let previousTotal = parseInt($('.playerTotal').text(), 10)
        cardTotal = cardValues(hitCard.cards[0]) + previousTotal
        // console.log(cardValues(hitCard.cards[0]))
        if (cardTotal > 21) {
            $('.playerTotal').text("BUSTED")
            hitCount = 0;
                    
        } else {
            $('.playerTotal').text(cardTotal)
        }
        if( $('.playerTotal').text() == "BUSTED") {
           $('.hit-btn').attr('disabled', true)
                     
        }
    }    
   
    function playerCards() {
        newHand()
        
        let playerHand = draw(2)
        card1 = playerHand.cards[0]
        card2 = playerHand.cards[1]
        //check for blackjack
        $('.remaining').text(playerHand.remaining)
        $('.left').css("background-image", "url("+card1.image+")").addClass(card1.value)
        $('.right').css("background-image", "url("+card2.image+")").addClass(card2.value)        
        let cardTotal = cardValues(card1) + cardValues(card2)
        $('.playerTotal').text(cardTotal)
        
        if ($('.left').hasClass("8")) {
            alert("success baby")
        }
        if ($('.right').hasClass("8")) {
            alert("success baby")
        }
       
        
    }
    $('.button').on("click", playerCards)
    $('.hit-btn').on('click', hit)
})



