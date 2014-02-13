using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using cakelove.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using cakelove.Models;
using System.Web.Http;
using System.Threading.Tasks;
using System.Threading;
using System.Security.Principal;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
namespace cakelove.Controllers.Tests
{
    [TestClass()]
    public class TeacherApplicationFormControllerTests
    {
        public UserManager<IdentityUser> UserManager { get; private set; }

        public TeacherApplicationFormControllerTests()
            : this(Startup.UserManagerFactory())
        {

        }

        public TeacherApplicationFormControllerTests(UserManager<IdentityUser> userManager)
        {
            UserManager = userManager;
        }

        [TestMethod()]
        public void ContactInfoTest()
        {
            IdentityUser user = new IdentityUser("alice");
            var identityResult = UserManager.Create(user, "password123");
            user = UserManager.FindByName("alice");

            var controller = new TeacherApplicationFormController();

            Task<IHttpActionResult> httpActionResult = controller.ContactInfo(new ContactInfoBindingModel()
            {
                Name = "Test" + DateTime.Now.Ticks,
                IdentityUserId = user.Id
            });

            if (httpActionResult.Result.GetType() != typeof(System.Web.Http.Results.OkResult))
            {
                Assert.Fail();
            }
        }
    }
}
