using System;
using System.Web.Mvc;
using cakelove.Models;

namespace cakelove.Controllers
{
    public class AngularController : Controller
    {
        protected override void HandleUnknownAction(string actionName)
        {
            try
            {
                View(actionName).ExecuteResult(ControllerContext);
            }
            catch (InvalidOperationException ieox)
            {
                ViewData["error"] = "Unknown Action:" + Server.HtmlEncode(actionName);
                ViewData["exMessage"] = ieox.Message;
                this.View("Error").ExecuteResult(this.ControllerContext);
            }
        }
    }
}
