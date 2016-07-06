/*
Author: Todd Kingham

*/
Solitaire = {};
(function(Cards){
	var CARDS;

	var methods = {
		shuffle: function(){
			CARDS.shuffle(['riffle','riffle','riffle','box','riffle','cut']);
		},

		deal: function(){
			CARDS.deal(11,0);
			for(var i=4;i<11;i++){
				for(var j=i;j<11;j++){
					CARDS.draw(j,1);
				}
				//turn first card over for each tableau
				CARDS.flip(CARDS.get('hands',i)[0]);
			}
		},

		getCardValue : function(i){
			var keys = {'K':13,'Q':12,'J':11,'A':1};
			var val = parseInt(i);
			return isNaN(val) ? keys[i.toUpperCase()] : val;
		}
	};

	this.init = function(deck=null){
		CARDS = new Cards({packs:1,jokers:false,discard_up:true},deck);
	};

	this.newGame = function(){
		CARDS.end();
		methods.shuffle();
		methods.deal();
	};

	this.turn = function(n=1){
		CARDS.burn(Math.min(n,CARDS.get('stock').length), true );
	};

	this.restock = function(){
		CARDS.restock(true);
	};

	this.buildTableau = function(i,key,x=-1,q=1){
		var target =  this.get('tableau',i)[0] || {color:'none',index:14};
		var src = this.get(key,x);
		var len = 0;
		var card;
		var result;

		i = parseInt(i);

		src.slice(0,q).map(function(obj){
			if(obj.upcard){
				card = obj;
				len ++;
			}
		});

		result = target.color !== card.color && methods.getCardValue(card.index)+1 === methods.getCardValue(target.index);

		if(result){
			if(key === 'talon'){
				CARDS.pickup(i+4);
			} else {
				var x_hand = key==='foundations'?x:x+4;
				CARDS.give(x_hand,i+4,0,len);
				if(src.length && !src[0].upcard){
					CARDS.flip(src[0]);
				}
			}
		}
		return result;
	};

	this.buildFoundation = function(key,x=-1){
		var src = this.get(key,x);
		var map = ['hearts', 'diamonds', 'spades', 'clubs'];
		var card = src[0] || {suit:'none',index:0};
		var i = map.indexOf(card.suit);
		var target =  (i>-1 ? this.get('foundations',i) : [])[0] || {suit:card.suit,index:0};
		var result = card.suit === target.suit && methods.getCardValue(card.index)-1 === methods.getCardValue(target.index);

		if(result){
			if(key === 'talon'){
				CARDS.pickup(i,1);
			} else{
				CARDS.give(x+4,i);
				if(src.length && !src[0].upcard){
					CARDS.flip(src[0]);
				}
			}
		}
		return result;
	};

	this.endGame = function(){
		console.log('stop it!');
	};

	this.get = function(el,i=-1){
		var translate = {
			'foundations':'hands',
			'tableau':'hands',
			'talon':'discard',
			'stock':'stock',
			'deck':'deck'
		};
		var result = CARDS.get(translate[el]);

		if(el === 'tableau'){
			result = result.slice(4,11);
		} else if (el === 'foundations'){
			result = result.slice(0,4);
		}

		if(i>-1){
			result = result[i];
		}
		return result;
	};

	//this.init();

}).apply(Solitaire,[PlayingCards]);
