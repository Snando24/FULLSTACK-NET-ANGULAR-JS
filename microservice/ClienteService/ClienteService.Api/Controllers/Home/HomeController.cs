using Microsoft.AspNetCore.Mvc;

namespace ClienteService.Api.Controllers
{
    [ApiController]
    [Route("/home")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("API funcionando");
    }
}