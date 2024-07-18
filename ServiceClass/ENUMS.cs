namespace Angular_VS_TEST.BaseClass
{        
   
   public enum RETURN_CODE
    {
        ERROR = -1,
        SUCCESS = 1,
        SECURITY_FAIL = -2
    }

    public class BANK_ACTION
    {
        public static readonly char DEPOSIT = 'D';
        public static readonly char WITHDRAW = 'W';
        public static readonly char PENDING = 'P';
    }
   

    public class WS_PATH
    {
        public static readonly string FOO_GET = "https://ws.foo.com/get";
    }

    public enum NETWORK
    {
        ETHEREUM_ID = 1,
        ROPSTEN_ID = 3,         // Ethereum Test network.
        POLYGON_ID = 137,       //'0x89',
        BINANCE_ID = 56,        // '0x38'
        TRON_ID = -1            // chain id is actual 1 but eth is also matching so using -1 for internal distinction.
    };
}