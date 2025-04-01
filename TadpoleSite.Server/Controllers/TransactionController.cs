using Microsoft.AspNetCore.Mvc;
using static TadpoleSite.Server.ServiceClass.QueryParameters;
using TadpoleSite.Server.ServiceClass;
using TadpoleSite.Server.Models;

namespace TadpoleSite.Server.Controllers;


[ApiController]
[Route("[controller]")]
//[Route("api/[controller]")]
public class TransactionController : ControllerBase
{
    private ServiceCommon common = new();

    public TransactionController()
    {
    }

    [HttpGet("IsAlive")]
    public IActionResult IsAlive([FromQuery] QueryParametersGet parameters)
    {

        if (ModelState.IsValid)
        {
            return Ok(
                common.JsendAssignJSONData("API Server Active")
                );
        }

        return BadRequest("Get Alive Status Failed");       // 400 Error     
    }

    [HttpGet("TestUser")]
    public IActionResult TestUser()
    {

        if (ModelState.IsValid)
        {           
           return Ok(
                common.JsendAssignJSONData(new TestUser
                {
                    Name = "John",
                    DOB = "N/A",
                    Age = 20,
                    Hobbies = ["Test","-","N/A","Scuba"],
                    Attributes = [
                        new UserAttributes{ key="test", value= "1"},
                        new UserAttributes{ key="test2", value= "N/A"}
                    ]                    
                })
            );
        }

        return BadRequest("No Test Supported");       // 400 Error     
    }
}
