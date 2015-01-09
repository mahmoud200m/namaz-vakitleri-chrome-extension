var currentDate = new Date();

$(document).ready(function(){
	var times=["fajr", "sunrise", "zuhr", "asr", "maghrib", "isha"];
	for (var i = times.length - 1; i >= 0; i--) {
		var obj = $(".time[zone="+times[i]+"] a.notify");
		if (localStorage["notify_"+times[i]+"_state"] && localStorage["notify_"+times[i]+"_state"]=="on") {
			obj.addClass("on");
			obj.next().removeClass("hide");
		} else {
			obj.removeClass("on");
			obj.next().addClass("hide");
		}
		$(".vacC",obj.next()).text(localStorage["notify_"+times[i]+"_minute"]?localStorage["notify_"+times[i]+"_minute"]:"0");
	};

	prepare();
	
	setInterval(function() {
		var selected;
        if (localStorage['currentTimeZone']=="fajr"){
			selected=0;
        }
        if (localStorage['currentTimeZone']=="sunrise"){
           selected=1;
        }
        if (localStorage['currentTimeZone']=="zuhr"){
            selected=2;
        }
        if (localStorage['currentTimeZone']=="asr"){
            selected=3;
        }
        if (localStorage['currentTimeZone']=="maghrib"){
            selected=4;
        }
        if (localStorage['currentTimeZone']=="isha"){
            selected=5;
        }
        $(".time .third").removeClass("selected");
        $(".time:eq("+selected+") .third").addClass("selected");
	}, 100);

	$('#location a').each(function() {
		var el = $(this);
		var resourceText = getOptionsPageUrl();
		el.attr({"href":resourceText});
		$(this).click(function(){
			openOptionsTab(true);
			return false;
		});
	});
	$('#date #prev,#date #next,#header a').click(function() {
		$("#github").stop(true, true).fadeOut(150);
		$("#container > .loader").stop(true, true).fadeIn(150);

		var sad=0;

		if ($(this).attr('id')) {
			sad=($(this).attr('id')=="prev"?(-1):1);
			currentDate.setDate(currentDate.getDate()+sad);
		} else {
			currentDate=new Date();
		}

		showTimes(currentDate, false, function(isTimeFound){
			if (isTimeFound) {} else {
				if (sad!=0) {
					currentDate.setDate(currentDate.getDate()+(sad*(-1)));
				}

				alert(chrome.i18n.getMessage("prayer_time_error"));
				
				$(".loader").stop(true, true).fadeOut(150);
                $("#github").stop(true, true).fadeIn(150);
				
                $("#quote > .loader").stop(true, true).fadeOut(150, function(){
					quote(currentDate, function(){});
				});
			}
		});
	});
	$('a.notify').click(function() {
		if ($(this).hasClass("on")) {
			localStorage["notify_"+$(this).parent().parent().attr("zone")+"_state"]="off";
			$(this).removeClass("on");
			$(this).next().addClass("hide");
		} else {
			localStorage["notify_"+$(this).parent().parent().attr("zone")+"_state"]="on";
			$(this).addClass("on");
			$(this).next().removeClass("hide");
		}
		localStorage["notify_"+$(this).parent().parent().attr("zone")+"_ok"]="";
		localStorage["notify_"+$(this).parent().parent().attr("zone")+"_minute"]=$(".vacC",this.next()).attr("data");
		return false;
	});
	$('a.notify + .pieContainer').click(function() {
		$(".vacC", this).attr({"data":$(".vacC", this).text()});
		localStorage["notify_"+$(this).parent().parent().attr("zone")+"_minute"]=$(".vacC",this).attr("data");
		localStorage["notify_"+$(this).parent().parent().attr("zone")+"_ok"]="";
	});
	if (localStorage['ready'] && localStorage['ready']=="true") {
		showTimes(currentDate, true, function(isTimeFound){
			if (isTimeFound) {
			     if (localStorage['version']!=chrome.app.getDetails().version && chrome.i18n.getMessage("version_update_text")!=""){
			     	$("#container > .loader .info .info_data").html(chrome.i18n.getMessage("version_update_text"));
			     	$("#container > .loader .bubblingG").hide();
			     	$("#container > .loader .info").show();
                    
                    $("#github").stop(true, true).fadeOut(150);
					$("#container > .loader").stop(true, true).fadeIn(150);
					
                    $("#container > .loader .info .info_ok").click(function(){
						$("#container > .loader").stop(true, true).fadeOut(150);
				     	$("#container > .loader .bubblingG").show();
				     	$("#container > .loader .info").hide();
                        $("#github").stop(true, true).fadeIn(150);
                        
						localStorage['version']=chrome.app.getDetails().version;
				     	quote(currentDate, function(){});
					});
			     } else {
				    $("#container > .loader .info").hide();
                    $("#github").stop(true, true).fadeIn(150);
                     
			     	localStorage['version']=chrome.app.getDetails().version;
			     	quote(currentDate, function(){});
			     }
			} else {
				var call_ = arguments.callee;
				setTimeout(function() {
				    showTimes(currentDate, true, call_);
				}, 2000)
			}
		});
	} else {
		openOptionsTab(true);
	}
});

