const url = "https://deckofcardsapi.com/api/deck/"
const newDeck = "new/shuffle/?deck_count=1"
const drawCount = "/draw/?count="
const shuffle = "/shuffle/"
var hitCount = 0;

//// Generates a new deck and gives the Deck id number
function newDeckMaker() { 
    let deck = $.ajax({
    type: 'GET',
    async: false,
    url: url+newDeck,
  });
  return deck.responseJSON.deck_id;
}
////

/// Takes the string value of cards and returns a number value
function cardValues(card) {
    if (card.value == "JACK" || card.value == "KING" || card.value == "QUEEN") {
        console.log(card.value)
        return 10
    } else {
        return parseInt(card.value, 10)
    }

}



$(() => {
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
        hitCount ++;
        console.log(hitCard)
        $('.remaining').text(hitCard.remaining)
        $('.playerHand').append($('<div>').addClass("hit").attr("id", ""+hitCount+""))
        console.log(hitCard)
        $('#'+hitCount+'').css("background-image", "url("+hitCard.cards[0].image+")")
        
    }    


    let deckID = newDeckMaker()
    console.log(deckID)
   
    function playerCards(x) {
        let playerHand = draw(2)
        card1 = playerHand.cards[0]
        card2 = playerHand.cards[1]
        console.log(playerHand)
        $('.remaining').text(playerHand.remaining)
        $('.left').css("background-image", "url("+card1.image+")")
        $('.right').css("background-image", "url("+card2.image+")")
        $('.hit-btn').on('click', hit)
        // let cardTotal = cardValues(hand.cards[0]) + cardValues(hand.cards[1])
        // console.log(cardValues(hand.cards[0]))
        // console.log(cardTotal)
        // $('.playerTotal').text(cardTotal)

        
    }
   $('.button').on("click", playerCards)
})



