﻿using System.Collections.Generic;
using System.Web.Optimization;

namespace cakelove
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = false;
            bundles.UseCdn = true;

            // angular
            const string angularCdn = "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/";
            var angular = new Dictionary<string, string>()
            {
                { "ng","angular.js"},
                { "ngRoute","angular-route.js"},
                { "ngSanitize","angular-sanitize.js"},
            };
            foreach (var pair in angular)
            {
                var bundleRoute = "~/bundles/" + pair.Key;
                var cdnPath = angularCdn + pair.Value; 
                var virtualPath = "~/Scripts/angular/" + pair.Value;
                bundles.Add(new ScriptBundle(bundleRoute, cdnPath).Include(virtualPath));
            }

            // bootstrap
            const string bootstrapCdn = "http://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css";
            bundles.Add(new StyleBundle("~/Content/bootstrap", bootstrapCdn).Include("~/Content/bootstrap.css"));

            // site
            bundles.Add(new StyleBundle("~/Content/bigfont").Include(
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/polyfills").IncludeDirectory("~/Scripts/polyfills", "*.js"));
            bundles.Add(new ScriptBundle("~/bundles/cakelove").IncludeDirectory("~/Scripts/cakelove", "*.js"));

        }
    }
}
