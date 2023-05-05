<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div v-for="(value, index) in values" :key="index">
        <div class="message-title">{{ keys[index] }}</div>
        <div class="message-text">{{ value }}</div>
      </div>
      <div class="message-title">回答区域</div>
      <div class="message-text" v-if="message != null">{{ message }}</div>
    </div>
    <div class="chat-input">
      <el-input v-model="content" @keyup.enter="sendMessage()" placeholder="请输入内容" />
      <el-button @click="sendMessage()" type="primary" :disabled="disabled">发送</el-button>
      <el-button @click="clearMessage()" type="primary">清除</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue'
import { setSearchDataApi, getSearchDataApi } from '@/request/api'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    const content = ref('')
    const messages = reactive([])
    const isTyping = ref(false)
    const disabled = ref(false)
    const message = ref('')
    const keys = reactive([])
    const values = reactive([])
    function getData(args) {
      content.value = args
      const url = 'http://localhost:8081/api/v1/pc/pet/streamChatWithWeb?content=' + content.value
      fetch(url, {
        headers: {
          Accept: 'text/event-stream',
        },
      })
        .then((response) => {
          const stream = new ReadableStream({
            start(controller) {
              const reader = response.body.getReader()
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close()
                    return
                  }
                  const text = new TextDecoder('utf-8').decode(value)
                  message.value += text
                  push()
                })
              }
              push()
            },
          })
          const reader = stream.getReader()
          function read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                return
              }
              const text = new TextDecoder('utf-8').decode(value)
              message.value += text
              read()
            })
          }
          read()
        })
        .catch((error) => {
          console.error(error)
        })
    }
    function sendMessage() {
      disabled.value = true
      const text = content.value.trim()
      if (text) {
        messages.push({ text, isMe: true })
        setTimeout(() => {
          addBotMessage()
        }, 1000)
      }
    }
    function addBotMessage() {
      isTyping.value = true
      setTimeout(() => {
        isTyping.value = false
        const botMessage = generateBotMessage()
        //存储数据
        messages.push({ text: botMessage, isMe: false })
      }, 1500)
    }
    function generateBotMessage() {
      // Generate the bot response here using AI models or other methods
      setTimeout(() => {
        message.value = ''
        getData(content.value)
      }, 5000)
      setRedisData(message.value, content.value)
      disabled.value = false
      return message.value
    }
    function clearMessage() {
      message.value = ''
      messages.length = 0
    }
    //获取数据
    const getRedisData = async () => {
      //获取token令牌
      const token = store.state.token
      const res = await getSearchDataApi(token)
      console.log(res)
      if (res.status === 200 && res.data.code === 0) {
        const data = res.data.data
        //将数据存储起来
        data[0].forEach((item) => {
          keys.push(item)
        })
        data[1].forEach((item) => {
          values.push(item)
        })
      } else {
        console.log('getRedisData失败')
      }
    }
    //将数据存储进来
    const setRedisData = async (m, t) => {
      const token = store.state.token
      const res = await setSearchDataApi(m, t, token)
      if (m !== '') {
        if (res.status === 200 && res.data.code === 0) {
          await getRedisData()
        } else {
          console.log('setRedisData失败')
        }
      } else {
        console.log('数据为空')
      }
    }
    onMounted(() => {
      getData('')
      getRedisData()
    })
    return {
      keys,
      values,
      isTyping,
      content,
      message,
      messages,
      disabled,
      sendMessage,
      clearMessage,
    }
  },
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 105%;
  margin-top: -30px;
  margin-left: -20px;
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: scroll;
  padding: 10px;
}

.chat-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  background-color: black;
}

.chat-message.is-user {
  align-items: flex-end;
}

.message-text {
  background-color: black;
  padding: 10px;
  border-radius: 10px;
  max-width: 100%;
  word-wrap: break-word;
  margin-top: 10px;
}

.message-title {
  background-color: gray;
  padding: 10px;
  border-radius: 10px;
  max-width: 100%;
  word-wrap: break-word;
  margin-top: 10px;
  text-align: center;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>
