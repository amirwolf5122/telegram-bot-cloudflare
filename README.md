## English
# Telegram Bot on Cloudflare Workers

Run Telegram messaging bot on Cloudflare Worker.

## Setup:
1. Get your new bot token from [@BotFather](https://t.me/botfather): https://core.telegram.org/bots#6-botfather
2. Sign up to Cloudflare Workers: https://workers.cloudflare.com/
3. In the Cloudflare Dashboard go to "Workers" and then click "Create a Service"
4. Choose a name and click "Create a Service" to create the worker
5. Click on "Quick Edit" to change the source code of your new worker
6. Copy and paste the code from [bot_en.js](bot_en.js) into the editor
7. Replace the `TOKEN` variable in the code with your token from [@BotFather](https://t.me/botfather)
8. Replace the `ADMIN` variable in the code with your Chat id from [@chatIDrobot](https://t.me/chatIDrobot)
9. Click on "Save and Deploy"
10. In the middle panel append `/registerWebhook` to the url. For example: https://my-worker-123.username.workers.dev/registerWebhook
11. Click "Send". In the right panel should appear `Ok`. If 401 Unauthorized appears, you may have used a wrong bot token.
12. Alright, it's done. Now you can use the messaging bot.

## Source: https://github.com/cvzi/telegram-bot-cloudflare
## [Amir_Wolf512](https://t.me/amir_wolf512)
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

7.روی "Save and Deploy" کلیک کنید

9.به اخر دامنه`/registerWebhook` اضافه کنید برای مثال https://my-worker-123.username.workers.dev/registerWebhook  

11.روی "Send" کلیک کنید. در پنل سمت راست باید "Ok" ظاهر بشه. اگر 401 Unauthorized ظاهر شد، ممکنه توکن وارد شده اشتباه باشه.

12.خب تموم شد الان میتونید ربات پیام رسان استفاده کنید

## منبع: https://github.com/cvzi/telegram-bot-cloudflare

## [Amir_Wolf512](https://t.me/amir_wolf512)
