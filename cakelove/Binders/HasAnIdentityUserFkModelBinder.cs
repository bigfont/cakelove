using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Metadata;
using cakelove.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace cakelove.Binders
{
    public class HasAnIdentityUserFkModelBinder : HttpParameterBinding
        {
            readonly HttpParameterBinding _defaultFormatterBinding;
            private readonly UserManager<IdentityUser> _userManager;

            public HasAnIdentityUserFkModelBinder(HttpParameterDescriptor desc, UserManager<IdentityUser> userManager)
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
}