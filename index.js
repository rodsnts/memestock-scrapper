const axios = require("axios");
const { performance } = require("perf_hooks");
const chalk = require("chalk");
const figlet = require("figlet");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const redditUrl = "https://www.reddit.com/r/wallstreetbets/top/?t=week";
const stocksAPI =
  "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=sandbox_c6nbrt2ad3ibta79tfmg";

const ascii = (text) => {
  figlet.text(
    text,
    {
      font: "Big",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(`${chalk.cyanBright(data)}\n`);
    }
  );
};

const getData = async (url) => {
  try {
    let t0 = performance.now();

    ascii("Rod Scrapper");
    console.log(`Scrapping ${chalk.yellow("r/WallStreetBets...")}\n`);

    const body = await axios.get(url);
    const dom = new JSDOM(body.data);
    const parse = dom.window.document.querySelector(
      ".rpBJOHq2PR60pnwJlUyP0"
    ).textContent;
    const stocks = await axios.get(stocksAPI);

    console.log(chalk.magenta("The most mentioned stocks are: "));

    const mentions = [];

    for (let i = 0; i < stocks.data.length; i++) {
      const match = parse.match(new RegExp(stocks.data[i].displaySymbol, "g"));
      if (match) {
        const counts = {
          label: null,
          count: null,
        };
        match.forEach((x) => {
          counts.label = stocks.data[i].displaySymbol;
          counts.count = match.length;
        });
        mentions.push(counts);
      }
    }

    console.log(mentions);

    let t1 = performance.now();
    console.log(
      `\nScrapping took ${chalk.cyan(Math.floor(t1 - t0) / 1000)} seconds.`
    );
  } catch (e) {
    if (e.code === "ENOTFOUND") {
      console.log(`Unable to find the URL: ${e.hostname}`);
    }
  }
};

getData(redditUrl);

// == /\$([A-Z]{1,5})/g == \\
