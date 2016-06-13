//SHUFFLING

TYPES:
wash
riffle
box
cut


Riffle Notes:
In a riffle type shuffle, the deck is split in half (relatively) and small number of cards (approx 1-4) from each respective half are alternated back into a single pile.

To simulate a real shuffle the alternating number of cards should be "randomly" chosen using the following percentages
1 card = 48% of the time
2 cards = 45% of the time
3 cards = 5% of the time
4 cards = 2% of the time






shuffle
deal
draw
discard
burn
setHands (may want to rename)


We need to be able to move a card from any pile into any other pile

from the deck we probably only ever need to move the index. That is to say there really aren't any games where you get to choose which card you get, you tipically just pull the top card(s) from the pile. So to "draw" from the deck you need to be able to ask for the number of indicies you want off the top. *side note: perhaps we may need to draw from the bottom? probably not *


from the discard pile, some games let you draw from the discard pile, typically you will get to select which card you want but I believe this can be designed by picking the index rather than the actual card.



