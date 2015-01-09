/**
  head.load.min.js ++++++++++++++++++++++++++++++++
*/
(function(f,w){function m(){}function g(a,b){if(a){"object"===typeof a&&(a=[].slice.call(a));for(var c=0,d=a.length;c<d;c++)b.call(a,a[c],c)}}function v(a,b){var c=Object.prototype.toString.call(b).slice(8,-1);return b!==w&&null!==b&&c===a}function k(a){return v("Function",a)}function h(a){a=a||m;a._done||(a(),a._done=1)}function n(a){var b={};if("object"===typeof a)for(var c in a)a[c]&&(b={name:c,url:a[c]});else b=a.split("/"),b=b[b.length-1],c=b.indexOf("?"),b={name:-1!==c?b.substring(0,c):b,url:a};return(a=p[b.name])&&a.url===b.url?a:p[b.name]=b}function q(a){var a=a||p,b;for(b in a)if(a.hasOwnProperty(b)&&a[b].state!==r)return!1;return!0}function s(a,b){b=b||m;a.state===r?b():a.state===x?d.ready(a.name,b):a.state===y?a.onpreload.push(function(){s(a,b)}):(a.state=x,z(a,function(){a.state=r;b();g(l[a.name],function(a){h(a)});j&&q()&&g(l.ALL,function(a){h(a)})}))}function z(a,b){var b=b||m,c;/\.css[^\.]*$/.test(a.url)?(c=e.createElement("link"),c.type="text/"+(a.type||"css"),c.rel="stylesheet",c.href=a.url):(c=e.createElement("script"),c.type="text/"+(a.type||"javascript"),c.src=a.url);c.onload=c.onreadystatechange=function(a){a=a||f.event;if("load"===a.type||/loaded|complete/.test(c.readyState)&&(!e.documentMode||9>e.documentMode))c.onload=c.onreadystatechange=c.onerror=null,b()};c.onerror=function(){c.onload=c.onreadystatechange=c.onerror=null;b()};c.async=!1;c.defer=!1;var d=e.head||e.getElementsByTagName("head")[0];d.insertBefore(c,d.lastChild)}function i(){e.body?j||(j=!0,g(A,function(a){h(a)})):(f.clearTimeout(d.readyTimeout),d.readyTimeout=f.setTimeout(i,50))}function t(){e.addEventListener?(e.removeEventListener("DOMContentLoaded",t,!1),i()):"complete"===e.readyState&&(e.detachEvent("onreadystatechange",t),i())}var e=f.document,A=[],B=[],l={},p={},E="async"in e.createElement("script")||"MozAppearance"in e.documentElement.style||f.opera,C,j,D=f.head_conf&&f.head_conf.head||"head",d=f[D]=f[D]||function(){d.ready.apply(null,arguments)},y=1,x=3,r=4;d.load=E?function(){var a=arguments,b=a[a.length-1],c={};k(b)||(b=null);g(a,function(d,e){d!==b&&(d=n(d),c[d.name]=d,s(d,b&&e===a.length-2?function(){q(c)&&h(b)}:null))});return d}:function(){var a=arguments,b=[].slice.call(a,1),c=b[0];if(!C)return B.push(function(){d.load.apply(null,a)}),d;c?(g(b,function(a){if(!k(a)){var b=n(a);b.state===w&&(b.state=y,b.onpreload=[],z({url:b.url,type:"cache"},function(){b.state=2;g(b.onpreload,function(a){a.call()})}))}}),s(n(a[0]),k(c)?c:function(){d.load.apply(null,b)})):s(n(a[0]));return d};d.js=d.load;d.test=function(a,b,c,e){a="object"===typeof a?a:{test:a,success:b?v("Array",b)?b:[b]:!1,failure:c?v("Array",c)?c:[c]:!1,callback:e||m};(b=!!a.test)&&a.success?(a.success.push(a.callback),d.load.apply(null,a.success)):!b&&a.failure?(a.failure.push(a.callback),d.load.apply(null,a.failure)):e();return d};d.ready=function(a,b){if(a===e)return j?h(b):A.push(b),d;k(a)&&(b=a,a="ALL");if("string"!==typeof a||!k(b))return d;var c=p[a];if(c&&c.state===r||"ALL"===a&&q()&&j)return h(b),d;(c=l[a])?c.push(b):l[a]=[b];return d};d.ready(e,function(){q()&&g(l.ALL,function(a){h(a)});d.feature&&d.feature("domloaded",!0)});if("complete"===e.readyState)i();else if(e.addEventListener)e.addEventListener("DOMContentLoaded",t,!1),f.addEventListener("load",i,!1);else{e.attachEvent("onreadystatechange",t);f.attachEvent("onload",i);var u=!1;try{u=null==f.frameElement&&e.documentElement}catch(F){}u&&u.doScroll&&function b(){if(!j){try{u.doScroll("left")}catch(c){f.clearTimeout(d.readyTimeout);d.readyTimeout=f.setTimeout(b,50);return}i()}}()}setTimeout(function(){C=!0;g(B,function(b){b()})},300)})(window);
/* ---------------------------------------------- */

