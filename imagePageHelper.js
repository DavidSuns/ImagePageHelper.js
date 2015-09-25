'use strcit';

/*
* ImagePageHelper.js version 1.0
*/

(function() {
  var ImagePageHelper = function() {
    this.dataSet = [];
    this.params = {
      appStoreUrl : "",
      iosAppUrlTemplete : "",
      androidAppUrlTemplete : "",
      environment: ""
    };
    this.bugMode = false;
  };

  ImagePageHelper.prototype.initImagePage = function(imageId, dataSet, params, bugMode) {
    this.dataSet = dataSet;
    this.params = params;
    this.bugMode = bugMode ? bugMode : false;
    this._checkEnvironment();
    this._setClickEvent(imageId);
  };

  ImagePageHelper.prototype.setBugMode = function(bugMode) {
    this.bugMode = bugMode;
  };

  ImagePageHelper.prototype.getBugMode = function() {
    return this.bugMode;
  };

  ImagePageHelper.prototype.setAppStoreUrl = function(url) {
    this.params.appStoreUrl = url;
  };

  ImagePageHelper.prototype.getAppStoreUrl = function() {
    return this.params.appStoreUrl;
  };

  ImagePageHelper.prototype.setIosUrlTemplete = function(urlTemplete) {
    this.params.iosAppUrlTemplete = urlTemplete;
  };

  ImagePageHelper.prototype.getIosUrlTemplete = function() {
    return this.params.iosAppUrlTemplete;
  };

  ImagePageHelper.prototype.setAndroidUrlTemplete = function(urlTemplete) {
    this.params.androidAppUrlTemplete = urlTemplete;
  };

  ImagePageHelper.prototype.getAndroidUrlTemplete = function() {
    return this.params.androidAppUrlTemplete;
  };

  ImagePageHelper.prototype._checkEnvironment = function() {
    if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
      this.params.environment = "ios";
    } else if( /Android/i.test(navigator.userAgent)) {
      this.params.environment = "android";
    }
  };

  ImagePageHelper.prototype._setClickEvent = function(imageId) {
    var img, addEvent, me;
    img = document.getElementById(imageId);
    addEvent = img.addEventListener ? img.addEventListener : img.attachEvent;
    me = this;

    addEvent("touchstart", (function(me){
      return function(e) {
        me._getClickArea(e, me);
      };
    }(this)));
  };

  ImagePageHelper.prototype._getClickArea = function(e, me) {
    var touch = e.changedTouches[0];
    for(var i= 0; i< me.dataSet.length; i++) {
      if(touch.clientX >= me.dataSet[i].x && touch.clientX < me.dataSet[i].x + me.dataSet[i].width &&
        touch.clientY >= me.dataSet[i].y && touch.clientY < me.dataSet[i].y + me.dataSet[i].height ) {
          if(me.bugMode) {
            me._testOpenApp(dataSet[i].videoInfo);
          } else {
            me._openApp(dataSet[i].videoInfo);
          }
          break;
      }
    }
  };

  ImagePageHelper.prototype._testOpenApp = function(videoInfo) {
    var appUrl = this._createAppUrl(videoInfo);
    var alertInfo = "appUrl : " + appUrl +
                    "\n appStore : " + this.params.appStoreUrl;
    alert(alertInfo);
  };

  ImagePageHelper.prototype._openApp = function(videoInfo) {
    var appUrl = this._createAppUrl(videoInfo);

    var link = document.createElement('a');
    link.setAttribute("href", this.params.appStoreUrl);
    link.addEventListener("click", function() {
      var ifr = document.createElement('iframe');
      ifr.src = appUrl;
      ifr.style.display = 'none';
      document.body.appendChild(ifr);
      window.setTimeout(function(){
          document.body.removeChild(ifr);
      },300);
    });
    if(document.createEvent) {
     var evt = document.createEvent("MouseEvents");
     evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
     link.dispatchEvent(evt);
   }
  };

  ImagePageHelper.prototype._createAppUrl = function(videoInfo) {
    var url = "", urlParams, videoParams;

    if(this.params.environment === "android") {
      urlParams = this.params.androidAppUrlTemplete.split("null");
    } else if(this.params.environment === "ios") {
      urlParams = this.params.iosAppUrlTemplete.split("null");
    } else {
      alert("环境出错");
    }

    videoParams = Object.keys(videoInfo).map(function (key) { return videoInfo[key]; });

    for(var i= 0; i < urlParams.length; i++) {
      if(videoParams[i] === undefined) {
        videoParams[i] = "";
      }
      url+= urlParams[i] + videoParams[i];
    }

    return url;
  };

  window.baoTV = {};
  window.baoTV.mobile = {};
  window.baoTV.mobile.ImagePageHelper = ImagePageHelper || {};
}());
