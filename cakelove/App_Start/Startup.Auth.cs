﻿using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;
using cakelove.Providers;
using cakelove.Models;

namespace cakelove
{
    public partial class Startup
    {
        static Startup()
        {
            PublicClientId = "self";
            
            UserManagerFactory = () => new UserManager<IdentityUser>(new UserStore<IdentityUser>());

            RoleManagerFactory = () => new RoleManager<IdentityRole>(new RoleStore<IdentityRole>());

            CreateRolesIfNotExists(new string[] { "admin", "member", "applicant" });

            ChangeUserPassword("cakecottage", "cakelove123");

            // hack
            AddExistingUserToExistingRole("aa403d2d-a493-4af0-bc8d-43cc8d803be3", "admin"); // jenandaussie
            AddExistingUserToExistingRole("acc327ab-b955-44fc-ab1b-9827e0e2ec36", "admin"); // shaunluttin

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId, UserManagerFactory),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                AllowInsecureHttp = true
            };
        }

        private static void ChangeUserPassword(string username, string newPassword)
        {
            UserManager<IdentityUser> userManager = UserManagerFactory();
            IdentityUser user = userManager.FindByName(username);
            userManager.RemovePassword(user.Id);
            userManager.AddPassword(user.Id, newPassword);
        }

        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static Func<UserManager<IdentityUser>> UserManagerFactory { get; set; }

        public static Func<RoleManager<IdentityRole>> RoleManagerFactory { get; set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");

            //app.UseFacebookAuthentication(
            //    appId: "",
            //    appSecret: "");

            //app.UseGoogleAuthentication();
        }

        private static IdentityResult CreateRolesIfNotExists(IEnumerable<string> roleNames)
        {
            IdentityResult result = IdentityResult.Failed();
            foreach (var roleName in roleNames)
            {
                RoleManager<IdentityRole> roleManager = RoleManagerFactory();
                result = !roleManager.RoleExists(roleName) ? roleManager.Create(new IdentityRole(roleName)) : IdentityResult.Success;
            }
            return result;
        }

        private static void AddExistingUserToExistingRole(string userId, string roleName)
        {
            IdentityResult result = IdentityResult.Failed();
            UserManager<IdentityUser> userManager = UserManagerFactory();
            RoleManager<IdentityRole> roleManager = RoleManagerFactory();
            if(roleManager.RoleExists(roleName) && userManager.FindById(userId) != null && !userManager.IsInRole(userId, roleName))
            {
                userManager.AddToRole(userId, roleName);
            }
        }
    }
}
