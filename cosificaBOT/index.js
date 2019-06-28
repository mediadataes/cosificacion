const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');



const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`);
menu.setCommand('start');

let options = ['A', 'B', 'C'];
let selectionStatus = [];
let selectedKey = "";
menu.select('s', options, {
    setFunc: async (ctx, key) => {
        let index = options.indexOf(key.toString());
        selectedKey = key;
        let status = selectionStatus[index];

        selectionStatus[index] = !status;

        console.log("SELECTED KEY: "+key+" AT INDEX: "+index);
        await ctx.answerCbQuery(`you selected ${key}`)
    },
    prefixFunc: (_ctx, key) => {

        let index = options.indexOf(key);
        return selectionStatus[index];


    }
});
menu.simpleButton('Enviar', 'c', {
    doFunc: async ctx => ctx.answerCbQuery('Respuesta enviada.')
});




///////////////////// INIT BOT /////////////////////
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(menu.init());

bot.startPolling();

