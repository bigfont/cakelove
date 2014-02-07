using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using cakelove.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace cakelove.Controllers
{
    [Authorize]
    [RoutePrefix("api/TeacherApplicationForm")]
    public class TeacherApplicationFormController : ApiController
    {

        public UserManager<IdentityUser> UserManager { get; private set; }

        public TeacherApplicationFormController()
            : this(Startup.UserManagerFactory())
        {

        }

        public TeacherApplicationFormController(UserManager<IdentityUser> userManager)
        {
            UserManager = userManager;
        }

        [Route("ContactInfo")]
        public ContactInfoViewModel GetContactInfo()
        {
            return new ContactInfoViewModel();
        }

        [Route("ContactInfo")]
        public async Task<IHttpActionResult> ContactInfo(ContactInfoBindingModel model)
        {
            string userName;
            string userId;
            if (HttpContext.Current != null && HttpContext.Current.User != null 
                   && HttpContext.Current.User.Identity.Name != null)
            {
                userName = HttpContext.Current.User.Identity.Name;
                userId = HttpContext.Current.User.Identity.GetUserId();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }




            var dbContext = new MyDbContext();
            dbContext.ContactInfo.Add(model);
            var result = await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
