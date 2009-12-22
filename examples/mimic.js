function Mimic(){this.mimics=[];
this.jQuery=null;
this._value=null;
this.reset=function(){for(var mimic in this.mimics){this.mimics[mimic]._reset();
}if(this.jQuery!=null){this.jQuery._reset();
}};
this.clear=function(){this.mimics=[];
};
this.that=function(value){Mimic._value=value;
return Mimic;
};
this.is=function(value){if(this._value!=value&&!Mimic.Util.Object.equals(this._value,value)){throw ("The value "+value+" was expected to equal "+this._value+", but does not.");
}this._value=null;
};
this.verify=function(){for(var mimic in this.mimics){Mimic.Verify(this.mimics[mimic]);
}if(this.jQuery!=null){Mimic.Verify(this.jQuery);
}};
this.isMimic=function(mimic){if(mimic._inject!=null){return true;
}return false;
};
}Mimic=new Mimic();
function mimic(object){var mimic;
if(object.fn&&object.fn.jquery){mimic=Mimic.Object.JQuery;
Mimic.jQuery=mimic();
}else{if(Mimic.isMimic(object)){mimic=object;
}else{mimic=new Mimic.Object();
mimic._inject(object,mimic);
Mimic.mimics.push(mimic);
}}return mimic;
}function restore(mimic){if(mimic==null){return;
}var object=mimic._originalObject;
for(var i=0;
i<Mimic.mimics.length;
i++){if(Mimic.mimics[i]==mimic){Mimic.mimics[i]=null;
Mimic.mimics=Mimic.Util.Array.clean(Mimic.mimics);
}}return object;
}function times(){}function time(){}function anything(){}function never(){}window.given=window;
window.when=window;
window.then=window;
window.and=window;
window.it=window;
window.should=window;
window.that=Mimic.that;
window.expect=Screw.Matchers.expect;
window.pass=function(){};
window.say=function(exception){thrown=exception;
return window;
};
var thrown;
Screw.Specifications.itOriginal=Screw.Specifications.it;
Screw.Specifications.it=function(name,fnOriginal){Screw.Specifications.itOriginal(name,function(){try{fnOriginal();
Mimic.verify();
Mimic.reset();
if(thrown!=null){var expected=thrown;
thrown=null;
throw ("An exception was expected to thrown and was not. The exception expected is: "+expected);
}}catch(exception){Mimic.reset();
if(thrown!=null){var expected=thrown;
thrown=null;
Screw.Matchers.expect(exception).to(Screw.Matchers.equal,expected);
}else{throw (exception);
}}});
};
jQuery.fn.text=function(text){return this.html(text);
};
Mimic.Util={};
Mimic.Util.Array={contains:function(array1,array2){if(array1==null||array2==null){return false;
}for(var i=0;
i<array1.length;
i++){if(this.equals(array1[i],array2)==true){return i;
}}return false;
},equals:function(array1,array2){if(array1==null||array2==null){return false;
}if(array1.length!=array2.length){return false;
}for(var i=0;
i<array1.length;
i++){if(typeof array1[i]=="object"&&typeof array2[i]=="object"){if(array1[i]!=null&&array1[i].join!=null&&array2[i]!=null&&array2[i].join!=null){if(this.equals(array1[i],array2[i])==false){return false;
}}else{if(Mimic.Util.Object.equals(array1[i],array2[i])==false){return false;
}}}else{if(array1[i]!=array2[i]){return false;
}}}return true;
},clean:function(array){var clean=[];
for(var i=0;
i<array.length;
i++){if(array[i]!=null){clean.push(array[i]);
}}return clean;
}};
Mimic.Util.Object={equals:function(object1,object2){if(typeof object1=="object"&&object1==null&&typeof object2=="object"&&object2==null){return true;
}if(typeof object1=="undefined"&&object1==undefined&&typeof object2=="undefined"&&object2==undefined){return true;
}if(object1==null||object2==null){return false;
}for(var i in object1){if(object1==object1[i]&&typeof object1==typeof object1[i]){continue;
}if(typeof object1[i]!=typeof object2[i]){return false;
}else{if(typeof object1[i]=="object"||typeof object1[i]=="function"){if(this.equals(object1[i],object2[i])==false){return false;
}}else{if(object1[i]!=object2[i]){return false;
}}}}return true;
},toString:function(object,withKey){var string=[];
for(var key in object){if(object[key]==null){string.push("null");
}else{if(typeof object[key]=="object"){if(object[key].join!=null){string.push("["+this.toString(object[key])+"]");
}else{string.push("{"+this.toString(object[key],true)+"}");
}}else{if(typeof object[key]=="string"){if(withKey==true){string.push('"'+key+'": "'+object[key]+'"');
}else{string.push('"'+object[key]+'"');
}}else{string.push(object[key]);
}}}}return string.join(", ");
},clone:function(object){var newObject=(object instanceof Array)?[]:{};
if(typeof object!="object"){return object;
}for(var key in object){if(object[key]&&typeof object[key]=="object"){newObject[key]=Mimic.Util.Object.clone(object[key]);
}else{newObject[key]=object[key];
}}return newObject;
}};
Mimic.Util.Parameters={evaluate:function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9){var parameters=[];
for(var i=0;
i<10;
i++){var evaluated=eval("arg"+i);
if(typeof evaluated!="undefined"){if(evaluated==null){parameters.push(evaluated);
}else{parameters.push(Mimic.Util.Object.clone(evaluated));
}}}return parameters;
},arguments:function(theFunction){return theFunction.toString().replace(/ /g,"").split("(")[1].split(")")[0];
}};
Mimic.Verify=function(mimic){if(mimic._expect.grouped!=null){var grouped=mimic._expect.grouped();
for(var i in grouped){var expectations=grouped[i];
var call=mimic._called[expectations[0].name];
Mimic.Verify.Default(mimic,call,expectations);
}}else{Mimic.Verify.JQuery(mimic);
}};
Mimic.Call=function(name){this.name=name;
this.callCount=0;
this.parameters=[];
this.incrementCallCount=function(){this.callCount++;
};
};
Mimic.Expectations=function(){this.expectations=[];
this.add=function(name,callExpected,parameterCount,callCount){for(var i in this.expectations){if(this.expectations[i].name==name&&this.expectations[i].callExpected!=callExpected){this.expectations[i]=null;
}}this.expectations=Mimic.Util.Array.clean(this.expectations);
var expectation=new Mimic.Expectation(name,callExpected,parameterCount,callCount);
this.expectations.push(expectation);
return expectation;
};
this.returnFor=function(name,parameters){for(var i in this.expectations){if(this.expectations[i].name==name&&Mimic.Util.Array.equals(this.expectations[i].parameters,parameters)){return this.expectations[i].returns;
}}};
this.grouped=function(){var groups=[];
for(var i in this.expectations){var currentGroup=null;
for(var j in groups){if(groups[j][0].name==this.expectations[i].name){currentGroup=groups[j];
}}if(currentGroup==null){groups.push([this.expectations[i]]);
}else{currentGroup.push(this.expectations[i]);
}}return groups;
};
};
Mimic.Expectation=function(name,callExpected,parameterCount,callCount){this.name=name;
this.callExpected=callExpected;
this.callCount=callCount;
this.parameterCount=parameterCount;
this.parameters=[];
this.returns=null;
this.throwz=null;
this.once=function(){return this.exactly(1,time);
};
this.twice=function(){return this.exactly(2,times);
};
this.exactly=function(callCount,times){this.callCount=callCount;
return this;
};
this.andReturn=function(value){this.returns=value;
};
this.andThrow=function(value){this.throwz=value;
};
this.using=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9){if(arg0==anything){return;
}this.parameters=Mimic.Util.Parameters.evaluate(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9);
return this;
};
};
Mimic.Object=function(isChild){if(isChild!=true){this._called=[];
this._expect=new Mimic.Expectations();
this._injectInto=null;
this._originalObject=null;
this.is=this;
this.injectedInto=function(object){this._injectInto=object;
return this;
};
this.as=function(name){if(this._injectInto!=null){eval("this._injectInto."+name+" = this;");
}this._injectInto=null;
};
this.should=function(callString,ignoreArg){if(ignoreArg!=undefined){throw ('Only one parameter can be provided for <b>should()</b>. To provide extra parameters try the following:<br/><p><b>should("'+callString+'").using('+ignoreArg+", ...)</b></p>");
}var parameterCount=0;
var theFunction=eval("this."+callString);
if(theFunction!=null){var parameters=Mimic.Util.Parameters.arguments(theFunction);
if(parameters!=""){parameterCount=parameters.split(",").length;
}}return this._expect.add(callString,true,parameterCount,-1);
};
this.shouldNot=function(callString){var parameterCount=0;
var theFunction=eval("this."+callString);
if(theFunction!=null){var parameters=Mimic.Util.Parameters.arguments(theFunction);
if(parameters!=""){parameterCount=parameters.split(",").length;
}}return this._expect.add(callString,false,parameterCount,-1);
};
}this._inject=function(object,root,callPrefix){for(var member in object){var callString=member;
if(callPrefix!=null){callString=callPrefix+"."+callString;
}if(typeof object[member]=="function"){var theFunction="this."+member+" = function("+Mimic.Util.Parameters.arguments(object[member])+') {     if (root._called["'+callString+'"] == null) { root._called["'+callString+'"] = new Mimic.Call("'+callString+'"); }     root._called["'+callString+'"].incrementCallCount();	 root._called["'+callString+'"].parameters.push(Mimic.Util.Parameters.evaluate('+Mimic.Util.Parameters.arguments(object[member])+'));    if (root._expect.returnFor("'+member+'", Mimic.Util.Array.clean(['+Mimic.Util.Parameters.arguments(object[member])+'])) != null) {     	return root._expect.returnFor("'+member+'", Mimic.Util.Array.clean(['+Mimic.Util.Parameters.arguments(object[member])+"]));    } else {    	return object[member];    }}";
eval(theFunction);
}else{if(typeof object[member]=="object"&&object[member]!=null&&object[member].join==null){eval("this."+member+" =  childMimic(object[member], root, callString);");
}else{eval("this."+member+" =  object[member];");
}}}if(root==null||this==root){this._originalObject=object;
}};
this._reset=function(){this._called=[];
this._expect=new Mimic.Expectations();
};
};
function childMimic(object,root,callPrefix){var mimic=new Mimic.Object(true);
mimic._inject(object,root,callPrefix);
return mimic;
}Mimic.Verify.Default=function(mimic,called,expectations){if(called==null){if(mimic[expectations[0].name]==null){throw ("Your specification did not pass!<br/><p><b>"+expectations[0].name+"()</b> does not exist, however it is referenced in the specification");
}else{if(expectations[0].callExpected==true){throw ("Your specification did not pass!<br/><p><b>"+expectations[0].name+"()</b> was expected but did not get called!");
}}return;
}var name=called.name;
var totalExpectedCallCount=0;
for(var i in expectations){if(expectations[i].callExpected==false){throw ("Your specification did not pass!<br/><p><b>"+name+"()</b> was called, but was not expected to be called");
}if(expectations[i].throwz!=null){throw (expectations[i].throwz);
}if(typeof expectations[i].callCount!="number"){throw ("A number must be provided when specifying the number of occurrences");
}if(expectations[i].callCount==-1){totalExpectedCallCount=-1;
}else{totalExpectedCallCount+=expectations[i].callCount;
}if(expectations[i].parameters.length>0&&expectations[i].parameterCount==0){throw ("Your specification did not pass!<br/><p><b>"+name+"()</b> does not accept any parameters. You must remove the parameters from the specification <b>"+name+"()</b>");
}else{if(expectations[i].parameters.length>expectations[i].parameters.slice(0,expectations[i].parameterCount).length){throw ("Your specification did not pass!<br/><p>The specification executed <b>"+name+"()</b> with <b>"+expectations[i].parameters.length+"</b> parameters, however the specification expected <b>"+name+"()</b> with <b>"+expectations[i].parameters.slice(0,expectations[i].parameterCount).length+"</b> parameters");
}}}if(totalExpectedCallCount!=-1&&called.callCount!=totalExpectedCallCount){throw ("Your specification did not pass!<br/><p>The specification executed <b>"+name+"() "+called.callCount+"</b> times, however the specification expected <b>"+name+"()</b> to be executed <b>"+totalExpectedCallCount+"</b> times");
}var parameters=called.parameters;
var failedExpectations=[];
for(var i in expectations){if(expectations[i].parameters.length==0){continue;
}var count=expectations[i].callCount;
if(count==-1){count=1;
}for(var j=0;
j<count;
j++){var position=Mimic.Util.Array.contains(parameters,expectations[i].parameters);
if(typeof position=="number"){parameters[position]=null;
parameters=Mimic.Util.Array.clean(parameters);
}else{failedExpectations.push(expectations[i]);
}}}var message=[];
for(var i in failedExpectations){if(message.length==0){message.push("Your specification did not pass!<br/><p>The specification executed <b>"+name+"("+Mimic.Util.Object.toString(parameters[0])+")</b>, however the specification expected <b>"+name+"("+Mimic.Util.Object.toString(failedExpectations[i].parameters)+")</b>");
}else{message.push(" or <b>"+name+"("+Mimic.Util.Object.toString(failedExpectations[i].parameters)+")</b>");
}}if(message.length>0){message.push("</p>");
throw (message.join(""));
}};
Mimic.Call.JQuery=function(selector,context,call){this.selector=selector;
this.context=context;
this.call=call;
this.set=function(name,value){this.call={name:name,value:value};
};
};
Mimic.Expectations.JQuery=function(){this.expectations=[];
this.add=function(selector,context){var expectation=new Mimic.Expectation.JQuery(selector,context);
this.expectations.push(expectation);
return expectation;
};
};
Mimic.Expectation.JQuery=function(selector,context){this.selector=selector;
this.context=context;
this.functions=[];
this.neverBeCalled=false;
this.neverHappens=function(){this.neverBeCalled=true;
};
this.should=function(name){return this.and(name);
};
this.and=function(name){this.functions.push({name:name,value:[]});
return this;
};
this.using=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9){this.functions[this.functions.length-1].value=Mimic.Util.Parameters.evaluate(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9);
return this;
};
this.hasFailedSelectorFrom=function(calls){if(this.selector==null){return false;
}for(var i=0;
i<calls.length;
i++){if(this.selector==calls[i].selector){if(this.neverBeCalled==true){return{call:calls[i],never:true};
}else{return false;
}}}if(this.neverBeCalled==true){return false;
}return true;
};
this.hasFailedExpectationsFrom=function(calls){var failedExpectations=[];
var expectationMet,brokenCall;
for(var i=0;
i<this.functions.length;
i++){expectationMet=false;
brokenCall=null;
for(var j=0;
j<calls.length;
j++){if(calls[j].call!=null){if(Mimic.Util.Object.equals(this.functions[i],calls[j].call)){expectationMet=true;
}else{if(this.functions[i].name==calls[j].call.name){if(!Mimic.Util.Object.equals(this.functions[i].value,calls[j].call.value)){brokenCall=calls[j].call;
}}}}}if(expectationMet==false){failedExpectations.push({expectation:this.functions[i],call:brokenCall});
}}return failedExpectations;
};
};
Mimic.Object.JQuery=function(selector,context){return _jQueryMimic.mimicInit(selector,context);
};
Mimic.JQuery=function(){this._called=[];
this._expect=new Mimic.Expectations.JQuery();
this.mimicInit=function(selector,context){if(selector!=null&&typeof selector=="string"){var call=new Mimic.Call.JQuery(selector,context);
this._called.push(call);
}selector=selector||document;
if(selector.nodeType){Mimic.Object.JQuery.clean();
this[0]=selector;
this.length=1;
return this;
}if(typeof selector=="string"){var match=quickExpr.exec(selector);
if(match&&(match[1]||!context)){if(match[1]){selector=originalJQuery.clean([match[1]],context);
}else{var elem=document.getElementById(match[3]);
if(elem){if(elem.id!=match[3]){return this.mimicInit()._find(selector);
}return this.mimicInit(elem);
}selector=[];
}}else{return this.mimicInit(context)._find(selector);
}}else{if(originalJQuery.isFunction(selector)){return this.mimicInit(document)[originalJQuery.fn.ready?"ready":"load"](selector);
}}Mimic.Object.JQuery.clean();
return Mimic.Object.JQuery.setArray(originalJQuery.makeArray(selector));
};
this.create=function(){this._inject(jQuery);
this._inject(jQuery.fn);
return this;
};
this.usingSelector=function(selector,context){return this._expect.add(selector,context);
};
this._find=function(selector){return Mimic.Object.JQuery.find(selector);
};
this._inject=function(object){for(var member in object){if(typeof object[member]=="function"){var theFunction="this."+member+' = function(arg0, arg1, arg2, arg3, arg4) {     var call = new Mimic.Call.JQuery(); 	 call.set("'+member+'", Mimic.Util.Parameters.evaluate(arg0, arg1, arg2, arg3, arg4));	 this._called.push(call);    return this;}';
eval(theFunction);
}else{eval("this."+member+" =  object[member];");
}}};
this._reset=function(){this._called=[];
this._expect=new Mimic.Expectations.JQuery();
};
};
var _jQueryMimic=new Mimic.JQuery().create();
var originalJQuery=jQuery;
var chars=originalJQuery.browser.safari&&parseInt(originalJQuery.browser.version)<417?"(?:[\\w*_-]|\\\\.)":"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",quickChild=new RegExp("^>\\s*("+chars+"+)"),quickID=new RegExp("^("+chars+"+)(#)("+chars+"+)"),quickClass=new RegExp("^([#.]?)("+chars+"*)");
var quickExpr=/^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;
Mimic.Object.JQuery.find=function(selector){var elems=originalJQuery.map(_jQueryMimic,function(elem){return Mimic.Object.JQuery.findElements(selector,elem);
});
return Mimic.Object.JQuery.pushStack(/[^+>] [^+>]/.test(selector)||selector.indexOf("..")>-1?originalJQuery.unique(elems):elems);
};
Mimic.Object.JQuery.pushStack=function(elems){var ret=_jQueryMimic.mimicInit(elems);
ret.prevObject=_jQueryMimic;
return ret;
};
Mimic.Object.JQuery.setArray=function(elems){_jQueryMimic.length=0;
Array.prototype.push.apply(_jQueryMimic,elems);
return _jQueryMimic;
};
Mimic.Object.JQuery.findElements=function(t,context){if(typeof t!="string"){return[t];
}if(context&&context.nodeType!=1&&context.nodeType!=9){return[];
}context=context||document;
var ret=[context],done=[],last,nodeName;
while(t&&last!=t){var r=[];
last=t;
t=originalJQuery.trim(t);
var foundToken=false,re=quickChild,m=re.exec(t);
if(m){nodeName=m[1].toUpperCase();
for(var i=0;
ret[i];
i++){for(var c=ret[i].firstChild;
c;
c=c.nextSibling){if(c.nodeType==1&&(nodeName=="*"||c.nodeName.toUpperCase()==nodeName)){r.push(c);
}}}ret=r;
t=t.replace(re,"");
if(t.indexOf(" ")==0){continue;
}foundToken=true;
}else{re=/^([>+~])\s*(\w*)/i;
if((m=re.exec(t))!=null){r=[];
var merge={};
nodeName=m[2].toUpperCase();
m=m[1];
for(var j=0,rl=ret.length;
j<rl;
j++){var n=m=="~"||m=="+"?ret[j].nextSibling:ret[j].firstChild;
for(;
n;
n=n.nextSibling){if(n.nodeType==1){var id=originalJQuery.data(n);
if(m=="~"&&merge[id]){break;
}if(!nodeName||n.nodeName.toUpperCase()==nodeName){if(m=="~"){merge[id]=true;
}r.push(n);
}if(m=="+"){break;
}}}}ret=r;
t=originalJQuery.trim(t.replace(re,""));
foundToken=true;
}}if(t&&!foundToken){if(!t.indexOf(",")){if(context==ret[0]){ret.shift();
}done=originalJQuery.merge(done,ret);
r=ret=[context];
t=" "+t.substr(1,t.length);
}else{var re2=quickID;
var m=re2.exec(t);
if(m){m=[0,m[2],m[3],m[1]];
}else{re2=quickClass;
m=re2.exec(t);
}m[2]=m[2].replace(/\\/g,"");
var elem=ret[ret.length-1];
if(m[1]=="#"&&elem&&elem.getElementById&&!originalJQuery.isXMLDoc(elem)){var oid=elem.getElementById(m[2]);
if((originalJQuery.browser.msie||originalJQuery.browser.opera)&&oid&&typeof oid.id=="string"&&oid.id!=m[2]){oid=jQuery('[@id="'+m[2]+'"]',elem)[0];
}ret=r=oid&&(!m[3]||originalJQuery.nodeName(oid,m[3]))?[oid]:[];
}else{for(var i=0;
ret[i];
i++){var tag=m[1]=="#"&&m[3]?m[3]:m[1]!=""||m[0]==""?"*":m[2];
if(tag=="*"&&ret[i].nodeName.toLowerCase()=="object"){tag="param";
}r=originalJQuery.merge(r,ret[i].getElementsByTagName(tag));
}if(m[1]=="."){r=originalJQuery.classFilter(r,m[2]);
}if(m[1]=="#"){var tmp=[];
for(var i=0;
r[i];
i++){if(r[i].getAttribute("id")==m[2]){tmp=[r[i]];
break;
}}r=tmp;
}ret=r;
}t=t.replace(re2,"");
}}if(t){var val=originalJQuery.filter(t,r);
ret=r=val.r;
t=originalJQuery.trim(val.t);
}}if(t){ret=[];
}if(ret&&context==ret[0]){ret.shift();
}done=originalJQuery.merge(done,ret);
return done;
};
Mimic.Object.JQuery.clean=function(){for(var i=0;
_jQueryMimic[i]!=undefined;
i++){delete _jQueryMimic[i];
}};
Mimic.Verify.JQuery=function(mimic){var calls=mimic._called;
for(var i in mimic._expect.expectations){var expectation=mimic._expect.expectations[i];
var failedSelector=expectation.hasFailedSelectorFrom(calls);
if(failedSelector!=false){if(failedSelector.never==true){throw ('The selector "'+expectation.selector+'" was expected to never be used, however it was!');
}else{throw ('The selector "'+expectation.selector+'" was expected but was not used!');
}}var failedExpectations=expectation.hasFailedExpectationsFrom(calls);
if(failedExpectations.length>0){if(failedExpectations[0].call==null){throw ('The function "'+failedExpectations[0].expectation.name+'" was expected but did not get called!');
}else{if(failedExpectations[0].expectation.name==failedExpectations[0].call.name){throw ('The function "'+failedExpectations[0].expectation.name+'" was expected to be called with ('+Mimic.Util.Object.toString(failedExpectations[0].expectation.value)+") but was called with ("+Mimic.Util.Object.toString(failedExpectations[0].call.value)+")");
}}}}};
