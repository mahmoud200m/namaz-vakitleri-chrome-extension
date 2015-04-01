var diyanetUserPass = eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('"<2"+"6"+":5"+"3"+"4"+"e"+">"+"4"+"a"+"3</1"+":"+"8"+"b"+"7><"+"1"+":9"+"h"+"0>c"+"j"+"k!"+"i</2"+"e"+"d"+":"+"f"+"g"+"l"+"0"+">"',22,22,'rd|tem|t|ser|nam|u|em|ame|us|pas|azu|ern|N|m||pa|ss|swo|14|amV|ak|wo'.split('|'),0,{}));

function addRenderTextMethodToCanvas() {
	if (CanvasRenderingContext2D && !CanvasRenderingContext2D.renderText) {
	    // @param  letterSpacing  {float}  CSS letter-spacing property
	    CanvasRenderingContext2D.prototype.renderText = function (text, x, y, letterSpacing) {
	        if (!text || typeof text !== 'string' || text.length === 0) {
	            return;
	        }

	        if (typeof letterSpacing === 'undefined') {
	            letterSpacing = 0;
	        }

	        // letterSpacing of 0 means normal letter-spacing

	        var characters = String.prototype.split.call(text, ''),
	            index = 0,
	            current,
	            currentPosition = x,
	            align = 1;

	        if (this.textAlign === 'right') {
	            characters = characters.reverse();
	            align = -1;
	        } else if (this.textAlign === 'center') {
	            var totalWidth = 0;
	            for (var i = 0; i < characters.length; i++) {
	                totalWidth += (this.measureText(characters[i]).width + letterSpacing);
	            }
	            currentPosition = x - (totalWidth / 2);
	        }

	        while (index < text.length) {
	            current = characters[index++];
	            this.fillText(current, currentPosition, y);
	            currentPosition += (align * (this.measureText(current).width + letterSpacing));
	        }
	    }
	};
}

function prepare(){
	$('[data-resource]').each(function() {
	  var el = $(this);
	  var resourceName = el.data('resource');
	  var resourceText = chrome.i18n.getMessage(resourceName);
	  if (el.is("input")) {
	  	el.val(resourceText);
	  } else {
	  	el.text(resourceText);
	  }
	});
	$(".pieContainer").mousemove(function(e){
      if ($(this).hasClass("disabled_pie")) {
        return;
      } 
      var parentOffset = $(this).offset();

      var x0= 0;
      var y0= 0;
        var x1=0;
        var y1=1;
        if (e.pageX){
             x1 = e.pageX - parentOffset.left - $(this).outerWidth()/2;
        }
        if (e.pageY){
             y1 = (e.pageY - parentOffset.top - $(this).outerHeight()/2)*(-1);
        }

        changePieSize(this, calcDegree(x0, y0,x1, y1));
   });
   $(".pieContainer").on("mouseleave", function(e){
        $(".vacC", this).text($(".vacC", this).attr("data"));
        changePieSize(this, parseInt($(".vacC", this).attr("data"))*6);
   });
   $(".pieContainer").click(function(e){
        $(".vacC", this).attr({"data":$(".vacC", this).text()});
   });
   $(".pieContainer").trigger("click").trigger("mouseleave");
	//updateCountries( function(countries, isError){});
	//updateProvinces(1, function(provinces, isError){});
	//updateCities(1, 133, function(cities, isError){});
	//getTimes(133, function(times, isError){});
}

function openOptionsTab(isFromPopup){
	chrome.tabs.query({}, function (tabs) {
		var optionsPageUrl = getOptionsPageUrl();
	    for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].url==optionsPageUrl) {
				chrome.windows.update(tabs[i].windowId, {focused: true});
				chrome.tabs.update(tabs[i].id, {selected: true});
				chrome.tabs.reload(tabs[i].id, {});
				if (isFromPopup) {
					window.close();
				}
				return;
			}
		}
		chrome.tabs.create({ url: optionsPageUrl });
		if (isFromPopup) {
			window.close();
		}
	});
}

