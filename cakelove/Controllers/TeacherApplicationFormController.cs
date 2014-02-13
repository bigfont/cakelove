using System;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using cakelove.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Web.Http.Results;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Text;

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
            var db = new MyDbContext();
            var userId = GetCurrentUserId();
            var bindingModel = db.ContactInfo.Include(ci => ci.Address).FirstOrDefault(ci => ci.IdentityUserId == userId) ?? new ContactInfoBindingModel() { Address = new AddressBindingModel() };
            var viewModel = Mapper.Map<ContactInfoBindingModel, ContactInfoViewModel>(bindingModel);
            return viewModel;
        }

        [System.Web.Http.Route("ContactInfo")]
        public async Task<IHttpActionResult> ContactInfo(ContactInfoBindingModel model)
        {
            IHttpActionResult httpActionResult = Ok();

            if (!ModelState.IsValid)
            {
                httpActionResult = BadRequest(ModelState);
            }
            else
            {
                try
                {
                    var dbContext = new MyDbContext();

                    dbContext.Database.Log = s => Debug.WriteLine(s);

                    //contactinfo
                    dbContext.ContactInfo.Attach(model);
                    dbContext.Entry(model).State = GetBindingModelState(model);
                    //address
                    dbContext.Address.Attach(model.Address);
                    dbContext.Entry(model.Address).State = GetBindingModelState(model);
                    //save
                    var result = await dbContext.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    httpActionResult = CreateHttpActionResultFromException(e);
                }
            }

            return httpActionResult;
        }

        [System.Web.Http.Route("TeachingExperience")]
        public TeachingExperienceViewModel GetTeachingExperience()
        {
            var db = new MyDbContext();
            var userId = GetCurrentUserId();
            var bindingModel = db.TeachingExperience.FirstOrDefault(ci => ci.IdentityUserId == userId) ?? new TeachingExperienceBindingModel();
            var viewModel = Mapper.Map<TeachingExperienceBindingModel, TeachingExperienceViewModel>(bindingModel);

            return viewModel;
        }

        [System.Web.Http.Route("TeachingExperience")]
        public async Task<IHttpActionResult> TeachingExperience(TeachingExperienceBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var dbContext = new MyDbContext();

                dbContext.TeachingExperience.Attach(model);
                dbContext.Entry(model).State = GetBindingModelState(model);


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

        [System.Web.Http.Route("ClassInfo")]
        public IEnumerable<ClassInfoViewModel> GetClassInfo()
        {
            var db = new MyDbContext();
            var userId = GetCurrentUserId();

            var bindingModel = db.ClassInfo.Where(ci => ci.IdentityUserId == userId).ToList();

            if (bindingModel.Count == 0)
            {
                bindingModel.Add(new ClassInfoBindingModel());
            }

            var viewModel = Mapper.Map<List<ClassInfoBindingModel>, List<ClassInfoViewModel>>(bindingModel);
            return viewModel;
        }

        [System.Web.Http.Route("ClassInfo")]
        public async Task<IHttpActionResult> ClassInfo(ClassInfoBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var dbContext = new MyDbContext();

                dbContext.ClassInfo.Attach(model);
                dbContext.Entry(model).State = GetBindingModelState(model);

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

        // todo Put this method into the IBindingModel or similar spot... model.SetState().
        private EntityState GetBindingModelState(IBindingModel model)
        {
            return model.Id == default(int) ? EntityState.Added : EntityState.Modified;
        }

        private string GetCurrentUserId()
        {
            return HttpContext.Current.User.Identity.GetUserId();
        }

        // todo improve this error handling
        private IHttpActionResult CreateHttpActionResultFromException(Exception exception)
        {
            Type exceptionType = exception.GetType();
            StringBuilder message = new StringBuilder();
            if (exceptionType == typeof(DbEntityValidationException))
            {
                DbEntityValidationException e = exception as DbEntityValidationException;
                message.AppendLine(e.Message);
                foreach (var error in e.EntityValidationErrors)
                {
                    message.AppendLine("DbEntityValidationException");
                }
            }
            else if (exceptionType == typeof(DbUpdateException))
            {
                DbEntityValidationException e = exception as DbEntityValidationException;
                message.AppendLine(e.Message);
            }
            else if (exceptionType == typeof(DbUpdateConcurrencyException))
            {
                DbUpdateConcurrencyException e = exception as DbUpdateConcurrencyException;
                message.AppendLine(e.Message);
            }
            else
            {
                message.AppendLine(exception.Message);
            }

            BadRequestErrorMessageResult httpActionResult = new BadRequestErrorMessageResult(message.ToString(), this);
            return httpActionResult;
        }
    }
}
