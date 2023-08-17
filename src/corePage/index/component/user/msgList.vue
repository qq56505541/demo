<template>
  <ta-drawer
    :visible="visible"
    destroy-on-close
    width="350px"
    wrap-class-name="msg-list"
    :get-container="setContainer"
    @close="close"
  >
    <h4 class="msg-head" :class="{'msg-new': newMsgSize>0}">
      {{ $t('news.newsTitle') }}（{{ newMsgSize }} {{ $t('news.unread') }}）
      <ta-icon type="sync" class="refresh" @click="refreshMessage" />
      <span style="margin: 0px 20px" class="refresh" @click="openRecord">{{ $t('news.more') }}</span>
    </h4>
    <ta-tabs v-model="tabType" default-active-key="1" class="fit" type="card" @change="tabChange">
      <ta-tab-pane key="0" :tab="$t('news.noticeUnread')">
        <template
          v-for="(item,index) in messageList"
        >
          <div
            v-if="item.readSign == '0'"
            :key="item.mId"
            class="msg-item new"
            :class="{'active': item == clickIndex}"
          >
            <ta-checkbox :checked="item.checked" @click="checkNotice(item)" />
            <ta-icon v-if="item.type=='01'" type="sound" style="color: #ca1064; margin-left: 10px" />
            <ta-icon v-else-if="item.type.indexOf('02') == 0" type="form" style="color: #04b2dc; margin-left: 10px" />
            <ta-icon v-else-if="item.type=='03'" type="mail" style="color: #108ee9; margin-left: 10px" />
            <ta-icon v-show="item.readSign=='0'" type="exclamation-circle-o" style="color: red" />
            <div style="cursor: pointer;" @click="clickDetail(item)">
              <div class="msg-title">
                {{ item.title }}
              </div>
              <div class="msg-content" v-html="item.content">
                {{ item.content }}
              </div>
              <div class="msg-time">
                {{ item.senderName }} {{ item.sendDate }}
              </div>
            </div>
          </div>
        </template>
      </ta-tab-pane>
      <ta-tab-pane key="1" :tab="$t('news.noticeRead')">
        <template v-for="(item,index) in messageList">
          <div
            v-if="item.readSign!='0'"
            :key="item.mId"
            class="msg-item new"
            :class="{'active': item == clickIndex}"
          >
            <ta-checkbox :checked="item.checked" @click="checkNotice(item)" />
            <ta-icon v-if="item.type=='01'" type="sound" style="color: #ca1064; margin-left: 10px" />
            <ta-icon v-else-if="item.type.indexOf('02') == 0" type="form" style="color: #04b2dc; margin-left: 10px" />
            <ta-icon v-else-if="item.type=='03'" type="mail" style="color: #108ee9; margin-left: 10px" />
            <div style="cursor: pointer;" @click="clickDetail(item)">
              <div class="msg-title">
                {{ item.title }}
              </div>
              <div class="msg-content" v-html="item.content">
                {{ item.content }}
              </div>
              <div class="msg-time">
                {{ item.senderName }} {{ item.sendDate }}
              </div>
            </div>
          </div>
        </template>
      </ta-tab-pane>
      <ta-tab-pane key="2" :tab="$t('news.privateLetter')">
        <div
          v-for="item in messageList2"
          :key="item.chatId"
          class="msg-item msg-item-letter"
          :class="{'active': item == clickIndex,'new': item.newLetter == '1'}"
          @click="clickDetail2(item)"
        >
          <div class="msg-content">
            {{ item.twoName }}<span v-show="item.chatId!='0'" class="msg-content-op" @click="removeChat(item,$event)">{{ $t('delete') }}</span>
          </div>
        </div>
      </ta-tab-pane>
    </ta-tabs>
    <div v-if="showDetail" class="msg-detail" style="padding-top: 70px;width:500px">
      <div class="detail-title">
        <span>{{ title }}</span>
        <span>{{ $t('news.sender') }}：{{ sender.name }}</span>
      </div>
      <div class="msg-detail-con">
