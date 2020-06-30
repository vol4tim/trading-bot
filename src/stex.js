import axios from "axios";

export default function () {
  return axios.get("https://api3.stex.com/public/ticker/1169").then((r) => {
    return {
      price: r.data.data.last,
      min: r.data.data.low,
      max: r.data.data.high,
      volume: Math.round(r.data.data.volumeQuote),
    };
  });
}
