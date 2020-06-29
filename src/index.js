import { Telegraf } from "telegraf";
import config from "../config.json";

const bot = new Telegraf(config.TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));
bot.launch();
