//index.js
//获取应用实例
const app = getApp()
// 引入工具类
const util = require('../../utils/util.js')
Page({
  data: {
    cateArr:[
      {
        icon: 'gongzuo',
        text: '工作'
      },
      {
        icon: 'sikao',
        text: '思考'
      },
      {
        icon: 'xiezuo',
        text: '写作'
      },
      {
        icon:'xuexi',
        text: '学习'
      },
      {
        icon:'yuedu',
        text:'阅读'
      },
      {
        icon:'yundong',
        text:'运动'
      }
    ],
    time: 35,
    cateActive: 0,
    rate:'',
    clockHeight:'',
    clockShow:false,
    mTime:2100000,
    timeStr:'35:00',
    okShow:false,
    pauseShow:true,
    continueCancelShow:false,
    timer:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 750rpx 不同手机屏幕宽度
    // 获取手机信息 + 计算rate
   var res = wx.getSystemInfoSync();
    var rate = 750 / res.windowWidth;
    //  rate = 750rpx / res.windowWidth  = height / res.windowHeight;
   this.setData({
     rate:rate,
    //  法2 去除滚动条
     clockHeight:rate * res.windowHeight
   })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 滑动时动态修改文字
  slideChange:function(e){
    this.setData({
      time:e.detail.value
    })
  },
  // 选中时修改文字颜色 
  clickCate:function(e){
    this.setData({
      cateActive:e.currentTarget.dataset.index
    })
  },
  // 点击开始专注 hidden
  start:function(e){
    this.setData({
      clockShow:true,
      mTime: this.data.time * 60 * 1000,
      timeStr:parseInt(this.data.time) >= 10 ? this.data.time+':00' : '0'+this.data.time+':00'
    })
    this.drawBg();
    this.drawActive();
  },
  // 绘制圆环背景
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
  },
  // 动态绘制圆环
  drawActive: function () {
    var _this = this;
    var timer = setInterval(function(){
      
      // 1.5~3.5
      // 0 2
      // 2100000 100
      // 21000次
      // 2/21000 每次的角度
      var angle = 1.5 + 2*(_this.data.time * 60 * 1000 - _this.data.mTime)/(_this.data.time*60*1000);
      var curTime = _this.data.mTime - 100;
      _this.setData({
        mTime: curTime
      })
      if (angle < 3.5) {
        // 整秒
        if(curTime % 1000 == 0){
          var msecStr = curTime / 1000;
          var minStr = parseInt(msecStr / 60);
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

        _this.setData({
          timeStr:'00:00',
          okShow:true,
          pauseShow: false,
          continueCancelShow: false,
        })
        clearInterval(timer);
      }

    },100);
    _this.setData({
      timer : timer
    })
  },
  pause:function(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: false,
      continueCancelShow: true,
      okShow: false
    })
  },
  continue:function(){
    this.drawActive();
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      okShow: false
    })
  },
  cancel:function(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      okShow: false,
      clockShow:false
    })
  },
  ok:function(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: true,
      continueCancelShow: false,
      okShow: false,
      clockShow: false
    })
  }
})
