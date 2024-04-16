require('dotenv').config();
const apixu = require('apixu');
const { Telegraf } = require('telegraf');
const { default: axios } = require('axios');
const bot = new Telegraf(process.env.WEATHER_TOKEN);

bot.start((ctx) =>
    ctx.reply(
        'Привет! Я погодный бот - напиши мне название города (пока что только на английском :c), и я непременно выдам тебе данные о погоде в этом городе, ну-с, вперёд!'
    )
);
bot.help((ctx) =>
    ctx.reply(
        'Напиши мне название города на английском, например =======> Boston'
    )
);
bot.launch();

const RegExp = /^[A-Za-z0-9-]+$/i;
const RegExp2 = /^[A-Za-z0-9-]+\s[A-Za-z0-9-]+$/i;
const RegExp3 = /^[A-Za-z0-9-]+\s[A-Za-z0-9-]+\s[A-Za-z0-9-]+$/i;

bot.hears([RegExp, RegExp2, RegExp3], async (ctx) => {
    const city = ctx.message.text;
    console.log(city);
    try {
        const weather = await axios.get(
            `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_ACCESS_KEY}&query=${city}`
        );
        return ctx.replyWithMarkdown(`
Текущая температура в городе ${city}: *${weather.data.current.temperature} (°C)*
Чувствуется как: *${weather.data.current.feelslike} (°C)*
Погодные условия: *${weather.data.current.weather_descriptions}*
Скорость ветра: *${weather.data.current.wind_speed} м/с*
Давление: *${weather.data.current.pressure} мм р.с.*
      `);
    } catch (error) {
        return ctx.reply(error);
    }
});
bot.catch((err) => {
    console.log(err);
});

bot.hears(
    [
        'Спасибо',
        'Thanks',
        'Thx',
        'Благодарю',
        'Спасибо!',
        'Thanks!',
        'Thx!',
        'Благодарю!',
        'cпасибо!',
        'thanks!',
        'thx!',
        'благодарю!',
    ],
    (ctx) => ctx.reply('Не за что! Приятного Вам дня!')
);
