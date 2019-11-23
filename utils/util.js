function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}
function getJson(url){
	var arr = url.split('?')[1].split('&')
	var theRequest = new Object();
	for (var i = 0; i < arr.length; i++) {
		var kye = arr[i].split("=")[0]
		var value = arr[i].split("=")[1]
		// 给对象赋值
		theRequest[kye] = value
	}
	return theRequest;
}
function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		// return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
		// 	_format(date.getHours()) + ':' + _format(date.getMinutes());
		return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDay());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		// var a = str;
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
/* 判断元素是否在数组内 */ 
function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
};

/* 计算字符串长度 */
function strlen (str){
    var realLength = 0, len = str.length, charCode = -1;
    for(var i = 0; i < len; i++){
        charCode = str.charCodeAt(i);
        if(charCode >= 0 && charCode <= 128)
            realLength += 1;
        else
            realLength += 2;
    }
    return realLength;
}
function showToast(title, duration = 1000) {  
	if(title){
		var msgleg = strlen(title)
		if(msgleg > 12){
		  uni.showToast({
			title: title,
			icon:'none',
			duration:duration
		  });										
		}else{
		  uni.showToast({
			title: title,
			duration:duration
		  });				
		}		
	}

};

function errorToast(title, duration = 1000) {  

	if(title){
		var msgleg = strlen(title)
		if(msgleg > 12){
		  uni.showToast({
			title: title,
			icon:'none',
			duration:duration
		  });										
		}else{
		  uni.showToast({
			title: title,
			duration:duration,
			image:'/static/img/error.png'
		  });				
		}		
	}	

};

module.exports = {
	getJson:getJson,
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	contains:contains,
	showToast:showToast,
	errorToast:errorToast,
	strlen:strlen
}
