using System.Web.Mvc;
using System.Web.Routing;

namespace cakelove
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");            

            routes.MapPageRoute(
                routeName: "Angular",
                routeUrl: "ng/{folder}/{filename}",
                physicalFile: "~/AngularAjax/{folder}/{filename}.html",
                checkPhysicalUrlAccess: true);

            // Default Route:
            routes.MapRoute(
               "Default", // Route name
               "{controller}/{action}/{id}", // URL with parameters
               new { controller = "Angular", action = "Index", id = string.Empty } // Parameter defaults
            );
        }
    }
}
