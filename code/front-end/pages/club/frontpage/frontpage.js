// pages/frontpage/frontpage.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    Tabs: ["社团详情", "社团活动", "社团人员"],
    member_number: 0,
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tab = options.tab
    if (tab !== undefined)
    {
      this.setData({
        TabCur: tab
      })
    }
    let club_id = options.club_id
    let user_id = app.globalData.openid
    let _this = this
    this.setData({
      loaded_info: false,
      loaded_manager: false,
      loaded_member: false,
      loaded_pictures: false,
      loaded_collector: false
    })
    new Promise((resolve, reject) => {
      app.getClubInfo(club_id, function(res){
        let cur_club = res.data
        cur_club.club_id = club_id
        cur_club.relation = app.globalData.relations[club_id]
        app.globalData.current_club = cur_club
        _this.setData({
            loaded_info: true,
            relation: app.globalData.current_club.relation,
            club_name: cur_club.club_name,
            club_tag: cur_club.club_tag,
        })
        resolve()
      })
    }).then(() => {
      app.getClubCollectors(club_id, res => {
        let collect_number = res.data.club_collector_list.length
        _this.setData({
          collect_number: collect_number,
          loaded_collector: true,
        })
      })
      app.getClubPictures(club_id, res => {
        let picture_list = res.data.club_pictures_list
        console.log(app.globalData.current_club)
        app.globalData.current_club.raw_picture_urls = picture_list
        app.globalData.current_club.cover_pircure = app.globalData.SERVER_ROOT_URL + picture_list[0][1]
        app.globalData.current_club.contact_QR = app.globalData.SERVER_ROOT_URL + picture_list[1][1]
        let display_pictures = []
        for (let pic of picture_list.slice(2))
        {
          display_pictures.push(app.globalData.SERVER_ROOT_URL + pic[1])
        }
        app.globalData.current_club.display_pictures = display_pictures
        _this.setData(
          {
            loaded_pictures: true,
            cover_url: app.globalData.current_club.cover_pircure 
          })
      })
      return new Promise((resolve, reject) => {
        app.getClubMembers(club_id, res=>{
          let member_list = res.data.club_member_list
          app.globalData.current_club.member_list = member_list
          _this.setData(
            {
              loaded_member: true,
            })
          resolve(member_list.length) 
        })
      })      
    }).then(len => {
      app.getClubManagers(club_id, res=>{
        let manager_list = res.data.club_manager_list
        app.globalData.current_club.manager_list = manager_list
        _this.setData(
          {
            loaded_manager: true,
            member_number: len + manager_list.length + 1
          })
      })
    })
  },

  refresh: function (e) {
    this.onLoad(e.detail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})