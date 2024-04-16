require('dotenv').config();
const { Telegraf } = require('telegraf');
const WizardScene = require('telegraf/scenes/wizard');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const { SentimentManager } = require('node-nlp');
const bot = new Telegraf(process.env.SENTIMENT_BOT_TOKEN);

bot.start((ctx) =>
    ctx.reply(
        `Привет, ${ctx.message.from.first_name}! Этот бот умеет оценивать Ваше настроение по ключевым словам и выводить его в (e)бальной системе, для этого просто отправь мне комманду /sent а потом сообщение и я постараюсь распознать твоё настроение(негативное или позитивное), good luck!`
    )
);
bot.help((ctx) =>
    ctx.reply(
        'Этот бот опеределяет настроение вашего  текста. Просто напиши текст. Команда /clear - сбросить среднее количество очков /sent - начать оценку настроения'
    )
);
const CreateScene = new WizardScene(
    'create',
    (ctx) => {
        ctx.reply(
            'Я слушаю и записываю. Если тебе надоест, то просто отправь мне сообщние с текстом stop и я перестану)'
        );
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text === 'stop') {
            return ctx.scene.leave();
        }
        const sentiment = new SentimentManager();

        sentiment.process('ru', `${ctx.message.text}`).then((res) => {
            console.log(res);
            if (res.vote === 'negative') {
                currentVote = 'негативное';
            }
            if (res.vote === 'positive') {
                currentVote = 'позитивное';
            }
            if (res.vote === 'neutral') {
                currentVote = 'в целом нейтральное(имхо)';
            }
            bot.command('clear', (ctx) => {
                res.vote = 0;
            });
            ctx.replyWithMarkdown(
                `
Числовая оценка настроения вашего сообщения: *${res.score}*
Настроение в целом: *${currentVote}*
${
    res.vote === 'neutral'
        ? ' '
        : `Средняя оценка настроения за всё время: * ${res.comparative} *`
}`
            ).catch((err) => ctx.reply(err));
        });
    }
);

const stage = new Stage();
stage.register(CreateScene);
bot.use(session());
bot.use(stage.middleware());

bot.command('sent', (ctx) => ctx.scene.enter('create'));

bot.launch()
    .then((res) => {
        console.log('started');
    })
    .catch((err) => console.log(err));
