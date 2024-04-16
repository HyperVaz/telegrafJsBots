require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.COVID_BOT_TOKEN);
const { default: axios } = require('axios');

let covidApi = {};
covidApi.getByCountry = (country) => {
    return axios({
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/statistics',
        params: { country },
        headers: {
            'X-RapidAPI-Key': process.env.RAPI,
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
        },
    });
};

bot.start((ctx) =>
    ctx.reply(
        `Привет, ${ctx.message.from.first_name}! Данный, тобиш говорица, бот, отправляет данные по COVID-2019 по названию страны. Просто напиши мне её наименование на английском и я выдам тебе актуальные данные за последние сутки, удачи!)`
    )
);
bot.help((ctx) =>
    ctx.reply('Отправь мне название страны на английском, например: Russia')
);

bot.hears(/.*/, async (ctx) => {
    const { data } = await covidApi.getByCountry(ctx.message.text);
    if (ctx.message.text === 'North Korea') {
        return ctx.reply(
            'Эта страна покрыта мраком,но Егор Летов говорил что там всё тоже что у нас'
        );
    }
    if (ctx.message.text == 'South Korea') {
        return ctx.reply('Да похуй на кейпоперов этих');
    }
    if (data && data.results == 0)
        return ctx.reply(
            'Некорректное название страны или страны не найдено ;c'
        );
    return ctx.replyWithHTML(`
Страна: <b>${data.response[0].country}</b>,
Популяция индивидов: <em>${data.response[0].population}</em>,
Новые случаи: <b>${
        data.response[0].cases.new != null
            ? `${data.response[0].cases.new}`
            : 'Нет, либо страна не предоставила данных'
    }</b>,
Всего больных на данный момент: <b>${data.response[0].cases.active}</b>,
Cмертей:  <b>${
        data.response[0].deaths.new != null
            ? `${data.response[0].deaths.new}`
            : 'Нет, либо страна не предоставила данных'
    }</b>,
Дата запроса: <em>${data.response[0].time}</em>

    `);
    console.log(data.response);
});

bot.catch((err) => console.log(err));

bot.launch()
    .then((res) => {
        console.log('started');
    })
    .catch((err) => console.log(err));


