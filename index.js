const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.SECRET_PORT || 3000
const apiUser = process.env.API_USER
const apiPassword = process.env.API_PASSWORD
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1')
const fs = require('fs')

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
})

app.use(bodyParser.json())

app.use(express.static('public'))

const apiInfo = {
  "url": "https://stream.watsonplatform.net/text-to-speech/api",
  "username": apiUser,
  "password": apiPassword
}

const textToSpeech = new TextToSpeechV1(apiInfo)

let clipCount = 0

app.get('/api/synthesize/:value', (req, res, next) => {
  console.log('req:' + req.params.value)
  const transcript = textToSpeech.synthesize({"text": `${req.params.value}`});
  transcript.on('error', next);
  clipCount +=1
  const fileLoc = __dirname + `/public/test${clipCount}.ogg`
  transcript.on('end', () => {
    res.download(fileLoc)
  })
  const temp = fs.createWriteStream(fileLoc)
  transcript.pipe(temp)
})
