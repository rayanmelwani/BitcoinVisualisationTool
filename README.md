# Bitcoin Visualisation Tool

This tool was developed for my Master's Dissertation titled 'How'd you get so rich? Behind the world's richest bitcoin addresses'.

## Development

This tool was built using ReactJS.

## Data Sources

Data sources for this tool include [GraphSense](https://graphsense.info/), [BitcoinAbuse](https://www.bitcoinabuse.com/) and [WalletExplorer](https://www.walletexplorer.com/).

## Running the tool locally

Before you run the tool locally, you must obtain API keys from the aforementioned data sources.
You then have to create a .env file with the following content:
```python
REACT_APP_API_KEY={GraphSense API Key}
REACT_APP_BITCOINABUSE_API_KEY= {BitcoinAbuse API Key}
```

Once this is complete, in the project directory run:
### `npm start`
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

This tool has also been deployed via Netlify at [Bitcoin Visualisation Tool](https://cool-buttercream-7e4150.netlify.app/).
