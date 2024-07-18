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


        [HttpGet("getDistribution")]
        public IActionResult getLogbyMatic([FromQuery] QueryParametersGet parameters)
        {
            StakingManage stakingManage = new();

            if (ModelState.IsValid)
            {
                return Ok( 
                    common.JsendAssignJSONData(stakingManage.GetTotalDistribution().Result) 
                    );
            }

            return BadRequest("Get Foo Failed");       // 400 Error     
        }

        [HttpGet("GetDistributionEvent")]
        public IActionResult GetDistributionEvent([FromQuery] QueryParametersGet parameters)
        {
            StakingManage stakingManage = new();

            if (ModelState.IsValid)
            {
                return Ok(
                    common.JsendAssignJSONData(stakingManage.GetDistribution())
                    );
            }

            return BadRequest("Get Foo Failed");       // 400 Error     
        }

        [HttpGet("GetSwapPrice")]
        public IActionResult GetSwapPrice([FromQuery] QueryParametersGet parameters)
        {
            StakingManage stakingManage = new();

            if (ModelState.IsValid)
            {
                return Ok(
                    common.JsendAssignJSONData(stakingManage.GetSwapPrice())
                    );
            }

            return BadRequest("Get GetSwapPrice Failed");       // 400 Error     
        }

        [HttpGet("GetTotalStakedEligable")]
        public IActionResult GetTotalStakedEligable([FromQuery] QueryParametersGet parameters)
        {
            StakingManage stakingManage = new();

            if (ModelState.IsValid)
            {
                return Ok(
                    common.JsendAssignJSONData(stakingManage.GetCGCTotalStakedEligable())
                    );
            }

            return BadRequest("Get CGC_KPI Failed");       // 400 Error     
        }
    }
}
