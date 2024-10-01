/**
 * https://github.com/amirwolf5122/telegram-bot-cloudflare
*/
const TOKEN = '***' // از ربات  @BotFather  بگیر
const ADMIN = 5831914878 //ایدی عددی شما
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (url.pathname === '/endpoint') {
    event.respondWith(handleWebhook(event,database))
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url, '/endpoint', 'QUEVEDO_BZRP_Music_Sessions_522'))
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook(event))
  } else {
    event.respondWith(new Response('No handler for this request'))
  }
})


async function handleWebhook (event,db) {
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== 'QUEVEDO_BZRP_Music_Sessions_522') {
    return new Response('Unauthorized', { status: 403 })
  }

  const update = await event.request.json()
  event.waitUntil(onUpdate(update,db))

  return new Response('Ok')
}

async function onUpdate (update,db) {
  if ('callback_query' in update) {
    await onCallbackQuery(update.callback_query,db)
  }
  if ('message' in update) {
    await onMessage(update.message,db)
  }
  return new Response('Ok')
  //const myConfigs = (await db.get("ban"))?.split("\n") || []; 
  //return fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${ADMIN}&text=hi4${JSON.stringify(myConfigs, null, 2)}`);
}
async function onCallbackQuery (callback,db) {
  if (callback.data == "ban"){
    const ban = (await db.get("ban"))?.trim().split("\n") || [];
    const user_id = callback.message.reply_markup.inline_keyboard[0][0].callback_data.split(":")[0].toString()
    if (!(ban.includes(user_id))) {
      ban.push(user_id);
      await db.put("ban",ban.join("\n"));
      (await fetch(apiUrl('sendMessage', {
        chat_id: parseInt(user_id),
        text: "شما بن شدید"
      }))).json()
    }
    (await fetch(apiUrl('sendMessage', {
      chat_id: callback.message.chat.id,
      text: "بن شد",
      reply_to_message_id: callback.message.message_id
    }))).json()
    (await fetch(apiUrl('deleteMessage', {
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id
    }))).json()
  }else{
    (await fetch(apiUrl('answerCallbackQuery', {
      callback_query_id: callback.id,
      text:"@amir_wolf512",
    }))).json()
  }
  return new Response('Ok')
}
async function onMessage (message,db) {
  const text = message.text || ""
  if (message.chat.type == "private") {
    const ban = ((await db.get("ban"))?.trim().split("\n")) || [];
    if ( message.from.id == ADMIN || !(ban.includes(message.from.id.toString()))) {
      if (message.from.id == ADMIN) {
        if (text.split(" ").length ==2 && text.split(" ")[0] == "ban" && !isNaN(text.split(" ")[1]/0)) {
          const user_id = text.split(" ")[1]
          if (!(ban.includes(user_id))) {
            ban.push(user_id);
            await db.put("ban",ban.join("\n"));
            (await fetch(apiUrl('sendMessage', {
              chat_id: parseInt(user_id),
              text: "شما بن شدید"
            }))).json()
          }
          (await fetch(apiUrl('sendMessage', {
            chat_id: message.chat.id,
            text: "بن شد",
            reply_to_message_id: message.message_id
          }))).json()
        }
        else if (text.split(" ").length ==2 && text.split(" ")[0] == "unban" && !isNaN(text.split(" ")[1]/0)) {
          const user_id = text.split(" ")[1]
          if ((ban.includes(user_id))) {
            const ban2 = ban.filter(elem => elem !== user_id);
            if (JSON.stringify(ban2, null, 2) != "[]"){
              await db.put("ban",ban2.join("\n"));
            }else{
              await db.delete("ban");
            }
            (await fetch(apiUrl('sendMessage', {
              chat_id: parseInt(user_id),
              text: "انبن شدید"
            }))).json()
            (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "انبن شد",
              reply_to_message_id: message.message_id
            }))).json()
          }else{
            (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "ایدی پیدا نشد",
              reply_to_message_id: message.message_id
            }))).json()
          }
        }
        else if (text == "banlist") {
          if (JSON.stringify(ban, null, 2) != "[]"){
            (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "لیست بن شدگان:\n〰️\n<code>"+ban.join("</code>\n〰️\n<code>")+'</code>',
              parse_mode: "HTML",
              reply_to_message_id: message.message_id
            }))).json()
          }else{
            (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "لیست خالی است",
              reply_to_message_id: message.message_id
            }))).json()
          }
        }
        else if (text == "cleanbanall") {
          if (JSON.stringify(ban, null, 2) != "[]"){
            await db.delete("ban");
            (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "لیست خالی شد",
              reply_to_message_id: message.message_id
            }))).json()
          }else{
            (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "لیست خالی است",
              reply_to_message_id: message.message_id
            }))).json()
          }
        }
      }
      if (text == "/start") {
        if (message.from.id == ADMIN) {
          (await fetch(apiUrl('sendMessage', {
            chat_id: message.chat.id,
            text: `
سلام خوش امدید


لیست دستورات
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>ban</code> [chatid]
◀️ بن کردن کاربر
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>unban</code> [chatid]
◀️ انبن کردن کاربر
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>banlist</code>
◀️ لیست بن شدگان
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>cleanbanall</code>
◀️ پاکسازی لیست بن شدگان
➿〰️〰️〰️〰️〰️〰️〰️➿
〰️〰️@amir_wolf512〰️〰️
➿〰️〰️〰️〰️〰️〰️〰️➿`,
            reply_to_message_id: message.message_id,
            parse_mode: "HTML",
          }))).json()
        }else{
          (await fetch(apiUrl('sendMessage', {
            chat_id: message.chat.id,
            text: "پیام خودتون ارسال کنید تا به سازندم برسونم:)",
            reply_to_message_id: message.message_id
          }))).json()
        }
      }else{
        if (message.from.id != ADMIN) {
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
                  text: ((message.chat.last_name) || "هیچی"),
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
                  text: "بن کردن کاربر",
                  callback_data: "ban"
                }
              ],
              [
                {
                  text: "رفتن به پیوی",
                  url: ((message.chat.username && 't.me/'+message.chat.username) || 'tg://openmessage?user_id='+message.chat.id)
                }
              ]
            ]
          })
          if ('reply_to_message' in message) {
            if (message.reply_to_message.from.id != message.from.id && !('reply_markup' in message.reply_to_message)){
              (await fetch(apiUrl('copyMessage', {
                from_chat_id: message.chat.id,
                message_id: message.message_id,
                chat_id: ADMIN,
                reply_markup: replymarkup23
                }))).json()
            }else{
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
            }          
          }else{
            (await fetch(apiUrl('copyMessage', {
              from_chat_id: message.chat.id,
              message_id: message.message_id,
              chat_id: ADMIN,
              reply_markup: replymarkup23
              }))).json()
          }
          (await fetch(apiUrl('sendMessage', {
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
              (await fetch(apiUrl('sendMessage', {
                chat_id: message.chat.id,
                text: "ارسال نشد کاربر ربات مسدود کرده است",
                reply_to_message_id: message.message_id
                }))).json()
            }else{
              (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "ارسال شد",
              reply_to_message_id: message.message_id
              }))).json()
            }
          }
        }
      }
    }else{
      (await fetch(apiUrl('sendMessage', {
        chat_id: message.chat.id,
        text: "شما بن شدید",
        reply_to_message_id: message.message_id
      }))).json()
    }
  }
  return new Response('Ok')
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
