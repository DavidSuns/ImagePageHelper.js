'use strcit';

/*
* ImagePageHelper.js version 2.0
*/

(function() {
  var ImagePageHelper = function() {
    this.dataSet = [];
    this.params = {
      appStoreUrl : {},
      iosAppUrlTemplete : {},
      androidAppUrlTemplete : {},
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

  ImagePageHelper.prototype.addAppStoreUrl = function(appName, url) {
    this.params.appStoreUrl[appName] = url;
  };

  ImagePageHelper.prototype.getAppStoreUrl = function(appName) {
    if (appName) {
      return this.params.appStoreUrl[appName];
    }
    return this.params.appStoreUrl;
  };

  ImagePageHelper.prototype.addIosUrlTemplete = function(appName, urlTemplete) {
    this.params.iosAppUrlTemplete[appName] = urlTemplete;
  };

  ImagePageHelper.prototype.getIosUrlTemplete = function(appName) {
    if(appName) {
      return this.params.iosAppUrlTemplete[appName];
    }
    return this.params.iosAppUrlTemplete;
  };

  ImagePageHelper.prototype.setAndroidUrlTemplete = function(appName, urlTemplete) {
    this.params.androidAppUrlTemplete[appName] = urlTemplete;
  };

  ImagePageHelper.prototype.getAndroidUrlTemplete = function(appName) {
    if(appName) {
      return this.params.androidAppUrlTemplete[appName];
    }
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
    var data, i, j;
    var touch = e.changedTouches[0];

    for(i= 0; i< me.dataSet.length; i++) {
      data = me.dataSet[i].data;
      for(j= 0; j< data.length; j++) {
        if(touch.pageX >= data[j].x && touch.pageX < data[j].x + data[j].width &&
          touch.pageY >= data[j].y && touch.pageY < data[j].y + data[j].height ) {
            if(me.bugMode) {
              if(me.dataSet[i].appName === "NOAPP") {
                me._testOpenWebPage(data[j].websiteUrl);
              } else {
                me._testOpenApp(i, data[j].videoInfo);
              }
            } else {
              if(me.dataSet[i].appName === "NOAPP") {
                me._openWebPage(data[j].websiteUrl);
              } else {
                me._openApp(i, data[j].videoInfo);
              }
            }
            break;
        }
      }
    }
  };

  ImagePageHelper.prototype._testOpenWebPage = function(websiteUrl) {
    var alertInfo = "Website url : " + websiteUrl;
    alert(alertInfo);
  };

  ImagePageHelper.prototype._testOpenApp = function(index, videoInfo) {
    var appUrl, alertInfo;

    appUrl = this._createAppUrl(index, videoInfo);
    alertInfo = "appUrl : " + appUrl +
                    "\n appStore : " + this.params.appStoreUrl[this.dataSet[index].appName];
    alert(alertInfo);
  };

  ImagePageHelper.prototype._openWebPage = function (websiteUrl) {
    window.location.href = websiteUrl;
  };

  ImagePageHelper.prototype._openApp = function(index, videoInfo) {
    var appUrl = this._createAppUrl(index, videoInfo);

    var link = document.createElement('a');
    link.setAttribute("href", this.params.appStoreUrl[this.dataSet[index].appName]);
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

  ImagePageHelper.prototype._createAppUrl = function(index, videoInfo) {
    var url = "", urlParams, videoParams;

    if(this.params.environment === "android") {
      urlParams = this.params.androidAppUrlTemplete[this.dataSet[index].appName].split("null");
    } else if(this.params.environment === "ios") {
      urlParams = this.params.iosAppUrlTemplete[this.dataSet[index].appName].split("null");
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
