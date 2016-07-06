DragDrop = {};
(function(){
		var DRAGSOURCE;
		var params = {
			drag: function(){return true;},
			target: function(){return true;},
			drop: function(){return true;}
		};

		var methods = {
			drag: function(ev){
				if(params.drag(ev.target)){
					DRAGSOURCE = ev.target;
					ev.dataTransfer.setData("obj", DRAGSOURCE);
				}
			},
			target: function(ev){
				if(params.target(ev.target)){
					ev.preventDefault();
				}
			},
			drop: function(ev){
				if(params.drop(DRAGSOURCE,ev.target)){
					ev.preventDefault();
		    		var data = ev.dataTransfer.getData("obj");
					ev.target.appendChild(DRAGSOURCE);
				}
			},
			isArray: function(obj){
				return Object.prototype.toString.call( obj ) === '[object Array]';
			}
		};

		this.set = function(src,target){
			src = methods.isArray(src) ? src : [src];
			target = methods.isArray(target) ? target : [target];

			src.map(function(obj){
				obj.draggable = true;
				obj.addEventListener("dragstart", methods.drag);
			});

			target.map(function(obj){
				obj.addEventListener("drop",methods.drop);
				obj.addEventListener("dragover",methods.target);
			});
			return this;
		};

		this.on = function(ev,cb){
			params[ev] = cb;
			return this;
		};
}).apply(DragDrop);
