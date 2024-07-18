

// Blockchain
const BLOCKCHAIN = {
  ETHEREUM: 1,
  TRON: 2,
  BNB: 3,
  POLYGON: 4
};

const TRANSACTION_TYPE = {
  TRANSFER: 1,
  DEPOSIT: 2
};

enum HEX_NETWORK {
  ETHEREUM_ID = '0x1',
  ROPSTEN_ID = '0x3',       // Ethereum Test network.
  POLYGON_ID = '0x89',
  BINANCE_ID = '0x38',      // 56 decimal
  BINANCE_TESTNET_ID = '0x61',
};

const NETWORKS_DESC = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  1337: "Ganache",
};

enum METAMASK_ERROR_CODE {
  UNRECOGNISED_CHAIN = 4902, 
};



export {
  BLOCKCHAIN,
  HEX_NETWORK,
  METAMASK_ERROR_CODE,  
  NETWORKS_DESC,     
  TRANSACTION_TYPE
};
