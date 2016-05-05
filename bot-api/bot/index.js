import Twit from 'twit'

const bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// connect to stream mentioning bot
const stream = Bot.stream('statuses/filter', {
  track: [process.env.BOT_USERNAME]
})

// main reply function
const replyToTweet = (id, text) => {
  bot.post('statuses/update', {
    status: text,
    in_reply_to_status_id: id,
  })
}

// debugging
if (process.env.OWNER_USERNAME) {
  const owner = process.env.OWNER_USERNAME

  stream.on('error', (error) => {
    const errorMessage = `${owner} I need some help! getting the error ${error}`
    replyToTweet(null, errorMessage)
  })

  stream.on('limit', (error) => {
    replyToTweet(null, `${owner} I'm hitting a limit! ${error}!`)
  })
}

stream.on('tweet', (tweet) => {
  const replyTo = `@${tweet.user.screenName}`
  replyToTweet(tweet.id_str, `${replyTo} hello`)
})

