//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let _this = this
    app.getClubList(
      function(res) {_this.setData({
        available_club_id: res.data.club_list[res.data.club_list.length-1][0]
      })
      console.log(_this.data.available_club_id)
    }
    )
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  test0: function() {
    getApp().globalData.userIsManager = false
    getApp().globalData.userIsPresident = true
    getApp().globalData. userIsMember = false
    // 应该写在navigate之前的
    console.log(this.data.available_club_id)
    let club_id = this.data.available_club_id
      wx.navigateTo({
        url: '/pages/frontpage/frontpage?club_id=' + club_id})
  },
  test1: function() {
    getApp().globalData.userIsManager = true
    getApp().globalData.userIsPresident = false
    getApp().globalData. userIsMember = false
    let club_id = this.data.available_club_id
      wx.navigateTo({
        url: '/pages/frontpage/frontpage?club_id=' + club_id})
  },
  test2: function() {
    getApp().globalData.userIsManager = false
    getApp().globalData.userIsPresident = false
    getApp().globalData. userIsMember = true
    let club_id = this.data.available_club_id
      wx.navigateTo({
        url: '/pages/frontpage/frontpage?club_id=' + club_id})
  },
  test3: function() {
    getApp().globalData.userIsManager = false
    getApp().globalData.userIsPresident = false
    getApp().globalData.userIsMember = false
    let club_id = this.data.available_club_id
      wx.navigateTo({
        url: '/pages/frontpage/frontpage?club_id=' + club_id})
  }
})

