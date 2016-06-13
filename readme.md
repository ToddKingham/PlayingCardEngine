I wrote this libraby for educational purposes and placed it in github simply to prevent loss. It is by no means complete and I will continue to work on it as time permits. The main purpose of this library is actually two-fold. 

Firstly, this is a study in array manipulation and can be useful to anyone wanting to understand arrays in JavaScript. The idea is to best describe the concept of arrays using one of the greatest examples of arrays in the physical world, Playing Cards.

Secondly, through the mediphor for Playing Cards I am attempting to not only create an example of array manipulation but at the same time attempt to solve a problem with some computer based Playing Card engines. Namely accounting for "Card Memory" (the physical proximity of each card to its' neighboring cards as actions are performed on the deck... shuffling, cutting, dealing, etc.). The issue is that many computer based gaming engines will simply randomize a deck of cards which changes the true probablity found in a physical deck of cards. 

For example, a typical un-shuffled brand new deck of cards will be "perfectly ordered" meaning it will contain: K,Q,J,10,9,8,7,6,5,4,3,2,A in the following suites (hearts, clubs, diamonds, spades). This would mean the "first card" in the deck would be King of Hearts and the "last card" in the deck would be Ace of Spades (removing jokers for illustration). By performing a single "riffle style" shuffle on this perfectly ordered deck of cards you would end up with a semi-randomization of the deck. However, the result could never place the King of Hearts next to (or anywhere near) the Ace of Spades because of the physicality of the deck. 

Although, this engine may not perfectly handle "Card Memory" I believe it is a great attempt to approximate it as well as possible and with a focus on that intent I feel this engine has reached an acceptable level of success.


This core library has no concept of scoring or game rules of any kind. It is simply a deck manipulation library. It should allow you to represent splitting or joining the deck in any manner possible while retaining the physicality of the deck(s).

To create an actual game I would envision creating one or two additional layers. For example, you could create a poker library, rummy library, black jack library, etc... each would extend this libary and apply thier own values and rules. In a poker library an Ace would be higher than a king but in a black jack library an Ace could be worth 11 and/or 1. 


Sample Usage and API Reference:

new PlayingCards({packs:1,jokers:true});
	.shuffle(['wash','riffle','riffle','box','riffle','cut']);
	.deal() // number of hands to deal, number of cards per hand
	.draw() // number of cards to draw from the pile
	.discard() // number of cards to 
	.burn()


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



