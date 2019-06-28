const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');



const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`);
menu.setCommand('start');

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




///////////////////// INIT BOT /////////////////////
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(menu.init());

bot.startPolling();

