#ImagePageHelper.js 说明文档
---
##介绍

ImagePageHelper.js是一款帮助运营或者美工同事实现简单图片页面的js库。

美工将网页效果图直接贴在HTML页面中，对于用户来说，显示效果和原生网页相同，缺点是没有动画效果。
不过对于某些只具有展示和跳转的简单网页还是可以接受，能够减轻前端的重复劳动。

使用ImagePageHelper.js, 可以设置同一图片中的多个区域的点击跳转，实现类似静态页面的跳转功能。
支持跳转到APP的对应Url，如果检查到用户没有安装APP，则跳转APPstore下载页面。
也可以跳转网页链接。

另外，ImagepageHelper.js还封装了不同操作系统的实现，现只支持IOS和Android。

---

##使用方法

首先需要引入ImagePageHelper.js文件到对应的HTML文档中
```html
<script>path/subpath/ImagePageHelper.js</script>
```
引入文件之后，创建一个ImagePageHelper的实例对象，并运用该对象的initImagePage方法去初始化页面

```javascript
  var imageHelper = new window.baoTV.mobile.imagePageHelper();
  imageHelper.initImagePage(imgId, dataSet, params, debugMode);
```
initImagePage方法有四个参数：

>#####imgId: 图片在HTML文档中的id
>#####dataSet: 点击区域相关信息
>#####params: 跳转url相关信息
>#####debugMode: 是否开启debug模式

调用完initImagePage,就完成了对网页的设置，可以让图片网页实现静态网页的功能。

---
##数据结构
###imgId

描述：HTML文档中图片的ID
类型：string

###dataSet
描述：点击区域相关信息
类型：array

结构：
```javascript
dataSet = [
    // APP 1
    {
      appName: string,    //app名称，一个页面支持多种app跳转，根据appName与其跳转路径做对应。
      data: [
        //区域1
        {  
            x: number,  //区域左上角x值
            y: number,  //区域左上角y值
            width: number,  // 区域宽度
            height: number,  //区域高度
            videoInfo: {     // 点击区域跳转信息，里面的属性可以根据具体情况进行数量上的变化，属性名可根据实际情况自取，但是属性申明顺序要和模板填充顺序对应
                seriesId : number, //属性举例，可根据实际情况变化
                videoId: number   //属性举例，可根据实际情况变化
                //....
            }
        },
        //区域2
        {   
            x: number,
            y: number,  
            width: number,  
            height: number,
            videoInfo: {   
                seriesId : number,
                videoId: number  
                //....
            }
        }
        //...
      ]
    },
    //APP 2
    {
      appName: string,
      data: [
        {
            x: number,
            y: number,  
            width: number,  
            height: number,  
            videoInfo: {   
                seriesId : number
                videoId: number   
                //....
            }
        }
        //...
      ]
    }
    //...
]
```

例如：
```javacript
  var dataSet = [
      {
        appName: "APP1",
        data: [
          {
              x: 0,
              y: 0,
              width: 500,
              height:300,
              videoInfo: {
                seriesId: 1,
                videoId: 1
              }
          },
          {
              x: 0,
              y: 400,
              width: 500,
              height:300,
              videoInfo: {
                seriesId: 2,
                videoId: 2
              }
          },
        ]
      },
      {
        appName: "APP2",
        data: [
          {
              x: 0,
              y: 800,
              width: 500,
              height:300,
              videoInfo: {
                seriesId: 3,
                videoId: 3
              }
          }
        ]
      },
      {
        appName: "NOAPP",
        data: [
          {
              x: 0,
              y: 800,
              width: 500,
              height:300,
              websiteUrl: "http://www.google.com"
          }
        ]
      }
  ];
```
###params
描述：跳转url相关信息
类型：object

结构：

```javascript
    params = {
    appStoreUrl : {},  // appStore下载app链接
    iosAppUrlTemplete : {},  //跳转ios app url模板
    androidAppUrlTemplete : {}}  //跳转android app url模板
  };
```

例如：
```javascript
  var params = {
    appStoreUrl : {
      app1: "http://app1.test.com",
      app2: "http://app2.test.com"
    },
    iosAppUrlTemplete : {
      app1 : "DemoApp1://seryId=null&videoId=null&action=playVideo",
      app2 : "DemoApp2://seryId=null&videoId=null&action=playVideo"
    },
    androidAppUrlTemplete : {
      app1 : "DemoApp1://series/null/videos/null",
      app2 : "DemoApp2://series/null/videos/null"
    }
  };
```

appStoreUrl, iosAppUrlTemplete, androidAppUrlTemplete, 都是hash值，它们的key就是app的名字，跟dataSet中的属性appName相对应(两个值要一致)。
因为每个app都对应着不同的跳转链接和应用商店。

模板介绍
跳转app的url不是固定的，需要确定跳转视频的id等一系列信息，所以需要用模板参数和dataSet中的videoInfo合作生成。
模板参数提供android和ios app的跳转模板，动态的参数用null来代替，作为占位。
例：
>ios模板："DemoApp://seryId=null&videoId=null&action=playVideo"
> android模板： "DemoApp://series/null/videos/null"

ImagePageHelper会帮助将动态信息替换掉摸板中的填充位。

如果dataSet的信息如下：

```javascript
 var dataSet = [
   {
     appName: "app1",
     data: [
       {
           x: 0,
           y: 0,
           width: 500,
           height:300,
           videoInfo: {
             seriesId: 1,
             videoId: 1
           }
       }
     ]
   }
  ]
```
那么点击该区域所生成的跳转url如下

>ios : "DemoApp1://seryId=1&videoId=1&action=playVideo"
>android: "DemoApp1://series/1/videos/1"

###debugMode
描述：是否开启debug模式
类型：boolean

---

##跳转网站链接模式

支持APP跳转的同时也支持网站链接的跳转。

将需要跳转网站链接的区域插入dataSet中，appName必须是"NOAPP"（全部字母大写）。这里面的data数据则都是跳转网站的区域信息。
所需要提供的信息有：

```javascript
 var dataSet = [
  {
      x: 0,
      y: 0,
      width: 500,
      height:300,
      websiteUrl : "http://www.demo.com"
  }]
```

##Debug模式

将debugMode设置为true，则进入调试模式。

进入调试模式后，点击图片设置区域，会弹出对话框。
如果跳转区域所对应的是APP跳转的话，对话框中的信息为跳转的 APP Url，下载 APP Url。
如果跳转区所对应的是网页跳转的话，对话框中的信息为跳转的APP Url。

不会真的跳转。
