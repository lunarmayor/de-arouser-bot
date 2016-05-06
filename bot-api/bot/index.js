import Twit from 'twit'
import google from 'googleapis'
const key = require('../jwt-key.json')

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive'],
  null
)

const drive = google.drive({ version: 'v3' })

const bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// connect to stream mentioning bot
const stream = bot.stream('statuses/filter', {
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

jwtClient.authorize((err, tokens) => {
  console.log(tokens, err, process.env.GOOGLE_FILE_ID)
  drive.files.export({
    auth: jwtClient,
    fileId: process.env.GOOGLE_FILE_ID,
    mimeType: 'application/vnd.google-apps.script+json',
  }, (err, res) => {
    console.log(res, err)
  })
})

stream.on('tweet', (tweet) => {
  const replyTo = `@${tweet.user.screen_name}`

  jwtClient.authorize((err, tokens) => {
    drive.files.export({
      auth: jwtClient,
      fileId: process.env.GOOGLE_FILE_ID,
      mimeType: 'application/vnd.google-apps.script+json',
    }, (err, res) => {
      console.log(res)
      replyToTweet(tweet.id_str, `${replyTo} hello`)
    })
  })
})

