using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Metadata;
using System.Web.Http.ModelBinding;
using System.Web.Http.ValueProviders;
using System.Web.UI.WebControls;
using AutoMapper;
using cakelove.Models;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using WebGrease.Css.Extensions;

namespace cakelove.Controllers
{
    [System.Web.Http.Authorize]
    [System.Web.Http.RoutePrefix("api/TeacherApplicationForm")]
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

        [System.Web.Http.Route("ContactInfo")]
        public ContactInfoViewModel GetContactInfo()
        {
            var dbContext = new MyDbContext();

            var userId = HttpContext.Current.User.Identity.GetUserId();

            var bindingModel = dbContext.ContactInfo.Include(ci => ci.Address).FirstOrDefault(ci => ci.IdentityUserId == userId);

            Mapper.CreateMap<ContactInfoBindingModel, ContactInfoViewModel>();
            Mapper.CreateMap<AddressBindingModel, AddressViewModel>();
            var viewModel = Mapper.Map<ContactInfoBindingModel, ContactInfoViewModel>(bindingModel);

            //var viewModel = new ContactInfoViewModel(bindingModel);
            return viewModel;
        }

        [System.Web.Http.Route("ContactInfo")]
        public async Task<IHttpActionResult> ContactInfo(ContactInfoBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var dbContext = new MyDbContext();

                dbContext.ContactInfo.Attach(model);
                dbContext.Entry(model).State = EntityState.Modified;

                dbContext.Address.Attach(model.Address);
                dbContext.Entry(model.Address).State = EntityState.Modified;

                var result = await dbContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var error in e.EntityValidationErrors)
                {
                    var m = error.Entry;
                }
            }
            catch (Exception e)
            {
                var message = e.Message;
            }

            return Ok();
        }
    }
}
