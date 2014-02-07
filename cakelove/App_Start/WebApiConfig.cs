using System.Web.Http;
using cakelove.Controllers;
using cakelove.Models;
using Microsoft.Owin.Security.OAuth;

namespace cakelove
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.ParameterBindingRules.Insert(0, (p => new TeacherApplicationFormController.CustomModelBinder(p, Startup.UserManagerFactory())));
        }
    }
}
