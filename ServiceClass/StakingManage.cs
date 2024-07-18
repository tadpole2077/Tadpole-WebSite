using Azure;
using Nethereum.ABI.EIP712;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using Nethereum.Hex.HexTypes;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Signer;
using Nethereum.Util;
using Nethereum.Web3;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Numerics;
using System.Reflection.PortableExecutable;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

namespace Angular_VS_TEST.ServiceClass
{
    [Event("Transfer")]
    public class TransferEventDTO : IEventDTO
    {
        [Parameter("address", "from", 1, true)]
        public string from { get; set; }

        [Parameter("address", "to", 2, true)]
        public string to { get; set; }

        [Parameter("uint256", "value", 3, false)]
        public BigInteger value { get; set; }
    }

    [Event("StakerDistribute")]
    public class StakerDistributeEventDTO : IEventDTO
    {
        [Parameter("uint256", "distributeFixed", 1, false)]
        public BigInteger distributeFixed { get; set; }

        [Parameter("uint256", "totalStakedEligible", 2, false)]
        public BigInteger totalStakedEligible { get; set; }

        [Parameter("uint32", "distributeCount", 3, false)]
        public int distributeCount { get; set; }
    }

    [Event("MinterBalance")]
    public class MinterBalanceDTO : IEventDTO
    {
        [Parameter("address", "minter", 1, true)]
        public string from { get; set; }
        
        [Parameter("uint256", "balance", 3, false)]
        public BigInteger value { get; set; }
    }

    [Function("totalSupply", "uint256")]
    public class TotalSupplyFunction : FunctionMessage
    {

    }

    [Function("totalStakedEligible", "uint256")]
    public class TotalStakedEligibleFunction : FunctionMessage
    {

    }


    public class StakingManage : ServiceBase
    {
        const string networkRPCUrl = "https://polygon-rpc.com";       // Polygon Matic RPC
        const string cgcAppManagerPrivateKey = "2f9a95cff4a718f781ad107a361d41b369cf1397fc52defa581147fcadd5113f";
        const string cgcContract = "0xb419Fc8E817A76Fe972707EABcF5dCA4c49Aa8e4";            // Live Active CGC Contract Polygon
        const string cgcStakeContract = "0x8031CC73E663DeA830cbfcd55208A7f646851822";       // TEST CGC Stake Contract Polygon
        const string wethContract = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
        const string distributionEventSignature = "790269b101958e041a3bae2e875eb1ed2e77312d113bb8acc37af2ea1efaaf19"; //"cdda5a1b2d9d79bc0f1392cead8ca354ffe556d7217d033219f55d4f44023f80";

        private static DistributionMonth cachedDistributionPriorMonth { get; set ; }
        private static DistributionMonth cachedDistributionCurrentMonth { get; set; }
        private static DateTime cachedSwapPriceDateLastChecked { get; set; }
        private static decimal cachedSwapPrice { get; set; }

        public StakingManage() { }

        // Block Range Limits : Ethereum — 5,000 blocks.Polygon — 3,000 blocks.BNB Smart Chain — 5,000 blocks
        // Polygon process ~43200 blocks/day or 1 block every 2 seconds. 17 requests per 24hr period.  527 request per month.  1.3 million blocks per month.
        public async Task<int> GetTotalDistribution()
        {
            //HexBigInteger startBlock = new HexBigInteger(2000);
            BlockParameter startBlock = new();            
            try
            {               
                var account = new Nethereum.Web3.Accounts.Account(cgcAppManagerPrivateKey);
                var web3 = new Web3(account, networkRPCUrl);

                var latestBlockNumber = await web3.Eth.Blocks.GetBlockNumber.SendRequestAsync();
                startBlock.SetValue(latestBlockNumber.Value - 3000);

                // Get All Contract level event - matching DTO (data transfer object)
                var transferEventHandler = web3.Eth.GetEvent<TransferEventDTO>(cgcContract);
                
                // Create Message : default values for BlockParameters are Earliest and Latest, meaning get all matching events on contract.
                var filterAllTransferEventsForContract = transferEventHandler.CreateFilterInput();
                filterAllTransferEventsForContract.FromBlock = startBlock;

                // Retrieve all logs using the Event.
                var allTransferEventsForContract = await transferEventHandler.GetAllChangesAsync(filterAllTransferEventsForContract);
            }
            catch (Exception ex)
            {

            }
            //return MegaBalance.ToString();

            return 0;
        }

