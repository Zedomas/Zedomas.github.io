const url = "https://deckofcardsapi.com/api/deck/"
const newDeck = "new/shuffle/?deck_count=6"
const draw = "/draw/?count=2"
const shuffle = "/shuffle/"

function newDeck() { 
    let deck = $.ajax({
    type: 'GET',
    async: false,
    url: url+newDeck,
    success: function(data) {
        
    } 
  });
  return deck.responseJSON.deck_id;
}

$(() => {
    let deckID = decker()
    console.log(deckID)
})



