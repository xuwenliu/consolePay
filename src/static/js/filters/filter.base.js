/**
 *
 */
var sysFilter = angular.module("sysFilter",[]);

sysFilter.filter('monitorWords',function(){
    return function(input){
        if(input){
            return input.length;
        }
        else return 0;
    };
})

.filter("wordLimit",function(){
    return function (word){
        return word.slice(0,5);
    };
})

.filter("removeNull",function(){
    return function(params){
        if(params === null){
            return "";
        }
        else
        return params+"-";
    };
})

.filter("gender",function(){
    return function(params){
        switch (params) {
            case 0:
                return "保密";
            case 1:
                return "男";
            case 2:
                return "女";
        }
    };
})
/*银行卡号每4位一个空格 eg:6227 0038 1370 0220 490*/
.filter("space4",function(){
	return function(str){
		if(str===""||str===undefined){
			return false;
		}else {
			return str.replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
		}
	}
})
/*保留两位小数 
 * eg:	0.0099*100=0.9900000000000001
 * 		Math.round(str*10000)/100;
 * 		1--->1.00
 * */
.filter("point2",function(){
	return function(str){
		var f = parseFloat(str);
		if (isNaN(f)) { 
	        return ""; 
	   	}
		var f = Math.round(str*10000)/100;
		var s = f.toString();
		var rs = s.indexOf('.'); 
      	if (rs < 0) { 
        	rs = s.length; 
        	s += '.'; 
      	} 
      	while (s.length <= rs + 2) { 
        	s += '0'; 
      	} 
      	return s; 
	}
})
