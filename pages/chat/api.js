// pages/chat/index.js
Page({
  // ...原有其他代码...

  // 修改后的消息加载方法
  async loadMessages(init = false) {
    if (loading) return;
    loading = true;
    
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      
      const newMessages = await this.fetchMessages({
        page: this.currentPage,
        page_size: PAGE_SIZE
      });

      this.setData({
        allMessages: init ? newMessages : [...newMessages, ...this.data.allMessages],
        messages: this.getVisibleMessages()
      }, () => {
        loading = false;
        wx.hideLoading();
        if (init) this.scrollToBottom();
      });

      // 成功加载后页码+1
      if (newMessages.length > 0) this.currentPage++;
      
    } catch (error) {
      loading = false;
      wx.hideLoading();
      this.showErrorToast(error.message);
    }
  },

  // 真实网络请求方法
  fetchMessages(params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'xx', // 替换为实际API地址
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xx' // 替换为实际token
        },
        data: {
          ...params,
          // 可添加其他固定参数
          // user_id: 'xx' 
        },
        timeout: 5000,
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 0) {
            resolve(this.normalizeMessages(res.data.list));
          } else {
            reject(new Error(res.data.msg || '请求失败'));
          }
        },
        fail: (err) => {
          reject(new Error(this.getNetworkErrorMsg(err)));
        }
      });
    });
  },

  // 数据标准化处理
  normalizeMessages(list) {
    return list.map(item => ({
      id: item.msg_id,
      content: item.content,
      type: item.msg_type || 'text',
      time: this.formatServerTime(item.create_time),
      isOwn: item.sender_id === this.userId
    }));
  },

  // 错误提示处理
  showErrorToast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    });
  },

  // 网络错误类型判断
  getNetworkErrorMsg(err) {
    const errorMap = {
      'request:fail timeout': '请求超时',
      'request:fail': '网络连接失败'
    };
    return errorMap[err.errMsg] || '服务器异常';
  },

  // 服务端时间格式化
  formatServerTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
});