        public DistributeInstance GetDistributeEventFromTransaction(string transactionHash)
        {
            StakerDistributeEventDTO distributeEventDTO = null;
            DistributeInstance distributeInstance = new();
            try
            {
                
                var account = new Nethereum.Web3.Accounts.Account(cgcAppManagerPrivateKey);
                var web3 = new Web3(account, networkRPCUrl);

                // Get Receipt for target Transaction
                var transactionReceipt = web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash).Result;

                // Get distribute Events for target Transaction
                var eventOutput = transactionReceipt.DecodeAllEvents<StakerDistributeEventDTO>();

                if (eventOutput.Count > 0)
                {
                    distributeEventDTO = eventOutput[0].Event;
                }

                distributeInstance.total = distributeEventDTO != null ? Web3.Convert.FromWei(distributeEventDTO.distributeFixed) : 0;
                distributeInstance.EPR = distributeEventDTO != null ? distributeInstance.total / Web3.Convert.FromWei(distributeEventDTO.totalStakedEligible) : 0;

            }
            catch (Exception ex)
            {

            }
            return distributeInstance;
        }

        public decimal GetCGCTotalStakedEligable()
        {
            decimal totalCGCStakedEligable = 0;
            try
            {
                var account = new Nethereum.Web3.Accounts.Account(cgcAppManagerPrivateKey);
                var web3 = new Web3(account, networkRPCUrl);

                // Option: using a QueryHandler
                var totalSupplyHandler = web3.Eth.GetContractQueryHandler<TotalSupplyFunction>();
                var totalCGCSupplyContract = totalSupplyHandler.QueryAsync<BigInteger>(cgcContract, null).Result;


                var totalStakedEligibleHandler = web3.Eth.GetContractQueryHandler<TotalStakedEligibleFunction>();
                var totalCGCStakedEligableContract = totalStakedEligibleHandler.QueryAsync<BigInteger>(cgcStakeContract, null).Result;

                decimal totalSupply = Web3.Convert.FromWei(totalCGCSupplyContract);
                totalCGCStakedEligable = Web3.Convert.FromWei(totalCGCStakedEligableContract);

            }
            catch (Exception ex)
            {

            }            

            return totalCGCStakedEligable;
        }


        public decimal GetSwapPrice()
        {
            decimal swapPrice = 0;
            try
            {
                // Check if SwapPrice checked within last 2 hour period and cached                
                if (cachedSwapPriceDateLastChecked > DateTime.UtcNow.AddHours(-2))
                {
                    swapPrice = cachedSwapPrice;
                }
                else
                {
                    // Get Events matching signature and contract
                    JObject response = QuerySwapPrice(cgcContract, wethContract).Result;

                    if (response != null)
                    {
                        JObject data = response.Value<JObject>("data");
                        JObject ethereum = data.Value<JObject>("ethereum");
                        JArray dexTrades = ethereum.Value<JArray>("dexTrades");
                        
                        // Get newest trade
                        JToken dexTrade = dexTrades.Last;
                        if (dexTrade != null) {

                            swapPrice = dexTrade.Value<decimal?>("quotePrice") ?? 0;                            
                        }
                    }

                    // Store total distribution for last month
                    cachedSwapPrice = swapPrice;
                    cachedSwapPriceDateLastChecked = DateTime.UtcNow;
                }
            }
            catch (Exception ex)
            {

            }

            return swapPrice;
        }

