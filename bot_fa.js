/**
 * https://github.com/amirwolf5122/telegram-bot-cloudflare
 */

const TOKEN = '59345149029:A4Ee1ANadgH4xHdaUlod-pp2mSvUlMOKQvo' // از ربات  @BotFather  بگیر
const WEBHOOK = '/endpoint'//نیاز به ویرایش نیست
const SECRET = 'QUEVEDO_BZRP_Music_Sessions_52' //نیاز به ویرایش نیست
const ADMIN = 5679710243 //ایدی عددی ادمین
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event))
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET))
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook(event))
  } else {
    event.respondWith(new Response('No handler for this request'))
  }
})


async function handleWebhook (event) {
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 })
  }

  const update = await event.request.json()
  event.waitUntil(onUpdate(update))

  return new Response('Ok')
}

async function onUpdate (update) {
  if ('callback_query' in update) {
    await onCallbackQuery(update.callback_query)
  }
  if ('message' in update) {
    await onMessage(update.message)
  }
  //return fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${ADMIN}&text=${JSON.stringify(update, null, 2)}`);
}
async function onCallbackQuery (callback) {
  return (await fetch(apiUrl('answerCallbackQuery', {
    callback_query_id: callback.id,
    text:"@amir_wolf512",
  }))).json()
}
async function onMessage (message) {
  if (message.chat.type == "private") {
    if (message.text == "/start") {
        return (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "پیام خودتون ارسال کنید تا به سازندم برسونم:)",
          reply_to_message_id: message.message_id
        }))).json()
    }else{
      if (message.from.id != ADMIN) {
        var last_name = "هیچی"
        if ("last_name" in message.chat) {
          var last_name = message.chat.last_name
        }
        const replymarkup23 = JSON.stringify({
          inline_keyboard:
          [
            [
              {
                text: message.chat.first_name,
                callback_data: message.chat.id+':'+message.message_id
              },
              {
                text: "اسم طرف",
                callback_data: message.chat.id+':'+message.message_id
              }
            ],
            [
              {
                text: last_name,
                callback_data: message.chat.id+':'+message.message_id
              },
              {
                text: "فامیل طرف",
                callback_data: message.chat.id+':'+message.message_id
              }
            ],
            [
              {
                text: message.chat.id,
                callback_data: message.chat.id+':'+message.message_id
              },
              {
                text: "ایدی عددی طرف",
                callback_data: message.chat.id+':'+message.message_id
              }
            ],
            [
              {
                text: "رفتن به پیوی",
                url: 'tg://openmessage?user_id='+message.chat.id
              }
            ]
          ]
        })
        if ('reply_to_message' in message) {
          if (message.reply_to_message.from.id == message.from.id){
            var reply = message.reply_to_message.message_id+1
          }else{
            var reply = message.reply_to_message.reply_markup.inline_keyboard[0][0].callback_data
          }
          (await fetch(apiUrl('copyMessage', {
            from_chat_id: message.chat.id,
            message_id: message.message_id,
            chat_id: ADMIN,
            reply_to_message_id: reply,
            reply_markup: replymarkup23
          }))).json()
        }else{
          (await fetch(apiUrl('copyMessage', {
            from_chat_id: message.chat.id,
            message_id: message.message_id,
            chat_id: ADMIN,
            reply_markup: replymarkup23
            }))).json()
        }
        return (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "ارسال شد",
          reply_to_message_id: message.message_id
        }))).json()
      }else{
        if(message.reply_to_message.from.id !=message.from.id){
          const id23 = message.reply_to_message.reply_markup.inline_keyboard[0][0].callback_data.split(":")
          const id223 = (await fetch(apiUrl('copyMessage', {
            from_chat_id: message.chat.id,
            message_id: message.message_id,
            chat_id: id23[0],
            reply_to_message_id:id23[1],
            reply_markup: JSON.stringify({
            inline_keyboard:
            [
              [
                {
                  text: message.reply_to_message.from.first_name,
                  callback_data: message.message_id
                }
              ]
            ]
            })
          })))
          const response23 = await id223.json();
          if(response23.description == "Forbidden: bot was blocked by the user"){
            return (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "ارسال نشد کاربر ربات مسدود کرده است",
              reply_to_message_id: message.message_id
              }))).json()
          }
        return (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "ارسال شد",
          reply_to_message_id: message.message_id
        }))).json()
        }
      }
    }
  }
}

async function registerWebhook (event, requestUrl, suffix, secret) {
  // https://core.telegram.org/bots/api#setwebhook
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`
  const r = await (await fetch(apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

async function unRegisterWebhook (event) {
  const r = await (await fetch(apiUrl('setWebhook', { url: '' }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

function apiUrl (methodName, params = null) {
  let query = ''
  if (params) {
    query = '?' + new URLSearchParams(params).toString()
  }
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}
