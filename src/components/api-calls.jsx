const { REACT_APP_API_KEY } = process.env;
const { REACT_APP_BITCOINABUSE_API_KEY } = process.env;
const { REACT_APP_WHOSWHO_API_KEY } = process.env;

export const getNodeInfo = async (address) => {

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `${REACT_APP_API_KEY}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const url = "https://api.graphsense.info/btc/addresses/" + address + "?include_tags=true";
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
}

export const getTransactions = async (address) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", "CAnjBITs/Njikv/BTHZtx/pKjF8eIQjD");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  const url = "https://api.graphsense.info/btc/addresses/" + address + "/txs";
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
}

export const getAddressFromTransaction = async (hash) => {

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `${REACT_APP_API_KEY}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const url = "https://api.graphsense.info/btc/txs/" + hash + "?include_io=true";
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;

}

export const getOutNeighbours = async (address, page) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `${REACT_APP_API_KEY}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const url = "https://api.graphsense.info/btc/addresses/" + address + "/neighbors?direction=out&include_labels=false&page=" + page;
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
}



export const getInNeighbours = async (address, page) => {

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `${REACT_APP_API_KEY}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  var url = "https://api.graphsense.info/btc/addresses/" + address + "/neighbors?direction=in&include_labels=false&page=" + page;
  var response = await fetch(url, requestOptions);
  var data = await response.json();
  return data;
}

export const checkBitcoinAbuse = async (address) => {

  const url = "https://www.bitcoinabuse.com/api/reports/check?address=" + address + "&api_token=" + `${REACT_APP_BITCOINABUSE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

//The API Key provided to me by the website does not appear to be functional
export const checkBitcoinWhosWho = async (address) => {

  const url = "https://www.bitcoinwhoswho.com/api/tag/" + `${REACT_APP_WHOSWHO_API_KEY}` + "?address=" + address;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export const createReportsLink = (address) => {
  const url = "https://www.bitcoinabuse.com/reports/" + address
  console.log(url);
  return url;
}

export const checkWalletExplorer = async (address) => {
  const url = "http://www.walletexplorer.com/api/1/address-lookup?address=" + address + "&caller=rayan.melwani21@imperial.ac.uk";
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
