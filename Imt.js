require('dotenv').config();
const { Telegraf } = require('telegraf');
const WizardScene = require('telegraf/scenes/wizard');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const bot = new Telegraf(process.env.IMT_TOKEN);

const CreateScene = new WizardScene(
    'create',
    (ctx) => {
        ctx.reply('1. Введите Ваш Вес (кг):');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text === 'stop') {
            return ctx.scene.leave();
        }
        ctx.wizard.state.weigth = parseInt(ctx.message.text, 10);
        ctx.reply('Введите ваш рост (см)');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.heigth = parseInt(ctx.message.text, 10) / 100;
        if (ctx.message.text === 'stop') {
            return ctx.scene.leave();
        }
        const bmi =
            ctx.wizard.state.weigth /
            ctx.wizard.state.heigth /
            ctx.wizard.state.heigth;

        ctx.reply(`Ваш ИМТ ${bmi} - ${caluclateVH(bmi)}`);
        return ctx.scene.leave();
    }
);

const stage = new Stage();
stage.register(CreateScene);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('create'));
bot.help((ctx) =>
    ctx.reply('You asked about help,  but you do it without a respect')
);

bot.launch()
    .then((res) => {
        console.log('started');
    })
    .catch((err) => console.log(err));

const caluclateVH = (index) => {
    if (index < 16) {
        return 'Выраженный дефицит массы тела';
    }
    if (index > 16 && index < 18.5) {
        return 'Недостаточная масса тела';
    }
    if (index > 18.5 && index < 25) {
        return 'Норма';
    }
    if (index > 25 && index < 30) {
        return 'Предожирение';
    }
    if (index > 30 && index < 35) {
        return 'Ожирение первой степени';
    }
    if (index > 35 && index < 40) {
        return 'Ожирение второй степени';
    }
    if (index > 40) {
        return 'Мегажирный';
    }
};
