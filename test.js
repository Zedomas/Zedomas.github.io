let aces = 0;

function checkAces(card) {
    if (card == "ACE") {
        aces ++;
    }
}

console.log(aces)
checkAces("ACE")
console.log(aces)

function tester() {
    aces++;
}
tester()
console.log(aces)