<!--        <div class="msg-detail-detail" v-html="htmlDecode(content)" />-->
        <div class="msg-detail-detail" v-html="content" />
        <div v-show="noticeFileList!=null && noticeFileList.length>=1">
          <ta-divider orientation="left">
            {{ $t('news.files') }}
          </ta-divider>
          <ta-list item-layout="horizontal" :data-source="noticeFileList">
            <ta-list-item slot="renderItem" slot-scope="item">
              <a :href="backUrl+'/message/downloadNoticeFile?annexId='+item.annexId">
                <ta-icon type="download" style="color: #0f990f" />
                {{ item.annexName }}</a>
            </ta-list-item>
          </ta-list>
        </div>
      </div>
      <div class="msg-detail-foot">
        <ta-button v-if="messageType=='03'" type="primary" @click="clickSend()">
          {{ $t('news.reply') }}
        </ta-button>
        <ta-button v-else-if="messageType.indexOf('02') == 0" type="primary" @click="clickOpen()">
          {{ $t('news.accessFunction') }}
        </ta-button>
        <ta-button @click="clickRemove()">
          {{ $t('delete') }}
        </ta-button>
      </div>
    </div>
    <div v-if="showDetail2" class="msg-detail" style="width:500px">
      <span class="detail-title">{{ sender.name }}</span>
      <div class="msg-detail-con">
        <div class="chat-content">
          <div v-show="chatId!='0'" class="chat-detail-item tip">
            <span class="chat-history" @click="chatHistory">{{ $t('news.history') }}</span>
            ({{ $t('news.saved') }})
          </div>
          <div v-for="item in chatList" :key="item.mId">
            <div v-if="item.senderId!=nowUserId||item.owner=='you'" class="chat-detail-item you">
              <div class="cd-item-time">
                {{ item.sendDate }}
              </div>
              <div class="cd-item-content-wrapper clearfix">
                <div class="cd-item-avatar-wrapper">
                  <ta-avatar style="backgroundColor:#87d068" size="default">
                    {{ item.senderName.substring(0,1) }}
                  </ta-avatar>
                </div>
                <div class="cd-item-content">
                  <i class="cd-item-content-arrow-left" />
                  <span class="cd-item-content-text" v-html="item.content">{{ item.content }}</span>
                  <span class="cd-item-content-state " />
                </div>
              </div>
            </div>
            <div v-else class="chat-detail-item me">
              <div class="cd-item-time">
                {{ item.sendDate }}
              </div>
              <div class="cd-item-content-wrapper clearfix">
                <div class="cd-item-avatar-wrapper">
                  <ta-avatar style="color: #f56a00; backgroundColor: #fde3cf" size="default">
                    {{ item.senderName.substring(0,1) }}
                  </ta-avatar>
                </div>
                <ta-spin v-show="item.type == '0'" size="small" />
                <div class="cd-item-content">
                  <i class="cd-item-content-arrow-right" />
                  <span class="cd-item-content-text">{{ item.content }}</span>
                  <span class="cd-item-content-state " />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ta-textarea v-model="content2" class="chat-content-say" :placeholder="$t('news.inputContent')" @keydown="inputKeydown" />
      </div>
      <div class="msg-detail-foot">
        <ta-button type="primary" @click="clickSend2()">
          {{ $t('news.send') }}
        </ta-button>
        <ta-button @click="clickClear2()">
          {{ $t('news.clear') }}
        </ta-button>
        <ta-button @click="showDetail2=false">
          {{ $t('news.close') }}
        </ta-button>
      </div>
    </div>
    <div v-if="tabType=='0' || tabType=='1'" slot="footer">
      <ta-dropdown>
        <ta-menu slot="overlay" @click="clickNewNotice">
          <ta-menu-item key="01">
            {{ $t('news.systemNotice') }}
          </ta-menu-item>
          <ta-menu-item key="03">
            {{ $t('news.generalNotice') }}
          </ta-menu-item>
        </ta-menu>
        <ta-button type="primary" style="padding: 0px 10px;">
          {{ $t('news.new') }}<ta-icon type="up" />
        </ta-button>
      </ta-dropdown>
      <ta-button style="padding: 0 5px;" @click="checkNotices()">
        {{ $t('news.selectAll') }}
      </ta-button>
      <ta-button style="padding: 0 5px;" @click="removeNotices()">
        {{ $t('delete') }}
      </ta-button>
      <ta-button style="padding: 0 5px;" @click="readNotices()">
        {{ $t('news.markRead') }}
      </ta-button>
    </div>
    <div v-else-if="tabType=='2'" slot="footer">
      <ta-button type="primary" style="padding: 0px 10px;" @click="clickShowSelectUserModal">
        {{ $t('news.addContacts') }}
      </ta-button>
    </div>
    <div v-if="showSend" class="msg-send msg-detail">
      <span class="detail-title">{{ title }}</span>
      <div class="msg-detail-con">
        <ta-form :auto-form-create="(form)=>{this.form = form}">
          <ta-form-item :label="$t('news.receiver')" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
            <ta-user-select
              id="withTag"
              ref="withTag"
              :props="userDefaultProps"
              :load="loadOrgTreeNode"
              :user-list-data="relationUserListData"
              :pagination="true"
              :with-tag="true"
              @close="fnCloseUserModal"
              @search="fnSearchUser"
              @queryUserList="fnQueryUserList"
              @getUserListResult="fnGetUserListResult"
            />
          </ta-form-item>
          <ta-form-item :label="$t('news.theme')" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
            <ta-input v-model="sendTitle" />
          </ta-form-item>
          <ta-form-item>
            <ta-upload
              name="file"
              :multiple="true"
              :action="backUrl+'/message/uploadNoticeFile'"
              :with-credentials="true"
              :before-upload="beforeUploadNoticeFile"
              :file-list="uploadFileList"
              @change="handleUploadChange"
            >
              <ta-button>
                <ta-icon type="upload" />
                {{ $t('news.uploadFiles') }}
              </ta-button>
            </ta-upload>
          </ta-form-item>
          <div style="width: 100%">
            <ta-rich-editor ref="richEditor" style="height: 400px" />
          </div>
        </ta-form>
      </div>
      <div class="msg-detail-foot">
        <ta-button type="primary" @click="sendNotice()">
          {{ $t('news.send') }}
        </ta-button>
        <ta-button @click="close()">
          {{ $t('news.close') }}
        </ta-button>
      </div>
    </div>
    <ta-modal v-model="userModal" :title="$t('news.userSelect')" height="300px" @ok="userSelectOk" @close="userModal=false">
      <ta-user-input
        :org-load-fn="handleLoadOrgNode"
        :user-load-fn="handleQueryUserList"
        :user-select-call="handleGetUserListResult"
      />
    </ta-modal>
  </ta-drawer>
</template>
<script type="text/jsx">
import { Base64, } from 'js-base64'
import Notify from '@wcjiang/notify'
import $api from './api'

