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
							symbol: details[t].suit[suit].symbol
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
			CARDS.hands = [];
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
			return [Math.floor,Math.ceil][methods.zeroOrOne()](n*p) + methods.plusOrMinus(3);
		}
	};

	this.shuffle = function(type){
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
				var result = [];
				var next_left,next_right;
				//var cutAt = 26;//Math.round(p.length/2) + ((methods.rando()%3)*[-1,1][methods.rando()%2]);
				var idx1 = methods.rando()%2;
				var idx2 = (idx1+1)%2;
				var halves = [[],[]];
					halves[idx1] = p.splice(0,methods.cutAt(p.length,.5)).reverse();
					halves[idx2] = p.reverse();

				// TODO: fix this so percentages come out correctly. see reaadme.md
				var afew = function(){
					var a = [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,3,2,1,2,1,2,1,2,1,2,2,1,2,1,2,1,2,3,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1];
					return a[methods.rando()%(a.length-1)];
				};

				while(halves[idx1].length + halves[idx2].length){
					left_few = afew();
					right_few = afew();
					next_left = halves[idx1].splice(0,left_few);
					next_right = halves[idx2].splice(0,right_few);
					result = result.concat(next_right).concat(next_left);
				}

				return result.reverse();
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
			CARDS.deck = types[type[i]].apply(this,[CARDS.deck]);
		}
	};

	this.deal = function(h,n){
		var d = CARDS.dealer+1;
		var card;
		methods.setHands(h);
		for(var i=d;i<(h*n)+d;i++){
			this.draw(i%h,1);
		}
	};

	this.draw = function(h,n,obj){
		var cards = (typeof obj === 'object' ? obj : CARDS[obj||'deck']).splice(0,n);
		CARDS.hands[h] = CARDS.hands[h].concat(cards);
	};

	this.discard = function(h,ids){
		var ids = typeof ids === 'number' ? [ids] : ids.sort().reverse();
		for( var i=0; i<ids.length; i++ ){
			var item = CARDS.hands[h].splice(ids[i], 1);
			CARDS.discard = item.concat(CARDS.discard);
		}
	};

	this.burn = function(n){
		var ids = [];
		for( var i=0; i<n; i++ ){
		  ids.push(i);
		}
		this.discard(CARDS.deck,ids);
	}

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