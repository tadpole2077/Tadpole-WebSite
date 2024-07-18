using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Angular_VS_TEST.ServiceClass
{
    
    public class QueryParameters
    {
        public class QueryParametersGet
        {
            public int foo { get; set; }
        }

        public class QueryParametersTransaction
        {
            [BindRequired]
            public string from_wallet { get; set; }

            [BindRequired]
            public string to_wallet { get; set; }

            [BindRequired]
            public int unit_type { get; set; }

            [BindRequired]
            public int unit_amount { get; set; }

            [BindRequired]
            public decimal value { get; set; }

            [BindRequired]
            public string hash { get; set; }

            [BindRequired]
            public int status { get; set; }

            [BindRequired]
            public int blockchain { get; set; }

            [BindRequired]
            public int transaction_type { get; set; }

            [BindRequired]
            public int token_id { get; set; }
        }

        public class QueryParametersTransactionReceipt
        {
            [BindRequired]
            public string hash { get; set; }

        }
    }
}