var img = new Image();

function drawIcon() {
    if (localStorage['ready'] && localStorage['ready']=="true") {
        var currentDate_ = new Date();
        var nextDate_ = new Date()
        nextDate_.setDate(nextDate_.getDate()+1);

        var currentTime = currentDate_.format('hh:mm');

        var day = getTimesOfDay(currentDate_);
        var nextDay = getTimesOfDay(nextDate_);
        
        if (day==null || nextDay==null) {
            chrome.browserAction.setBadgeText({
                text: "..."
            });
            
            getTimes(localStorage["city"], function(isError){
                if (!isError) {
                    setTimeout(function () { drawIcon() }, 0);
                } else {
                    setTimeout(function () { drawIcon() }, 500);
                }
            });
            
            return;
        }

        var prevTimeZone = localStorage['currentTimeZone'];
        var prevFollowTimeZone = localStorage['nextTimeZone'];

        var diff = null;
        for(i=0;i<1;i++){
            diff = timeDiff(currentTime, day.fajr);
            if (diff.hours>=0 && diff.minutes>0) {
                localStorage['currentTimeZone']="isha";
                localStorage['nextTimeZone']="fajr";
                break;
            }
            diff = timeDiff(currentTime, day.sunrise);
            if (diff.hours>=0 && diff.minutes>0) {
                localStorage['currentTimeZone']="fajr";
                localStorage['nextTimeZone']="sunrise";
               break;
            }
            diff = timeDiff(currentTime, day.zuhr);
            if (diff.hours>=0 && diff.minutes>0) {
                localStorage['currentTimeZone']="sunrise";
                localStorage['nextTimeZone']="zuhr";
               break;
            }
            diff = timeDiff(currentTime, day.asr);
            if (diff.hours>=0 && diff.minutes>0) {
                localStorage['currentTimeZone']="zuhr";
                localStorage['nextTimeZone']="asr";
               break;
            }
            diff = timeDiff(currentTime, day.maghrib);
            if (diff.hours>=0 && diff.minutes>0) {
                localStorage['currentTimeZone']="asr";
                localStorage['nextTimeZone']="maghrib";
               break;
            }
            diff = timeDiff(currentTime, day.isha);
            if (diff.hours>=0 && diff.minutes>0) {
                localStorage['currentTimeZone']="maghrib";
                localStorage['nextTimeZone']="isha";
               break;
            }
            if (nextDay!=null) {
                var nextFajr = nextDay.fajr.split(":");
                diff = timeDiff(currentTime, (((parseInt(nextFajr[0])+24)+"").pad(2, "0")+":"+nextFajr[1]));
            } else {
                diff = timeDiff(currentTime, "23:59");
            }
            localStorage['currentTimeZone']="isha";
            localStorage['nextTimeZone']="fajr";
        }

        var nextMinute = parseInt(localStorage["notify_"+localStorage['nextTimeZone']+"_minute"]);
        var minute = parseInt(localStorage["notify_"+localStorage['currentTimeZone']+"_minute"]);

        if (localStorage["notify_"+localStorage['currentTimeZone']+"_state"] && localStorage["notify_"+localStorage['currentTimeZone']+"_state"]=="on") {
            if (prevTimeZone && prevTimeZone!=localStorage['currentTimeZone']) {
                localStorage["notify_"+prevTimeZone+"_ok"]="";
                if (minute==0){ // Time changed
                    show("", "");
                    localStorage["notify_"+localStorage['currentTimeZone']+"_ok"]="ok";
                }
            }
        }

        if (localStorage["notify_"+localStorage['nextTimeZone']+"_state"]=="on" &&
            (!localStorage["notify_"+localStorage['nextTimeZone']+"_ok"] || localStorage["notify_"+localStorage['nextTimeZone']+"_ok"]=="") &&
            (diff.hours*60+diff.minutes)<=nextMinute){
            show("", "");
            localStorage["notify_"+localStorage['nextTimeZone']+"_ok"]="ok";
        }

        var element = document.createElement("canvas");

        element.width = 19;
        element.height = 19;
        var ctx = element.getContext("2d");

        ctx.drawImage(img, 0, 0);
        if (!localStorage['time_watcher']){
            localStorage["time_watcher"]="30";
        }
        if (diff.hours==0 && diff.minutes<=parseInt(localStorage["time_watcher"])) {
            chrome.browserAction.setBadgeBackgroundColor({ color: [225, 0, 0, 255] });
        } else {
            chrome.browserAction.setBadgeBackgroundColor({ color: [0, 100, 175, 255] });
        }

        var badgeText="";
        if (diff.hours>9) {
            ctx.beginPath();
            ctx.moveTo(0, 17);
            ctx.lineTo(0, 12);
            ctx.quadraticCurveTo(0, 10, 2, 10);
            ctx.lineTo(17, 10);
            ctx.quadraticCurveTo(19, 10, 19, 12);
            ctx.lineTo(19, 17);
            ctx.quadraticCurveTo(19, 19, 17, 19);
            ctx.lineTo(2, 19);
            ctx.quadraticCurveTo(0, 19, 0, 17);
            ctx.fillStyle = "yellow"; //"#f280a7";
            ctx.fill();
            ctx.strokeStyle = "#f0f0f0";
            ctx.stroke();

            ctx.lineWidth = 0.5;
            ctx.lineWidth = 0.5;
            ctx.fillStyle = "#000";
            ctx.font = "8px Helvetica";

            ctx.renderText((diff.hours>9?"":" ")+diff.hours+":"+(diff.minutes+"").pad(2, "0"), 0, 18, 0);            
        } else {
            badgeText = diff.hours+":"+(diff.minutes+"").pad(2, "0");
        }

        chrome.browserAction.setIcon({imageData:ctx.getImageData(0, 0, 19,19)});
        chrome.browserAction.setBadgeText({ text: badgeText });
    } else {
        chrome.browserAction.setBadgeText({
            text: "..."
        });
    }
    setTimeout(function () { drawIcon() }, 500);
}

function init() {
    setTimeout(function () {
        init()
    }, 1000);
}

function show(title, text) {
    var notification = window.webkitNotifications.createNotification('', chrome.i18n.getMessage("title") + (title ? (" - " + title) : ""), text);
    notification.onclick = function () {
        this.cancel();
    };

    notification.show();
    setTimeout(function () {
        notification.cancel();
    }, 15000);
}

head.js("js/jquery-1.10.2.js",
    function () {
        head.js("js/utils.js",
            function () {
                if (!localStorage['isNotFirstUsage'] && localStorage['isNotFirstUsage']!="true") {
                  openOptionsTab(false);
                }

                localStorage['isNotFirstUsage']="true";

                if (localStorage['version']!=chrome.app.getDetails().version && chrome.i18n.getMessage("version_update_text")!=""){
                    updateTimes(localStorage["city"], function(times, isError){
                        if (!isError){
                            localStorage["times"]=JSON.stringify(times);
                        }
                    });
                }

                /* Start to drawing icon +++ */
                addRenderTextMethodToCanvas();
                img.src = 'img/icon_19.png';
                img.onload = function () {
                    drawIcon();
                };
                /* --- Start to drawing icon*/

                init();
            }
        );
    }
);
