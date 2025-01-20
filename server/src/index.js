const express = require('express');
require('dotenv').config();
const { rateLimit } = require('express-rate-limit')
const { EnkaClient, Character, DetailedGenshinUser, ArtifactSet } = require("enka-network-api");
const { EnkaNetworkError } = require("enka-system");
const jwt = require('jsonwebtoken');
const bearerPrefix = 'Bearer ';
const app = express();
app.set('trust proxy', 1 /* number of proxies between user and server */)
const enka = new EnkaClient();
enka.cachedAssetsManager.cacheDirectoryPath = "./cache";
enka.cachedAssetsManager.cacheDirectorySetup();
enka.cachedAssetsManager.activateAutoCacheUpdater({
    instant: true, // Run the first update check immediately
    timeout: 60 * 60 * 1000, // 1 hour interval
    onUpdateStart: async () => {
        console.log("Updating Genshin Data...");
    },
    onUpdateEnd: async () => {
        enka.cachedAssetsManager.refreshAllData(); // Refresh memory
        console.log("Updating Completed!");
    }
});


app.use((req, res, next) => {

  if(app.get('env') === 'production') {
    res.header("Access-Control-Allow-Origin", "https://83yhi2ze70uoffr9bfbsndeev293ro.ext-twitch.tv"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Twitch-Client-Id, X-Twitch-User-Id");
  } else if (app.get('env') === 'development') {
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173'); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Authorization, X-Twitch-Client-Id, X-Twitch-User-Id");
  }
  next()
})

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	limit: 20, // Limit each IP to 20 requests per `window` (here, per 3 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

function verifyAndDecode(header) {
  if (header.startsWith(bearerPrefix)) {
    try {
      const key = process.env.TWITCH_SECRET;
      const secret = Buffer.from(key, 'base64');
      const token = header.substring(bearerPrefix.length);
      return jwt.verify(token, secret, { algorithms: ['HS256'] });
    }
    catch (e) {
      console.log('Invalid JWT');
      return false;
    }
  }
}

/**
 * @param pathUID In-game UID of the user
 * @returns Character[] from the game uid
 * @throws {EnkaNetworkError}
 */
async function run(pathUID) {
  // const uid = 825436941;
  const uid = pathUID;
  let characters = []
  try{
    /** @type {DetailedGenshinUser} */
    const user = await enka.fetchUser(uid);
    characters = user.characters;
    if (characters.length === 0) {
        console.log("This user has no detailed characters on the profile.");
        return characters;
    }
  }
  catch (err) {
    throw err;
  }
  enka.close();
  return characters;
}

// Load configuation
async function publishToTwitch(config){
  /*
  
  The config service for Twitch Extensions is great.
  But when you set config it doesn't trigger onChanged.
  onChanged is used to retrieve config values from the config service.
  But it's only triggered once when the extension inits
  
  This example covers how to set the config
  And then Broadcast it
  
  it's a NodeJS Example
  it's suitable for cron jobs
  
  */
  const channel_id = config.channel_id;
  // Require depedancies
  // Fetch is used for making HTTP/API Calls
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  // jsonwebtoken is used for creating an decoding JWT's
  // Prepare the Extension secret for use
  // it's base64 encoded and we need to decode it first
  const ext_secret = Buffer.from(config.extension_secret, 'base64');
  
  // Lets prepare the signatures for saving config and sending to PubSub
  // The EXP is being set to 4 seconds in the future
  const sigConfigPayload = {
      "exp": Math.floor(new Date().getTime() / 1000) + 60,
      "user_id": config.owner,
      "role": "external",
  }
  const sigConfig = jwt.sign(sigConfigPayload, ext_secret);
  
  const sigPubSubPayload = {
      "exp": Math.floor(new Date().getTime() / 1000) + 60,
      "user_id": config.owner,
      "role": "external",
      "channel_id": channel_id,
      "pubsub_perms": {
          "send": [
              "broadcast"
          ]
      }
  }
  const sigPubSub = jwt.sign(sigPubSubPayload, ext_secret);
  
  // Payload we are storing in config
  // it needs to be a JSON string
  // Also remember about the 5kb limit for config segements and pubsub
  var payloadContent = config.content;
  let content = JSON.stringify(config.content);

  // We have now prepared the Signatures and data
  // We'll now store this in the global segment
  // This means its' available for all instances of the extension
  // an instance is a channel the extension is installed upon
  
  fetch(
      "https://api.twitch.tv/helix/extensions/configurations",
      {
          method: "PUT",
          headers: {
              "Client-ID": config.client_id,
              "Authorization": "Bearer " + sigConfig,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              extension_id: config.client_id,
              segment: "broadcaster",
              broadcaster_id: channel_id,
              content
          })
      }
  )
  .then(resp => {
      // console log out the useful information
      // keeping track of rate limits is important
      // you can only set the config 12 times a minute per segment
      console.error(resp.statusText)
      console.error('Store Config OK', resp.status, resp.headers.get('ratelimit-remaining'), '/', resp.headers.get('ratelimit-limit'));

  fetch(
      "https://api.twitch.tv/helix/extensions/pubsub",
      {
          method: "POST",
          headers: {
              "Client-ID": config.client_id,
              "Authorization": `Bearer ${sigPubSub}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              target: sigPubSubPayload.pubsub_perms.send,
              broadcaster_id: channel_id,
              is_global_broadcast: false,
              message: JSON.stringify({
                  event: "configure",
                  payloadContent
              })
          })
      }
  )
  .then(async resp => {
      // Same story here with the rate limit its around 60 per minute per topic
      if (resp.status != 204) {
          console.error('Relay Error', await resp.text());
          return;
      }
      console.error('Relay PubSub OK', resp.status, resp.headers.get('ratelimit-remaining'), '/', resp.headers.get('ratelimit-limit'));
  })
  .catch(err => {
      console.error('Relay Error', err);
  });

})
}


function containsOnlyDigits(str) {
  return /^\d+$/.test(str);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
app.get('/users/:userId', async function (req, res) {
  if(app.get('env') === 'production'){
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No credentials sent!' });
    }
    if(!verifyAndDecode(req.headers.authorization)){
      return res.status(403).send();
    }
  }
  
  if(req.params.userId.length > 12 || !containsOnlyDigits(req.params.userId)){
    return res.status(400).send();
  }
  /** @type {Character[]} */
  let genshinChars;
  
  try{
    genshinChars = await run(req.params.userId);
  }
  catch (enkaError) {
    if(enkaError instanceof EnkaNetworkError){
      res.sendStatus(enkaError.statusCode);
    }
    else{
      console.log(enkaError);
    }
    return;
  }
  // let info = {}
  let charProfileMap = {}
  let statStrings = ['maxHealth', 'attack', 'defense', 'elementMastery', 'critDamage', 'critRate', 'chargeEfficiency', 'healAdd'];
  for (const char of genshinChars) {
    const id = char.characterData.id;
    const name = char.characterData.name.get();
    const sideProfileURL = char.characterData.sideIcon.name;
    const overallStats = []
    const level = char.level;
    for (let i = 0; i < statStrings.length; i++) {
      let curStat = char.stats[statStrings[i]];
      let statToWrite = (curStat.isPercent) ? Number.parseFloat(curStat.value).toFixed(4) : Number.parseFloat(curStat.value).toFixed(0);
      overallStats.push(statToWrite)
    }
     /** @type {string} */
    var elePrefix = char.stats['highestDamageBonus'][0].fightPropName.get().at(0);
    if(elePrefix === 'P'){
      elePrefix += char.stats['highestDamageBonus'][0].fightPropName.get().at(1);
    }
    overallStats.push(elePrefix + ':' + Number.parseFloat(char.stats['highestDamageBonus'][0].value).toFixed(4));
    overallStats.push(level);
    overallStats.push(id);
    overallStats.push(char.characterData.element.name.get().at(0));
    const charInfo = []
    charInfo.push(overallStats);
    charInfo.push(sideProfileURL);
    // Talent Information:
    const talentStats =[]
    talentStats.push(char.skillLevels[0]['level']['value'])
    talentStats.push(char.skillLevels[1]['level']['value'])
    talentStats.push(char.skillLevels[2]['level']['value'])
    charInfo.push(talentStats);
    // Constellations:
    charInfo.push(char.unlockedConstellations.length)
    // Weapon information:
    const wepInfo = []
    const wep = char.weapon;
    wepInfo.push(wep.weaponData.name.get());
    wepInfo.push(wep.level);
    wepInfo.push(wep.maxLevel);
    wepInfo.push(wep.refinementRank);
    wepInfo.push(wep.weaponData.awakenIcon.name);
    charInfo.push(wepInfo);
    // Artifact set bonuses
    const setBonuses = ArtifactSet.getActiveSetBonus(char.artifacts);
    const activeBonuses = setBonuses
        .filter(set => set.activeBonus.length > 0)
        .flatMap(set => set.set.name.get() + " : " + (set.count % 2 == 0 ? set.count : set.count-1));
    charInfo.push(activeBonuses);
    
    charProfileMap[name] = charInfo;
  }

  const genshin_profile = Object.entries(charProfileMap);
  res.send(genshin_profile);

  if(req.get('X-Twitch-Client-Id') && req.get('X-Twitch-User-Id')){
    const twitchPubConfig = {
      extension_secret : process.env.TWITCH_SECRET,
      channel_id : req.get('X-Twitch-User-Id'),
      owner : '123835625',
      client_id : req.get('X-Twitch-Client-Id'),
      content : {
        genshin: genshin_profile
      }
    };
    await publishToTwitch(twitchPubConfig);  
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app listening on http://localhost:${port}`) );