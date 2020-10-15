const TelegramBot = require('node-telegram-bot-api');
const tokenBot = '1381951994:AAEDSkw5AnYlVVEORND7djS-ly7cZo-nokc';
const bot = new TelegramBot(tokenBot, {polling: { interval: 300, params:{ timeout: 10 } } } );
const fs = require('fs');
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      cors = require('cors'),
      mysql = require('mysql'),
      request = require('request');
      
var con = mysql.createConnection({
  host: "194.87.190.88",
  user: "admin_obvion",
  password: "CF9AJiGlN0",
  database: "admin_obvion"
});
      
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf;

const host = '194.87.190.88';
const port = 3000;
//const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var MemoryStore = session.MemoryStore;

var locMessg;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'gdg8Jd3o98hg048hVdfhbskD2k12a',
    //name: "secretname",
    store: new MemoryStore({
      //checkPeriod: 86400000 // prune expired entries every 24h
      checkPeriod: new Date(Date.now() + (24 * 60 * 60 * 365 * 1000))
    }),
    //expires: new Date(Date.now() + (24 * 60 * 60 * 365 * 1000)),
    expires: 86400000,
    //maxAge: new Date(Date.now() + (24 * 60 * 60 * 365 * 1000)),
    maxAge: 86400000,
    
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: { 
      secure: true,
      expires: new Date(Date.now() + (24 * 60 * 60 * 365 * 1000)),
      expires: 86400000,
      //maxAge: new Date(Date.now() + (24 * 60 * 60 * 365 * 1000))
      maxAge: 86400000
    }
  })
);

//******************* VLADIMIR BLOCK START **************************
//*******************************************************************
const TronWeb = require('tronweb')
const axios = require('axios')

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
const privateKey = "92909549e34c2169107e2b14c0b91d531f544ac17091ff4332257d6f6db785ce";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);

//var userAddress = '';
//TV7wtF3vtEtkniAWUpqqNcj2Zpto24qqXn

const addressPassive = 'TJD5p91UfHWqF5zsWyMUnHjuieAGqz3BL6',
	addressRefStorage = 'TWcoez2KXQGYqiEV9Sbua78JSDBjyKhHHz',
	addressToken = 'TRrUZiFGEpFpmK9CqwdUbawU8RN91G9zm7',
	addressTokemonics = 'TR11fVFAJTBS3qQtm3RveXR5K23qfLqRrb',
	addressLevelsAndTurnovers = 'TNMXmrcFXu2fXHwYcu83C4uPWcMGZK8rMJ'

let Passive, RefStorage, Token, Tokemonics, LevelsAndTurnovers, eventsPassive, eventsToken


const getDeposit = async (addr)=>{
	let res = await Passive.getDeposit(addr).call()
	res = Number(res._hex)/(10**6)
	console.log('Deposit: ', res)
	return res
}

const getAllDeposits = async (addr)=>{
	let count = await Passive.getCountOfDeposits(addr).call()
	count = Number(count._hex)
	let res = []
	for(let i=0; i<count; i++){
		let deposit = await Passive.deposits(addr, i).call()
		deposit = {
			amount: Number(deposit.amount._hex)/(10**6),
			time: Number(deposit.time._hex),
			countOfWeeks: deposit.countOfweeks
		}
		res.push(deposit)
	}
	console.log('Deposits: ')
	console.log(res)
	return res
}

const getLevel = async(addr)=>{
	let res = await LevelsAndTurnovers.getLevel(addr).call()
	res = Number(res._hex)
	console.log('Level: ', res)
	return res
}

const getTersonalTurnover = async(addr)=>{
	let res = await LevelsAndTurnovers.personalTurnover(addr).call()
	res = Number(res._hex)/(10**6)
	console.log('personalTurnover: ', res)
	return res
}

const getTotalTurnover = async(addr)=>{
	let res = await LevelsAndTurnovers.totalTurnover(addr).call()
	res = Number(res._hex)/(10**6)
	console.log('totalTurnover: ', res)
	return res
}

const getPassiveIncome = async(addr)=>{
	let reserved = await Passive.calculatePassive(addr).call()
	reserved = Number(reserved._hex)/(10**6)
	let received = 0

	let events

	await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/PassiveIncome`).then(async (res)=>{
		events = res.data
		if(events.length==200){
			while(events[events.length-1].block_number>lastBlockPassive){
				let block_timestamp = events[events.length-1].block_timestamp
				let _events = await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/PassiveIncome?size=200&since=${block_timestamp}`)
				while(_events.data[0].block_timestamp==block_timestamp){
					_events.data.shift()
					
				}
				events = events.concat(_events.data)
			}
		}
		events = events.reverse()
	})

	for(const event in events){
		let addressUser = tronWeb.address.fromHex(events[event].result.user)
		if(addr==addressUser){
			received += parseInt(events[event].result.amount)/(10**6)
		}
	}
	const result = {
		reserved: reserved,
		received: received,
		all: received+reserved
	}
	console.log('PassiveIncome', result)
	return result
}

const getRefIncome = async(addr)=>{
	let events

	await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/RefIncome`).then(async (res)=>{
		events = res.data
		if(events.length==200){
			while(events[events.length-1].block_number>lastBlockPassive){
				let block_timestamp = events[events.length-1].block_timestamp
				let _events = await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/RefIncome?size=200&since=${block_timestamp}`)
				while(_events.data[0].block_timestamp==block_timestamp){
					_events.data.shift()
					
				}
				events = events.concat(_events.data)
			}
		}
		events = events.reverse()
	})

	let received = 0
	for(const event in events){
		let addressUser = tronWeb.address.fromHex(events[event].result.user)
		if(addr==addressUser){
			received += parseInt(events[event].result.amount)/(10**6)
		}
	}
	console.log('RefIncome', received)
	return received
}

