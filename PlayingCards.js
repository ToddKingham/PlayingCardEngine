/*
Author: Todd Kingham

*/
function PlayingCards(obj){

	var params = {
		jokers : false,
		packs : 1,
		cards : {
			standard: {
				indecies: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
				suits: ['Spades','Diamonds','Clubs','Hearts']
			},
			wild: {
				indecies: ['%'],
				suits: ['Little','Big']
			}
		},
		exclude : {
			cards : [],
			suits : []
		}
	};

	var CARDS = {
		deck:[],
		stock:[],
		discard:[],
		hands:[],
		table:[], // maybe we will use this when "laying down" in games such as rummy or even poker games like texas hold 'em
		dealer:0,
		player:1
	};

	var methods = {
		init : function(obj){
			obj = obj || params;
			for(var x in params){
				params[x] = obj[x] || params[x];
			}
			CARDS.deck = methods.new_deck();
		},

		new_deck : function(){
			var result = [];
			var suit,card,type;
			var base_types = ['wild','standard'];

			var details = {
				standard: {
					card: {
						'A':{name:'Ace',type:'pip'},
						'2':{name:'Two',type:'pip'},
						'3':{name:'Three',type:'pip'},
						'4':{name:'Four',type:'pip'},
						'5':{name:'Five',type:'pip'},
						'6':{name:'Six',type:'pip'},
						'7':{name:'Seven',type:'pip'},
						'8':{name:'Eight',type:'pip'},
						'9':{name:'Nine',type:'pip'},
						'10':{name:'Ten',type:'pip'},
						'J':{name:'Jack',type:'face'},
						'Q':{name:'Queen',type:'face'},
						'K':{name:'King',type:'face'},		
					},
					suit: {
						spades: {color:'black',symbol:'&#9828;'},
						clubs: {color:'black',symbol:'&#9831;'},
						hearts: {color:'red',symbol:'&#9825;'},
						diamonds: {color:'red',symbol:'&#9826;'}
					}
				},
				wild: {
					card: {
						'%':{name:'Joker',type:'wild'},
					},
					suit: {
						big: {color:'Black',symbol:'&#9787;'},
						little: {color:'Red',symbol:'&#9786;'},
					}
				}
			}

			var build_type_set = function(t){
				var r = [];
				for(var s in params.cards[t].suits){
					for(var c in params.cards[t].indecies){
						suit = params.cards[t].suits[s].toLowerCase();
						card = params.cards[t].indecies[c].toUpperCase();
						r.push({
							index: card,
							name: details[t].card[card].name,
							type: details[t].card[card].type,
							suit: suit,
							color: details[t].suit[suit].color,
							symbol: details[t].suit[suit].symbol,
							visible: false
						});
					}
				}
				return r;
			};
			
			if(!params.jokers){
				base_types.shift();
			}

			for(var i=0;i<params.packs;i++){
				for(var t in base_types){
					type = base_types[t];
					result = result.concat(build_type_set(type));
				}
				
				// if(params.jokers){
				// 	result = [
				// 		{index: '%',name: 'Joker', type: 'wild', suit: null, color: 'red', symbol:'&#9786;'},
				// 		{index: '%',name: 'Joker', type: 'wild', suit: null, color: 'black', symbol:'&#9787;'}
				// 	].concat(result);
				// }
			}
			return result.reverse();
		},

		setHands : function(n){
			//CARDS.hands = [];
			for(var i=0;i<n;i++){
				CARDS.hands.push([]);
			}
		},

		rando: function(){
			return Math.ceil(Math.random()*100);
		},

		plusOrMinus: function(n){
			return methods.rando()%(n+1) * (Math.round(Math.random()) * 2 - 1);
		},

		zeroOrOne: function(){
			return Math.round(Math.random());
		},

		cutAt: function(n,p){
			return [Math.floor,Math.ceil][methods.zeroOrOne()](n*p) + methods.plusOrMinus(2);
		},

		merge: function(){
			var result = [];
			for(var i=0;i<arguments.length;i++){
				result = result.concat(arguments[i].splice(0,arguments[i].length));
			}
			return result;
		},

		flip: function(obj){
			CARDS[obj] = CARDS[obj].reverse();
		},

		isArray: function(obj){
			return Object.prototype.toString.call( obj ) === '[object Array]';
		}
	};




	this.shuffle = function(type,obj='deck'){
		type = type || ['riffle'];
		types = {
			wash: function(p){
				var result = [], n=[];
				while(p.length){
				  n = p.splice(methods.rando()%p.length,1);
				  result = result.concat(n);
				}
				return result;
			},
			riffle: function(p){
				var result = [],
					halves = [
						p.splice(0,methods.cutAt(p.length,.5)),
						p
					],
					afew = function(){
						var a = [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,3,2,1,2,1,2,1,2,1,2,2,1,2,1,2,1,2,3,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1];
						return a[methods.rando()%(a.length-1)];
					},
					idx1 = halves[0].length<halves[1].length?0:1,
					idx2 = (idx1+1)%2,
					next,
					next_up = halves[0].length>halves[1].length?0:1;
				
				while(halves[idx1].length + halves[idx2].length){
					next = halves[next_up].splice(halves[next_up].length-afew(),halves[next_up].length);
					result = next.concat(result);
					next_up = (next_up+1)%2;
		        }
        
				return result;
			},
			box: function(p){
				var result = [];
				var n = p.length/4;
				for(var i=0;i<3;i++){
				var x = p.splice(0,n+methods.plusOrMinus(4));
				result = x.concat(result);
				}
				//result = ;

				return p.concat(result);
			},
			cut: function(p){
				var top_deck = p.splice(0,methods.cutAt(p.length,.33*(Math.round(Math.random())+1)));
				return p.concat(top_deck);
			}
		}

		for(var i=0;i<type.length;i++){
			CARDS[obj] = types[type[i]].apply(this,[CARDS[obj]]);
		}
	};

	this.deal = function(h,n){
		var result = h*n <= CARDS.deck.length;
		if(result){
			var d = CARDS.dealer+1;
			var card;
			methods.setHands(h);
			for(var i=d;i<(h*n||0)+d;i++){
				this.draw(i%h,1,CARDS.deck);
			}
			CARDS.stock = methods.merge(CARDS.stock,CARDS.deck);
		}
		return result;
	};
	
	this.draw = function(h,n,obj){
		var cards = (typeof obj === 'object' ? obj : CARDS[obj||'stock']).splice(0,n);
		CARDS.hands[h] = cards.concat(CARDS.hands[h]);
	};

	this.discard = function(h,ids){
		var ids = typeof ids === 'number' ? [ids] : ids.sort().reverse();
		for( var i=0; i<ids.length; i++ ){
			var item = CARDS.hands[h].splice(ids[i], 1);
			CARDS.discard = item.concat(CARDS.discard);
		}
	};

	this.burn = function(n=1,obj='stock'){
		CARDS.discard = methods.merge(CARDS.discard,CARDS[obj].splice(0,n));
	};

	this.fold = function(n){
		CARDS.discard = methods.merge(CARDS.hands[n],CARDS.discard);
	};

	this.give = function(src,dest,n=0,c=1){
		var result;
		c = typeof n === 'number' ? c : 1;
		n = typeof n === 'number' ? [n] : n.sort().reverse();
		for( var i=0; i<n.length; i++ ){
			CARDS.hands[dest] = CARDS.hands[src].splice(n[i],c).concat(CARDS.hands[dest]);
		}
	};

	this.end = function(){
		var collectedHands = methods.merge.apply(this,CARDS.hands); //apply syntax to avoid a loop
		CARDS.deck = methods.merge(CARDS.deck,CARDS.stock,collectedHands,CARDS.discard);
		CARDS.hands = [];
	};

	this.pickup = function(n,q){
		CARDS.hands[n] = CARDS.discard.splice(0,q).concat(CARDS.hands[n]);
	};

	this.restock = function(f=false,s=[]){
		if(f){ methods.flip('discard'); }
		CARDS.stock = methods.merge(CARDS.stock,CARDS.discard);
		if(s.length){ this.shuffle(s,'stock'); }
	};

	this.get = function(s,i){
		var result = (typeof CARDS[s] !== 'undefined') ? (typeof CARDS[s][i] !== 'undefined') ? CARDS[s][i] : CARDS[s] : null;
		return result;
	};
//remove before shipping
	this.getParams = function(){
		return params;
	};
//remove

	// we need to set up a number of decks and decide which cards to be included (ie. Jokers or not?)	
	methods.init(obj);

	return this;
}