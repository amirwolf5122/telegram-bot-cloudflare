/**
 * https://github.com/amirwolf5122/telegram-bot-cloudflare
*/

const TOKEN = '***'// Get it from @BotFather https://core.telegram.org/bots#6-botfather
const ADMIN = 5831914878 //// Get it from @chatIDrobot
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
  else if ('message' in update) {
    if (update.message.chat.type == "private") {
      if (update.message.text && update.message.text == "/start"){
        await onstart(update.message,db)
      }
      else if (update.message.text && update.message.text.split(" ").length === 2 && ["ban", "unban"].includes(update.message.text.split(" ")[0]) && !isNaN(update.message.text.split(" ")[1]) || update.message.text && ( update.message.text == "banlist" || update.message.text == "cleanbanall")){
        await onadmin(update.message,db)
      }else{
        await onMessage(update.message,db)
      }
    }
  }
  else if ('edited_message' in update) {
    if (update.edited_message.chat.type == "private") {
      await onMessageedit(update.edited_message,db)
    }
  }
  return new Response('Ok')
  //const myConfigs = (await db.get("ban"))?.split("\n") || []; 
  //return fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${ADMIN}&text=hi4${JSON.stringify(update, null, 2)}`);
}
async function onMessageedit (message,db) {
  const ban = ((await db.get("ban"))?.trim().split("\n")) || [];
  let timestamp = message.edit_date;
  let date = new Date(timestamp * 1000);
  let hours = String(date.getUTCHours()).padStart(2, '0');
  let minutes = String(date.getUTCMinutes()).padStart(2, '0');
  let seconds = String(date.getUTCSeconds()).padStart(2, '0');
  if ( message.from.id == ADMIN || !(ban.includes(message.from.id.toString()))) {
    const replymarkup24 = JSON.stringify({
      inline_keyboard:
      [
        [
          {
            text: `Edited:${hours}:${minutes}:${seconds}`,
            callback_data: message.chat.id+':'+message.message_id
          }
        ],
        [
          {
            text: "first name:",
            callback_data: message.chat.id+':'+message.message_id
          }
          {
            text: message.chat.first_name,
            callback_data: message.chat.id+':'+message.message_id
          },
        ],
        [
          {
            text: "last name:",
            callback_data: message.chat.id+':'+message.message_id
          }
          {
            text: ((message.chat.last_name) || "None"),
            callback_data: message.chat.id+':'+message.message_id
          },
        ],
        [
          {
            text: "chat id",
            callback_data: message.chat.id+':'+message.message_id
          }
          {
            text: message.chat.id,
            callback_data: message.chat.id+':'+message.message_id
          },
        ],
        [
          {
            text: "Ban the user",
            callback_data: "ban"
          }
        ],
        [
          {
            text: "Open chat",
            url: ((message.chat.username && 't.me/'+message.chat.username) || 'tg://openmessage?user_id='+message.chat.id)
          }
        ]
      ]
      })
    const replymarkup25 = JSON.stringify({
        inline_keyboard:
        [
          [
            {
              text: `Edited:${hours}:${minutes}:${seconds}`,
              callback_data: message.message_id
            }
          ]
        ]
        })
    let filedata = "";
    if (message.photo) {
      if (Array.isArray(message.photo)) {
            filedata = JSON.stringify({
                type: 'photo',
                media: message.photo[message.photo.length - 1].file_id
            });
      }else{
        filedata = JSON.stringify({
          type: 'photo',
          media: message.photo.file_id
      });
      }
    } else if (message.animation) {
      if (Array.isArray(message.animation)) {
        filedata = JSON.stringify({
            type: 'animation',
            media: message.animation[message.animation.length - 1].file_id
        });
      }else{
        filedata = JSON.stringify({
        type: 'animation',
        media: message.animation.file_id
        });
      }
    } else if (message.video) {
      if (Array.isArray(message.video)) {
        filedata = JSON.stringify({
            type: 'video',
            media: message.video[message.video.length - 1].file_id
        });
      }else{
        filedata = JSON.stringify({
        type: 'video',
        media: message.video.file_id
        });
      }
    } else if (message.document) {
      if (Array.isArray(message.document)) {
        filedata = JSON.stringify({
            type: 'document',
            media: message.document[message.document.length - 1].file_id
        });
      }else{
        filedata = JSON.stringify({
        type: 'document',
        media: message.document.file_id
        });
      }
    } else if (message.audio) {
      if (Array.isArray(message.audio)) {
        filedata = JSON.stringify({
            type: 'audio',
            media: message.audio[message.audio.length - 1].file_id
        });
      }else{
        filedata = JSON.stringify({
        type: 'audio',
        media: message.audio.file_id
        });
      }
    } else if (message.sticker) {
      if (Array.isArray(message.sticker)) {
        filedata = JSON.stringify({
            type: 'sticker',
            media: message.sticker[message.sticker.length - 1].file_id
        });
      }else{
        filedata = JSON.stringify({
        type: 'sticker',
        media: message.sticker.file_id
        });
      }
    } else if (message.voice) {
      if (Array.isArray(message.voice)) {
        filedata = JSON.stringify({
            type: 'voice',
            media: message.voice[message.voice.length - 1].file_id
        });
      }else{
        filedata = JSON.stringify({
        type: 'voice',
        media: message.voice.file_id
        });
      }
    }
    if (message.from.id != ADMIN) {
        if (filedata) {
          try {
            (await fetch(apiUrl('editMessageMedia', {
            chat_id: ADMIN,
            message_id: message.message_id+1,
            media: filedata,
            reply_markup: replymarkup24
            }))).json();
          } catch (error) {}
          try {
            (await fetch(apiUrl('editMessageCaption', {
            chat_id: ADMIN,
            message_id: message.message_id+1,
            caption: message.caption || "",
            reply_markup: replymarkup24
            }))).json()
          } catch (error) {}
        }else{
          (await fetch(apiUrl('editMessageText', {
              chat_id: ADMIN,
              message_id: message.message_id+1,
              text: message.text || message.caption || "",
              reply_markup: replymarkup24
            }))).json()
        }   
      }else{
        const id23 = message.reply_to_message.reply_markup.inline_keyboard[0][0].callback_data.split(":")
        if (filedata) {
          try {
            (await fetch(apiUrl('editMessageMedia', {
            chat_id: id23[0],
            message_id: message.message_id+1,
            media: filedata,
            reply_markup: replymarkup25
            }))).json();
          } catch (error) {}
          try {
            (await fetch(apiUrl('editMessageCaption', {
            chat_id: id23[0],
            message_id: message.message_id+1,
            caption: message.text || message.caption || "",
            reply_markup: replymarkup25
            }))).json()
          } catch (error) {}
        }else{
          const id223 = (await fetch(apiUrl('editMessageText', {
            chat_id: id23[0],
            message_id: message.message_id+1,
            text: message.text || message.caption || "",
            reply_markup: replymarkup25
          })))
        }
      }
  }
  return new Response('Ok')
}
async function onstart (message,db) {
  const ban = ((await db.get("ban"))?.trim().split("\n")) || [];
  if (message.from.id == ADMIN || !(ban.includes(message.from.id.toString()))) {
    if (message.from.id == ADMIN) {
      (await fetch(apiUrl('sendMessage', {
      chat_id: message.chat.id,
      text: `
hello welcome


List of commands
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>ban</code> [chatid]
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>unban</code> [chatid]
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>banlist</code>
➿〰️〰️〰️〰️〰️〰️〰️➿
▶️ <code>cleanbanall</code>
➿〰️〰️〰️〰️〰️〰️〰️➿
〰️〰️@amir_wolf512〰️〰️
➿〰️〰️〰️〰️〰️〰️〰️➿`,
      reply_to_message_id: message.message_id,
      parse_mode: "HTML",
      }))).json()
    }else{
      (await fetch(apiUrl('sendMessage', {
      chat_id: message.chat.id,
      text: "Send a message so that I can deliver your message to my owner:3",
      reply_to_message_id: message.message_id
      }))).json()
    }
  }
}
async function onadmin (message,db) {
  const text = message.text || ""
  const ban = ((await db.get("ban"))?.trim().split("\n")) || [];
  if (message.from.id == ADMIN) {
    if (text.split(" ").length ==2 && text.split(" ")[0] == "ban" && !isNaN(text.split(" ")[1]/0)) {
      const user_id = text.split(" ")[1]
      if (!(ban.includes(user_id))) {
        ban.push(user_id);
        await db.put("ban",ban.join("\n"));
        (await fetch(apiUrl('sendMessage', {
          chat_id: parseInt(user_id),
          text: "You are blocked"
        }))).json()
      }
      (await fetch(apiUrl('sendMessage', {
        chat_id: message.chat.id,
        text: "Blocked!",
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
          text: "Unblocked!"
        }))).json();
        (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "Unblocked!",
          reply_to_message_id: message.message_id
        }))).json()
      }else{
        (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "ID not found",
          reply_to_message_id: message.message_id
        }))).json()
      }
    }
    else if (text == "banlist") {
      if (JSON.stringify(ban, null, 2) != "[]"){
        (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "Blocked list:\n〰️\n<code>"+ban.join("</code>\n〰️\n<code>")+'</code>',
          parse_mode: "HTML",
          reply_to_message_id: message.message_id
        }))).json()
      }else{
        (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "The list is empty!",
          reply_to_message_id: message.message_id
        }))).json()
      }
    }
    else if (text == "cleanbanall") {
      if (JSON.stringify(ban, null, 2) != "[]"){
        await db.delete("ban");
        (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "The list is empty!",
          reply_to_message_id: message.message_id
        }))).json()
      }else{
        (await fetch(apiUrl('sendMessage', {
          chat_id: message.chat.id,
          text: "The list is empty",
          reply_to_message_id: message.message_id
        }))).json()
      }
    }
  }
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
        text: "You are blocked"
      }))).json()
    }
    (await fetch(apiUrl('sendMessage', {
      chat_id: callback.message.chat.id,
      text: "Blocked!",
      reply_to_message_id: callback.message.message_id
    }))).json();
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
    const ban = ((await db.get("ban"))?.trim().split("\n")) || [];
    if ( message.from.id == ADMIN || !(ban.includes(message.from.id.toString()))) {
        if (message.from.id != ADMIN) {
          const replymarkup23 = JSON.stringify({
      inline_keyboard:
      [
        [
          {
            text: "first name:",
            callback_data: message.chat.id+':'+message.message_id
          }
          {
            text: message.chat.first_name,
            callback_data: message.chat.id+':'+message.message_id
          },
        ],
        [
          {
            text: "last name:",
            callback_data: message.chat.id+':'+message.message_id
          }
          {
            text: ((message.chat.last_name) || "None"),
            callback_data: message.chat.id+':'+message.message_id
          },
        ],
        [
          {
            text: "chat id",
            callback_data: message.chat.id+':'+message.message_id
          }
          {
            text: message.chat.id,
            callback_data: message.chat.id+':'+message.message_id
          },
        ],
        [
          {
            text: "Ban the user",
            callback_data: "ban"
          }
        ],
        [
          {
            text: "Open chat",
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
            text: "Message sent!",
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
                text: response23.description,
                reply_to_message_id: message.message_id
                }))).json()
            }else{
              (await fetch(apiUrl('sendMessage', {
              chat_id: message.chat.id,
              text: "Message sent!",
              reply_to_message_id: message.message_id
              }))).json()
            }
          }
        }
      }
    /*else{
      (await fetch(apiUrl('sendMessage', {
        chat_id: message.chat.id,
        text: "You are blocked",
        reply_to_message_id: message.message_id
      }))).json()
    }*/
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