const getTokenIncome = async(addr)=>{

	let refTokens = 0, investTokens = 0
	let tokenPrice = await Token.tokenPrice().call()
	tokenPrice = Number(tokenPrice._hex)/(10**6)

	let events

	await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/TokenRefIncome`).then(async (res)=>{
		events = res.data
		if(events.length==200){
			while(events[events.length-1].block_number>lastBlockPassive){
				let block_timestamp = events[events.length-1].block_timestamp
				let _events = await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/TokenRefIncome?size=200&since=${block_timestamp}`)
				while(_events.data[0].block_timestamp==block_timestamp){
					_events.data.shift()
					
				}
				events = events.concat(_events.data)
			}
		}
		events = events.reverse()
	})


	for(const event in events){
		let addressUser = tronWeb.address.fromHex(events[event].result.user)
		if(addr==addressUser){
			refTokens += parseInt(events[event].result.amount)/(10**6)
		}
	}
	events=[]

	console.log('refTokens:', refTokens)

	await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/TokenInvestIncome`).then(async (res)=>{
		events = res.data
		if(events.length==200){
			while(events[events.length-1].block_number>lastBlockPassive){
				let block_timestamp = events[events.length-1].block_timestamp
				let _events = await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressPassive}/TokenInvestIncome?size=200&since=${block_timestamp}`)
				while(_events.data[0].block_timestamp==block_timestamp){
					_events.data.shift()
					
				}
				events = events.concat(_events.data)
			}
		}
		events = events.reverse()
	})

	for(const event in events){
		let addressUser = tronWeb.address.fromHex(events[event].result.user)
		if(addr==addressUser){
			investTokens += parseInt(events[event].result.amount)/(10**8)
		}
	}

	console.log('investTokens:', investTokens)

	const result = {
		tokens: refTokens+investTokens,
		value: (refTokens+investTokens)*tokenPrice
	}

	console.log('TokenIncome', result)

	return result

}

const getTokenInfo = async (addr)=>{
	
	let events

	await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressToken}/Burn`).then(async (res)=>{
		events = res.data
		if(events.length==200){
			while(events[events.length-1].block_number>lastBlockToken){
				let block_timestamp = events[events.length-1].block_timestamp
				let _events = await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressToken}/Burn?size=200&since=${block_timestamp}`)
				while(_events.data[0].block_timestamp==block_timestamp){
					_events.data.shift()
					
				}
				events = events.concat(_events.data)
			}
		}
		events = events.reverse()
	})

	let tokenBalance = await Token.balanceOf(addr).call()
	tokenBalance = Number(tokenBalance._hex)
	let tokenPrice = await Token.tokenPrice().call()
	tokenPrice = Number(tokenPrice._hex)/(10**6)
	let totalSupply = await Token.totalSupply().call()
	totalSupply = Number(totalSupply._hex)
	let burnedTokens = 0;
	for(const event in events){
		burnedTokens += Number(events[event].result.value)
	}
	let result = {
		tokenBalance: tokenBalance/(10**8),
		tokenPrice: tokenPrice,
		totalSupply: totalSupply/(10**8),
		burnedTokens: burnedTokens/(10**8)

	}
	console.log('tokenInfo: ', result)
	return result
} 

const getPartners = async(addr)=>{

	const deposit = await getDeposit(addr)
	let _1line = await RefStorage._1Line(addr).call()
	let _2line = await RefStorage._2Line(addr).call()
	let _3line = await RefStorage._3Line(addr).call()
	let _4line = await RefStorage._4Line(addr).call()
	let _5line = await RefStorage._5Line(addr).call()
	let _6line = await RefStorage._6Line(addr).call()
	let _7line = await RefStorage._7Line(addr).call()
	let _8line = await RefStorage._8Line(addr).call()
	let _9line = await RefStorage._9Line(addr).call()
	let _10line = await RefStorage._10Line(addr).call()
	let _11line = await RefStorage._11Line(addr).call()
	let _12line = await RefStorage._12Line(addr).call()

	let events, countOfPartners=0

	await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressRefStorage}/Register`).then(async (res)=>{
		events = res.data
		if(events.length==200){
			while(events[events.length-1].block_number>lastBlockRefStorage){
				let block_timestamp = events[events.length-1].block_timestamp
				let _events = await axios.get(`https://api.shasta.trongrid.io/event/contract/${addressRefStorage}/Register?size=200&since=${block_timestamp}`)
				while(_events.data[0].block_timestamp==block_timestamp){
					_events.data.shift()
					
				}
				events = events.concat(_events.data)
			}
		}
		events = events.reverse()
	})

	const getReferrers = (user)=>{
		let _referrers = []
		for(const event in events){
			let addressUser = tronWeb.address.fromHex(events[event].result.ref)
			if(user==addressUser){
				countOfPartners++
				_referrers.push(tronWeb.address.fromHex(events[event].result.user))
			}
		}
		return _referrers
	}

	let referrers = getReferrers(addr)

	for(let i=0; i<referrers.length; i++){
		let _ref = getReferrers(referrers[i])
		referrers = referrers.concat(_ref)
	}

	const result = {
		_1line: _1line._hex/(10**6)-deposit,
		_2line: _2line._hex/(10**6)-_1line._hex/(10**6),
		_3line: _3line._hex/(10**6)-_2line._hex/(10**6),
		_4line: _4line._hex/(10**6)-_3line._hex/(10**6),
		_5line: _5line._hex/(10**6)-_4line._hex/(10**6),
		_6line: _6line._hex/(10**6)-_5line._hex/(10**6),
		_7line: _7line._hex/(10**6)-_6line._hex/(10**6),
		_8line: _8line._hex/(10**6)-_7line._hex/(10**6),
		_9line: _9line._hex/(10**6)-_8line._hex/(10**6),
		_10line: _10line._hex/(10**6)-_9line._hex/(10**6),
		_11line: _11line._hex/(10**6)-_10line._hex/(10**6),
		_12line: _12line._hex/(10**6)-_11line._hex/(10**6),
		countOfPartners: countOfPartners
	}

	console.log('Partners ', result)

	return result
}

const getData = async ()=>{	
	Passive = await tronWeb.contract().at(addressPassive)
	RefStorage = await tronWeb.contract().at(addressRefStorage)
	Token = await tronWeb.contract().at(addressToken)
	Tokemonics = await tronWeb.contract().at(addressTokemonics)
	LevelsAndTurnovers = await tronWeb.contract().at(addressLevelsAndTurnovers)
	eventsPassive = await axios.get(`https://api.shasta.trongrid.io/v1/contracts/${addressPassive}/events`).then((res)=>{
		eventsPassive = res.data.data
	})

	eventsToken = await axios.get(`https://api.shasta.trongrid.io/v1/contracts/${addressToken}/events`).then((res)=>{
		eventsToken = res.data.data
	})

    /*
	const deposit = await getDeposit(userAddress)

	const level = await getLevel(userAddress)

	const personalTurnover = await getTersonalTurnover(userAddress)

	const totalTurnover = await getTotalTurnover(userAddress)

	const allDeposits = await getAllDeposits(userAddress)

	const passiveIncome = await getPassiveIncome(userAddress, eventsPassive)

	const refIncome = await getRefIncome(userAddress, eventsPassive)

	const tokenIncome = await getTokenIncome(userAddress, eventsPassive)

	const tokenInfo = await getTokenInfo(userAddress, eventsToken)

	const partners = await getPartners(userAddress)
    */
}

