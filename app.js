const url = "https://deckofcardsapi.com/api/deck/"
const newDeck = "new/shuffle/?deck_count=1"
const draw = "/draw/?count=2"
const shuffle = "/shuffle/"

function newDeckMaker() { 
    let deck = $.ajax({
    type: 'GET',
    async: false,
    url: url+newDeck,
  });
  return deck.responseJSON.deck_id;
}



$(() => {
    function drawer() {
        let cards = $.ajax({
                type: 'GET',
                async: false,
                url: url+deckID+draw
            })
            return cards.responseJSON
        }
    


    let deckID = newDeckMaker()
    console.log(deckID)
   
    function playerCards() {
        let hand = drawer()
        console.log(hand)
        $('.remaining').text(hand.remaining)
        console.log(cards)
        $('.left').css("background-image", "url("+hand.cards[0].image+")")
        $('.right').css("background-image", "url("+hand.cards[1].image+")")
        
    }
   $('.button').on("click", playerCards)
})



