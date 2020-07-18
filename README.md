# 微信小程序入门——番茄ToDo

*跟着B站UP主：喔咔咔耶耶（公众号：小李爱编程）写的。视频BV号：[BV1PV411k7ie](https://www.bilibili.com/video/BV1PV411k7ie)。*

[toc]

## 一、开发环境

开发工具：微信官方开发者工具

## 二、页面设置

### 1 首页

滑动滑块选择专注时间，动态改变时间显示。

提供不同的任务选择，默认选择工作。

点击开始专注，跳转到专注页面。

<img src="https://github.com/xuzichang/tomatoToDo/blob/master/tomatoToDo.assets/image-20200718005829906.png" alt="首页" style="zoom:50%;" /><img src="https://github.com/xuzichang/tomatoToDo/blob/master/tomatoToDo.assets/image-20200718010955097.png" alt="数据绑定" style="zoom:50%;" />
![首页](https://github.com/xuzichang/tomatoToDo/blob/master/tomatoToDo.assets/image-20200718005829906.png)


### 2 专注页

根据剩余时间动态画圆，直到专注时间结束。

点击暂停，出现“继续”和“放弃”按钮。点击继续回到专注页继续专注；点击放弃回到首页，本次专注记录不保存。

<img src="https://github.com/xuzichang/tomatoToDo/blob/master/tomatoToDo.assets/image-20200718005957025.png" alt="专注页" style="zoom:50%;" /><img src="https://github.com/xuzichang/tomatoToDo/blob/master/tomatoToDo.assets/image-20200718010818093.png" alt="专注页暂停" style="zoom:50%;" />

### 3 统计

显示今日/累计专注次数和今日/累计专注时长。

以记录序列的形式显示专注任务的详细信息，无缓存数据时显示信息。

*时间-任务类型-专注时长*

<img src="https://github.com/xuzichang/tomatoToDo/blob/master/tomatoToDo.assets/image-20200718010421024.png" alt="今日统计" style="zoom:50%;" /><img src="https://github.com/xuzichang/tomatoToDo/blob/master/tomatoToDo.assets/image-20200718010512464.png" alt="历史统计" style="zoom:50%;" />

## 三、实现步骤

*因为是刚开始接触，写的比较细。*

### step1：新建项目

### step2：删除文件原有内容

index.wxml；index.js中data、函数等内容；app.js；

### step3：开始编写

#### ①实现顶部导航背景颜色和文字

微信全局配置中提供`window`属性，用于设置小程序的状态栏、导航条、标题、窗口背景色。

| 属性                             | 类型     | 默认值   | 描述                                                         |
| :------------------------------- | :------- | :------- | :----------------------------------------------------------- |
| ==navigationBarBackgroundColor== | HexColor | #000000  | 导航栏背景颜色，如 `#000000`                                 |
| ==navigationBarTextStyle==       | string   | white    | 导航栏标题颜色，仅支持 `black` / `white`                     |
| ==navigationBarTitleText==       | string   |          | 导航栏标题文字内容                                           |
| navigationStyle                  | string   | default  | 导航栏样式，仅支持以下值： `default` 默认样式 `custom` 自定义导航栏，只保留右上角胶囊按钮。参见注 2。 |
| backgroundColor                  | HexColor | #ffffff  | 窗口的背景色                                                 |
| backgroundTextStyle              | string   | dark     | 下拉 loading 的样式，仅支持 `dark` / `light`                 |
| backgroundColorTop               | string   | #ffffff  | 顶部窗口的背景色，仅 iOS 支持                                |
| backgroundColorBottom            | string   | #ffffff  | 底部窗口的背景色，仅 iOS 支持                                |
| enablePullDownRefresh            | boolean  | false    | 是否开启全局的下拉刷新。 详见 [Page.onPullDownRefresh](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onpulldownrefresh) |
| onReachBottomDistance            | number   | 50       | 页面上拉触底事件触发时距页面底部距离，单位为 px。 详见 [Page.onReachBottom](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onreachbottom) |
| pageOrientation                  | string   | portrait | 屏幕旋转设置，支持 `auto` / `portrait` / `landscape` 详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html) |

```json
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#E7624F",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle":"white"
  }
```

> app.json中是全局的。页面的json针对当前页面，会覆盖app.json中的配置。



#### ②实现滑块功能

1. **滑块**

   微信官方提供了slider组件。==高亮==为用到的属性。

| 属性               | 类型        | 默认值      | 必填   | 说明                                             |
| :----------------- | :---------- | :---------- | :----- | :----------------------------------------------- |
| ==min==            | number      | 0           | 否     | 最小值                                           |
| ==max==            | number      | 100         | 否     | 最大值                                           |
| step               | number      | 1           | 否     | 步长，取值必须大于 0，并且可被(max - min)整除    |
| disabled           | boolean     | false       | 否     | 是否禁用                                         |
| ==value==          | number      | 0           | 否     | 当前取值                                         |
| ~~color~~          | ~~color~~   | ~~#e9e9e9~~ | ~~否~~ | ~~背景条的颜色（请使用 backgroundColor）~~       |
| ~~selected-color~~ | ~~color~~   | ~~#1aad19~~ | ~~否~~ | ~~已选择的颜色（请使用 activeColor）~~           |
| ==activeColor==    | color       | #1aad19     | 否     | 已选择的颜色                                     |
| backgroundColor    | color       | #e9e9e9     | 否     | 背景条的颜色                                     |
| block-size         | number      | 28          | 否     | 滑块的大小，取值范围为 12 - 28                   |
| block-color        | color       | #ffffff     | 否     | 滑块的颜色                                       |
| ==show-value==     | boolean     | false       | 否     | 是否显示当前 value                               |
| ==bindchange==     | eventhandle |             | 否     | 完成一次拖动后触发的事件，event.detail = {value} |
| bindchanging       | eventhandle |             | 否     | 拖动过程中触发的事件，event.detail = {value}     |

>  微信没有<div></div>标签，使用<view></view>标签。
>
> css中单位是rpx。

2. **绑定滑块和文字数据**

滑块设置`value`。`value="{{time}}"`。

```html
<view class="task_desc">在接下来的{{time}}分钟，专注完成这件事</view>
```

在滑块中利用`bindChange`添加事件`slideChange`。

```javascript
  // 滑动时动态修改文字
  slideChange:function(e){
    // 动态改变data中的参数值
    this.setData({
      time:e.detail.value
    })
  },
```

>报错Warning:Now you can provide attr `wx:key` for a `wx:for` to improve performance. 
>
>加上`wx:key`就行。`<view wx:for="{{cateArr}}" wx:key="cate">`



#### ③实现任务选择功能

1. **图标和文字数据**

图标和文字在index.js的`data`中新建`cateArr`。

```json
 cateArr:[
      {
        icon: 'gongzuo',
        text: '工作'
      }]
```

> 微信循环——wx:for={{arr}}。
>
> 图片引入
>
> 1、在wxml标签中拼接好（`src="../../images/{{item.icon}}.png"`）；2、在data中补全（icon:'../../images/tubiao.png'）。

2. **选中时动态显示样式**。

使用`bindtap`属性添加事件`clickCate`。`bindtap="clickCate" data-index="{{index}}"`。

> 添加属性 data-属性名，会被放在dataset下。

```javascript
  // 选中任务时修改文字颜色 
  clickCate:function(e){
    this.setData({
      cateActive:e.currentTarget.dataset.index
    })
  },
```

判断任务是否选中，默认为0。` cateActive: 0`

`class='{{index == cateActive ? "cate_text_active" : ""}}'`

判断`index`和选中的`cateActive`是否相同，相同则添加class`cate_text_active`，改变文字颜色。



#### ④实现首页和专注页的切换

> 切换方式
>
> 1.分成两个页面；2.合并成一个页面，使用`hidden`属性。

`hidden="{{clockShow}}" `。 `clockShow`默认为false;`hidden` = true时，隐藏。

“开始专注”按钮使用`bindtap`属性添加事件`start`。

```javascript
  // 点击开始专注 hidden
  start:function(e){
    this.setData({
      clockShow:true,
      mTime: this.data.time * 60 * 1000,
      timeStr:parseInt(this.data.time) >= 10 ? this.data.time+':00' : '0'+this.data.time+':00'
    })
    this.drawBg();
    this.drawActive();
  }
```



#### ⑤实现动态画圆功能

1. **单位换算**

小程序默认宽度750rpx，不同手机屏幕真实宽度不同。通过API，获取手机宽度，计算比率。

微信官方提供API：`wx.getSystemInfo(Object object)`，获取系统信息。

```javascript
rate = 750rpx / res.windowWidth  = height / res.windowHeight
```

| 属性                        | 类型    | 说明                                                         |
| :-------------------------- | :------ | :----------------------------------------------------------- |
| brand                       | string  | 设备品牌                                                     |
| model                       | string  | 设备型号                                                     |
| pixelRatio                  | number  | 设备像素比                                                   |
| screenWidth                 | number  | 屏幕宽度，单位px                                             |
| screenHeight                | number  | 屏幕高度，单位px                                             |
| ==windowWidth==             | number  | 可使用窗口宽度，单位px                                       |
| ==windowHeight==            | number  | 可使用窗口高度，单位px                                       |
| statusBarHeight             | number  | 状态栏的高度，单位px                                         |
| language                    | string  | 微信设置的语言                                               |
| version                     | string  | 微信版本号                                                   |
| system                      | string  | 操作系统及版本                                               |
| platform                    | string  | 客户端平台                                                   |
| fontSizeSetting             | number  | 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 |
| SDKVersion                  | string  | 客户端基础库版本                                             |
| benchmarkLevel              | number  | 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） |
| albumAuthorized             | boolean | 允许微信使用相册的开关（仅 iOS 有效）                        |
| cameraAuthorized            | boolean | 允许微信使用摄像头的开关                                     |
| locationAuthorized          | boolean | 允许微信使用定位的开关                                       |
| microphoneAuthorized        | boolean | 允许微信使用麦克风的开关                                     |
| notificationAuthorized      | boolean | 允许微信通知的开关                                           |
| notificationAlertAuthorized | boolean | 允许微信通知带有提醒的开关（仅 iOS 有效）                    |
| notificationBadgeAuthorized | boolean | 允许微信通知带有标记的开关（仅 iOS 有效）                    |
| notificationSoundAuthorized | boolean | 允许微信通知带有声音的开关（仅 iOS 有效）                    |
| bluetoothEnabled            | boolean | 蓝牙的系统开关                                               |
| locationEnabled             | boolean | 地理位置的系统开关                                           |
| wifiEnabled                 | boolean | Wi-Fi 的系统开关                                             |
| safeArea                    | Object  | 在竖屏正方向下的安全区域                                     |
| theme                       | string  | 系统当前主题，取值为`light`或`dark`，全局配置`"darkmode":true`时才能获取，否则为 undefined （不支持小游戏） |

2. **绘制圆环**

微信提供画布组件canvas。

```xml
<canvas canvas-id="progress_bg" class="progress_bg"></canvas>
```

| 属性            | 类型        | 默认值 | 必填 | 说明                                                         |
| :-------------- | :---------- | :----- | :--- | :----------------------------------------------------------- |
| type            | string      |        | 否   | 指定 canvas 类型，支持 2d (2.9.0) 和 webgl (2.7.0)           |
| ==canvas-id==   | string      |        | 否   | canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性    |
| disable-scroll  | boolean     | false  | 否   | 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新 |
| bindtouchstart  | eventhandle |        | 否   | 手指触摸动作开始                                             |
| bindtouchmove   | eventhandle |        | 否   | 手指触摸后移动                                               |
| bindtouchend    | eventhandle |        | 否   | 手指触摸动作结束                                             |
| bindtouchcancel | eventhandle |        | 否   | 手指触摸动作被打断，如来电提醒，弹窗                         |
| bindlongtap     | eventhandle |        | 否   | 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动 |
| binderror       | eventhandle |        | 否   | 当发生错误时触发 error 事件，detail = {errMsg}               |

```javascript
// 绘制背景圆环,在点击“开始专注”调用的start函数中调用
drawBg:function(){
     // px与rpx转化
    var lineWidth = 6 / this.data.rate;
    var ctx = wx.createCanvasContext('progress_bg');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#000000');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(400/this.data.rate/2, 400/this.data.rate/2,400/this.data.rate/2 - 2*lineWidth,0,2*Math.PI,false);
    ctx.stroke();
    ctx.draw();
  }
```

```javascript
 // 动态绘制圆环,在点击“开始专注”调用的start函数中调用
  drawActive: function () {
    // 定时器内指向对象不同
    var _this = this;
    // 设置定时器
    var timer = setInterval(function(){
      // 绘制角度：1.5~3.5
      // 开始与结束相差0 2
      // 毫秒mTime：2100000ms 调用定时器时间：100ms
      // 调用执行：21000次
      // 每次的角度：2/21000 
      var angle = 1.5 + 2*(_this.data.time * 60 * 1000 - _this.data.mTime)/(_this.data.time*60*1000);
      var curTime = _this.data.mTime - 100;
        
      _this.setData({
        mTime: curTime
      })
        
      if (angle < 3.5) {
        // 设置圆环内文字和定时器同步
        // 整秒时，改变文字
        if(curTime % 1000 == 0){
          var msecStr = curTime / 1000;
          // 分
          var minStr = parseInt(msecStr / 60);
          // 秒 小于10补0
          var secStr = (msecStr - minStr * 60) >= 10 ? (msecStr - minStr * 60): '0' + (msecStr - minStr * 60);
          var minStr = minStr >= 10 ? minStr:'0' + minStr;
            
          _this.setData({
            timeStr:minStr + ':' + secStr
          })
        }
          
        // px与rpx转化
        var lineWidth = 6 / _this.data.rate;
        var ctx = wx.createCanvasContext('progress_active');
        ctx.setLineWidth(lineWidth);
        ctx.setStrokeStyle('#ffffff');
        ctx.setLineCap('round');
        ctx.beginPath();
        ctx.arc(400 / _this.data.rate / 2, 400 / _this.data.rate / 2, 400 / _this.data.rate / 2 - 2 * lineWidth, 1.5 * Math.PI, angle * Math.PI, false);
        ctx.stroke();
        ctx.draw();
      }else{
          
        // 取
        var logs = wx.getStorageSync('logs') ||[];
        // logs加元素
        logs.unshift({
          date:util.formatTime(new Date),
          cate:_this.data.cateActive,
          time:_this.data.time
        })
        // 存
        wx.setStorageSync('logs', logs);
		
         // 圆环文字
        _this.setData({
          timeStr:'00:00',
          okShow:true,
          pauseShow: false,
          continueCancelShow: false,
        })
          
        // 清除定时器
        clearInterval(timer);
      }

    },100);
    _this.setData({
      timer : timer
    })
  },
```

3. **动态改变圆环内文字**

和首页滑块文字相同：`timeStr:parseInt(this.data.time) >= 10 ? this.data.time+':00' : '0'+this.data.time+':00'`。

和定时器改变时间同步：`curTime = _this.data.mTime - 100` 动态绘制中更新值（<3.5和>=3.5）。



#### ⑥暂停、继续、放弃、完成返回按钮

利用`wx-if`判断是否显示。` okShow;` `pauseShow;` `continueCancelShow;`

利用`bindtap`属性添加事件。

动态绘制圆环结束后，设置按钮显示状态。

```xml
<view class="okBtn" bindtap="ok" wx:if="{{okShow}}">返回</view>
```

```javascript
  // 暂停
  pause:function(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: false,
      continueCancelShow: true,
      okShow: false
    })
  },
  // 继续
  continue:function(){
    this.drawActive();
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      okShow: false
    })
  },
  // 取消
  cancel:function(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      okShow: false,
      clockShow:false
    })
  },
  // 完成返回
  ok:function(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      okShow: false,
      clockShow: false
    })
  }
```



#### ⑦实现底部tabBar功能

微信全局配置中提供`tabBar`属性，可以通过配置指定 tab 栏的表现，以及 tab 切换时显示的对应页面。

| 属性              | 类型     | 必填 | 默认值 | 描述                                                         |
| :---------------- | :------- | :--- | :----- | :----------------------------------------------------------- |
| ==color==         | HexColor | 是   |        | tab 上的文字默认颜色，仅支持十六进制颜色                     |
| ==selectedColor== | HexColor | 是   |        | tab 上的文字<u>**选中**</u>时的颜色，仅支持十六进制颜色      |
| backgroundColor   | HexColor | 是   |        | tab 的背景色，仅支持十六进制颜色                             |
| borderStyle       | string   | 否   | black  | tabbar 上边框的颜色， 仅支持 `black` / `white`               |
| list              | Array    | 是   |        | tab 的列表，详见 `list` 属性说明，最少 2 个、最多 5 个 tab   |
| position          | string   | 否   | bottom | tabBar 的位置，仅支持 `bottom` / `top`                       |
| custom            | boolean  | 否   | false  | 自定义 tabBar，见[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html) |

其中 list 接受一个数组，**只能配置最少 2 个、最多 5 个 tab**。tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：

| 属性                 | 类型   | 必填 | 说明                                                         |
| :------------------- | :----- | :--- | :----------------------------------------------------------- |
| ==pagePath==         | string | 是   | 页面路径，必须在 pages 中先定义                              |
| ==text==             | string | 是   | tab 上按钮文字                                               |
| ==iconPath==         | string | 否   | 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。 **当 `position` 为 `top` 时，不显示 icon。** |
| ==selectedIconPath== | string | 否   | <u>**选中**</u>时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。 **当 `position` 为 `top` 时，不显示 icon。** |

app.json中修改`tabBar`。

```json
"tabBar": {
    "selectedColor": "#E7624F",
    "color": "#bfbfbf",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "计时",
        "iconPath":"./images/jishi1.png",
        "selectedIconPath":"./images/jishi2.png"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "统计",
        "iconPath": "./images/tongji1.png",
        "selectedIconPath": "./images/tongji2.png"
      }
    ]
  }
```



#### ⑧实现统计功能

1. **生命周期**

将代码写在onShow中。

<img src="https://res.wx.qq.com/wxdoc/dist/assets/img/page-lifecycle.2e646c86.png" alt="页面的生命周期" style="zoom: 67%;" />

2. **存储、读取缓存**

日期格式化需要使用工具类utils中的`formatTime`。

引入utils：`const util = require('../../utils/util.js')`

同步获取指定key的缓存。`any wx.getStorageSync(string key)`

同步存储数据到缓存的指定key 中，会覆盖掉原来该 key 对应的内容。`wx.setStorage(Object object)`

index.js在动态画圆结束后，**存储**记录数据。

```javascript
        // 取
        var logs = wx.getStorageSync('logs') ||[];
        // logs加元素
        logs.unshift({
          date:util.formatTime(new Date),
          cate:_this.data.cateActive,
          time:_this.data.time
        })
        // 存
        wx.setStorageSync('logs', logs);
```

log.js中**读取**已经存入缓存的数据。

```javascript
  onShow: function () {
    var logs = wx.getStorageSync('logs') || [];
    // 今日专注次数
    var day = 0;
    // 累计专注次数
    var total = logs.length;
    // 今日专注时长
    var dayTime = 0;
    // 累计专注时长
    var totalTime = 0;
    // 当天记录
    var dayList = [];

    if(logs.length > 0){
      for (var i = 0; i < logs.length; i++){
        // 判断记录是否为同一天
        if (logs[i].date.substr(0,10) == util.formatTime(new Date).substr(0, 10)){
          day += 1;
          dayTime += parseInt(logs[i].time);
          dayList.push(logs[i]);
          this.setData({
            dayList:dayList,
            // 默认选择今日
            list:dayList
          })
        }
        totalTime += parseInt(logs[i].time);
      }
      // 设置sum中val
      this.setData({
        'sum[0].val': day,
        'sum[1].val': total,
        'sum[2].val': dayTime + '分钟',
        'sum[3].val': totalTime + '分钟'
      })
    }
  },
```

3. **列表显示详情信息**

切换今日和历史。

样式：同②实现任务选择功能。

内容：`dayList`存储当天记录。`list`选择显示今日/历史。

```javascript
  changeType:function(e){
    // 选择今日/历史
    var index = e.currentTarget.dataset.index;
      
    if (index == 0) {
      this.setData({
        list:this.data.dayList
      })
    }else if(index == 1){
      var logs = wx.getStorageSync('logs') || [];
      this.setData({
        list: logs
      })
    }
      
    this.setData({
      activeIndex: index
    })
  }
```

4. **缓存无数据的情况**

```xml
  <view class="detail_list" wx:if="{{list.length > 0}}"></view>

  <view class="detail_list" wx:if="{{list.length == 0}}">
    暂无数据
  </view>

```



#### ⑨其他

> 去除滚动条的两个方法
>
> 1.`.overflow: hidden;`
>
> 2.设置style高度等于手机屏幕高度。
>
> `clockHeight:rate * res.windowHeight`。rate和res.windowHeight在[实现动态画圆功能](#④实现动态画圆功能)使用过了。

## 四、遇到的问题

*报错：Uncaught TypeError: Cannot read property ‘substr’ of undefined* at *'if (logs[i].date.substr(0,10) == util.formatTime(new Date).substr(0, 10))'*

因为app.js写了个示范，导致 logs里有空的对象undefined，注释掉就好。  

```javascript
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
```



