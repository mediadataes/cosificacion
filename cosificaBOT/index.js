const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');
const session = require('telegraf/session');
const Extra = require('telegraf/extra');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const moment = require('moment');
const {leave} = Stage;
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./AWS.json');

const db = new AWS.DynamoDB;
const docClient = new AWS.DynamoDB.DocumentClient();

const menu = new TelegrafInlineMenu(ctx => `La pregunta`);
let options = ['Troceada', 'Objeto', 'Intercambiable', 'Maltrato', 'Sexualizada', 'Mercancía', 'Lienzo'];
let selectionStatus = [false, false, false, false, false, false, false];
menu.select('s', options, {
    setFunc: async (ctx, key) => {
        let index = options.indexOf(key);
        let status = selectionStatus[index];
        selectionStatus[index] = !status;
        await ctx.answerCbQuery(`you selected ${key}`)
    },
    prefixFunc: (_ctx, key) => {
        return selectionStatus[options.indexOf(key)];
    },
    columns: 2
});
menu.simpleButton('⏩Enviar⏪', 'c', {
    doFunc: async ctx => {
        ctx.answerCbQuery('Respuesta enviada.');
        ctx.session.results = selectionStatus;
        ctx.scene.enter('results')
    }
});
menu.setCommand('empezar');


// Greeter scene
const greeter = new Scene('greeter');
greeter.enter((ctx) => {
    ctx.reply('¡Bienvenidx!\nAntes de comenzar, necesito saber un poco mas de ti. Por favor responde a estas preguntas 👇');
    ctx.scene.enter('aboutGenderTraining');

});

const aboutGenderTraining = new Scene('aboutGenderTraining');
aboutGenderTraining.enter((ctx) => {
    ctx.reply('¿Tienes formación en estudios de géenro?', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('Sí', 'yes'),
            m.callbackButton('No', 'no')
        ])))
});

aboutGenderTraining.on('callback_query', ctx => {
    let answer = ctx.callbackQuery.data;
    if (answer === 'yes') {
        ctx.answerCbQuery('Sí');
        ctx.session.usrGenderTraining = true;
        ctx.scene.enter('aboutGender');


    } else if (answer === 'no') {
        ctx.answerCbQuery('No');
        ctx.session.usrGenderTraining = false;
        ctx.scene.enter('aboutGender');

    }

});


const aboutGender = new Scene('aboutGender');
aboutGender.enter((ctx) => {

    ctx.reply('¿Cuál es tu género?', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('Femenino', 'fem'),
            m.callbackButton('Masculino', 'masc'),
            m.callbackButton('Otro', 'other')
        ])));


});
aboutGender.on('callback_query', ctx => {
    let answer = ctx.callbackQuery.data;
    ctx.answerCbQuery('✅');
    ctx.session.usrGender = answer;
    ctx.scene.enter('aboutAge');


});


const aboutAge = new Scene('aboutAge');
aboutAge.enter((ctx) => {
    ctx.reply('¿Cuál es tu edad?');

});
aboutAge.on('message', ctx => {
    let answer = ctx.message.text;
    let regex = /^(1[6-9]|[2-5][0-9]|9[0-9])$/;

    if (regex.test(answer)) {
        ctx.session.userAge = answer;
        ctx.scene.enter('one');
    } else {
        ctx.reply("Lo lamento, esa edad no es correcta o eres demasiado joven para poder utilizar este bot.");
        ctx.scene.reenter();
    }
});


// Training scenes
const one = new Scene('one');
one.enter((ctx) => {
    let one = "https://s3.eu-central-1.amazonaws.com/bot.cosificacion/1.jpg";

    ctx.reply('¡Perfecto!\nAhora vamos a aprender cómo clasificar un fotograma en función de diversos parámetros.').then(value => {
        ctx.reply('El análisis está basado en el Test de Objeto Sexual diseñado por la socióloga americana Caroline Heldman.\n' +
            'Estos son algunos ejemplos para que puedas familiarizarte con los conceptos analizados.').then(value1 => {
            ctx.replyWithPhoto(one).then(value => {
                ctx.reply('Se muestra sólo una parte del cuerpo (tetas, culo). PARTE', Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        m.callbackButton('Siguiente', 'next')
                    ])))
            })
        })
    })

});

one.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.scene.enter('two');


});
const two = new Scene('two');
two.enter((ctx) => {
    let two = "https://s3.eu-central-1.amazonaws.com/bot.cosificacion/2.jpg";

    ctx.replyWithPhoto(two).then(value => {
        ctx.reply('Se reduce a la mujer a un soporte (silla, mesa). OBJETO', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Siguiente', 'next')
            ])))
    })

});

two.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.scene.enter('three');


});
const three = new Scene('three');
three.enter((ctx) => {
    let three = "https://s3.eu-central-1.amazonaws.com/bot.cosificacion/3.jpg";

    ctx.replyWithPhoto(three).then(value => {
        ctx.reply('La mujer aparece como algo reemplazable. DECORATIVA', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Siguiente', 'next')
            ])))
    })

});

three.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.scene.enter('four');


});
const four = new Scene('four');
four.enter((ctx) => {
    let four = "https://s3.eu-central-1.amazonaws.com/bot.cosificacion/4.jpg";

    ctx.replyWithPhoto(four).then(value => {
        ctx.reply('Se muestra a la mujer maltratada, humillada o como ser inferior. MALTRATO', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Siguiente', 'next')
            ])))
    })

});

