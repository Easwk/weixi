// 消息分页配置
const PAGE_SIZE = 20;
let loading = false;

Page({
  data: {
    messages: [], // 当前展示的消息
    allMessages: [], // 全部消息（模拟数据源）
    inputText: "",
    scrollTop: 0,
  },

  onLoad() {
    // 初始化加载首屏消息
    this.loadMessages(true);
  },

  // 核心：分页加载消息（优化大量数据场景）
  async loadMessages(init = false) {
    if (loading) return;
    loading = true;

    // 模拟API请求
    // const newMessages = await this.mockFetchMessages();
    const newMessages = [{
      id: Date.now(),
      content: 79879879,
      time: this.formatTime(),
      isOwn: false,
      type: "text",
    }]
    this.setData(
      {
        allMessages: init ? newMessages : [...newMessages, ...this.data.allMessages],
        messages: this.getVisibleMessages(),
      },
      () => {
        loading = false;
        if (init) this.scrollToBottom();
      },
    );
  },

  // 获取可视区域消息（性能优化关键）
  getVisibleMessages() {
    return this.data.allMessages.slice(-PAGE_SIZE +1);
  },

  // 发送消息
  sendMessage() {
    const newMsg = {
      id: Date.now(),
      content: this.data.inputText,
      time: this.formatTime(),
      isOwn: true,
      type: "text",
    };
    
    this.updateMessages(newMsg);
    this.resetInput();
     this.scrollToBottom();
  },

  bindKeyInput(e) {

    
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
    console.log(this.data.inputText)
  },
  resetInput() {
    this.setData({
      inputText: ''
    })
  },
  // 图片上传
  async uploadImage() {
    const res = await wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
    });

    const newMsg = {
      id: Date.now(),
      content: res.tempFiles[0].tempFilePath,
      time: this.formatTime(),
      isOwn: true,
      type: "image",
    };

    this.updateMessages(newMsg);
    this.scrollToBottom();
  },

  // 优化消息更新（使用diff算法）
  updateMessages(newMsg) {
    this.setData({
      allMessages: [...this.data.allMessages, newMsg],
      messages: this.getVisibleMessages(),
    });
    console.log(this.data)
  },

  // 滚动优化：自动到底部
  scrollToBottom() {
    this.setData({ scrollTop: 99999 });
  },

  // 时间格式化
  formatTime() {
    return new Date().toLocaleTimeString("zh-CN", { hour12: false });
  },
});
