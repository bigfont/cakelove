using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(cakelove.Startup))]

namespace cakelove
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
