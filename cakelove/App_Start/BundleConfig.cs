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

            bundles.Add(new ScriptBundle("~/bundles/bigfont").Include(
                        "~/Scripts/bigfont.identity.js"));

            const string angularCdn = "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular.js";
            bundles.Add(new ScriptBundle("~/bundles/angular", angularCdn).Include("~/Scripts/angular.js"));

            const string bootstrapCdn = "http://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css";
            bundles.Add(new StyleBundle("~/Content/bootstrap", bootstrapCdn).Include("~/Content/bootstrap.css"));
            
            bundles.Add(new StyleBundle("~/Content/bigfont").Include(
                      "~/Content/site.css"));
        }
    }
}
