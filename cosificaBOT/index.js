const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { leave } = Stage;




// Greeter scene
const greeter = new Scene('greeter');
greeter.enter((ctx) => ctx.reply('Bienvenidx'));
ctx.scene.enter('frame');


// Frame scene
const frame = new Scene('frame');
frame.enter((ctx) => menu.replyMenuMiddleware());
const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`);

let options = ['Troceada', 'Objeto', 'Intercambiable','Maltrato', 'Sexualizada', 'Mercancía','Lienzo'];
let selectionStatus = [];
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
    doFunc: async ctx => ctx.answerCbQuery('Respuesta enviada.')
});



// Create scene manager
const stage = new Stage();
stage.command('cancel', leave());

// Scene registration
stage.register(greeter);
stage.register(frame);




///////////////////// INIT BOT /////////////////////
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
bot.use(stage.middleware());
bot.use(menu.init());


bot.command('start', (ctx) => ctx.scene.enter('greeter'));

bot.startPolling();

