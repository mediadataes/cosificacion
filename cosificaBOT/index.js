const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { leave } = Stage;
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./AWS.json');

const db = new AWS.DynamoDB;
const docClient = new AWS.DynamoDB.DocumentClient();

const menu = new TelegrafInlineMenu(ctx => `La pregunta`);
let options = ['Troceada', 'Objeto', 'Intercambiable','Maltrato', 'Sexualizada', 'Mercancía','Lienzo'];
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
    ctx.reply('Bienvenidx');
    ctx.scene.enter('frame');

});



// Frame scene
const frame = new Scene('frame');
frame.enter((ctx) => {
    console.log("Entered frame scene");


    getFrame().then(value => {
        let frameId = value.frame_id;
        let url = value.url.S;
        ctx.session.url = url;
        ctx.session.frameId = frameId;
        ctx.replyWithPhoto(url).then(value1 => {
            ctx.reply("Aquí tienes un frame para analizar. Pulsa /empezar para analizarlo.");
        });

    })



});



// Resultados scene
const results = new Scene('results');
results.enter((ctx) => {
    console.log("Entered results scene");
    let results = ctx.session.results;
    ctx.reply(results);
    ctx.reply("Gracias!");

    // let storeVote = {
    //     TableName: 'votes',
    //     Item: {
    //         "id": uuidv1(),
    //         "question1": ctx.session.vote1,
    //         "question2": ctx.session.vote2
    //     }
    // };
    // docClient.put(storeVote, function (err, data) {
    //
    // })
});










// Create scene manager
const stage = new Stage();
stage.command('cancel', leave());

// Scene registration
stage.register(greeter);
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





function getFrame(){
    return new Promise(resolve => {
        let query = {
            TableName: "cosificabot_frames"
        };

        db.scan(query, function (err, data) {

            if(err) console.log(err);
            else{
                let items = data.Items;
                let rand = items[Math.floor(Math.random() * items.length)];
                return resolve(rand);

            }
        })
    })

}