const MESSAGETYPE_NOTICE_SYSTEM = '01'
const MESSAGETYPE_NOTICE_BUSSINESS = '02'
const MESSAGETYPE_NOTICE_USER = '03'
const MESSAGETYPE_LETTER_USER = '04'
const MESSAGETYPE_LETTER_AI = '05'
let backPath, uid, cr, rm, re, ks, count
const AUDIO_FILE = ['audio/chang.wav', 'audio/dingdingding.wav', 'audio/duanxin.wav', 'audio/mofabang.wav', 'audio/rtx.wav']
const notify = new Notify({
  message: '有消息了!', // 标题
  effect: 'flash', // flash | scroll 闪烁还是滚动
  // openurl: 'index.html', // 点击弹窗打开连接地址
  // onclick: () => { // 点击弹出的窗之行事件
  //   console.log('---')
  // },
  // 可选播放声音
  audio: {
    // 可以使用数组传多种格式的声音文件
    // file: ['audio/chang.wav', 'audio/dingdingding.wav', 'audio/duanxin.wav', 'audio/mofabang.wav', 'audio/rtx.wav']
    // 下面也是可以的哦
    file: 'audio/dingdingding.wav',
  },
  // 标题闪烁，或者滚动速度
  interval: 1000,
  // 可选，默认绿底白字的  Favicon
  updateFavicon: {
    // favicon 字体颜色
    textColor: '#fff',
    // 背景颜色，设置背景颜色透明，将值设置为“transparent”
    backgroundColor: '#2F9A00',
  },
  // 可选chrome浏览器通知，默认不填写就是下面的内容
  notification: {
    title: '通知！', // 设置标题
    icon: '', // 设置图标 icon 默认为 Favicon
    body: '您来了一条新消息,来自 - TA404', // 设置消息内容
  },
})

