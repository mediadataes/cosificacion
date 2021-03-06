const Telegraf = require('telegraf');
const uuidv1 = require('uuid/v1');
const session = require('telegraf/session');
const Extra = require('telegraf/extra');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const moment = require('moment');
const {leave} = Stage;


// Greeter scene
const greeter = new Scene('greeter');
greeter.enter((ctx) => {
    ctx.reply('¡Bienvenidx!\nAntes de comenzar, necesito saber un poco más de ti.\nPor favor, responde a estas preguntas 👇').then(value => {
        ctx.scene.enter('aboutGenderTraining');
        //ctx.scene.enter('frame');
        ctx.session.results = [false, false, false, false, false, false, false];
    });
});

const aboutGenderTraining = new Scene('aboutGenderTraining');
aboutGenderTraining.enter((ctx) => {
    ctx.reply('¿Tienes formación en estudios de género?', Extra.HTML().markup((m) =>
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
    let one = "https://s3.eu-central-1.amazonaws.com/cosificacion.bot/11.jpg";

    ctx.reply('¡Perfecto!\nAhora vamos a aprender cómo clasificar un clip en función de diversos parámetros.').then(value => {
        ctx.reply('El análisis está basado en el Test de Objeto Sexual diseñado por la socióloga americana Caroline Heldman.\n' +
            'Estos son algunos ejemplos para que puedas familiarizarte con los 7 conceptos analizados.').then(value1 => {
            ctx.replyWithPhoto(one).then(value => {
                ctx.reply('Se muestra solo una parte del cuerpo (tetas, culo). ➡️PARTE', Extra.HTML().markup((m) =>
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
    let two = "https://s3.eu-central-1.amazonaws.com/cosificacion.bot/22.jpg";

    ctx.replyWithPhoto(two).then(value => {
        ctx.reply('Se reduce a la mujer a un soporte (silla, mesa). ➡️OBJETO', Extra.HTML().markup((m) =>
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
    let three = "https://s3.eu-central-1.amazonaws.com/cosificacion.bot/33.jpg";

    ctx.replyWithPhoto(three).then(value => {
        ctx.reply('La mujer aparece como algo reemplazable. ➡️DECORATIVA', Extra.HTML().markup((m) =>
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
    let four = "https://s3.eu-central-1.amazonaws.com/cosificacion.bot/44.jpg";

    ctx.replyWithPhoto(four).then(value => {
        ctx.reply('Se muestra a la mujer maltratada, humillada o como ser inferior. ➡️MALTRATADA', Extra.HTML().markup((m) =>
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
    let five = "https://s3.eu-central-1.amazonaws.com/cosificacion.bot/55.jpg";

    ctx.replyWithPhoto(five).then(value => {
        ctx.reply('Se muestra la disponibilidad sexual de la mujer. ➡️SEXUALIZADA', Extra.HTML().markup((m) =>
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
    let six = "https://s3.eu-central-1.amazonaws.com/cosificacion.bot/66.jpg";

    ctx.replyWithPhoto(six).then(value => {
        ctx.reply('Se muestra a la mujer como mercancía o alimento. ➡️MERCANCIA', Extra.HTML().markup((m) =>
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
    let seven = "https://s3.eu-central-1.amazonaws.com/cosificacion.bot/77.jpg";
    ctx.replyWithPhoto(seven).then(value => {
        ctx.reply('El cuerpo de la mujer es utilizado para pintar mensajes. ➡️LIENZO', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Finalizar', 'fin')
            ])))
    })

});

seven.on('callback_query', ctx => {
    ctx.answerCbQuery('✅');
    ctx.reply("Perfecto 👍, ahora ya puedes empezar a clasificar clips.");
    ctx.scene.enter('frame');


});


// Frame scene
const frame = new Scene('frame');
frame.enter((ctx) => {
    console.log("Entered frame scene");


    getClip().then(link => {

        ctx.replyWithVideo(link).then(value1 => {
            ctx.reply("Pulsa sobre las opciones que veas en el clip 👇\nEn caso de no encontrar ninguna de las opciones, símplemente haz click sobre ENVIAR", Extra.HTML().markup((m) =>
                m.inlineKeyboard([
                    [m.callbackButton('Parte', 'Parte'), m.callbackButton('Objeto', 'Objeto')],
                    [m.callbackButton('Decorativa', 'Decorativa'), m.callbackButton('Maltratada', 'Maltratada')],
                    [m.callbackButton('Sexualizada', 'Sexualizada'), m.callbackButton('Mercancía', 'Mercancía')],
                    [m.callbackButton('Lienzo', 'Lienzo')],
                    [m.callbackButton('⏩ENVIAR⏪', 'SEND')]]
                )));
        });

    })

});
frame.on('callback_query', ctx => {
    let answer = ctx.callbackQuery.data;

    if (answer === "SEND") {
        ctx.answerCbQuery('✅');
        ctx.scene.enter('results');
    } else {

        let options = ['Parte', 'Objeto', 'Decorativa', 'Maltratada', 'Sexualizada', 'Mercancía', 'Lienzo'];
        let index = options.indexOf(answer);
        let selectionStatus = ctx.session.results;

        selectionStatus[index] = !selectionStatus[index];
        ctx.session.results = selectionStatus;

        let keyOptions = ['Parte', 'Objeto', 'Decorativa', 'Maltratada', 'Sexualizada', 'Mercancía', 'Lienzo'];


        let tick = "✅";

        for (let i = 0; i < selectionStatus.length; i++) {
            let status = selectionStatus[i];
            if (status) {
                keyOptions[i] = tick + keyOptions[i];

            } else {
                keyOptions[i] = options[i];
            }
        }
        let keyboardUpdated = Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                [m.callbackButton(keyOptions[0], 'Parte'), m.callbackButton(keyOptions[1], 'Objeto')],
                [m.callbackButton(keyOptions[2], 'Decorativa'), m.callbackButton(keyOptions[3], 'Maltratada')],
                [m.callbackButton(keyOptions[4], 'Sexualizada'), m.callbackButton(keyOptions[5], 'Mercancía')],
                [m.callbackButton(keyOptions[6], 'Lienzo')],
                [m.callbackButton('⏩Enviar⏪', 'SEND')]]
            ));
        ctx.editMessageReplyMarkup(JSON.stringify({inline_keyboard: keyboardUpdated.reply_markup.inline_keyboard}));
        ctx.answerCbQuery('✅');
    }
});


// Resultados scene
const results = new Scene('results');
results.enter((ctx) => {
    console.log("Entered results scene");

    let results = ctx.session.results;
    ctx.session.results = [false, false, false, false, false, false, false];

    let focused = results[0];
    let object = results[1];
    let decorative = results[2];
    let abused = results[3];
    let sexualized = results[4];
    let commodity = results[5];
    let canvas = results[6];

    ctx.reply("¡Muchas gracias! Si quieres clasificar otro clip, pulsa /clasificar")



});
results.command('clasificar', (ctx) => {
    ctx.scene.enter('frame');
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
bot.catch(error => {
    console.log('telegraf error', error.response, error.parameters, error.on || error)
});

bot.command('start', (ctx) => ctx.scene.enter('greeter'));

bot.startPolling();


function getClip (){
    return new Promise((resolve, reject) => {
        let items = [
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-1-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-2-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-3-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-4-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-5-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-6-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-7-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-8-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-9-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-10-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-11-of-12.mp4",
            "https://s3.eu-central-1.amazonaws.com/cosificacion.bot.clips/Aitana%2C+Lola+Indigo+-+Me+Quedo-SJcm2dLUjVo-12-of-12.mp4"
        ];
        let rand = items[Math.floor(Math.random() * items.length)];
        return resolve(rand);
    });

}