getData();

//*******************************************************************
//******************* VLADIMIR BLOCK END ****************************

//console.log('LAUNCH APP CALL');

app.get('/app', (req, res) => {
    
  var datetime = new Date();
    
  //console.log('GET APP CALL '+datetime);
  
  req.session.wallets = [];
  
  if (typeof req.session.wallet === 'undefined')
    req.session.wallet = 'undefined';
  
  if (typeof req.session.marketing === 'undefined')
    req.session.marketing = 'first';
  
  if (typeof req.session.bot_lang === 'undefined')
    req.session.bot_lang = 'ru_lang';
  
  var startOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: '🇬🇧 English', callback_data: 'en_lang' }],
        [{ text: '🇩🇪 Deutsche', callback_data: 'de_lang' },{ text: '🇷🇺 Русский', callback_data: 'ru_lang' }],
        [{ text: '🇪🇸 Español', callback_data: 'es_lang' },{ text: '🇮🇹 Italiano', callback_data: 'it_lang' }],
        //[{ text: '⬅️ Вернуться к настройкам', callback_data: 'back_settings' }]
      ],
    }),
    parse_mode: "HTML"
  };

  /*  СТАРТ  */
  bot.onText(/\/start/, function (msg, match) {
    var datetime = new Date();
    
    //console.log('Choose Language - '+datetime);
    
    bot.sendMessage(msg.chat.id, '<b>🌍 Language</b>\n\n', startOptions);
  });
  
  /*  ОБРАТНЫЕ ВЫЗОВЫ КНОПОК  */
  bot.on('callback_query', function (msg) {
    var answer = msg.data;
    
    console.log('Choose Language - 1');

    /*  ВЫБОР ЯЗЫКОВ  */
    if (answer == 'en_lang' || answer == 'ru_lang' || answer == 'es_lang' || answer == 'it_lang' || answer == 'de_lang') {
      req.session.bot_lang = answer;

      let rawdata = fs.readFileSync(__dirname+'/localization/'+req.session.bot_lang+'.json');
      locMessg = JSON.parse(rawdata);
      //console.log(locMessg.text1);
      
      console.log('Choose Language - 2');
      
      var mainMenuOptions = {
        reply_markup: JSON.stringify({
          /*
          keyboard: [
            [{ text: '🖥 Контракты' },{ text: '📈 Доходы' }],
            [{ text: '👨🏻‍💻 Партнеры' },{ text: '💎 Токен' }],
            [{ text: '🔔 Уведомления' },{ text: '✖️ Удалить' }],
            [{ text: '⚙️ О проекте' },{ text: '📊 Маркетинг' }],
            [{ text: '🔐 Смарт-контракты' },{ text: '💻 Регистрация' }],
            [{ text: '🤖 Менеджер доходов' },{ text: '♻️ DeFi' }]
          ],
          */
          keyboard: [
            [{ text: locMessg.menuAboutProjectTranslate },{ text: locMessg.menuMarketingProjectTranslate }],
            [{ text: locMessg.menuSmartContractsProjectTranslate },{ text: locMessg.menuRegistrationProjectTranslate }],
            [{ text: locMessg.menuIncomeManagerProjectTranslate },{ text: locMessg.menuFaqProjectTranslate }]
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }),
        parse_mode: "HTML"
      };
      
      //console.log('STICKER SET = '+JSON.stringify(bot.getStickerSet('Obvion')));
      req.session.marketing = 'first';
      bot.sendSticker(msg.from.id, 'CAACAgIAAxkBAAEBVdBfYIv0vpK9gZzN2UlI-MSiY2R-bAACYAADOmD5EoVgSk3XDvCBGwQ');
      setTimeout(function(bot,fromId,locMessage,mainMenuOptions) { bot.sendMessage(fromId, locMessage, mainMenuOptions) }, 500, bot, msg.from.id, locMessg.congrads, mainMenuOptions);
    }
    
    if (answer == 'language_choose') {
        bot.sendMessage(msg.from.id, locMessg.langFullTranslate, startOptions);
    }
    
    /*  МЕНЕЖДЕР ДОХОДОВ  */
    if (answer == 'manager_manager_income') {
        
        if (req.session.wallets.includes(msg.from.id)) {
            var mainMenuOptions = {
              reply_markup: JSON.stringify({
                keyboard: [
                  [{ text: locMessg.menuContractsTranslate },{ text: locMessg.menuIncomesTranslate }],
                  [{ text: locMessg.menuPartnersTranslate },{ text: locMessg.manuTokenTranslate }],
                  [{ text: locMessg.menuMarketingTranslate },{ text: locMessg.manuDefiTranslate }],
                  [{ text: locMessg.menuNotificationsTranslate },{ text: locMessg.menuFaqTranslate }],
                  [{ text: locMessg.menuExitButton }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
              }),
              parse_mode: "HTML"
            };
            
            req.session.marketing = 'second';
            
            bot.sendMessage(msg.from.id, locMessg.textIncomeManagerCongradsTranslate, mainMenuOptions);
            setTimeout(function(bot,fromId) { bot.sendMessage(fromId, locMessg.textIncomeManagerPlesaseConfirmTranslate,mainMenuOptions) }, 300, bot, msg.from.id);
            setTimeout(function(bot,fromId) { bot.sendSticker(fromId, 'CAACAgIAAxkBAAEBVdJfYIwihP1PgYwfdIV_2uFWRYgeUAACqQADOmD5ErXo47BnVO-qGwQ') }, 600, bot, msg.from.id);
            setTimeout(function(bot,fromId) { var greetYouMenuOptions = {parse_mode: "HTML"}; bot.sendMessage(msg.from.id, locMessg.textIncomeManagerYouPassConfirmTranslate,greetYouMenuOptions) }, 900, bot, msg.from.id);
        } else {
            bot.sendMessage(msg.from.id, 'Введите свой кошелек 📗', mainMenuOptions);
        }
    }
    
    if (answer == 'faq_question_1' || answer == 'faq_question_2' || answer == 'faq_question_3' || answer == 'faq_question_4' || answer == 'faq_question_5' || answer == 'faq_question_6' || 
        answer == 'faq_question_7' || answer == 'faq_question_8' || answer == 'faq_question_9' || answer == 'faq_question_10' || answer == 'faq_question_11' || answer == 'faq_question_12' || answer == 'faq_question_13') {
        
        var faqMenuOptions = {
                reply_markup: JSON.stringify({
                keyboard: [
                  [{ text: locMessg.menuContractsTranslate },{ text: locMessg.menuIncomesTranslate }],
                ],
                resize_keyboard: true,
                one_time_keyboard: false
              }),
              parse_mode: "HTML"
          };
          
        var faqMenuOptions = {
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [{ text: "⁉️ FAQ", callback_data: 'faq_question_repeat' }]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: false
                }),
                parse_mode: "HTML"
              };
        
        if (answer == 'faq_question_1')
            bot.sendMessage(msg.from.id, locMessg.textFaqWhyNeedToDoText, faqMenuOptions);
        else if (answer == 'faq_question_2')
            bot.sendMessage(msg.from.id, locMessg.textFaqConfidentDataText, faqMenuOptions);
        else if (answer == 'faq_question_3')
            bot.sendMessage(msg.from.id, locMessg.textFaqInstallTronlinkText, faqMenuOptions);
        else if (answer == 'faq_question_4')
            bot.sendMessage(msg.from.id, locMessg.textFaqPayWalletTronText, faqMenuOptions);
        else if (answer == 'faq_question_5')
            bot.sendMessage(msg.from.id, locMessg.textFaqMinDepositObvionText, faqMenuOptions);
        else if (answer == 'faq_question_6')
            bot.sendMessage(msg.from.id, locMessg.textFaqHowPaySmartContractText, faqMenuOptions);
        else if (answer == 'faq_question_7')
            bot.sendMessage(msg.from.id, locMessg.textFaqModAdditionTronText, faqMenuOptions);
        else if (answer == 'faq_question_8')
            bot.sendMessage(msg.from.id, locMessg.textFaqBusinessManagementText, faqMenuOptions);
        else if (answer == 'faq_question_9')
            bot.sendMessage(msg.from.id, locMessg.textFaqSafeWalletStorageText, faqMenuOptions);
        else if (answer == 'faq_question_10')
            bot.sendMessage(msg.from.id, locMessg.textFaqForgotPasswordTronText, faqMenuOptions);
        else if (answer == 'faq_question_11')
            bot.sendMessage(msg.from.id, locMessg.textFaqWhyObiAlwaysGrowText, faqMenuOptions);
        else if (answer == 'faq_question_12')
            bot.sendMessage(msg.from.id, locMessg.textFaqContractActivityText, faqMenuOptions);
        else if (answer == 'faq_question_13')
            bot.sendMessage(msg.from.id, locMessg.textFaqMyContractHasLostText, faqMenuOptions);
    }
    
    if (answer == 'faq_question_repeat') {
        
        var smartFaqsMenuOption = {
              reply_markup: JSON.stringify({
                inline_keyboard: [
                  [{ text: locMessg.textFaqWhyNeedToDo, callback_data: 'faq_question_1' }, { text: locMessg.textFaqConfidentData, callback_data: 'faq_question_2' }],
                  [{ text: locMessg.textFaqInstallTronlink, callback_data: 'faq_question_3' }, { text: locMessg.textFaqPayWalletTron, callback_data: 'faq_question_4' }],
                  [{ text: locMessg.textFaqMinDepositObvion, callback_data: 'faq_question_5' }, { text: locMessg.textFaqHowPaySmartContract, callback_data: 'faq_question_6' }],
                  [{ text: locMessg.textFaqModAdditionTron, callback_data: 'faq_question_7' }, { text: locMessg.textFaqBusinessManagement, callback_data: 'faq_question_8' }],
                  [{ text: locMessg.textFaqSafeWalletStorage, callback_data: 'faq_question_9' }, { text: locMessg.textFaqForgotPasswordTron, callback_data: 'faq_question_10' }],
                  [{ text: locMessg.textFaqWhyObiAlwaysGrow, callback_data: 'faq_question_11' }, { text: locMessg.textFaqContractActivity, callback_data: 'faq_question_12' }],
                  [{ text: locMessg.textFaqMyContractHasLost, callback_data: 'faq_question_13' }]
                ],
                //resize_keyboard: true,
                //one_time_keyboard: true
              }),
              parse_mode: "HTML"
            };
              
            bot.sendMessage(msg.from.id, '⁉️ FAQ', smartFaqsMenuOption);
    }
    
    /*  ДИАЛОГ УДАЛЕНИЕ  */
    if (answer == 'remove_first' && req.session.wallets.includes(msg.from.id)) {
      var removeOption = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: locMessg.menuRemoveTranslate, callback_data: 'remove_all' }]
          ],
        }),
        parse_mode: "HTML"
      };
      
      bot.sendMessage(msg.from.id, locMessg.textIncomeManagerAfterClickRemoveTranslate, removeOption);
    }
    
    /*  УДАЛЕНИЕ ВСЕХ  */
    if (req.session.wallets.includes(msg.from.id)) {
        if (answer == 'remove_all') {
          req.session.marketing = 'first';
          
          var messageId = msg.message.message_id;
          
          //messageId--;
          
          while (messageId > 0) {
            bot.deleteMessage(msg.message.chat.id, messageId);
            messageId--;
          }
          
          setTimeout(function(bot,fromId,startOptions,removeOption) { bot.sendMessage(fromId, locMessg.textIncomeManagerChooseLangTranslate, startOptions) }, 2000, bot, msg.from.id, startOptions);
        }
    }
    
  });
  
  var newrawlang = fs.readFileSync(__dirname+'/localization/'+req.session.bot_lang+'.json');
  locMessg = JSON.parse(newrawlang);
  
  // new RegExp(locMessg.menuAboutProjectTranslate, "i")
  
  /*  О ПРОЕКТЕ  */
  bot.onText(/⚙️ О проекте|⚙️ About the Project|⚙️ Über das Projekt|⚙️ Sobre el proyecto|⚙️ Informazioni sul progetto/, (msg, match) => {
    
    var aboutProjectMenuOption = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: locMessg.menuPresentationPdfTranslate, callback_data: 'about_pdf' }],
            [{ text: locMessg.menuVideoPresentationTranslate, callback_data: 'about_video_presentation' }],
            [{ text: locMessg.menuTokenomikaTranslate, callback_data: 'about_tokenomika_pdf' }],
            [{ text: locMessg.menuDefiPdfTranslate, callback_data: 'about_delfi_pdf' }]
          ],
          //resize_keyboard: true,
          //one_time_keyboard: true
        }),
        parse_mode: "HTML"
      };
      
      bot.sendMessage(msg.from.id, locMessg.textAboutProjectSectionTranslate, aboutProjectMenuOption);
  });
  
  /*  МАРКЕТИНГ  */
  bot.onText(/📊 Маркетинг|📊 Marketing|📊 Marketing|📊 Marketing|📊 Marketing/, (msg, match) => {
    
    if (req.session.marketing == 'first' && !req.session.wallets.includes(msg.from.id)) {
        var marketingMenuOption = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: locMessg.menuMarketingPdfTranslate, callback_data: 'marketing_pdf' }],
                [{ text: locMessg.menuVideoMarketingTranslate, callback_data: 'marketing_video_marketing' }],
                [{ text: locMessg.menuStickersObvionTranslate, callback_data: 'marketing_stikers_obvion' }]
              ],
              //resize_keyboard: true,
              //one_time_keyboard: true
            }),
            parse_mode: "HTML"
          };
    } else if (req.session.marketing == 'second' && req.session.wallets.includes(msg.from.id)) {
        var marketingMenuOption = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: locMessg.menuPresentationPdfTranslate, callback_data: 'marketing_presentation' }, { text: locMessg.menuMarketingPdfTranslate, callback_data: 'marketing_pdf' }],
                [{ text: locMessg.menuVideoPresentationTranslate, callback_data: 'marketing_video_presentation' }, { text: locMessg.menuVideoMarketingTranslate, callback_data: 'marketing_video_marketing' }],
                [{ text: locMessg.menuTokenomikaTranslate, callback_data: 'marketing_tokenomika_pdf' }, { text: locMessg.menuDefiPdfTranslate, callback_data: 'about_delfi_pdf' }],
                [{ text: locMessg.menuStickersObvionTranslate, callback_data: 'marketing_stikers_obvion' }, { text: locMessg.menuPromoMaterialsTranslate, callback_data: 'marketing_promo_materials' }],
                [{ text: locMessg.menuSmartContractsTranslate, callback_data: 'marketing_smart_contracts' }]
              ],
              //resize_keyboard: true,
              //one_time_keyboard: true
            }),
            parse_mode: "HTML"
          };
    }
      
      bot.sendMessage(msg.from.id, locMessg.textMarketingSectionTranslate, marketingMenuOption);
  });
  
  /*  СМАРТ КОНТРАКТЫ  */
  bot.onText(/🔐 Смарт-контракты|🔐 Smart Contracts|🔐 Smart Contracts|🔐 Contratos inteligentes|🔐 Smart contracts/, (msg, match) => {
    
    var smartContractsMenuOption = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: locMessg.menuCountingIncomeTranslate, callback_data: 'smart_contracts_counting_income' }],
            [{ text: locMessg.menuPartnerProgramTranslate, callback_data: 'smart_contracts_partner_program' }],
            [{ text: locMessg.menuOpenLevelsTranslate, callback_data: 'smart_contracts_opening_levels' }],
            [{ text: locMessg.menuObiTokenTranslate, callback_data: 'smart_contracts_obi_token' }],
            [{ text: locMessg.menuTokenomikaObiTranslate, callback_data: 'smart_contracts_tokenomika_obi' }]
          ],
          //resize_keyboard: true,
          //one_time_keyboard: true
        }),
        parse_mode: "HTML"
      };
      
      bot.sendMessage(msg.from.id, locMessg.textSmartContractsSectionTranslate, smartContractsMenuOption);
  });
  
  /*  РЕГИСТРАЦИЯ  */
  bot.onText(/💻 Регистрация|💻 Registration|💻 Registrierung|💻 Registro|💻 Registrazione/, (msg, match) => {
      var registrationMenuOption = { parse_mode: "HTML" };
      bot.sendMessage(msg.from.id, locMessg.textRegistrationSectionTranslate, registrationMenuOption);
      //bot.sendSticker(msg.from.id, 'CAACAgIAAxkBAAEBRmVfS5Fj9v8Li9D8Qfp4nEC-wq_DOwACYQADOmD5EnGMeonber4vGwQ');
      //setTimeout(function(bot,fromId,message) { bot.sendMessage(fromId, message) }, 1000, bot, msg.from.id, 'Поздравляю  🤖🎉\n\nВы прошли подтверждение. \nТеперь я буду высылать Вам уведомления о регистрации новых партнеров, а также о начислении всех видов дохода. Я многофункционален, и со всеми моими возможностями Вы ознакомитесь в разделе Главное меню');
  });
  
  /*  МЕНЕДЖЕР ДОХОДОВ  */
  bot.onText(/🤖Менеджер доходов|🤖Income Manager|🤖Einkommen Manager|🤖Gerente de ingresos|🤖Manager dei redditi/, (msg, match) => {
      
      var mainMenuOptions = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: locMessg.menuIncomeManagerProjectTranslate, callback_data: 'manager_manager_income' }],
          ],
          /*
          keyboard: [
            [{ text: '🖥 Контракты' },{ text: '📈 Доходы' }],
            [{ text: '👨🏻‍💻 Партнеры' },{ text: '💎 Токен' }],
            [{ text: '📊 Маркетинг' },{ text: '♻️ DeFi' }],
            [{ text: '🔔 Уведомления' },{ text: '✖️ Удалить' }]
          ],
          resize_keyboard: true,
          one_time_keyboard: false
          */
        }),
        parse_mode: "HTML"
      };
      
      //req.session.marketing = 'second';
      
      bot.sendMessage(msg.from.id, locMessg.textIncomeManagerSectionTranslate, mainMenuOptions);
      //setTimeout(function(bot,fromId) { bot.sendSticker(fromId, 'CAACAgIAAxkBAAEBRmVfS5Fj9v8Li9D8Qfp4nEC-wq_DOwACYQADOmD5EnGMeonber4vGwQ') }, 500, bot, msg.from.id);
      //setTimeout(function(bot,fromId) { bot.sendMessage(msg.from.id, 'Поздравляю  🤖🎉\nВы прошли подтверждение. \nТеперь я буду высылать Вам уведомления о регистрации новых партнеров, а также о начислении всех видов дохода. Я многофункционален, и со всеми моими возможностями Вы ознакомитесь в разделе Главное меню ') }, 500, bot, msg.from.id);
  });
  
  /*  ПОМОЩЬ  */
  bot.onText(/⁉️ FAQ/, (msg, match) => {
      //var faqMenuOptions = {parse_mode: "HTML"};
      //bot.sendMessage(msg.from.id, locMessg.textFaqSectionTranslate,faqMenuOptions);
      
      var smartFaqsMenuOption = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: locMessg.textFaqWhyNeedToDo, callback_data: 'faq_question_1' }, { text: locMessg.textFaqConfidentData, callback_data: 'faq_question_2' }],
            [{ text: locMessg.textFaqInstallTronlink, callback_data: 'faq_question_3' }, { text: locMessg.textFaqPayWalletTron, callback_data: 'faq_question_4' }],
            [{ text: locMessg.textFaqMinDepositObvion, callback_data: 'faq_question_5' }, { text: locMessg.textFaqHowPaySmartContract, callback_data: 'faq_question_6' }],
            [{ text: locMessg.textFaqModAdditionTron, callback_data: 'faq_question_7' }, { text: locMessg.textFaqBusinessManagement, callback_data: 'faq_question_8' }],
            [{ text: locMessg.textFaqSafeWalletStorage, callback_data: 'faq_question_9' }, { text: locMessg.textFaqForgotPasswordTron, callback_data: 'faq_question_10' }],
            [{ text: locMessg.textFaqWhyObiAlwaysGrow, callback_data: 'faq_question_11' }, { text: locMessg.textFaqContractActivity, callback_data: 'faq_question_12' }],
            [{ text: locMessg.textFaqMyContractHasLost, callback_data: 'faq_question_13' }]
          ],
          //resize_keyboard: true,
          //one_time_keyboard: true
        }),
        parse_mode: "HTML"
      };
      
      bot.sendMessage(msg.from.id, '⁉️ FAQ', smartFaqsMenuOption);
  });
  
  /*  ДЕЛФИ  */
  bot.onText(/♻️ DeFi/, (msg, match) => {
      var delfiMenuOptions = {parse_mode: "HTML"};
      
      if (req.session.wallets.includes(msg.from.id))
        bot.sendMessage(msg.from.id, locMessg.textDefiSectionTranslate,delfiMenuOptions);
  });
  
  /*  КОНТРАКТЫ  */
  bot.onText(/🖥 Контракты|🖥 Contracts|🖥 Kontrakte|🖥 Contratos|🖥 Contracts/, (msg, match) => {
      var contractsMenuOptions = {parse_mode: "HTML"};
      
      /*
      bot.sendMessage(msg.from.id, '<b>🖥 Контракты</b>\n\n▫️ Мой кошелек: <b>TNSRcKLevsCg15fVF71G4bCqJJPBXRxHwP</b>\n▫️ Моя партнерская ссылка: <a href="https://obvion.io/invite/TNSRcKLevsCg15fVF71G4bCqJJPBXRxHwP"><b>obvion.io/invite/TNSRcKLevsCg15fVF71G4bCqJJPBXRxHwP</b></a>\n▫️ Уровень: <b>4</b>\n▫️ Личный оборот: <b>23000 TRX</b>\n▫️ Общий оборот: <b>118500 TRX</b>\n\n'+
                        '🖥 Мои контракты:\n\n<b>Контракт 1 ➡️ 10 000 TRX</b>\nНачало контракта: 10.05.2020\nИстечение контракта: 10.05.2021\nКоличество еженедельных выплат: 34\n\n<b>Контракт 2 ➡️ 30 000 TRX</b>\nНачало контракта: 20.05.2020\nИстечение контракта: 20.05.2021\nКоличество еженедельных выплат: 42\n\n<b>Контракт 3 ➡️ 50 000 TRX</b>\nНачало контракта: 30.05.2020'+
                        'Истечение контракта: 30.05.2021\nКоличество еженедельных выплат: 45\n\n<b>Контракт 4 ➡️ 50 000 TRX</b>\nНачало контракта: 30.06.2020\nИстечение контракта: 30.06.2021\nКоличество еженедельных выплат: 50',contractsMenuOptions);
      */
      
      if (req.session.wallets.includes(msg.from.id)) {
          
          var passiveContractsFunc = async function() {
              
                var level = await getLevel(req.session.wallet);
                var personalTurnover = await getTersonalTurnover(req.session.wallet);
                var totalTurnover = await getTotalTurnover(req.session.wallet);
                var allDeposits = await getAllDeposits(req.session.wallet);
                
                const result = {
                    level: level,
                    personalTurnover: personalTurnover,
                    totalTurnover: totalTurnover,
                    allDeposits: allDeposits
                }
                
                return result;
             };

             passiveContractsFunc().then( passiveContractsArray => {
                    
                    var contractTextMessage = vsprintf(locMessg.textContractesMyWalletTranslate,[ passiveContractsArray.level, '$' + passiveContractsArray.personalTurnover.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), '$' + passiveContractsArray.totalTurnover.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') ]);
                    
                    if (passiveContractsArray.allDeposits.length > 0)
                        contractTextMessage += locMessg.textMyContractsTranslate;
                    
                    /*
                    passiveContractsArray.allDeposits.forEach(element => {
                      console.log(element);
                      contractTextMessage += '<b>Контракт 1 ➡️ '+element.amount+' TRX</b>\nНачало контракта: '+element.time+'\nИстечение контракта: '+element.time+'\nКоличество еженедельных выплат: '+element.countOfWeeks+'\n\n';
                    });
                    */
                    
                    passiveContractsArray.allDeposits.forEach(function (value, i) {
                        var startDate   = new Date(value.time * 1000);
                        var endDate     = new Date((value.time+31449600) * 1000);
                        
                        var startYear    = startDate.getFullYear();
                        var startMonth   = ("0" + startDate.getMonth()).substr(-2);
                        var startDate    = ("0" + startDate.getDate()).substr(-2);
                        
                        var endYear    = endDate.getFullYear();
                        var endMonth   = ("0" + endDate.getMonth()).substr(-2);
                        var endDate    = ("0" + endDate.getDate()).substr(-2);

                        var formattedStartTime  = startDate + '.' + startMonth + '.' + startYear;
                        var formattedEndTime    = endDate + '.' + endMonth + '.' + endYear;
                        
                        contractTextMessage += vsprintf(locMessg.textContractStartContractTranslate, [(i+1), '$' + value.amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), formattedStartTime, formattedEndTime, value.countOfWeeks]);
                    });
                    
                    bot.sendMessage(msg.from.id, contractTextMessage, contractsMenuOptions);
                    
             } );
      }
  });
  
  /*  ДОХОДЫ  */
  bot.onText(/📈 Доходы|📈 Income|📈 Einkommen|📈 Ingresos|📈 Redditi/, (msg, match) => {
      var incomesMenuOptions = {parse_mode: "HTML"};
      
      /*
      bot.sendMessage(msg.from.id, '<b>📈 Доходы</b>\n\n<b>🔹 Пассивный доход</b>\nЗарезервировано: <b>24 500 TRX</b>\nЗачислено: <b>31 500 TRX</b>\nИтого: <b>54 000 TRX</b>\n\n'+
                                    '<b>🔹 Активный доход</b> \nЗарезервировано: <b>20 500 TRX</b>\nЗачислено: <b>51 500 TRX</b>\nИтого: <b>72 000 TRX</b>\n\n'+
                                    '<b>🔹 OBI токен</b>\nЗарезервировано: <b>11 200 OBI</b>\nЗачислено: <b>5 800 OBI</b>\nИтого: <b>17 000 OBI = 20 000 TRX</b>\n\n'+
                                    '<b>🔷 Общий доход: 14 6000 TRX</b>',incomesMenuOptions);
     */
      
      if (req.session.wallets.includes(msg.from.id)) {
          
          var passiveIncomeFunc = async function() {
                var getPassiveIncVar = await getPassiveIncome(req.session.wallet, eventsPassive);
                var refIncomeVar = await getRefIncome(req.session.wallet, eventsPassive);
                var tokenIncome = await getTokenIncome(req.session.wallet, eventsPassive);
                
                const result = {
                    passiveIncome: getPassiveIncVar,
                    activeIncome: refIncomeVar,
                    obiIncome: tokenIncome
                }

                return result;
              };
          
          passiveIncomeFunc().then( passiveIncomeArray => {
              
              var allAmount = passiveIncomeArray.passiveIncome.all + passiveIncomeArray.activeIncome + passiveIncomeArray.obiIncome.value;
              
              var incomeTextMessage = vsprintf(locMessg.textIncomesPassiveIncomeTranslate, ['$' + passiveIncomeArray.passiveIncome.reserved.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), '$' + passiveIncomeArray.passiveIncome.received.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), '$' + passiveIncomeArray.activeIncome.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), passiveIncomeArray.obiIncome.tokens, '$' + allAmount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')]);
              
              bot.sendMessage(msg.from.id, incomeTextMessage, incomesMenuOptions);
          } );
      }

  });
  
  /*  ПАРТНЕРЫ  */
  bot.onText(/👨🏻‍💻 Партнеры|👨🏻‍💻 Partners|👨🏻‍💻 Partner|👨🏻‍💻 Participantes|👨🏻‍💻 Partners/, (msg, match) => {
      var partnersMenuOptions = {parse_mode: "HTML"};
      
      // bot.sendMessage(msg.from.id, '<b>👨🏻‍💻 Партнеры</b>\n\n1️⃣ линия: <b>8</b>\n2️⃣ линия: <b>15</b>\n3️⃣ линия: <b>10</b>\n4️⃣ линия: <b>4</b>\n5️⃣ линия: <b>2</b>\n6️⃣ линия: <b>1</b>\n7️⃣ линия: <b>0</b>\n8️⃣ линия: <b>0</b>\n9️⃣ линия: <b>0</b>\n🔟 линия: <b>0</b>\n1️⃣1️⃣ линия: <b>0</b>\n1️⃣2️⃣ линия: <b>0</b>\n\n<b>✅ Всего партнеров: 33</b>',partnersMenuOptions);
      
      if (req.session.wallets.includes(msg.from.id)) {
          
          var partnerContractsFunc = async function() {
                var partners = await getPartners(req.session.wallet);
                
                return partners;
             };

             partnerContractsFunc().then( partnerContractsArray => {
                    var partnersCount = 12;
                 
                    bot.sendMessage(msg.from.id, vsprintf(locMessg.textPartnersLinesTranslate, [ partnerContractsArray._1line, partnerContractsArray._2line, partnerContractsArray._3line, partnerContractsArray._4line, partnerContractsArray._5line, partnerContractsArray._6line, partnerContractsArray._7line, partnerContractsArray._8line, partnerContractsArray._9line, partnerContractsArray._10line, partnerContractsArray._11line, partnerContractsArray._12line, partnerContractsArray.countOfPartners ]),partnersMenuOptions);
             } );
      }
  });
  
  /*  ТОКЕН  */
  bot.onText(/💎 Токен|💎 Token/, (msg, match) => {
      var tokenMenuOptions = {parse_mode: "HTML"};
      
      // bot.sendMessage(msg.from.id, '<b>💎 Токен</b>\n\n🔸 Мои OBI токены:\n<b>10 000 OBI</b>\n\n🔸 Цена:\n<b>1 OBI = 0.4545 TRX</b>\n\n🔸 Эмисcия:\n<b>10 000 000 OBI</b>\n\n🔸 Сожжено:\n<b>1 000 000 OBI</b>',tokenMenuOptions);
      
      if (req.session.wallets.includes(msg.from.id)) {
          
          var tokenContractsFunc = async function() {
                var tokenInfo = await getTokenInfo(req.session.wallet, eventsToken);
                
                return tokenInfo;
             };

             tokenContractsFunc().then( tokenContractsArray => {
                    bot.sendMessage(msg.from.id, vsprintf(locMessg.textTokenMyObiTranslate, [ tokenContractsArray.tokenBalance, '$' + tokenContractsArray.tokenPrice.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), tokenContractsArray.totalSupply, tokenContractsArray.burnedTokens ]), tokenMenuOptions);
             } );
      }
  });
  
  /*  УВЕДОМЛЕНИЯ  */
  bot.onText(/🔔 Уведомления|🔔 Notifications|🔔 Benachrichtigungen|🔔 Notificaciones|🔔 Notifiche/, (msg, match) => {
      
      if (req.session.wallets.includes(msg.from.id)) {
          
          var notificationOptions = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: locMessg.menuTurnOffNotificationsTranslate, callback_data: 'notification_off' }],
                [{ text: locMessg.menuTurnOnNotificationsTranslate, callback_data: 'notification_on' }],
                [{ text: locMessg.menuLangTranslate, callback_data: 'language_choose' }],
                [{ text: locMessg.menuRemoveTranslate, callback_data: 'remove_first' }]
              ]
            }),
            parse_mode: "HTML"
          };
          
          bot.sendMessage(msg.from.id, locMessg.textNotificationsTranslate,notificationOptions);
      }
      //setTimeout(function(bot,fromId,startOptions) { bot.sendMessage(msg.chat.id, '🌍 Язык \n\nВыберите язык интерфейса. Смена языка не повлияет на отправленные ранее сообщения.', startOptions) }, 500, bot, msg.chat.id, startOptions );
  });
  
  /*  УДАЛИТЬ  */
  bot.onText(/✖️ Удалить|✖️ Delete|✖️ Löschen|✖️ Eliminar|✖️ Cancellare/, (msg, match) => {
      
      if (req.session.wallets.includes(msg.from.id)) {
          
          var removeOption = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: locMessg.menuRemoveTranslate, callback_data: 'remove_all' }]
              ],
            }),
            parse_mode: "HTML"
          };
          
          bot.sendMessage(msg.from.id, locMessg.menuAfterClickRemoveTranslate, removeOption);
      }
  });
  
  /*  О ПРОЕКТЕ  */
  bot.onText(/❌ Выход|❌ Exit/, (msg, match) => {
      bot.leaveChat(msg.from.id);
  });
  
  /*  ПРОВЕРКА КОШЕЛЬКА  */
  bot.onText(/(.+)/, (msg, match) => {
      
      var removeOption = { parse_mode: "HTML" };
      
      if (msg.text.length == 34) {
          
          con.connect(function(err) {
            con.query("SELECT * FROM obv_users WHERE wallet = '"+msg.text+"'", function (err, result, fields) {
              if (result.length) {
                req.session.wallets.push(msg.from.id);
                req.session.wallet = msg.text;
                bot.sendMessage(msg.from.id, "❇️ Кошелек <strong>"+msg.text+"</strong> найден.\n\nТеперь введите проверочный код:", removeOption);
              } else {
                bot.sendMessage(msg.from.id, "Такого кошелька в системе не найдено!⁉️", removeOption);
              }
            });
          });

      } else if (msg.text.length == 6 && req.session.wallets.includes(msg.from.id)) {  
        request('https://obvion.io/ajax-google-check-secret?wallet='+req.session.wallet+'&check_code='+msg.text, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var parseData = JSON.parse(body);

            if (parseData.result == 'success') {
              bot.sendMessage(msg.from.id, "✅ Код был успешно подтвержден!\n\n", removeOption);
              
              var mainMenuOptions = {
                  reply_markup: JSON.stringify({
                    keyboard: [
                      [{ text: locMessg.menuContractsTranslate },{ text: locMessg.menuIncomesTranslate }],
                      [{ text: locMessg.menuPartnersTranslate },{ text: locMessg.manuTokenTranslate }],
                      [{ text: locMessg.menuMarketingTranslate },{ text: locMessg.manuDefiTranslate }],
                      [{ text: locMessg.menuNotificationsTranslate },{ text: locMessg.menuFaqTranslate }],
                      [{ text: locMessg.menuExitButton }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: false
                  }),
                  parse_mode: "HTML"
                };
                
                req.session.marketing = 'second';
                
                bot.sendMessage(msg.from.id, locMessg.textIncomeManagerCongradsTranslate, mainMenuOptions);
                setTimeout(function(bot,fromId) { bot.sendMessage(fromId, locMessg.textIncomeManagerPlesaseConfirmTranslate,mainMenuOptions) }, 300, bot, msg.from.id);
                setTimeout(function(bot,fromId) { bot.sendSticker(fromId, 'CAACAgIAAxkBAAEBVdJfYIwihP1PgYwfdIV_2uFWRYgeUAACqQADOmD5ErXo47BnVO-qGwQ') }, 600, bot, msg.from.id);
                setTimeout(function(bot,fromId) { var greetYouMenuOptions = {parse_mode: "HTML"}; bot.sendMessage(msg.from.id, locMessg.textIncomeManagerYouPassConfirmTranslate,greetYouMenuOptions) }, 900, bot, msg.from.id);
            } else if (parseData.result == 'no code') {
              bot.sendMessage(msg.from.id, "Вы не сгенерировали код в личном кабинете❕\n➡️ Войдите в кабинет, сгенерируйте код и отсканируйте его через <strong>Пополнить контракт -> Продолжить -> Google 2FA на <a href=\"https://obvion.io\">https://obvion.io</a></strong>\n\n🔢 Полученый код введите или отсканируйте <strong>QR-код</strong> в <strong>Google Authenticator</strong> приложение. Этот код который генерируется в этом приложении нужно будет вводить в боте при его запросе.", removeOption);
            } else if (parseData.result == 'error') {
              bot.sendMessage(msg.from.id, "Вы ввели неверный код❌\nПожалуйства повторите попытку еще раз❕", removeOption);
            }
          }
        });
      }
      
  });
  
  res.sendStatus(200);
});