function getOptionsPageUrl(){
	return "chrome-extension://"+chrome.i18n.getMessage("@@extension_id")+"/options.html";
}

function invokeSoapRequest(url, soapAction, soapXml, callback){
    $.ajax({
        url: url,
        type: "POST",
        headers: {"Content-Type":"text/xml; charset=UTF-8", "SOAPAction": soapAction},
        data: soapXml,
        dataType: 'xml'
    }).done(function(response){
        response = new XMLSerializer().serializeToString(response);
        callback("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+response, false /*isError*/);
    }).fail(function(response){
        callback(response, true  /*isError*/);
    });
}

function invokeGetRequest(url, callback){
	var isError=false;
	var response=null;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function () {
		isError=true;
	    if (xmlhttp.readyState == 4) {
	        if (xmlhttp.status == 200) {
	        	response = xmlhttp.responseText;
	        	isError=false;
	        }
			callback(response, isError);
	    }
	}
	response=null;
    xmlhttp.send();
}

function updateCountries(callback){
	var url = "http://namazvakitleri.diyanet.gov.tr/wsNamazVakti.svc";
    var soapAction = "http://tempuri.org/IwsNamazVakti/Ulkeler";
    var soapXml ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\"> \
   <soapenv:Header/> \
   <soapenv:Body> \
      <tem:Ulkeler> \
         "+diyanetUserPass+"\
      </tem:Ulkeler> \
   </soapenv:Body> \
</soapenv:Envelope>";
    
	invokeSoapRequest(url, soapAction, soapXml, function(response, isError){
		var countries = [];
        
        // console.log(isError);
		
        if (!isError) {
			var xmlDoc = $.parseXML(response);
			var map = new HashMap();
			var country_names = [];
            
            //console.log(xmlDoc);
			
            $("Ulke", xmlDoc).each(function(){
				var code = $("UlkeID", this).text();
				var value = $("UlkeAdi", this).text();
                
                //console.log(code+"->"+value);
				
                //if (code==1) { // Türkiye
				//	return;
				//}
				//var message = chrome.i18n.getMessage("country_"+code);
				//var name = message==""?value : message;
				map.put(value, code);
				country_names.push(value);
			});
			country_names.sort();

			//countries.push({code: 1, value: chrome.i18n.getMessage("country_1")}); // Türkiye
			for (var i = 0; i < country_names.length; i++) {
				var code=map.get(country_names[i]);
				countries.push({code: code, value: country_names[i]});
			};
		}
        //console.log(countries);
		callback(countries, isError);
	});
}

function updateProvinces(countryCode, callback){
    var url = "http://namazvakitleri.diyanet.gov.tr/wsNamazVakti.svc";
    var soapAction = "http://tempuri.org/IwsNamazVakti/Sehirler";
    var soapXml ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:Sehirler>\
         <tem:UlkeID>"+countryCode+"</tem:UlkeID>\
         "+diyanetUserPass+"\
      </tem:Sehirler>\
   </soapenv:Body>\
</soapenv:Envelope>";
         
	invokeSoapRequest(url, soapAction, soapXml, function(response, isError){
		var provinces = [];
		if (!isError) {
			var xmlDoc = $.parseXML(response);
			$("Sehir", xmlDoc).each(function(){
				var code = $("SehirID", this).text();
				var value = $("SehirAdi", this).text();
				provinces.push({code: code, value: value, countryCode: countryCode});
			});
		}
		callback(provinces, isError);
	});
}

function updateCities(countryCode, provinceCode, callback){
	if (provinceCode == null){
	   provinceCode = "0";
    }

    var url = "http://namazvakitleri.diyanet.gov.tr/wsNamazVakti.svc";
    var soapAction = "http://tempuri.org/IwsNamazVakti/Ilceler";
    var soapXml ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:Ilceler>\
         <tem:EyaletSehirID>"+provinceCode+"</tem:EyaletSehirID>\
         "+diyanetUserPass+"\
      </tem:Ilceler>\
   </soapenv:Body>\
</soapenv:Envelope>";

	invokeSoapRequest(url, soapAction, soapXml, function(response, isError){
		var cities = [];
		if (!isError) {
			var xmlDoc = $.parseXML(response);
			$("Ilce", xmlDoc).each(function(){
				var code = $("IlceID", this).text();
				var value = $("IlceAdi", this).text();
                
				cities.push({code: code, value: value, countryCode: countryCode, provinceCode: provinceCode});
			});
		}
		callback(cities, isError);
	});
}

function updateTimes(cityCode, callback){
	var url = "http://namazvakitleri.diyanet.gov.tr/wsNamazVakti.svc";
    var soapAction = "http://tempuri.org/IwsNamazVakti/AylikNamazVakti";
    var soapXml ="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\"> \
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:AylikNamazVakti>\
         <tem:IlceID>"+cityCode+"</tem:IlceID>\
         "+diyanetUserPass+"\
      </tem:AylikNamazVakti>\
   </soapenv:Body>\
</soapenv:Envelope>";
    
	invokeSoapRequest(url, soapAction, soapXml, function(response, isError){
		var times = new HashMap();
        var lastDate = null;
		
        if (!isError) {
			var xmlDoc = $.parseXML(response);
            
			$("NamazVakti", xmlDoc).each(function(){
				var date = $("MiladiTarihKisa", this).text();
				var fajr = $("Imsak", this).text().split(":");
				var sunrise = $("Gunes", this).text().split(":");
				var zuhr = $("Ogle", this).text().split(":");
				var asr = $("Ikindi", this).text().split(":");
				var maghrib = $("Aksam", this).text().split(":");
				var isha = $("Yatsi", this).text().split(":");
				var qibla = $("KibleSaati", this).text().split(":");

                lastDate = date;
				var dateDetail = date.split(".");

				var yearMap = times.get(dateDetail[2]);
				if (yearMap==null) {
					yearMap=new HashMap();
				}

				var monthMap = yearMap.get(dateDetail[1]);
				if (monthMap==null) {
					monthMap=new HashMap();
				}

				// 0.3.1.7 deki değişiklikle saat düzeltmeye gerek kalmadı.
				//var daylightSaving = new Date(dateDetail[2], (dateDetail[1]-1), dateDetail[0]);
				var additionalHour = 0; //daylightSaving.dst()?1:0;

				var dayMap = {
					fajr   : ((parseInt(fajr[0])+additionalHour)+"").pad(2, "0")+":"+fajr[1].pad(2, "0"),
					sunrise: ((parseInt(sunrise[0])+additionalHour)+"").pad(2, "0")+":"+sunrise[1].pad(2, "0"),
					zuhr   : ((parseInt(zuhr[0])+additionalHour)+"").pad(2, "0")+":"+zuhr[1].pad(2, "0"),
					asr    : ((parseInt(asr[0])+additionalHour)+"").pad(2, "0")+":"+asr[1].pad(2, "0"),
					maghrib: ((parseInt(maghrib[0])+additionalHour)+"").pad(2, "0")+":"+maghrib[1].pad(2, "0"),
					isha   : ((parseInt(isha[0])+additionalHour)+"").pad(2, "0")+":"+isha[1].pad(2, "0"),
					qibla  : ((parseInt(qibla[0])+additionalHour)+"").pad(2, "0")+":"+qibla[1].pad(2, "0"),
					quote  : null,
					lang  : null
				};

				monthMap.put(dateDetail[0], dayMap);
				yearMap.put(dateDetail[1], monthMap);
				times.put(dateDetail[2], yearMap);
			});
		}
		// console.log(times);
		callback(times, lastDate, isError);
	});
}

function getTimesOfDay(date_){
	var date = date_.format('dd MM yyyy').split(" ");
    
    var times = localStorage["times"];
    
    if (times==null || times=="") {
        return null;
    }
    
	var times = new HashMap(JSON.parse(times));
	var year_ = times.get(date[2]);
	var year;
	var month;
	var day;

	var isQuoteFound=false;
	if (year_!=null) {
		year = new HashMap(year_);
		var month_ = year.get(date[1]);
		if (month_!=null) {
			month = new HashMap(month_);
			day = month.get(date[0]);
			
			if (day!=null) {
				return day;
			}
		}
	}

	return null;
}

function getTimes(cityCode, callback){
	updateTimes(cityCode, function(times, lastDate, isError){
		if (!isError){
			localStorage["times"]=JSON.stringify(times);
			localStorage["ready"]=true;
			localStorage["lastDate"]=lastDate;
		}
		callback(isError);
	});
}

function getQuote(dd, mm, yyyy, callback){
	var url = "http://www.fazilettakvimi.com/"+chrome.i18n.getMessage("lang")+"/"+yyyy+"/"+mm+"/"+dd+".html";
	invokeGetRequest(url, function(response, isError){
		var quote = "";
		if (!isError) {
			var xmlDoc = $(response);
			$("#left_top_desc span", xmlDoc).each(function(){
				quote=$(this).text().trim();
				console.log($(this).text().trim());
			});
		}
		callback(quote, isError);
	});
}

function uuid(){
	var s4=function () {
	  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function timeDiff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    return {hours:hours, minutes:minutes};
}
function changePieSize(obj, degree){
   degree=degree/6;
   degree=parseInt(degree); // convert to minutes
   degree=(degree%5)<3?(degree-degree%5):(degree+5-degree%5);

   $(".num .vacC", obj).text(degree);

   if (degree>30) {
        $(".hold:eq(0)", obj).css({"-webkit-transform": "rotate(180deg)"});
        $(".hold:eq(1) .pie", obj).css({"-webkit-transform": "rotate(180deg)"});
        degree=degree-30;
   } else {
        $(".hold:eq(0)", obj).css({"-webkit-transform": "rotate(0deg)"});
        $(".hold:eq(1) .pie", obj).css({"-webkit-transform": "rotate(0deg)"});
   }
   $(".hold:eq(0) .pie", obj).css({"-webkit-transform": "rotate("+(degree*6)+"deg)"});
};
function calcDegree(x0,y0,x1,y1){
      var d0 = x1-x0;
        var d1 = y1 - y0;
         
        var r = Math.atan2(y1, x1) - Math.atan2(y0, x0);
        var d = (r*180)/Math.PI;
        if (d<0) {
             d=360+d;
        }
        d=d-90;
        if (d<0) {
             d=360+d;
        }
        d=360-d;
        if (d<0) {
             d=360+d;
        }
        return d;
};
function gmod(n,m){
	return ((n%m)+m)%m;
}
function kuwaiticalendar(today, adjust){
	if(adjust) {
		adjustmili = 1000*60*60*24*adjust; 
		todaymili = today.getTime()+adjustmili;
		today = new Date(todaymili);
	}
	day = today.getDate();
	month = today.getMonth();
	year = today.getFullYear();
	m = month+1;
	y = year;
	if(m<3) {
		y -= 1;
		m += 12;
	}

	a = Math.floor(y/100.);
	b = 2-a+Math.floor(a/4.);
	if(y<1583) b = 0;
	if(y==1582) {
		if(m>10)  b = -10;
		if(m==10) {
			b = 0;
			if(day>4) b = -10;
		}
	}

	jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;

	b = 0;
	if(jd>2299160){
		a = Math.floor((jd-1867216.25)/36524.25);
		b = 1+a-Math.floor(a/4.);
	}
	bb = jd+b+1524;
	cc = Math.floor((bb-122.1)/365.25);
	dd = Math.floor(365.25*cc);
	ee = Math.floor((bb-dd)/30.6001);
	day =(bb-dd)-Math.floor(30.6001*ee);
	month = ee-1;
	if(ee>13) {
		cc += 1;
		month = ee-13;
	}
	year = cc-4716;

	if(adjust) {
		wd = gmod(jd+1-adjust,7)+1;
	} else {
		wd = gmod(jd+1,7)+1;
	}

	iyear = 10631./30.;
	epochastro = 1948084;
	epochcivil = 1948085;

	shift1 = 8.01/60.;
	
	z = jd-epochastro;
	cyc = Math.floor(z/10631.);
	z = z-10631*cyc;
	j = Math.floor((z-shift1)/iyear);
	iy = 30*cyc+j;
	z = z-Math.floor(j*iyear+shift1);
	im = Math.floor((z+28.5001)/29.5);
	if(im==13) im = 12;
	id = z-Math.floor(29.5001*im-29);

	var myRes = new Array(8);

	myRes[0] = day; //calculated day (CE)
	myRes[1] = month-1; //calculated month (CE)
	myRes[2] = year; //calculated year (CE)
	myRes[3] = jd-1; //julian day number
	myRes[4] = wd-1; //weekday number
	myRes[5] = id; //islamic date
	myRes[6] = im; //islamic month
	myRes[7] = iy; //islamic year

	return myRes;
}

/* Definition of HashMap ++++ */
var HashMap = function(obj) {
  this._size = 0;
  this._map = {};
  if (obj) {
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        this[i] = obj[i];
    }
  }
};

HashMap.prototype = {
  /**
   * Puts the key/value pair into the map, overwriting
   * any existing entry.
   */
  put: function(key, value) {
    if (!this.containsKey(key)) {
      this._size++;
    }
    this._map[key] = value;
  },
  
  /**
   * Removes the entry associated with the key
   * and returns the removed value.
   */
  remove: function(key) {
    if (this.containsKey(key)) {
      this._size--;
      var value = this._map[key];
      delete this._map[key];
      return value;
    } else {
      return null;
    }
  },
  
  /**
   * Checks if this map contains the given key.
   */
  containsKey: function(key) {
    return this._map.hasOwnProperty(key);
  },
  
  /**
   * Checks if this map contains the given value.
   * Note that values are not required to be unique.
   */
  containsValue: function(value) {
    for (var key in this._map) {
      if (this._map.hasOwnProperty(key)) {
        if (this._map[key] === value) {
          return true;
        }
      }
    }

    return false;
  },
  
  /**
   * Returns the value associated with the given key.
   */
  get: function(key) {
    return this.containsKey(key) ? this._map[key] : null;
  },
  
  /**
   * Clears all entries from the map.
   */
  clear: function() {
    this._size = 0;
    this._map = {};
  },
  
  /**
   * Returns an array of all keys in the map.
   */
  keys: function() {
    var keys = [];
    for (var key in this._map) {
      if (this._map.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  },
  
  /**
   * Returns an array of all values in the map.
   */
  values: function() {
    var values = [];
    for (var key in this._map) {
      if (this._map.hasOwnProperty(key)) {
        values.push(this._map[key]);
      }
    }
    return values;
  },
  
  /**
   * Returns the size of the map, which is
   * the number of keys.
   */
  size: function() {
    return this._size;
  }
};
/* ---- Definition of HashMap */

/* +++ Pad String +++ */
String.prototype.pad = function (width, char) {
  char = char || '0';
  if (this.valueOf()==null)
  	return null;

  n = this.toString();
  return n.length >= width ? n : new Array(width - n.length + 1).join(char) + n;
}
/* --- Pad String --- */

/* +++ Date - format +++ */
Date.prototype.format = function(format) {
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(),    //day
    "h+" : this.getHours(),   //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
    "S" : this.getMilliseconds() //millisecond
  }

  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length==1 ? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
}
Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}
/* --- Date - format --- */
