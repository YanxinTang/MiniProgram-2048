// component/pattern/pattern.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    open: {
      type: Boolean,
      value: true,
    },
    name: {
      type: String,
      value: '',
    },
    score: {
      type: Number,
      value: 0,
    },
    best: {
      type: Number,
      value: 0,
    },
    url :{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    pageNavigateTo(){
      console.log(this.data.url)
      wx.navigateTo({
        url: this.data.url,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
    }
  }
})
