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
using System.Diagnostics;
namespace cakelove.Controllers.Tests
{
    [TestClass()]
    public class TeacherApplicationFormControllerTests
    {
        public UserManager<IdentityUser> UserManager { get; private set; }
        public IdentityUser TestUser
        {
            get
            {
                IdentityUser user = UserManager.FindByName("alice");
                if (user == null)
                {
                    user = new IdentityUser("alice");
                    var identityResult = UserManager.Create(user, "password123");
                    user = UserManager.FindByName("alice");
                }
                return user;
            }
        }

        public TeacherApplicationFormControllerTests()
            : this(Startup.UserManagerFactory())
        {

        }

        public TeacherApplicationFormControllerTests(UserManager<IdentityUser> userManager)
        {
            UserManager = userManager;
        }

        [TestMethod()]
        public void ContactInfoTest_Create()
        {
            Debug.WriteLine("--- ContactInfoTest_Create");

            var minimalCreate = new ContactInfoBindingModel()
            {
                IdentityUserId = TestUser.Id
            };

            var controller = new TeacherApplicationFormController();
            Task<IHttpActionResult> httpActionResult = controller.ContactInfo(minimalCreate);

            if (httpActionResult.Result.GetType() != typeof(System.Web.Http.Results.OkResult))
            {
                Assert.Fail();
            }
        }

        [TestMethod()]
        public void ContactInfoTest_Update()
        {
            Debug.WriteLine("--- ContactInfoTest_Update");

            var minimalUpdate = new ContactInfoBindingModel()
            {
                Id = 5,
                AddressId = 5,
                Address = new AddressBindingModel() { Id = 5 },
                Name = TestUser.UserName += DateTime.Now.Ticks,
                IdentityUserId = TestUser.Id
            };

            var controller = new TeacherApplicationFormController();
            Task<IHttpActionResult> httpActionResult = controller.ContactInfo(minimalUpdate);

            if (httpActionResult.Result.GetType() != typeof(System.Web.Http.Results.OkResult))
            {
                Assert.Fail();
            }
        }
    }
}
