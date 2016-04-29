import TelegramBot from 'node-telegram-bot-api'
const telegramToken = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(telegramToken, { polling: true })
console.log('hello')

bot.onText(/hello/, (message, match) => {
  const fromId = message.from.id
  bot.sendMessage(fromId, 'hello')
})
