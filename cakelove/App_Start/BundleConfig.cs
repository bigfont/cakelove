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
            const string ngMain = "angular.js";
            const string ngRoute = "angular-route.js";
            const string ngSanitize = "angular-sanitize.js";

            bundles.Add(new ScriptBundle("~/bundles/ng", angularCdn + ngMain).Include("~/Scripts/" + ngMain));
            bundles.Add(new ScriptBundle("~/bundles/ngRoute", angularCdn + ngRoute).Include("~/Scripts/" + ngRoute));
            bundles.Add(new ScriptBundle("~/bundles/ngSanitize", angularCdn + ngSanitize).Include("~/Scripts/" + ngSanitize));

            // bootstrap
            const string bootstrapCdn = "http://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css";
            bundles.Add(new StyleBundle("~/Content/bootstrap", bootstrapCdn).Include("~/Content/bootstrap.css"));

            // site
            bundles.Add(new StyleBundle("~/Content/bigfont").Include(
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/polyfills").IncludeDirectory("~/Scripts/polyfills", "*.js"));
            bundles.Add(new ScriptBundle("~/bundles/bigfont").IncludeDirectory("~/Scripts/bigfont", "*.js"));
            bundles.Add(new ScriptBundle("~/bundles/cakelove").IncludeDirectory("~/Scripts/cakelove", "*.js"));

        }
    }
}
