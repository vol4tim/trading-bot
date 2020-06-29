import { Telegraf } from "telegraf";
import axios from "axios";
import config from "../config.json";

const bot = new Telegraf(config.TOKEN);

const data = {
  uniswap: 0,
  stex: 0,
};

axios
  .get("https://api.uniswap.info/v2/summary")
  .then((r) => {
    data.uniswap = Math.round(
      r.data[
        "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7_0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      ].quote_volume
    );
    return axios.get("https://api3.stex.com/public/ticker/1169");
  })
  .then((r) => {
    data.stex = Math.round(r.data.data.volumeQuote);
    return bot.telegram.sendMessage(
      config.GROUP,
      `Uniswap volume: ${data.uniswap} XRT\nStex volume: ${data.stex} XRT`
    );
  });