function showTimes(date_, isStartup, callback) {
	$("#quote > .loader").stop(true, true).fadeOut(150, function(){
		var hijri = kuwaiticalendar(currentDate, null);

		var hijri_day = hijri[5];
		var hijri_year = hijri[7];
		var hijri_month = chrome.i18n.getMessage("hijri_"+hijri[6]);

		var date = date_.format('dd MM yyyy hh mm ss').split(" ");
		var dayName = chrome.i18n.getMessage("d_"+((currentDate.getDay()+1)+"").pad(2, "0"));
		var monthName = chrome.i18n.getMessage("m_"+(date[1]+"").pad(2, "0"));

		var day = getTimesOfDay(date_);

		if (day!=null) {
            // chrome.i18n.getMessage("country_"+localStorage["country"])==""?
			var countryName=localStorage["country_desc"];
			var cityName=(localStorage["city_desc"]=="-Merkez-" || localStorage["city_desc"]=="-Center of the city-")?chrome.i18n.getMessage("city_center"):localStorage["city_desc"];

			$('#location a').text(countryName+"/"+(localStorage["province_desc"]==""?"":(localStorage["province_desc"]+"/"))+cityName);

			$("#date label:eq(0)").text(date[0] + " "+ monthName+ " "+date[2]);
			$("#date label:eq(1)").text("- "+ dayName+ " -");

			$(".time:eq(0) .third .vacC").text(day.fajr);
			$(".time:eq(1) .third .vacC").text(day.sunrise);
			$(".time:eq(2) .third .vacC").text(day.zuhr);
			$(".time:eq(3) .third .vacC").text(day.asr);
			$(".time:eq(4) .third .vacC").text(day.maghrib);
			$(".time:eq(5) .third .vacC").text(day.isha);

			$("#hijri_day").text(hijri_day);
			$("#hijri_year").text(hijri_year);
			$("#hijri_month").text(hijri_month);

			if (!isStartup) {
				quote(date_, function(){});
			}
            $("#github").stop(true, true).fadeIn(150);
			$("#container > .loader").stop(true, true).fadeOut(150);
		}

		callback(day!=null);
	});
}

function quote(date_, callback){
	$("#quote .quote").stop(true, true).fadeOut(150, function(){
		var date=date_.format('dd MM yyyy').split(" ");

		var times = new HashMap(JSON.parse(localStorage["times"]));
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
				console.log(day);
				if (day!=null) {
					if (day.quote!=null && day.lang!=null && day.lang==chrome.i18n.getMessage("lang")) {
						$("#quote .quote").text(day.quote);
						isQuoteFound=true;
					}
				}
			}
		}

		$("#quote > .loader").stop(true, true).fadeIn(150, function(){
			if (isQuoteFound) {
				$("#quote > .loader").stop(true, true).fadeOut(150, function(){
					$("#quote .quote").stop(true, true).fadeIn(150);
				});
			} else {
				getQuote(date[0],date[1],date[2],function(quote,isError){
					if(!isError) {
						$("#quote .quote").text(quote);

						day.quote=quote;
						day.lang=chrome.i18n.getMessage("lang")
						month.put(date[0], day);
						year.put(date[1], month);
						times.put(date[2], year);
						
						localStorage["times"]=JSON.stringify(times);
						
						$("#quote > .loader").stop(true, true).fadeOut(150, function(){
							$("#quote .quote").stop(true, true).fadeIn(150);
						});
					} else {
						var call_ = arguments.callee;
						setTimeout(function() {
						    getQuote(date[0],date[1],date[2],call_);
						}, 2000)
					}
				});
			}
		});
	});
}
