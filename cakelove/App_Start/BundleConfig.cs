using System.Web;
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

            /*
            const string angularCdn = "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular.js";
            bundles.Add(new ScriptBundle("~/bundles/angular", angularCdn).Include(
                "~/Scripts/angular.js"));
             */

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
