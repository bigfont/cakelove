using System.Web.Mvc;
using cakelove.Models;

namespace cakelove.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            var context = new MyDbContext();
            var conn = context.Database.Connection.ConnectionString;


            return View();
        }
    }
}