        public async Task<JObject> QuerySwapPrice(string pairContract1, string pairContract2)
        {
            JObject responseObj = null;

            try
            {
                string content = string.Empty;
                string serviceUrl = "https://graphql.bitquery.io";

                HttpResponseMessage response;

                using (var client = new HttpClient(getSocketHandler()) { Timeout = new TimeSpan(0, 0, 60) })
                {
                    // Apply Header 'application/json' to the stringContent - wont accept it as header on the Request or client
                    StringContent stringContent = new(
                        string.Concat(@"{""query"":""{\n  ethereum(network: matic) {\n    dexTrades(\n      baseCurrency: {is: \""",
                        pairContract1,
                        @"\""}\n      quoteCurrency: {is: \""",
                        pairContract2,
                        @"\""}\n      date: {after: \""2024-02-19\""}\n     \n    ) {\n      maximum(of: quote_price, get: quote_price)\n      date {\n        date        \n      }\n      quotePrice\n      quoteCurrency {\n        name\n        symbol\n      }\n    }\n  }\n}"",""variables"":""{}""}"));

                    stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    var request = new HttpRequestMessage()
                    {
                        RequestUri = new Uri(serviceUrl),
                        Method = HttpMethod.Post,
                        Content = stringContent
                    };

                    // Add Auth headers to Request object.
                    request.Headers.Add("X-API-KEY", "BQYV9VYpsiRnuAC8KYk6yNWPJ5l9moEm");
                    request.Headers.Add("Authorization", "Bearer ory_at__CrxymJ6Wm03uGkdvXUYyFjDq-lxOphh0VbLqxQDEmQ.DA3JHGtnAXwG0M72GAhaK94I94skA5yq_3_3pjskC1E");

                    response = await client.SendAsync(request);

                    response.EnsureSuccessStatusCode(); // throws if not 200-299
                    content = await response.Content.ReadAsStringAsync();

                }
                // End timer
                watch.Stop();                

                responseObj = JObject.Parse(content);
            }
            catch (Exception ex)
            {
            }

            return responseObj;
        }

        // Get Rewards distribution over a set period
        // Extension 1 : get distribution over current month period, add to cache - update cache daily (on client request)
        public Distribution GetDistribution()
        {
            DistributionMonth distributionMonth = null;
            decimal distributionTotal = 0, eprTotal = 0;
            string startDate, endDate;
            JObject response;

            Distribution distribution = new();

            try
            {
                // PRIOR MONTH DISTRIBUTION : Check if distribution already calculated for last month and cached
                DateTime checkDate = DateTime.UtcNow.AddMonths(-1);
                if (cachedDistributionPriorMonth != null && cachedDistributionPriorMonth.year == checkDate.Year && cachedDistributionPriorMonth.monthNumber == checkDate.Month)
                {
                    distribution.priorMonth = cachedDistributionPriorMonth;
                }
                else
                {

                    startDate = GetLastDayOfMonth(DateTime.UtcNow.AddMonths(-2)).ToString("yyyy-MM-dd");
                    endDate = DateTime.UtcNow.ToString("yyyy-MM-01");

                    // Get Events matching signature and contract
                    response = GetEvents(cgcStakeContract, distributionEventSignature, startDate, endDate).Result;

                    if (response != null)
                    {
                        JObject data = response.Value<JObject>("data");
                        JObject ethereum = data.Value<JObject>("ethereum");
                        JArray smartContractEvents = ethereum.Value<JArray>("smartContractEvents");
                        foreach (JToken smartContractEvent in smartContractEvents)
                        {
                            JObject transaction = smartContractEvent.Value<JObject>("transaction");
                            string hash = transaction.Value<string>("hash");

                            DistributeInstance distributeInstance = GetDistributeEventFromTransaction(hash);
                            distributionTotal += distributeInstance.total;
                            eprTotal += distributeInstance.EPR;

                            /* Original extract of event arguements - but bitQuery doesnt retrurn them for these events for some reason only the transaction hash */
                            /*JArray arguments = smartContractEvent.Value<JArray>("arguments");
                            if (arguments != null)
                            {
                                foreach (JToken argument in arguments)
                                {
                                    if (argument != null && argument.Value<string>("argument") == "balance")
                                    {
                                        string value = argument.Value<string>("value");
                                        distributionRaw = BigInteger.Parse(value);

                                        totalDistribution += Web3.Convert.FromWei(distributionRaw);
                                    }
                                }
                            }*/
                        }
                    }

                    // Store total distribution for last month
                    distributionMonth = new()
                    {
                        monthNumber = checkDate.Month,
                        month = checkDate.ToString("MMM"),
                        year = checkDate.Year,
                        total = distributionTotal,
                        EPR = eprTotal
                    };

                    distribution.priorMonth = cachedDistributionPriorMonth = distributionMonth;

                }


                // CURRENT MONTH DISTRIBUTION : Check if distribution already calculated (for today) for current month and cached
                // Using separate Cache mechanism for currently month - cache updated per day.
                checkDate = DateTime.UtcNow;
                if (cachedDistributionCurrentMonth != null &&
                    cachedDistributionCurrentMonth.year == checkDate.Year &&
                    cachedDistributionCurrentMonth.monthNumber == checkDate.Month &&
                    cachedDistributionCurrentMonth.day == checkDate.Day)
                {
                    distribution.currentMonth = cachedDistributionCurrentMonth;
                }
                else
                {
                    distributionTotal = eprTotal = 0;
                    startDate = DateTime.UtcNow.ToString("yyyy-MM-01");
                    endDate = DateTime.UtcNow.ToString("yyyy-MM-dd");

                    // Get Events matching signature and contract
                    response = GetEvents(cgcStakeContract, distributionEventSignature, startDate, endDate).Result;

                    if (response != null)
                    {
                        JObject data = response.Value<JObject>("data");
                        JObject ethereum = data.Value<JObject>("ethereum");
                        JArray smartContractEvents = ethereum.Value<JArray>("smartContractEvents");
                        foreach (JToken smartContractEvent in smartContractEvents)
                        {
                            JObject transaction = smartContractEvent.Value<JObject>("transaction");
                            string hash = transaction.Value<string>("hash");

                            DistributeInstance distributeInstance = GetDistributeEventFromTransaction(hash);
                            distributionTotal += distributeInstance.total;
                            eprTotal += distributeInstance.EPR;
                        }
                    }

                    // Store total distribution for last month
                    distributionMonth = new()
                    {
                        monthNumber = checkDate.Month,
                        month = checkDate.ToString("MMM"),
                        year = checkDate.Year,
                        day = checkDate.Day,
                        total = distributionTotal,
                        EPR = eprTotal
                    };

                    distribution.currentMonth = cachedDistributionCurrentMonth = distributionMonth;
                }                
            }
            catch (Exception ex)
            {

            }

            return distribution;
        }

        public DateTime GetLastDayOfMonth(DateTime dateTime)
        {
            return new DateTime(dateTime.Year, dateTime.Month, DateTime.DaysInMonth(dateTime.Year, dateTime.Month));
        }

        // Using 3rd Party BitQuery, request all EVM logged events for contract - matching event signature and date range.
        public async Task<JObject> GetEvents(string contract, string eventSignature, string startDate, string endDate)
        {
            JObject responseObj = null;

            try
            {
                string content = string.Empty;
                string serviceUrl = "https://graphql.bitquery.io";

                HttpResponseMessage response;

                using (var client = new HttpClient(getSocketHandler()) { Timeout = new TimeSpan(0, 0, 60) })
                {
                    // Apply Header 'application/json' to the stringContent - wont accept it as header on the Request or client
                    StringContent stringContent = new(
                        string.Concat(@"{""query"":""{  ethereum(network: matic) { smartContractEvents(",
                        @"smartContractAddress: {is: \""", contract, @"\""}   ",
                        @"date: {after: \""", startDate  ,@"\""",
                        @", before: \""", endDate, @"\""}",                        
                        @"smartContractEvent: {is: \""", eventSignature, @"\""} ) ",
                        @"{ block { timestamp {   time(format: \""%Y-%m-%d %H:%M:%S\"")   }   height  } ",
                        @"transaction(txHash: {}) {hash} }} }\n"",""variables"":""{}""}"
                        ));
                        //@"     arguments {\n        argument\n        value\n      }\n      smartContractEvent {\n        name\n        signature\n        signatureHash\n      }\n    }\n  }\n}\n"",""variables"":""{}""}"));

                    stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    var request = new HttpRequestMessage()
                    {
                        RequestUri = new Uri(serviceUrl),
                        Method = HttpMethod.Post,
                        Content = stringContent
                    };

                    // Add Auth headers to Request object.
                    //request.Headers.Add("Content-Type", "application/json");
                    request.Headers.Add("X-API-KEY", "BQYV9VYpsiRnuAC8KYk6yNWPJ5l9moEm");
                    request.Headers.Add("Authorization", "Bearer ory_at__CrxymJ6Wm03uGkdvXUYyFjDq-lxOphh0VbLqxQDEmQ.DA3JHGtnAXwG0M72GAhaK94I94skA5yq_3_3pjskC1E");

                    response = await client.SendAsync(request);

                    response.EnsureSuccessStatusCode(); // throws if not 200-299
                    content = await response.Content.ReadAsStringAsync();

                }
                // End timer
                watch.Stop();
                //servicePerfDB.AddServiceEntry(serviceUrl, serviceStartTime, watch.ElapsedMilliseconds, content.Length, ownerMaticKey);

                responseObj = JObject.Parse(content);
            }
            catch (Exception ex)
            {
            }
            
            return responseObj;
        }
    }
}