const HtmlUtil = {
  /* 1.用浏览器内部转换器实现html转码 */
  htmlEncode: function (html) {
    // 1.首先动态创建一个容器标签元素，如DIV
    let temp = document.createElement('div');
    // 2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
    (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html)
    // 3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
    const output = temp.innerHTML
    temp = null
    return output
  },
  /* 2.用浏览器内部转换器实现html解码 */
  htmlDecode: function (text) {
    // 1.首先动态创建一个容器标签元素，如DIV
    let temp = document.createElement('div')
    // 2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
    temp.innerHTML = text
    // 3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
    const output = temp.innerText || temp.textContent
    temp = null
    return output
  },
}
export default {
  name: 'msgList',
  props: ['visible'],
  data () {
    return {
      userDefaultProps: {
        treeNodeKey: 'orgId',
        treeLabel: 'label',
        treeChildren: 'children',
        treeIsLeaf: 'isLeaf',
        listKey: 'userId', // 每条用户信息的唯一标识（默认：userId）
        listTitle: 'name', // 用户信息第一行显示内容
        listSubTitle: 'mobile', // 用户信息第二行显示内容
        listDescription: 'namePath', // 用户信息鼠标移上去显示描述信息
      },
      relationUserListData: [], // 点击左侧组织查询到的用户信息
      userSelectData: [],
      userListData: [],
      searchData: [],

      selectedUserId: '',
      selectedLoginId: '',
      selectedName: '',
      // 显示用
      tabType: '0',
      userModal: false,
      // 通知
      backUrl: '',
      currentUploadFile: {},
      uploadFileList: [],
      uploadFileIds: null,
      messageList: [],
      checkboxList: [],
      userList: [],
      selectUsers: [],
      clickIndex: '',
      showDetail: false,
      showSend: false,
      mId: '',
      content: '',
      sender: {},
      title: '',
      menuUrl: '',
      // 附件
      hasFile: false,
      noticeFileList: [],
      // 发送用
      nowUserId: '',
      nowUserName: '',
      nowLoginId: '',
      sendTitle: '',
      sendContext: '',
      messageType: '',
      // 私信
      messageList2: [{
        chatId: '0',
        twoUserId: '000001',
        twoName: this.$t('news.xiaoY'),
        chatList: [{
          mId: '11',
          owner: 'you',
          content: this.$t('news.helloY'),
          time: '2019-08-25 14:02:15',
          senderId: '000001',
          senderName: this.$t('news.Y'),
        }],
      }],
      chatId: '',
      chatList: [],
      showDetail2: false,
      content2: '',
      colorList: ['#1B65B9'],
      nameColor: '',
    }
  },
  computed: {
    newMsgSize () {
      return this.messageList.filter(a => a.readSign === '0').length
    },
  },
  watch: {
    newMsgSize: {
      handler: function (now, old) {
        this.$emit('update:noticeNum', this.newMsgSize)
      },
    },
  },
  mounted () {
    this.$store.dispatch('setUserInfo').then((userInfo) => {
      count = 0
      uid = this.nowUserId = userInfo.userId
      this.nowLoginId = userInfo.loginId
      if (typeof uid != 'string') {
        this.$message.error(this.$t('news.notLogin'))
        return
      }
      this.nowUserName = userInfo.userName
      rm = this.receiveMessage
      re = this.reconnect
      cr = this.createWebSocket
      this.Base.submit(null, {
        url: 'message/queryAddress',
      }, {
        successCallback: (result) => {
          if (faceConfig.basePath.indexOf('http') >= 0) {
            this.backUrl = faceConfig.basePath
          } else {
            this.backUrl = 'http://' + result.data.ip + ':' + result.data.port + faceConfig.basePath
          }
          backPath = this.backUrl.replace('http://', '')
          cr(backPath)
        },
      })
      this.queryUserMessage(this.nowUserId)
    })
  },
  methods: {
    ...HtmlUtil,
    createWebSocket (path) {
      let websocket
      try {
        if ('WebSocket' in window) {
          websocket = new WebSocket('ws://' + path + '/webSocketServer2')
        } else if ('MozWebSocket' in window) {
          websocket = new MozWebSocket('ws://' + path + '/webSocketServer2')
        } else {
          websocket = new SockJS('http://' + path + '/sockjs/webSocketServer')
        }
      } catch (err) {
        console.log('该浏览器无法正常使用websocket: ' + err)
      }
      if (typeof websocket !== 'undefined') {
        websocket.onopen = function (event) {
          console.log('webSocket open')
          count = 0
          websocket.send(uid)
        }
        websocket.onmessage = function (event) {
          if (event.data != 'pong') {
            rm(JSON.parse(event.data))
          }
        }
        websocket.onerror = function (event) {
          console.log('webSocket连接断开')
        }
        websocket.onclose = function (event) {
          console.log('webSocket连接关闭')
          count++
          if (count <= 3) {
            console.log('webSocket开始重新连接')
            re(path)
          }
        }
      }
      // 定时心跳
      // this.keepAlive(websocket)
    },
    reconnect (path) {
      setTimeout(function () {
        cr(path)
      }, 2000)
    },
    keepAlive (ws) {
      if (ks) {
        clearInterval(ks)
      }
      ks = setInterval(function () {
        ws.send('ping')
      }, 30000)
    },
    fnSearchUser (value) {
    },
    // 加载左侧组织树
    loadOrgTreeNode (node, resolve) {
      if (node.level === 0) {
        $api.queryAllTaOrg(null, data => {
          // 数据成功后默认返回的数据
          const orgVos = data.data.orgTreeData
          if (orgVos[0] && orgVos[0].children && (orgVos[0].children instanceof Array) && orgVos[0].children.length > 0) {
            const dd = orgVos[0].children.map(v => {
              const obj = v
              if (v.childNum > 0) {
                obj.children = []
              }
            })
            orgVos[0].children = dd
          }
          return resolve(orgVos)
        })
      }
      if (node.level >= 1) {
        const orgId = node.data.orgId
        const isLeaf = node.data.isLeaf
        const data = {
          orgId: orgId,
        }
        $api.queryAllTaOrg(data, data => {
          // 数据成功后默认返回的数据
          let dd = data.data.orgTreeData
          if (isLeaf) {
            dd = dd.map(v => {
              const obj = v
              obj.children = []
            })
          }
          return resolve(dd)
        })
      }
    },
    // 关闭人员选择模态框
    fnCloseUserModal (value) {
    },

    fnQueryUserList (orgId, includeChildren, pageNum, searchType, searchParam) {
      // 查询用户信息
      const data = {
        orgId: orgId,
        showChildUser: includeChildren ? '1' : '0',
        pageNumber: pageNum,
        pageSize: 10,
      }
      if (searchType) {
        data[searchType] = searchParam
      }
      $api.queryBatchUserByOrgId(data, (data) => {
        this.relationUserListData = data.data.userList.list
      })
    },
    // 确认选择的人员信息
    fnGetUserListResult (data, addId, deleteId) {
      this.selectUsers = []
      data.forEach(a => {
        this.selectUsers.push(a.userId)
      })
    },

    handleLoadOrgNode (node, resolve) {
      const nodeOrgId = (node.data && node.data.orgId) || ''
      $api.queryAllTaOrg({ orgId: nodeOrgId, }, (data) => {
        resolve(data.data.orgTreeData)
      })
    },

    handleGetUserListResult (dataObj) {
      if (dataObj) {
        this.selectedUserId = dataObj.userId
        this.selectedLoginId = dataObj.loginId
        this.selectedName = dataObj.name
      }
    },

    handleQueryUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam, }, resolve) {
      $api.queryUserList({
        orgId,
        userId,
        includeChild,
        pageSize,
        pageNum,
        searchVal,
        searchType,
        searchParam,
      }, (data) => {
        resolve(data.data.userList.list)
      })
    },

    setContainer () {
      return document.body
    },
    refreshMessage () {
      this.queryUserMessage(this.nowUserId)
    },
    openRecord () {
      Base.openTabMenu({ url: 'messagemg.html#/recordMg', id: 'messageRecord', name: this.$t('news.recycle'), })
    },
    tabChange (value) {
      this.tabType = value
      if (value === '0' || value === '1') {
        this.showDetail2 = false
      } else if (value === '2') {
        this.showDetail = false
        this.showSend = false
      }
    },
    /**
       * notice
       */
    clickDetail (item) {
      this.clickIndex = item
      this.showDetail = true
      this.showDetail2 = false
      this.showSend = false
      this.uploadFileIds = null
      this.mId = item.mId
      this.content = item.content
      this.title = item.title
      this.sender.name = item.senderName
      this.sender.id = item.senderId
      this.messageType = item.type
      this.menuUrl = item.menuUrl
      if (item.readSign === '0') {
        if (item.menuUrl) {
          Base.openTabMenu({ url: this.menuUrl, id: 'messageOpen', name: this.title, })
        }
        this.Base.submit(null, {
          url: 'message/readNotice',
          data: { mId: item.mId, userId: this.nowUserId, },
        })
        item.readSign = '1'
      }
      if (!(this.noticeFileList = item.noticeFileList)) { // 查询附件
        this.Base.submit(null, {
          url: 'message/queryNoticeFiles',
          data: { mId: item.mId, },
        }, {
          successCallback: (result) => {
            this.noticeFileList = item.noticeFileList = result.data.noticeFileList
          },
        })
      }
    },
    clickNewNotice (e) {
      this.messageType = e.key
      this.title = this.messageType == '01' ? this.$t('news.systemNotice') : this.$t('news.generalNotice')
      this.showDetail = false
      this.showSend = true
      this.selectUsers = []
      this.$refs.withTag?.deleteAll()
      this.sendTitle = ''
      this.$refs.richEditor?.clearContent()
      this.uploadFileList = []
    },
    checkNotice (item) {
      item.checked = !item.checked
    },
    checkNotices () {
      const sign = this.tabType
      const index = this.messageList.findIndex(a => a.readSign === sign)
      if (index >= 0) {
        const c = !this.messageList[index].checked
        this.messageList.filter(a => a.readSign === sign).forEach(a => a.checked = c)
        // for (const item in this.messageList) {
        //   this.messageList[item].checked = c
        // }
      }
    },
    removeNotices () {
      const sign = this.tabType
      const mIds = this.messageList.filter(a => a.checked && a.readSign === sign).map(a => a.mId).join(',')
      if (!mIds || mIds.length == 0) {
        message.warn('请勾选要删除的数据!')
        return
      }
      this.Base.submit(null, {
        url: 'message/removeNotices',
        data: { mIds: mIds, userId: this.nowUserId, },
      }, {
        successCallback: (result) => {
          this.queryUserMessage(this.nowUserId)
          // this.messageList = result.data.notice
        },
      })
    },
    readNotices () {
      const mIds = this.messageList.filter(a => a.checked).map(a => {
        a.readSign = '1'
        return a.mId
      }).join(',')
      if (!mIds || mIds.length == 0) {
        message.warn('请勾选要标记的数据!')
        return
      }
      this.Base.submit(null, {
        url: 'message/readNotices',
        data: { mIds: mIds, userId: this.nowUserId, },
      }, {
        successCallback: (result) => {

        },
      })
    },
    handleUploadChange (upload) {
      const list = upload.fileList
      if (upload.file.status === 'done' && upload.file.response) {
        if (upload.file.response.code === 200 && upload.file.response.data.fileId) {
          list.forEach(a => {
            if (a.uid === upload.file.uid) {
              a.status = 'success'
              a.fileId = upload.file.response.data.fileId
            }
          })
          this.$message.success(this.$t('news.uploadSucceeded'))
        } else {
          list.forEach(a => {
            if (a.uid === upload.file.uid) {
              a.status = 'error'
            }
          })
          this.$message.error(upload.file.response.errors[0].msg)
        }
      }
      this.uploadFileList = list
    },
    beforeUploadNoticeFile (file, fileList) {
      // this.currentUploadFile = file
      // this.uploadFileList = fileList
      if (file.size > 20971520) { // 20M
        this.$message.error(this.$t('news.uploadRules'))
        file.status = 'error'
        return false
      }
      return true
    },
    uploadNoticeFile (upload) {
      this.Base.submit(null, {
        url: 'message/uploadNoticeFile',
        data: { file: upload.file, },
        isFormData: true,
      }, {
        successCallback: (result) => {
          console.log(result.data.fileId)
          if (this.uploadFileIds == null) {
            this.uploadFileIds = result.data.fileId
          } else {
            this.uploadFileIds += ',' + result.data.fileId
          }
          upload.status = 'done'
        },
      })
    },
    clickOpen () {
      Base.openTabMenu({ url: this.menuUrl, id: 'messageOpen', name: this.title, })
    },
    clickSend () {
      this.showDetail = false
      this.showSend = true
      this.selectUsers = []
      this.selectUsers.push(this.sender.id)
      this.sendTitle = 'Re: ' + this.title
      this.title = this.$t('news.reply') + this.title
    },
    clickRemove () {
      this.Base.submit(null, {
        url: 'message/removeNotices',
        data: { mIds: this.mId, userId: this.nowUserId, },
      }, {
        successCallback: (result) => {
          const index = this.messageList.findIndex(a => a.mId === this.mId)
          this.messageList.splice(index, 1)
          this.showDetail = false
        },
      })
    },
    returnDetail () {
      this.showDetail = true
      this.showSend = false
      this.uploadFileIds = null
    },
    sendNotice () {
      const msg = {}
      msg.title = this.sendTitle
      msg.content = Base64.encode(this.$refs.richEditor.getHtml())
      msg.senderId = this.nowUserId
      msg.senderName = this.nowUserName
      msg.type = this.messageType
      msg.readSign = '0'
      const voStr = JSON.stringify(msg)
      const userIds = this.selectUsers.join(',')
      if (userIds.length === 0) {
        this.$message.error(this.$t('news.receiverEmpty'))
        return
      }
      if (msg.title.length === 0) {
        this.$message.error(this.$t('news.titleEmpty'))
        return
      }
      if (this.$refs.richEditor.getText().length === 0) {
        this.$message.error(this.$t('news.contentEmpty'))
        return
      }

      const uploadFileIds = this.uploadFileList.filter(a => a.fileId).map(a => a.fileId).join(',')
      this.Base.submit(null, {
        url: 'message/sendNotice2',
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        // autoQs: false,
        data: { userIds: userIds, voStr: voStr, annexIds: uploadFileIds, },
      }, {
        successCallback: (result) => { // 发送成功
          this.$message.info(this.$t('news.sendSuccess'))
          this.sendTitle = ''
          this.$refs.richEditor.clearContent()
          this.uploadFileList = []
          this.$refs.withTag?.deleteAll()
        },
      })
    },
    /**
       * letter
       */
    clickDetail2 (item) {
      this.clickIndex = item
      this.showDetail = false
      this.showDetail2 = true
      this.chatId = item.chatId
      this.sender.name = item.twoName
      this.sender.id = item.twoUserId
      this.messageType = item.type
      const index = item.chatId.charCodeAt() % 4
      this.nameColor = this.colorList[index]
      this.chatList = item.chatList
      if (item.chatList.length > 0) {
        this.Base.submit(null, {
          url: 'message/readLetter',
          data: { chatId: this.chatId, userId: this.nowUserId, },
        }, {
          successCallback: (result) => {
          },
        })
      } else if (item.newLetter === '1') {
        // search
        this.Base.submit(null, {
          url: 'message/queryUserLetterNoRead',
          data: { chatId: this.chatId, userId: this.nowUserId, },
        }, {
          successCallback: (result) => {
            this.chatList = item.chatList = result.data.letterList
          },
        })
      }
      item.newLetter = '0'
    },
    clickShowSelectUserModal () {
      this.userModal = true
    },

    userSelectOk () {
      if (this.selectedLoginId === '') {
        this.userModal = false
        return
      }
      const ul = [this.selectedUserId, this.selectedLoginId, this.selectedName]
      let chatId
      if (ul[1] === this.nowLoginId) {
        this.$message.info(this.$t('news.chooseSelf'))
        return
      }
      if (ul[1] > this.nowLoginId) {
        chatId = ul[1] + '-' + this.nowLoginId
      } else {
        chatId = this.nowLoginId + '-' + ul[1]
      }
      if (this.messageList2.filter(a => a.chatId === chatId).length > 0) {
        // do nothing
      } else {
        const chat = {
          chatId: chatId,
          twoUserId: ul[0],
          twoName: ul[2],
          chatList: [],
        }
        this.Base.submit(null, {
          url: 'message/createChat',
          data: { chatId: chatId, owner: this.nowUserId, twoUserId: ul[0], twoName: ul[2], },
        }, {
          successCallback: (result) => {
            this.messageList2.push(chat)
          },
        })
      }
      this.userModal = false
    },
    removeChat (chat, e) {
      e.stopPropagation()
      this.Base.submit(null, {
        url: 'message/removeChat',
        data: { chatId: chat.chatId, userId: this.nowUserId, },
      }, {
        successCallback: (result) => {
          const index = this.messageList2.findIndex(a => a.chatId === chat.chatId)
          this.messageList2.splice(index, 1)
        },
      })
    },
    clickSend2 () {
      if (this.content2.length === 0) {
        this.$message.error(this.$t('news.contentEmpty'))
        return
      }
      const msg = {
        chatId: this.chatId,
        senderId: this.nowUserId,
        senderName: this.nowUserName,
        receiverId: this.sender.id,
        content: this.content2,
        type: '0',
        readSign: '0',
      }
      msg.owner = 'me'
      msg.sendDate = (new Date()).toLocaleString()
      this.content2 = ''
      this.chatList.push(msg)
      if (this.chatId === '0') {
        this.chatList.push(this.reply(msg.content))
        msg.type = MESSAGETYPE_LETTER_USER
        return
      }
      msg.sendDate = ''
      // 后台发送
      this.Base.submit(null, {
        url: 'message/sendLetter2',
        data: { receiverId: msg.receiverId, voStr: JSON.stringify(msg), },
      }, {
        successCallback: (result) => {
          msg.type = MESSAGETYPE_LETTER_USER
        },
      })
    },
    reply (content) {
      const msg = {}
      msg.owner = 'you'
      // msg.sendDate = (new Date()).toLocaleString()
      msg.senderId = '000001'
      msg.senderName = this.$t('news.Y')
      if (content.indexOf('help') !== -1) {
        msg.content = '<a target="_blank" href="http://114.116.130.110/docs/#/docs/infos/vue/introduce-cn">' + this.$t('news.helpDocument') + '</a>'
      } else if (content === '1') {
        msg.content = '<a target="_blank" href="http://114.116.130.110/docs/#/docs/infos/vue/introduce-cn">' + this.$t('news.helpDocument') + '</a>'
      } else if (content === '2') {
        msg.content = '<a target="_blank" href="http://www.baidu.com">' + this.$t('news.projectIntroduction') + '</a>'
      } else if (content === '3') {
        msg.content = this.$t('news.noData')
      } else if (content === '4') {
        msg.content = this.$t('news.support')
      } else if (content === '5') {
        msg.content = this.$t('news.suggest')
      } else {
        const num = Math.ceil(Math.random() * 10)
        switch (num) {
          case 1:
            msg.content = this.$t('news.AI.msg1')
            break
          case 2:
            msg.content = this.$t('news.AI.msg2')
            break
          case 3:
            msg.content = this.$t('news.AI.msg3')
            break
          case 4:
            msg.content = this.$t('news.AI.msg4')
            break
          case 5:
            msg.content = this.$t('news.AI.msg5')
            break
          default:
            msg.content = content.replace('你', '我').replace('you', 'I').replace('不', '').replace('吗', '').replace('?', '!').replace('？', '！')
        }
      }
      return msg
    },
    inputKeydown (e) { // 私信输入框 ctrl+enter 发送事件
      if (e.ctrlKey) {
        if (e.keyCode === 13) {
          this.clickSend2()
        }
      }
    },
    clickClear2 () { // 私信 清空聊天记录
      this.chatList = []
    },
    chatHistory () { // 私信 历史记录
      this.Base.submit(null, {
        url: 'message/queryUserLetter',
        data: { chatId: this.chatId, },
      }, {
        successCallback: (result) => {
          this.chatList = result.data.letterList
        },
      })
    },
    close () {
      this.showDetail = false
      this.showDetail2 = false
      this.showSend = false
      this.uploadFileIds = null
      this.uploadFileList = []
      this.clickIndex = ''
      this.tabType = '0'
      this.$emit('close')
    },
    queryUserMessage (userId) { // 进入首页查询消息
      this.Base.submit(null, {
        url: 'message/queryUserMessage',
        data: { userId: this.nowUserId, sign: '002', },
      }, {
        successCallback: (result) => {
          result.data.notice.forEach(a => a.checked = false)
          this.messageList = result.data.notice
          if (result.data.chat && result.data.chat.length > 0) {
            this.messageList2 = this.messageList2.slice(0, 1)
            this.messageList2.push.apply(this.messageList2, result.data.chat)
            this.messageList2.forEach(a => {
              if (!a.chatList) {
                a.chatList = []
              }
            })
          }
        },
      })
    },
    receiveMessage (msg) { // 收到推送消息，新消息提醒
      let icon = <ta-icon type="question" style="color: #182027"/>
      if (MESSAGETYPE_NOTICE_SYSTEM === msg.type) {
        icon = <ta-icon type="sound" style="color: #ca1064"/>
        this.receiveNotice(msg, icon)
      } else if (msg.type.indexOf(MESSAGETYPE_NOTICE_BUSSINESS) === 0) {
        icon = <ta-icon type="form" style="color: #04b2dc"/>
        this.receiveNotice(msg, icon)
      } else if (MESSAGETYPE_NOTICE_USER === msg.type) {
        icon = <ta-icon type="mail" style="color: #108ee9"/>
        this.receiveNotice(msg, icon)
      } else if (MESSAGETYPE_LETTER_USER === msg.type) {
        icon = <ta-icon type="bell" style="color: #becc09"/>
        this.receiveLetter(msg, icon)
      } else if (MESSAGETYPE_LETTER_AI === msg.type) {
        icon = <ta-icon type="bell" style="color: #dc7d04"/>
        this.receiveLetter(msg, icon)
      }
    }, // receiveMessage end
    receiveNotice (msg, icon) {
      msg.checked = false
      // this.messageList.push(msg)
      this.messageList.unshift(msg)
      this.showReceiveNotice(msg, icon)
      if (msg.type.indexOf(MESSAGETYPE_NOTICE_BUSSINESS) === 0) {
        const c = parseInt(msg.type.charAt(msg.type.length - 1)) % 5
        notify.setURL(AUDIO_FILE[c])
      }
      notify.player()
      notify.notify({})
    },
    receiveLetter (msg, icon) {
      let noChat = true
      let chat
      for (const item in this.messageList2) {
        if (this.messageList2[item].chatId === msg.chatId) {
          noChat = false
          this.messageList2[item].chatList.push(msg)
          this.messageList2[item].newLetter = '1'
          chat = this.messageList2[item]
          break
        }
      }
      if (noChat) {
        chat = {
          chatId: msg.chatId,
          twoUserId: msg.senderId,
          twoName: msg.senderName,
          newLetter: '1',
          chatList: [],
        }
        chat.chatList.push(msg)
        this.messageList2.push(chat)
      }
      this.showReceiveLetter(msg, icon, chat)
    },
    showReceiveNotice (msg, icon) { // 收到notice
      const key = msg.mId
      notification.open({
        message: msg.title,
        description: (h) => {
          return h('div', {
            style: {
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
              'max-height': '100px',
            },
            domProps: {
              innerHTML: msg.content,
            },
          })
        },
        duration: 4.5,
        icon: icon,
        btn: (h) => {
          return h('ta-button', {
            props: {
              type: 'primary',
              size: 'small',
            },
            on: {
              click: () => this.openNoticeDetail(msg),
            },
          }, this.$t('news.detail'))
        },
        key,
        // onClose: close
      })
    },
    openNoticeDetail (msg) {
      this.$emit('update:visible', true)
      this.tabType = '0'
      this.clickDetail(msg)
    },
    showReceiveLetter (msg, icon, chat) { // 收到letter
      const key = msg.mId
      notification.open({
        message: chat.twoName,
        description: (h) => {
          return h('div', {
            style: {
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
              'max-height': '100px',
            },
            domProps: {
              innerHTML: msg.content,
            },
          })
        },
        duration: 2.5,
        icon: icon,
        btn: (h) => {
          return h('ta-button', {
            props: {
              type: 'primary',
              size: 'small',
            },
            on: {
              click: () => this.openLetterDetail(chat),
            },
          }, this.$t('news.detail'))
        },
        key,
        // onClose: close  //没定义就在使用?!!
      })
    },
    openLetterDetail (chat) {
      this.$emit('update:visible', true)
      this.tabType = '2'
      this.clickDetail2(chat)
    },
  },
}
</script>
<style lang="less" type="text/less">
    .ta-user-select-with-tag{
        .ant-btn-dashed{
            display: none;
        }
    }

  .refresh {
    cursor: pointer;

    &:hover {
      color: @primary-color
    }
  }

  .msg-list {
    .ant-drawer-body {
      padding: 24px 0;
      height: calc(100% - 55px);
    }

    .ant-drawer-wrapper-body {
      overflow: hidden !important;
    }

    .msg-head {
      padding: 0 24px 16px;
      margin: 0;
    }

    .msg-new {
      color: @warning-color;
    }

    .msg-item {
      padding: 10px 24px 0 21px;
      position: relative;
      border-left: #fff solid 3px;

      &:hover {
        border-left: #fafafa solid 3px;
        background: #fafafa
      }

      &.active {
        border-left: @primary-color solid 3px;
        background: #fafafa
      }

      &.new:before {
        content: "";
        display: block;
        width: 6px;
        height: 6px;
        background: @error-color;
        border-radius: 100%;
        position: absolute;
        left: 24px;
        top: 18px
      }

      .msg-title {
        overflow: hidden;
        padding: 0 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 800;
      }

      .msg-content {
        overflow: hidden;
        padding: 0 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 22px;
      }

      .msg-time {
        color: #999999;
        padding: 5px 16px 10px;
        border-bottom: 1px solid #eee;
      }
    }

    .msg-item-letter {
      border-top: #fff solid 3px;

      .msg-content {
        border-bottom: 1px solid #eee;
        padding-bottom: 30px;
      }

      .msg-content-op {
        position: relative;
        float: right;
        color: red;
        cursor: pointer;
      }
    }

    .msg-detail {
      position: absolute;
      width: 330px;
      height: 100%;
      right: 350px;
      top: 0px;
      bottom: 0;
      padding: 55px 24px 55px 24px;
      overflow: auto;
      /*z-index: 1;*/
      background: #fff;
      box-shadow: @box-shadow-base;
      box-sizing: border-box;

      .detail-title {
        position: absolute;
        top: 20px;
        color: @primary-color;
        >span{
          display: inline-block;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
        }
      }
      .msg-detail-detail{
        margin-top: 10px;
        padding: 10px;
        background: @background-color-light;
        border-radius: 4px;
        overflow: auto;
        >table td{    //通知查看表格样式 采用wangEditor-container 的
          border: 1px solid #999;
          padding: 3px 5px;
          min-width: 50px;
          height: 20px;
        }
      }

      .msg-detail-con {
        height: 100%;
        overflow: auto;
        position: relative;
        .beautifyScrollbar();
      }

      .msg-detail-foot {
        position: absolute;
        z-index: 999;
        background: @body-background;
        bottom: 0px;
        left: 0px;
        right: 0px;
        border-top: 1px solid @border-color-split;
        height: 55px;
        padding: 10px 15px;
        box-sizing: border-box;
        text-align: right;
      }
    }

    .msg-send {
      width: 750px;
    }

    .w-e-text-container {
      height: 500px !important; /*!important是重点，因为原div是行内样式设置的高度300px*/
    }

    .chat-content {
      width: 100%;
      top: 0px;
      position: absolute;
      bottom: 160px;
      overflow: auto;
      border-radius: 4px;
      margin-bottom: 15px;
      background-color: @background-color-light;
      .beautifyScrollbar();
    }

    .chat-content-say {
      height: 150px;
      position: absolute;
      bottom: 10px;
      left: 0px;
    }

    .chat-history {
      color: #639bcc;
      cursor: pointer;
    }

    .cd-item-content {
      border-radius: 10px;
      position: relative;
      font-size: 12px;
      line-height: 22px;
      min-height: 22px;
      padding: 3px 10px;
      text-align: left;
      margin-top: 3px;
      word-break: break-word;
      word-wrap: break-word;
      color: #3c3c3c;
      width: auto;
    }

    .chat-detail-item.tip {
      color: #d0d0d0;
      font-size: 12px;
      height: 21px;
      margin-top: 5px;
    }

    .chat-detail-item {
      text-align: center;
      margin: 18px 0;
    }

    .cd-item-time {
      font-size: 12px;
      color: #d0d0d0;
      margin-bottom: 2px;
      text-align: center;
    }

    .chat-detail-item {
      text-align: center;
      margin: 18px 0;
    }

    .chat-detail-item.you .cd-item-avatar-wrapper {
      float: left;
      margin-right: 11px;
      padding-left: 10px;
    }

    .chat-detail-item.you .cd-item-content {
      background: #fff;
      float: left;
      max-width: 70%;
      /*font-size: 20px;*/
    }

    .cd-item-content-arrow-right {
      right: -6px;
      background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAANCAYAAAB7AEQGAAAAbUlEQVQYlY3NQQqCUBQF0FPrE0JoO06cR0toDw6aNtAtCE5dglARNNBJguj//u7sXc7jHsbiNNpPc0wA+KbQA9ke6pDjHUMfnDFADJVo5yOEelyXRQhdfnNR9MJt/bVGFZ4pdA/Mb1D9D+pDaAKByBPqoGsOoAAAAABJRU5ErkJggg==);
      background-size: contain;
      background-position: left -2px;
    }

    .cd-item-content-arrow-left {
      left: -6px;
      background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAANCAYAAAB7AEQGAAAAdklEQVQYlY2QMQrCUBBEn6lEAx7B3ht6CA+TKlWqHMI2ZQ4gaCE8m0Q+nyWbgYFlmF1mFnU0QQN8yaCe1GHrEgsv6jMzod7Ud2ZCve8xHdUpalfiAzzqcge11lpgBs6rUF8CeAFdKUQmgL5+ZsRrGTzK9N9fhx/jSPQOTglOfwAAAABJRU5ErkJggg==);
      background-size: contain;
      background-position: right -2px;
    }

    .cd-item-content-arrow-left, .cd-item-content-arrow-right {
      position: absolute;
      top: 9px;
      width: 9px;
      height: 13px;
      *display: none;
    }

    .chat-detail-item.me .cd-item-avatar-wrapper {
      float: right;
      margin-left: 11px;
      cursor: pointer;
      padding-right: 10px;
    }

    .chat-detail-item.me .cd-item-content {
      border: 1px solid #ff7d4f;
      background: #ff7d4f;
      float: right;
      min-width: 10px;
      max-width: 70%;
      /*font-size: 20px;*/
    }

    .me .cd-item-content {
      color: #fff;
    }
  }
</style>