four.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.scene.enter('five');
});
const five = new Scene('five');
five.enter((ctx) => {
    let five = "https://s3.eu-central-1.amazonaws.com/bot.cosificacion/5.jpg";

    ctx.replyWithPhoto(five).then(value => {
        ctx.reply('Se muestra la disponibilidad sexual de la mujer. SEXUALIZADA', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Siguiente', 'next')
            ])))
    })

});

five.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.scene.enter('six');


});
const six = new Scene('six');
six.enter((ctx) => {
    let six = "https://s3.eu-central-1.amazonaws.com/bot.cosificacion/6.jpg";

    ctx.replyWithPhoto(six).then(value => {
        ctx.reply('Se muestra a la mujer como mercancía o alimento. MERCANCIA', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Siguiente', 'next')
            ])))
    })

});

six.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.scene.enter('seven');


});
const seven = new Scene('seven');
seven.enter((ctx) => {
    let seven = "https://s3.eu-central-1.amazonaws.com/bot.cosificacion/7.jpg";
    ctx.replyWithPhoto(seven).then(value => {
        ctx.reply('El cuerpo de la mujer es utilizado para pintar mensajes. LIENZO', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Finalizar', 'fin')
            ])))
    })

});

seven.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.scene.enter('frame');


});














// Frame scene
const frame = new Scene('frame');
frame.enter((ctx) => {
    console.log("Entered frame scene");

    getFrame().then(value => {
        ctx.session.frameId = value.frame_id;
        ctx.session.title = value.title;
        ctx.session.artists = value.artists;
        ctx.session.aiMaleGenitalia = value.ai_male_genitalia;
        ctx.session.aiFemaleGenitalia = value.ai_female_genitalia;
        ctx.session.aiMaleBreast = value.ai_male_breast;
        ctx.session.aiFemaleBreast = value.ai_female_breast;
        ctx.session.telFocused = value.tel_focused;
        ctx.session.telObject = value.tel_object;
        ctx.session.telDecorative = value.tel_decorative;
        ctx.session.telAbused = value.tel_abused;
        ctx.session.telSexualized = value.tel_sexualized;
        ctx.session.telComodity = value.tel_commodity;
        ctx.session.telCanvas = value.tel_canvas;

        ctx.session.created = value.created;
        ctx.session.coAnalyzed = value.co_analyzed;
        ctx.session.aiAnalyzed = value.ai_analyzed;
        ctx.session.url = value.url.S;


        ctx.replyWithPhoto(ctx.session.url).then(value1 => {
            ctx.reply("Aquí tienes un frame para analizar. Pulsa /empezar para analizarlo.");
        });

    })

});


// Resultados scene
const results = new Scene('results');
results.enter((ctx) => {
    console.log("Entered results scene");

    let results = ctx.session.results;

    let focused = results[0];
    let object = results[1];
    let decorative = results[2];
    let abused = results[3];
    let sexualized = results[4];
    let commodity = results[5];
    let canvas = results[6];


    ctx.reply(results);
    ctx.reply("Gracias!");

    let imagen = {
        TableName: 'cosificabot_frames',
        Item: {
            "frame_id": ctx.session.frameId,

            "title": ctx.session.title,
            "artists": ctx.session.artists,

            "ai_male_genitalia": ctx.session.aiMaleGenitalia,
            "ai_female_genitalia": ctx.session.aiFemaleGenitalia,
            "ai_male_breast": ctx.session.aiMaleBreast,
            "ai_female_breast": ctx.session.aiFemaleBreast,

            "tel_focused": focused,
            "tel_object": object,
            "tel_decorative": decorative,
            "tel_abused": abused,
            "tel_sexualized": sexualized,
            "tel_commodity": commodity,
            "tel_canvas": canvas,

            "usr_gender_training": ctx.session.usrGenderTraining,
            "usr_gender": ctx.session.usrGender,
            "usr_age": ctx.session.userAge,

            "created": ctx.session.created,
            "updated": moment().format(),
            "co_analyzed": ctx.session.coAnalyzed,
            "ai_analyzed": ctx.session.aiAnalyzed,

            "url": ctx.session.url

        }
    };

});


// Create scene manager
const stage = new Stage();
stage.command('cancel', leave());

// Scene registration
stage.register(greeter);
stage.register(aboutGenderTraining);
stage.register(aboutGender);
stage.register(aboutAge);
stage.register(one);
stage.register(two);
stage.register(three);
stage.register(four);
stage.register(five);
stage.register(six);
stage.register(seven);
stage.register(frame);
stage.register(results);


///////////////////// INIT BOT /////////////////////
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
bot.use(stage.middleware());
bot.use(menu.init());
bot.catch(error => {
    console.log('telegraf error', error.response, error.parameters, error.on || error)
});

bot.command('start', (ctx) => ctx.scene.enter('greeter'));

bot.startPolling();


function getFrame() {
    return new Promise(resolve => {
        let query = {
            TableName: "cosificabot_frames"
        };

        db.scan(query, function (err, data) {

            if (err) console.log(err);
            else {
                let items = data.Items;
                let rand = items[Math.floor(Math.random() * items.length)];
                return resolve(rand);

            }
        })
    })

}