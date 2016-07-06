function $(q,p=document){
  var result = [];
  var nodes = p.querySelectorAll(q);
  for(var idx=0;idx<nodes.length;idx++){
    result.push(nodes[idx]);
  }
  return result;
}

GAME = {};
	(function(solitaire,draggy,$){

		var params = {
			hoverTimers: {}
		};

		var session = {
		  get: function(k){
		    return JSON.parse(sessionStorage.getItem(k));
		  },
		  set: function(k,v){
		     sessionStorage.setItem(k,JSON.stringify(v));
		    return true;
		  },
		  remove: function(k){
		    sessionStorage.removeItem(k);
		  },
		  clear: function(){
		    sessionStorage.clear();
		  }
		};

		var methods = {
			init: function(){

				if(session.get('state') === 'active'){
					solitaire.init(session.get('deck'));
					methods.syncUI();
					console.log(session.get('deck'));
				}


				$('#stock')[0].addEventListener('click',function(ev){
					if(session.get('state') === 'active'){
						if(solitaire.get('stock').length){
							solitaire.turn(3);
						}else{
							solitaire.restock();
						}
						methods.syncUI();
					}
				});

				$('#newgame')[0].addEventListener('click',(function(ev){
					ev.preventDefault();
					this.newGame();
				}).bind(this));

			},

			syncUI: function(){
				methods.laydownCards(document.getElementById('stock'),solitaire.get('stock'));
				methods.laydownCards(document.getElementById('talon'),solitaire.get('talon'));

				solitaire.get('tableau').map(function(obj,i,parent){
					methods.laydownCards(document.getElementById('tableau_'+i),obj,true);
				});

				solitaire.get('foundations').map(function(obj,i,parent){
					methods.laydownCards(document.getElementById('foundations_'+i),obj,true);
				});
				methods.setDrag();
				session.set('deck',solitaire.get());

				var isGameWon = !$('.down').length && $('#talon .card').length === 1;
				if(isGameWon){
					methods.gameWon();
				}
			},

			getCard: function(li){
				var result = false;
				var card = solitaire.get(li.dataset.hand,li.dataset.handIndex || 0);
					if(methods.isArray(card)){
						result = card[li.dataset.cardIndex];
					}
				return result;
			},

			getLocaleFromOL: function(ol){
				var locale = ol.id.split('_').concat([-1]);
				return {"hand":locale[0],"handIndex":locale[1]};
			},

			getLocaleFromLI: function(li){
				return {"hand":li.dataset.hand,"handIndex":parseInt(li.dataset.handIndex),"cardIndex":parseInt(li.dataset.cardIndex)};
			},

			getParentOL: function(itm){
				try{
					while(itm.getAttribute('class') !== 'cards'){
						itm = itm.parentNode;
					}
				}catch(e){
					console.log(itm);
				}

				return itm;
			},

			laydownCards: function(stack,obj,l=false){
				stack.innerHTML = typeof stack.dataset.default !=='undefined' ? '<span class="default">'+stack.dataset.default+'</span>' : '';
				var locale = methods.getLocaleFromOL(stack);
				var stacks = {
					'up':	document.createElement('div'),
					'down':	document.createElement('div')
				};
						stacks.up.className = 'upcards';
						stacks.down.className = 'downcards';


				obj.map(function(obj,i){
					var card = document.createElement('div');
					var state = obj.upcard ? 'up' : 'down';
							card.innerHTML = '<span class="index">'+obj.index+'</span><span class="suit">'+obj.symbol+'</span>';
							card.className = ['card',obj.color,state].join(' ');
							card.dataset.cardIndex = i;
							card.dataset.hand = locale.hand;
							card.dataset.handIndex = locale.handIndex;

					var parent = locale.hand === 'tableau' ? stacks[state] : stack;

					if(l){
						parent.insertBefore(card, parent.firstChild);
					}else{
						parent.appendChild(card);
					}
				});

				if(locale.hand === 'tableau'){
					stack.appendChild(stacks.down);
					stack.appendChild(stacks.up);
				}
			},

			setDrag: function(){
				draggy.set($('.cards div'),$('.cards'))
					.on('drag',function(el){
						return methods.getCard(el).upcard;
					})
					.on('target',function(el){
						var result = true;
						var target = methods.getParentOL(el);


						// var bound = (function(){
						// 	this.lastChild.className = this.lastChild.className.replace(/active/gi,'');
						// 	//console.log(this);
						// }).bind(target);
						//
						// if(typeof params.hoverTimers[el] !=='undefined'){
						// 	clearTimeout(params.hoverTimers[el]);
						// }
						//
						// //set active
						// target.lastChild.className += ' active';
						//
						// //clear active
						// params.hoverTimers[el] = setTimeout(bound,100);
						// // $('.active').map(function(el){
						// //
						// //
						// // });



						return result;
					})
					.on('drop',function(el,target){
						var result = false;
						var success = false;
						var source = methods.getLocaleFromLI(el);
						var target = methods.getLocaleFromOL(methods.getParentOL(target));

						if(target.hand === 'foundations'){
							success = solitaire.buildFoundation(source.hand,source.handIndex);
						} else if(target.hand === 'tableau'){
							success = solitaire.buildTableau(target.handIndex,source.hand,source.handIndex,source.cardIndex+1);
						}

						if(success){
							methods.syncUI();
						}

						return result;
					});
			},

			gameWon: function(){
				alert('you won!');
			},

			isArray: function(obj){
				return Object.prototype.toString.call( obj ) === '[object Array]';
			}
		};

		this.newGame = function(){
			session.set('state','active');
			solitaire.init(null);
			solitaire.newGame();
			methods.syncUI();
		};

		methods.init.apply(this);
		// if(session.get('state') === 'active'){
		//
		// } else {
		// 	this.newGame();
		// }


	}).apply(GAME,[Solitaire,DragDrop,$]);
