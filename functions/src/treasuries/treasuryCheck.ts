import { storage } from "firebase-admin";

export async function treasuryCheck() {
  const quotes = await fetchQuotes();

  const output: Output = {
    quotes,
    time: new Date(),
  };

  await updateData(output);

  return output;
}

interface Output {
  quotes: Quote[];
  time: Date;
}

async function fetchQuotes(): Promise<Quote[]> {
  const response = await fetch(
    "https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol" +
      "?symbols=US1M%7CUS2M%7CUS3M%7CUS4M%7CUS6M%7CUS1Y%7CUS2Y%7CUS3Y%7CUS5Y%7CUS7Y%7CUS10Y%7CUS20Y%7CUS30Y" +
      "&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1",
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    }
  );

  const result = (await response.json()) as {
    FormattedQuoteResult: {
      FormattedQuote: {
        symbol: string;
        last: string;
        last_time: string;
      }[];
    };
  };

  return result.FormattedQuoteResult.FormattedQuote.map((quote) => {
    const rate = parseFloat(quote.last) / 100;
    const time = new Date(quote.last_time);

    return {
      symbol: quote.symbol,
      rate,
      time,
    };
  });
}

interface Quote {
  symbol: string;
  rate: number;
  time: Date;
}

const filePath = "treasuries/treasury.json";

async function updateData(newOutput: Output) {
  const bucket = storage().bucket();
  const file = bucket.file(filePath);

  const [buffer] = await file.download();
  const oldText = buffer.toString("utf-8");
  const oldOutput = JSON.parse(oldText) as Output;

  const newMap = new Map<string, Quote>();
  oldOutput.quotes.forEach((quote) => newMap.set(quote.symbol, quote));
  newOutput.quotes.forEach((quote) => newMap.set(quote.symbol, quote));

  const saveOutput = {
    quotes: [...newMap.values()],
    time: newOutput.time,
  };
  await file.save(JSON.stringify(saveOutput));
}
