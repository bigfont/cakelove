using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Specialized;
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
            return new ContactInfoViewModel();
        }

        public class CustomModelBinder : HttpParameterBinding
        {
            readonly HttpParameterBinding _defaultFormatterBinding;
            private readonly UserManager<IdentityUser> _userManager;

            public CustomModelBinder(HttpParameterDescriptor desc, UserManager<IdentityUser> userManager)
                : base(desc)
            {
                _defaultFormatterBinding = new FromBodyAttribute().GetBinding(desc);
                _userManager = userManager;
            }

            public override Task ExecuteBindingAsync(ModelMetadataProvider metadataProvider,
                HttpActionContext actionContext, CancellationToken cancellationToken)
            {
                // do default model binding
                Task task = _defaultFormatterBinding.ExecuteBindingAsync(metadataProvider, actionContext,
                    cancellationToken);

                // get httpContext
                object httpContext;
                actionContext.Request.Properties.TryGetValue("MS_HttpContext", out httpContext);

                // get user
                var context = httpContext as HttpContextWrapper;
                if (context != null && context.User != null)
                {
                    var userId = context.User.Identity.GetUserId();

                    // set user
                    var model = actionContext.ActionArguments.FirstOrDefault().Value as HasAnIdentityUserFk;
                    if (model != null) model.IdentityUserId = userId;
                }



                // remove from model state
                actionContext.ModelState.Remove("model.IdentityUserId");

                return task;
            }
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
                dbContext.ContactInfo.Add(model);
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
