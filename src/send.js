import { Telegraf } from "telegraf";
import axios from "axios";
import config from "../config.json";

const bot = new Telegraf(config.TOKEN);

const data = {
  uniswap: {
    price: 0,
    priceUSD: 0,
    volume: 0,
  },
  stex: {
    price: 0,
    min: 0,
    max: 0,
    volume: 0,
  },
};

function getVolumeUniswap() {
  // return axios.get("https://api.uniswap.info/v2/summary").then((r) => {
  //   return Math.round(
  //     r.data[
  //       "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7_0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  //     ].quote_volume
  //   );
  // });

  return axios
    .post("https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap", {
      query: `{
  exchanges(where:{tokenAddress:"0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7"}){
    id
    price
    priceUSD
    tradeVolumeToken
  }
}`,
    })
    .then((r) => {
      return {
        price: (1 / r.data.data.exchanges[0].price).toFixed(8),
        priceUSD: Number(r.data.data.exchanges[0].priceUSD).toFixed(2),
        volume: Math.round(r.data.data.exchanges[0].tradeVolumeToken),
      };
    });
}

function getVolumeStex() {
  return axios.get("https://api3.stex.com/public/ticker/1169").then((r) => {
    return {
      price: r.data.data.last,
      min: r.data.data.low,
      max: r.data.data.high,
      volume: Math.round(r.data.data.volumeQuote),
    };
  });
}

async function main() {
  data.uniswap = await getVolumeUniswap();
  data.stex = await getVolumeStex();

  const template = `<b>Good day everyone! The regular daily state below:</b>

[<a href="https://uniswap.info/pair/0x3185626c14acb9531d19560decb9d3e5e80681b1">Uniswap</a>]
1 XRT = ${data.uniswap.price} ETH ($ ${data.uniswap.priceUSD});
Volume (24hrs): ${data.uniswap.volume} XRT;

[<a href="https://app.stex.com/en/trade/pair/ETH/XRT/5">STEX</a>]
1 XRT = ${data.stex.price} ETH;
24h max price ${data.stex.max} ETH;
24h min price ${data.stex.min} ETH;
Volume (24hrs): ${data.stex.volume} XRT;

p.s.: participate in the development of Robonomics project! Check events in the main chat of the community: t.me/robonomics
`;
  return bot.telegram.sendMessage(config.GROUP, template, {
    parse_mode: "HTML",
  });
}
main();
