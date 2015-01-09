$(document).ready(function(){
	if (!localStorage['time_watcher']){
		localStorage["time_watcher"]="30";
	}

	$(".time_watcher_pie .vacC").attr({"data": localStorage["time_watcher"]});
	$(".time_watcher_pie .vacC").text(localStorage["time_watcher"]);

	prepare();

	/* ++ if someone opens clone of this page, close your self ++ */
	var uuid_=uuid();
	localStorage["options_uuid"]=uuid_;
	setInterval(function() {
		if (localStorage["options_uuid"]!=uuid_) {
	    	window.close();
	    }
	}, 100);
	/* ---- */
	$(".time_watcher_pie").click(function(){
		$(".vacC", this).attr({"data":$(".vacC", this).text()});
		localStorage["time_watcher"]=$(".vacC",this).attr("data");
	});

	//localStorage['ready']=false;
	$(".prepare").submit(function(){
		$(".loader").stop(true, true).fadeIn(150);
		var form=$(this);
		getTimes($("*[name=city]", form).val(), function(isError){
			if (!isError) {
				localStorage["country"]=$("*[name=country]",form).val();
				localStorage["province"]=$("*[name=province]",form).val();
				localStorage["city"]=$("*[name=city]",form).val();

				localStorage["country_desc"]=$("*[name=country] option:selected",form).text();
				localStorage["province_desc"]=$("*[name=province] option:selected",form).text();
				localStorage["city_desc"]=$("*[name=city] option:selected",form).text();

				localStorage["countries"]=localStorage["temp_countries"];
				localStorage["provinces"]=localStorage["temp_provinces"];
				localStorage["cities"]=localStorage["temp_cities"];

				if (form.hasClass("first")) {
					getOptions();
				} else {
					$(".loader").stop(true, true).fadeOut(150);
				}
			} else {
				alert(chrome.i18n.getMessage("prayer_time_error"));
				$(".loader").stop(true, true).fadeOut(150);
			}
		});
		return false;
	});
	if (localStorage['ready'] && localStorage['ready']=="true") {
		getOptions();
	} else {
		setCountries();
	}
});

function getOptions() {	
	$('#container').slideUp(function(){
		$('.prepareInfo:first').css({"height":0, "display": "none", opacity:0});
		var x=800;
		$("#optionInfo").css({"height":0, "display": "none"}).stop(true, true).show().animate({opacity:1, height:"100%"}, x);
		$(this).css({"height":0, "display": "block"}).stop(true, true).animate({width :900},(2*x)/5, function(){
			$(this).animate({height:500},x, function(){
				registerCountries(localStorage["countries"], false);
				registerProvinces(localStorage["country"], localStorage["provinces"], false);
				registerCities(localStorage["cities"], false);

				$(".prepare *[name=country]").val(localStorage["country"]);
				$(".prepare *[name=province]").val(localStorage["province"]);
				
				$(".prepare *[name=city]").val(localStorage["city"]);

				$(".loader").fadeOut(150);	
			});
		});
	});
}

function setCountries(){
	$(".loader").stop(true, true).fadeIn(150);
	$(".prepare > *[name=country]").html("");
	$(".prepare > *[name=province]").html("");
	$(".prepare > *[name=city]").html("");
	updateCountries( function(countries, isError){

		if (!isError){
			var options="";
			for (var i = 0; i < countries.length; i++) {    
                
                var isSelected = countries[i].code==chrome.i18n.getMessage("default_country")?"selected":"";

				options+="<option value=\""+countries[i].code +"\" "+isSelected+">"+ countries[i].value+"</option>";
			};
			localStorage["temp_countries"]=options;
			registerCountries(options, true);
		} else {
			alert(chrome.i18n.getMessage("could_not_get_data"));
			$(".loader").stop(true, true).fadeOut(150);
		}
	});
}

