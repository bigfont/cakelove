﻿using System.Collections.Generic;
using System.Web.Optimization;

namespace cakelove
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            bundles.UseCdn = true;            

            // angular
            const string angularCdn = "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/";
            const string angularDir = "~/Scripts/angular/";
            var angular = new Dictionary<string, string>()
            {
                { "ng","angular.js"},
                { "ngRoute","angular-route.js"},
                { "ngSanitize","angular-sanitize.js"},
            };
            foreach (var pair in angular)
            {
                var bundleRoute = "~/bundles/" + pair.Key;
                var cdnPath = angularCdn + pair.Value;  // todo use minified cdn
                var virtualPath = angularDir + pair.Value;
                bundles.Add(new ScriptBundle(bundleRoute, cdnPath).Include(virtualPath));
            }
            bundles.Add(new ScriptBundle("~/bundles/ngFileUpload").Include(angularDir + "angular-file-upload.js"));

            // angular.ui.bootstrap
            const string angularUiBootstrapCdn = "http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/";
            var angularUiBootstrap = new Dictionary<string, string>()
            {
                {"ngUiBootstrap", "ui-bootstrap-tpls.js"},
                {"ngUiBootstrapTpls", "ui-bootstrap.js"}
            };
            foreach (var pair in angularUiBootstrap)
            {
                var bundleRoute = "~/bundles/" + pair.Key;
                var cdnPath = angularUiBootstrapCdn + pair.Value;  // todo use minified cdn
                var virtualPath = angularDir + pair.Value;
                bundles.Add(new ScriptBundle(bundleRoute, cdnPath).Include(virtualPath));
            }

            // bootstrap
            const string bootstrapCdn = "http://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css";
            bundles.Add(new StyleBundle("~/Content/bootstrap", bootstrapCdn).Include("~/Content/bootstrap.css"));

            // modernizr
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-{version}.js"));

            // site
            bundles.Add(new StyleBundle("~/Content/bigfont").Include(
                      "~/Content/site.css",
                      "~/Content/angular-csp.css"));

            bundles.Add(new ScriptBundle("~/bundles/polyfills").IncludeDirectory("~/Scripts/polyfills", "*.js"));
            bundles.Add(new ScriptBundle("~/bundles/cakelove").IncludeDirectory("~/Scripts/cakelove", "*.js"));

        }
    }
}
