import { padLeft, toHex, toBigInt, toWei, ChunkResponseParser, Eip1193Provider, EventEmitter, SocketProvider, Web3DeferredPromise, asciiToHex, bytesToHex, bytesToUint8Array, checkAddressCheckSum, compareBlockNumbers, convert, convertScalarValue, encodePacked, ethUnitMap, format, fromAscii, fromDecimal, fromTwosComplement, fromUtf8, fromWei, getStorageSlotNumForLongString, hexToAscii, hexToBytes, hexToNumber, hexToNumberString, hexToString, hexToUtf8, isAddress, isBatchRequest, isBatchResponse, isBloom, isContractAddressInBloom, isDataFormat, isHex, isHexStrict, isInBloom, isNullish, isPromise, isResponseRpcError, isResponseWithError, isResponseWithNotification, isResponseWithResult, isSubscriptionResult, isTopic, isTopicInBloom, isUserEthereumAddressInBloom, isValidResponse, jsonRpc, keccak256, keccak256Wrapper, leftPad, mergeDeep, numberToHex, padRight, pollTillDefined, pollTillDefinedAndReturnIntervalId, processSolidityEncodePackedArgs, randomBytes, randomHex, rejectIfConditionAtInterval, rejectIfTimeout, rightPad, setRequestIdStart, sha3, sha3Raw, soliditySha3, soliditySha3Raw, stringToHex, toAscii, toBatchPayload, toBool, toChecksumAddress, toDecimal, toNumber, toPayload, toTwosComplement, toUtf8, uint8ArrayConcat, uint8ArrayEquals, utf8ToBytes, utf8ToHex, uuidV4, validateResponse, waitWithTimeout } from 'web3-utils';

// Wrapper class to convert web-utils JS library to a typescript class
// Purpose of which is to allow provide access to web-utils using a class container, avoid namespace issues with dup named functions
// Web3 Optimisation >> Tree shaking >> https://docs.web3js.org/guides/advanced/web3_tree_shaking_support_guide/
export class Web3Utils {

  CONTRACT_DECIMALS :number;
  CONTRACT_DECIMALS_COUNT : number;

  padLeft: typeof padLeft = padLeft;
  toHex: typeof toHex = toHex;
  toBigInt: typeof toBigInt = toBigInt;
  toWei: typeof toWei = toWei;

  constructor(CONTRACT_DECIMALS: number = 1e18, CONTRACT_DECIMALS_COUNT: number = 18) {
    this.CONTRACT_DECIMALS = CONTRACT_DECIMALS;
    this.CONTRACT_DECIMALS_COUNT = CONTRACT_DECIMALS_COUNT;
  }

  //*******************************************************************
  // COIN CONVERTER Fn's
  // javascript string.padStart requires ECMA 2017 - but best to avoid using it..  using a native solution for it.
  convertFromEVMtoCoinLocale(amount: any, decimalPlaces: number, decimalCount: number = this.CONTRACT_DECIMALS_COUNT) {

    let amountString = amount.toString();
    let amountDecimal: string = '';
    let amountInteger: string = ''; 

    if (amount != 0) {
      if (amountString.length >= decimalCount) {
        amountDecimal = amountString.substring(amountString.length - decimalCount);
        amountInteger = amountString.substring(0, amountString.length - decimalCount);                
      }
      else {
        //amountDecimal = amountString.padStart(decimalCount - amountString.length, '0');   // Issues using string.padStart()        
        let padZero: string = '';
        for (let index = 0; index < decimalCount - amountString.length; index++) {
          padZero = '0' + padZero;
        }
        amountDecimal = padZero + amountString;
      }
    }
    amountDecimal = amountDecimal.substring(0, decimalPlaces);

    //remove trailing zeros from decimal string
    for (let counter = amountDecimal.length; counter--; counter >= 0) {
      if (amountDecimal.substring(amountDecimal.length - 1) == "0") {
        amountDecimal = amountDecimal.slice(0, -1); // Remove the last character
      }
      else {
        break;  // found a none zero char as end char.
      }
    }

    // Combine
    if (amountInteger != '' && amountDecimal != '') {
      amountString = amountInteger + '.' + amountDecimal;
    }
    else if (amountInteger == '' && amountDecimal != '') {
      amountString = '.' + amountDecimal;
    }
    else if (amountInteger != '' && amountDecimal == '') {
      amountString = amountInteger;
    }
    else {
      amountString = 0;
    }

    return amountString;
  }

  // Calculate actual tokens amounts based on decimals in token
  // Convert to string - ensure no localised chars .  Some issue with BigNumber adding additoinal values - may be due to using es2015
  convertToCoinNumber(amount: any, allowanceExtra:number = 0): string{
        
    let stringAmount = '0';
    let decimalLength = 0;
    let bigAmount: bigint;

    if (amount != null) {
      amount = Number(amount);

      // Check if number is fractional then remove fractional amount.
      if ((amount % 1 != 0)) {
        decimalLength = amount.toString().split(".")[1].length;
        amount = amount * (10 ** decimalLength);                  // using Exponential ** operator
        bigAmount = BigInt(amount * (10 ** (this.CONTRACT_DECIMALS_COUNT - decimalLength)));
      }
      else {
        bigAmount = (BigInt(amount) * BigInt(this.CONTRACT_DECIMALS));
      }

      if (allowanceExtra != 0) {
        bigAmount += BigInt(allowanceExtra);
      }
    }
    else {
      bigAmount = BigInt(0);
    }

    return bigAmount.toString();
  }
  //*******************************************************************


}
