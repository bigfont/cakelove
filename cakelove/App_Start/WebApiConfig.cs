using System;
using System.Security.Cryptography;
using System.Web.Http;
using System.Web.Http.Controllers;
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

            config.ParameterBindingRules.Insert(0, (desc =>
            {
                if (desc.ParameterType.BaseType != null 
                    && desc.ParameterType.BaseType == typeof(HasAnIdentityUserFk))
                {
                    return new Binders.SetModelUserId(desc, Startup.UserManagerFactory());
                }
                else
                {
                    return null;
                }
            }));

        }
    }
}
