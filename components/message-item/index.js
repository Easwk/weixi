Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    content: {
      type: String,
      value: 'default value',
    },
    time: {
      type: String,
      value: 'default value',
    },
    type: {
      type: String,
      value: 'default value',
    },
    isOwn: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){}
  }
})
 