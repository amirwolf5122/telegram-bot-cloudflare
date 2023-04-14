## En
# Telegram Bot on Cloudflare Workers

Telegram messaging bot running on a Cloudflare Worker.

## Setup:
1. Get your new bot token from [@BotFather](https://t.me/botfather): https://core.telegram.org/bots#6-botfather
2. Sign up to Cloudflare Workers: https://workers.cloudflare.com/
3. In the Cloudflare Dashboard go to "Workers" and then click "Create a Service"
4. Choose a name and click "Create a Service" to create the worker
5. Click on "Quick Edit" to change the source code of your new worker
6. Copy and paste the code from [bot_en.js](bot_en.js) into the editor
7. Replace the `TOKEN` variable in the code with your token from [@BotFather](https://t.me/botfather)
8. Optional: Change the `WEBHOOK` variable to a different path and the `SECRET` variable to a random secret. See https://core.telegram.org/bots/api#setwebhook
9. Click on "Save and Deploy"
10. In the middle panel append `/registerWebhook` to the url. For example: https://my-worker-123.username.workers.dev/registerWebhook
11. Click "Send". In the right panel should appear `Ok`. If 401 Unauthorized appears, you may have used a wrong bot token.
12. That's it, now you can send a text message to your Telegram bot
## فارسی

# ربات تلگرام در Cloudflare Workers

ربات پیام رسان تلگرام در Cloudflare Worker اجرا کنید.

## اموزش نصب:

1.توکن از ربات [@BotFather](https://t.me/botfather) بگیرید

2.در سایت https://workers.cloudflare.com ثبت نام کنید

3.در داشبورد Cloudflare به "Workers" برید و روی "Create a Service" کلیک کنید

4.یک نام دلخواه وارد کنید و روی "Create a Service" کلیک کنید

5.روی "Quick Edit" کلیک کنید

6.حالا [bot_fa.js](bot_fa.js) قسمت های لازم ویرایش کنید و کپی کنید  "Quick Edit" قرار بدید 