app.get("/app/hello", (req, res) => {
  res.send("Hello world");
});

app.get('/app/close', function(req,res) {
  res.send('closing..');
  server.close();
});

var server = app.listen(port, host, function() {
  console.log(`Server listens http://${host}:${port}`)
});

/*
process.on('SIGTERM', function() {
  console.log('SIGTERM.')
});

process.on('SIGINT', function() {
  console.log('SIGINT.')
});
*/

// process.on('exit', function() {
//   var datetime = new Date();
//   //server.close();
//   /*
//   server = app.listen(port, host, function() {
//     console.log(`Server listens http://${host}:${port}`)
//   });
//   */
//   //console.log('Process terminating - '+datetime)
// });

// process.on('uncaughtException', function(e) {

//     //console.log('[uncaughtException] app will be terminated: ', e.stack);

//     //killProcess();
//     /**
//      * @https://nodejs.org/api/process.html#process_event_uncaughtexception
//      *  
//      * 'uncaughtException' should be used to perform synchronous cleanup before shutting down the process. 
//      * It is not safe to resume normal operation after 'uncaughtException'. 
//      * If you do use it, restart your application after every unhandled exception!
//      * 
//      * You have been warned.
//      */
// });

/*
var http = require('http');

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

//const Telegraf = require('telegraf');
//const bot = new Telegraf(process.env.BOT_TOKEN);

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: '🇬🇧 English', callback_data: 'en_lang' },{ text: '🇷🇺 Русский', callback_data: 'ru_lang' }],
          [{ text: '🇪🇸 Español', callback_data: 'es_lang' },{ text: '🇮🇹 Italiano', callback_data: 'it_lang' }],
          [{ text: '🇩🇪 Deutsche', callback_data: 'de_lang' }],
          [{ text: '⬅️ Вернуться к настройкам', callback_data: 'back_settings' }]
        ]
      })
    };

    bot.onText(/\/start/, function (msg, match) {
      bot.sendMessage(msg.chat.id, '🌍 Язык \n\nВыберите язык интерфейса. Смена языка не повлияет на отправленные ранее сообщения.', options);
    });
    
    bot.on('callback_query', function (msg) {
      var answer = msg.data;

      if (answer == 'ru_lang') {
        bot.sendMessage(msg.from.id, 'Приветствую 🖖🏻 \nЯ бот открытой финансовой системы Obvion. Я познакомлю Вас с проектом и предоставлю всю актуальную информацию о бизнесе и инвестициях, для этого переходите в интересующие Вас вкладки в разделе Основное меню');
      }
    });
        
    res.end('Success!');
});

server.listen();
*/