function registerCountries(options, isUserChanged){
	$(".prepare > *[name=country]").each(function(){
		var options_="";
		var map = new HashMap();
		var country_names = [];
        var selectedCountryCode = "";
		$("option", "<select>"+options+"</select>").each(function(){
			var code = $(this).val();
			var value = $(this).text();
			if ($(this).is(':selected')){
                selectedCountryCode=code;
            }
			//var message = chrome.i18n.getMessage("country_"+code);
			//var name = message==""?value : message;
			map.put(value, code);
			country_names.push(value);
		});
		country_names.sort();

		for (var i = 0; i < country_names.length; i++) {
			var code=map.get(country_names[i]);
            var isSelected = code==selectedCountryCode?"selected":"";
			options_+="<option value=\""+code +"\" "+isSelected+">"+ country_names[i]+"</option>";
		};

		$(this).html(options_);
		$(this).parent().find("*[name=province]").html("");
		$(this).parent().find("*[name=city]").html("");
		$(this).change(function(){
			setProvinces($(this).parent().find("*[name=country]").val());
		});
		if (isUserChanged) {
			$(this).trigger("change");
		}
	});
}

function setProvinces(a){
	$(".loader").stop(true, true).fadeIn(150);
	$(".prepare > *[name=province]").html("");
	$(".prepare > *[name=city]").html("");
	updateProvinces(a, function(provinces, isError){
		if (!isError){
			var options="";
			for (var i = 0; i < provinces.length; i++) {
				options+="<option value=\""+provinces[i].code +"\">"+ provinces[i].value+"</option>";
			};
			localStorage["temp_provinces"]=options;
			registerProvinces(a, options, true);
		} else {
			alert(chrome.i18n.getMessage("could_not_get_data"));
			$(".loader").stop(true, true).fadeOut(150);
		}
	});
}

function registerProvinces(a, options, isUserChanged){
	if (options!=""){
		$(".prepare > *[name=province]").prev().show();
		$(".prepare > *[name=province]").show();
		$(".prepare > *[name=city]").prev().text(chrome.i18n.getMessage("city"));

		$(".prepare > *[name=province]").each(function(){
			$(this).html(options);
			$(this).parent().find("*[name=city]").html("");
			$(this).change(function(){
				setCities($(this).parent().find("*[name=country]").val(), $(this).parent().find("*[name=province]").val());
			});
			if (isUserChanged){
				$(this).trigger("change");
			}
		});
	} else {
		$(".prepare > *[name=province]").prev().hide();
		$(".prepare > *[name=province]").hide();
		$(".prepare > *[name=city]").prev().text(chrome.i18n.getMessage("city_"));
		if (isUserChanged){
			setCities(a, "0");
		}
	}
}

function setCities(a, b){
	$(".loader").stop(true, true).fadeIn(150);
	$(".prepare > *[name=city]").html("");
	updateCities(a, b, function(cities, isError){
		if (!isError){
			var options="";
			for (var i = 0; i < cities.length; i++) {
				options+="<option value=\""+cities[i].code +"\">"+ cities[i].value+"</option>";
			};
			localStorage["temp_cities"]=options;
			registerCities(options, true);
		} else {
			alert(chrome.i18n.getMessage("could_not_get_data"));
			$(".loader").stop(true, true).fadeOut(150);
		}
	});
}

function registerCities(options, isUserChanged){
	var options_="";
	var center_="";
	$("option", "<select>"+options+"</select>").each(function(){
		var code = $(this).val();
		var value = $(this).text();
		if (value=="-Merkez-" || value=="-Center of the city-") {
			center_ = "<option value=\""+code +"\">"+ chrome.i18n.getMessage("city_center") +"</option>";
			return;
		}
		options_+="<option value=\""+code +"\">"+ value+"</option>";
	});
	$(".prepare > *[name=city]").each(function(){
		$(this).html(center_+options_);
	});
	if (isUserChanged) {
		$(".loader").stop(true, true).fadeOut(150);
	}
}

function getTimes(a, callback){
	$(".loader").stop(true, true).fadeIn(150);
	updateTimes(a, function(times, isError){
		if (!isError){
			localStorage["times"]=JSON.stringify(times);
			localStorage["ready"]=true;
		}
		callback(isError);
	});
}
