Mimic.Object = function(isChild) {
	if (isChild != true) {
		this._called = [];
		this._expect = new Mimic.Expectations();
		this._injectInto = null;
		this._originalObject = null;

		this.is = this;

		this.injectedInto = function(object) {
			this._injectInto = object;
			return this;
		};

		this.as = function(name) {
			if (this._injectInto != null) {
				eval('this._injectInto.' + name + ' = this;');
			}
			this._injectInto = null;
		};

		this.should = function(callString, ignoreArg) {
			if (ignoreArg != undefined) {
				throw('Only one parameter can be provided for <b>should()</b>. To provide extra parameters try the following:<br/><p><b>should("'+ callString +'").using(' + ignoreArg + ', ...)</b></p>');
			}
			
			var parameterCount = 0;
			var theFunction  = eval('this.' + callString);
			if (theFunction != null) {
				var parameters = Mimic.Util.Parameters.arguments(theFunction);
				if (parameters != '') {
					parameterCount = parameters.split(',').length;
				}
			}

			return this._expect.add(callString, true, parameterCount, -1);
		};

		this.shouldNot = function(callString) {
			var parameterCount = 0;
			var theFunction  = eval('this.' + callString);
			if (theFunction != null) {
				var parameters = Mimic.Util.Parameters.arguments(theFunction);
				if (parameters != '') {
					parameterCount = parameters.split(',').length;
				}
			}

			return this._expect.add(callString, false, parameterCount, -1);
		};
	}
	
	this._inject = function(object, root, callPrefix) {
		for(var member in object) {
			var callString = member;
			if (callPrefix != null) {
				callString = callPrefix + '.' + callString;
			}
			
			if (typeof object[member] == 'function') { 
				var theFunction = 'this.' + member + ' = function(' + Mimic.Util.Parameters.arguments(object[member]) + ') { ' +
					'    if (root._called["' + callString + '"] == null) { root._called["' + callString + '"] = new Mimic.Call("' + callString + '"); } ' +  
			 		'    root._called["' + callString + '"].incrementCallCount();' +
					'	 root._called["' + callString + '"].parameters.push(Mimic.Util.Parameters.evaluate(' + Mimic.Util.Parameters.arguments(object[member]) + '));' +
			 		'    if (root._expect.returnFor("' + member + '", Mimic.Util.Array.clean([' + Mimic.Util.Parameters.arguments(object[member]) + '])) != null) { ' +
			 		'    	return root._expect.returnFor("' + member + '", Mimic.Util.Array.clean([' + Mimic.Util.Parameters.arguments(object[member]) + ']));' + 
			 		'    } else {' +
			 		'    	return object[member];' +
			 		'    }' +
			 		'}';
				eval(theFunction);
			} else if (typeof object[member] == 'object' && object[member] != null && object[member].join == null) {
				eval('this.' + member + ' =  childMimic(object[member], root, callString);');
			} else {
				eval('this.' + member + ' =  object[member];');
			}
		}
		
		if (root == null || this == root) {
			this._originalObject = object;
		}
	};
	
	this._reset = function() {
		this._called = [];
		this._expect = new Mimic.Expectations();
	};
};

function childMimic(object, root, callPrefix) {
	var mimic = new Mimic.Object(true);
	mimic._inject(object, root, callPrefix);

	return mimic;
}