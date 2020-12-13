// pages/clubPersonnel/personnel.js
let app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    ready: function() {
      console.log(app.globalData.current_club)
      let member_list = app.globalData.current_club.member_list
      let manager_list = app.globalData.current_club.manager_list
      let president_id = app.globalData.current_club.club_president_id
      let member_detail_list = []
      let manager_detail_list = []
      for (let person_id of member_list) {
        member_detail_list.push({
          id: person_id,
          name: person_id,
          duty: "社团成员",
          avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg'
        })
      }
      manager_detail_list.push({
        id: president_id,
        name: president_id,
        duty: "会长",
        avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg'
      })
      for (let person_id of manager_list) {
        manager_detail_list.push({
          id: person_id,
          name: person_id,
          duty: "管理员",
          avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg'
        })
      }
      this.setData({
        "persons.manager.personlist": manager_detail_list,
        "persons.member.personlist": member_detail_list,
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    modalShow: false,
    userIsPresident: app.globalData.userIsPresident,
    userIsManager: app.globalData.userIsManager,
    userName: app.globalData.userName,
    tabs:[
      "查看个人主页",
      "移交会长",
      "任命管理员",
      "移除管理员"
    ],
    persons: {
      manager:
      {
        style: "text-orange",
        role_name: "社团骨干",
        showall: 0,
        personlist: [
          // {
          //   name: 'zrf',
          //   duty: '会长',
          //   avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg'
          // },
          // {
          //   name: 'yqc',
          //   duty: '管理员',
          //   avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10004.jpg'
          // },
        ],
      },
      member:
      {
        style: "text-gray",
        role_name: "社团成员",    
        showall: 0,
        personlist: [
          // {
          //   name: 'hr',
          //   avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10003.jpg'
          // },
          // {
          //   name: 'zz',
          //   avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
          // },
        ]
      },
    },   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPersons: function (e) {
      let personKind = e.currentTarget.dataset.personkind
      let onshow = this.data.persons[personKind].showall
      let key = `persons.${personKind}.showall`
      this.setData(
        {
          [key]: 1 - onshow
        }
      )
    },
  
    showModal(e) {
      let person = e.currentTarget.dataset.person
      let duty = person.duty
      if (duty === '社团成员') {duty = 'member'}
      else if (duty === '会长') {duty = 'president'}
      else if (duty === '管理员') {duty = 'manager'}
      else {alert(`wrong duty: ${duty}`)}
      let modalName = person.name
      let modalId = person.id
      let userName = this.data.userName
      let userIsPresident = this.data.userIsPresident
      let userIsManager = this.data.userIsManager
      let userIsMember = this.data.userIsMember
      this.setData({
        showTab: [
          true,
          userName !== modalName && (userIsPresident && duty === 'manager'),
          userName !== modalName && (userIsPresident && duty === 'member'),
          (userIsPresident && duty==='manager') || (userIsManager && userName === modalName)
        ],
        modalShow: true,
        modalName: modalName,
        modalId: modalId
      })
    },
  
    hideModal(e) {
      this.setData({
        modalShow: false
      })
    },
  
    tabClick(e) {
      let tabInd = e.currentTarget.dataset.tabindex
      let tabContent = this.data.tabs[tabInd]
      let modalName = this.data.modalName
      let content = [
        null,
        `将会长移交给${modalName}？`,
        `将${modalName}设为社团管理员？`,
        `移除${modalName}的管理员身份？`
      ]
      // 查看主页不需要检查
      if (tabInd > 0)
      {
        wx.showModal({
          title: tabContent,
          content: content[tabInd],
          cancelColor: 'cancelColor',
          success: res=>{
            if (tabInd === 0)
            {
              wx.navigateTo({
                url: '/pages/frontpage/frontpage',
              })
            }
            else if (tabInd === 1)
            {
              app.sendMessages(app.globalData.openid, this.data.modalId, 0, "移交会长",  "xxx想将社长移交给你", res=>console.log(res))
            }
            else if (tabInd === 2)
            {
              app.sendMessages(app.globalData.openid, this.data.modalId, 0, "管理员邀请",  "xxx想任命你为社团管理员", res=>console.log(res))
            }
            else{
              app.deleteManagerFromClub(app.globalData.current_club.club_id, this.data.modalId, res=>console.log(res))
            }
          },
          fail: res=>{console.log(res)}
        })
      }     
    }
  }
})
