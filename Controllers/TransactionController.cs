using Microsoft.AspNetCore.Mvc;
using System.Transactions;
using Angular_VS_TEST.ServiceClass;
using static Angular_VS_TEST.ServiceClass.QueryParameters;

namespace Angular_VS_TEST.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class TransactionController : Controller
    {
        private ServiceCommon common = new();

        public TransactionController()
        {
        }
    }
}
