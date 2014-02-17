using System;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Net.Http;
using AutoMapper;
using cakelove.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Web.Http.Results;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Text;
using System.Collections.Specialized;
using System.Net;
using System.IO;
using Newtonsoft.Json;

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

        [System.Web.Http.Route("Biography")]
        public BiographyViewModel GetBiography()
        {
            var db = new MyDbContext();
            var userId = GetCurrentUserId();
            var bindingModel = db.Biography.FirstOrDefault(b => b.IdentityUserId == userId) ?? new BiographyBindingModel();
            var viewModel = Mapper.Map<BiographyBindingModel, BiographyViewModel>(bindingModel);
            return viewModel;
        }

        [System.Web.Http.Route("Biography")]
        public async Task<IHttpActionResult> Biography(BiographyBindingModel model)
        {
            IHttpActionResult httpActionResult = Ok();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var dbContext = new MyDbContext();

                dbContext.Biography.Attach(model);
                dbContext.Entry(model).State = GetBindingModelState(model);


                var result = await dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                httpActionResult = CreateHttpActionResultFromException(e);
            }

            return httpActionResult;
        }

        [HttpPost]
        [System.Web.Http.Route("BiographyImage")]
        public async Task<IHttpActionResult> BiographyImage()
        {
            IHttpActionResult httpActionResult = Ok();

            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            try
            {
                await SaveImage(Request, "bio");
            }
            catch (System.Exception e)
            {
                httpActionResult = CreateHttpActionResultFromException(e);
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
            IHttpActionResult httpActionResult = Ok();

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
            catch (Exception e)
            {
                httpActionResult = CreateHttpActionResultFromException(e);
            }

            return httpActionResult;
        }

        [System.Web.Http.Route("ClassInfo")]
        public IEnumerable<ClassInfoViewModel> GetClassInfo()
        {
            var db = new MyDbContext();
            var userId = GetCurrentUserId();

            var bindingModel = db.ClassInfo.Where(ci => ci.IdentityUserId == userId).ToList();

            if (bindingModel.Count == 0)
            {
                var classInfo = new ClassInfoBindingModel() { IdentityUserId = GetCurrentUserId(), ClassName = "New Class" };
                db.ClassInfo.Attach(classInfo);
                db.Entry(classInfo).State = EntityState.Added;
                var result = db.SaveChanges();
                bindingModel.Add(classInfo);
            }

            var viewModel = Mapper.Map<List<ClassInfoBindingModel>, List<ClassInfoViewModel>>(bindingModel);
            return viewModel;
        }

        [HttpPost]
        [System.Web.Http.Route("ClassInfo")]
        public async Task<IHttpActionResult> ClassInfo(ClassInfoBindingModel model)
        {
            IHttpActionResult httpActionResult = Ok();

            if (!ModelState.IsValid)
            {
                httpActionResult = BadRequest(ModelState);
            }

            try
            {
                var dbContext = new MyDbContext();

                dbContext.ClassInfo.Attach(model);
                dbContext.Entry(model).State = GetBindingModelState(model);

                var result = await dbContext.SaveChangesAsync();

                var jsonSettings = new JsonSerializerSettings();
                var jsonResult
                    = new JsonResult<Dictionary<string, int>>(new Dictionary<string, int> { { "id", model.Id } }, jsonSettings, System.Text.Encoding.UTF8, this);
                httpActionResult = jsonResult;
            }
            catch (Exception e)
            {
                httpActionResult = CreateHttpActionResultFromException(e);
            }

            return httpActionResult;
        }

        // api/TeacherApplicationForm/deleteClassInfo/78
        [HttpDelete]
        [System.Web.Http.Route("DeleteClassInfo/{id}")]
        public async Task<IHttpActionResult> DeleteClassInfo(int id)
        {
            IHttpActionResult httpActionResult = Ok();

            var classInfo = new ClassInfoBindingModel() { Id = id };
            var db = new MyDbContext();
            db.Entry(classInfo).State = EntityState.Deleted;
            await db.SaveChangesAsync();

            return httpActionResult;
        }

        [HttpPut]
        [System.Web.Http.Route("SubmitCurrentUserApplication")]
        public async Task<IHttpActionResult> SubmitCurrentUserApplication()
        {
            IHttpActionResult httpActionResult = Ok();

            var applicationStatus = new ApplicationStatusBindingModel()
            {
                IdentityUserId = GetCurrentUserId(),
                IsSubmitted = true
            };
            var db = new MyDbContext();
            await InsertOrUpdate(db, applicationStatus);

            return httpActionResult;
        }

        [HttpPost]
        [System.Web.Http.Route("ClassImage")]
        public async Task<IHttpActionResult> ClassImage()
        {
            IHttpActionResult httpActionResult = Ok();

            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            try
            {
                await SaveImage(Request, "class");
            }
            catch (System.Exception e)
            {
                httpActionResult = CreateHttpActionResultFromException(e);
            }

            return httpActionResult;
        }

        private async Task SaveImage(HttpRequestMessage request, string fileNameSuffix)
        {
            string root = HttpContext.Current.Server.MapPath("~/UserImages");

            if (!Directory.Exists(root))
            {
                Directory.CreateDirectory(root);
            }

            var provider = new MultipartFormDataStreamProvider(root);

            // Read the form data.
            await request.Content.ReadAsMultipartAsync(provider);

            var imageId = provider.FormData["imageId"] ?? string.Empty;

            // Save
            foreach (MultipartFileData file in provider.FileData)
            {
                var mediaType = file.Headers.ContentType.MediaType;
                string fileExtension = null;
                switch (mediaType)
                {
                    case "image/jpeg": fileExtension = ".jpg"; break;
                    case "image/png": fileExtension = ".png"; break;
                    default: break;
                }
                if (fileExtension != null)
                {
                    var newFileName = GetCurrentUserId() + "_" + fileNameSuffix + imageId + fileExtension;
                    newFileName = Path.Combine(root, newFileName);

                    if (File.Exists(newFileName))
                    {
                        File.Delete(newFileName);
                    }
                    File.Move(file.LocalFileName, newFileName);
                }
            }
        }

        // Nice-to-have: Put this method into the IBindingModel or similar spot... model.SetState().
        // Maybe use the answer here: http://stackoverflow.com/questions/16195847/does-ef-upsert-has-to-be-done-manually
        private EntityState GetBindingModelState(IEntityBase model)
        {
            return model.Id == default(int) ? EntityState.Added : EntityState.Modified;
        }

        public async Task InsertOrUpdate(DbContext context, IEntityBase entity)
        {
            context.Entry(entity).State = entity.Id == 0 ?
                                           EntityState.Added :
                                           EntityState.Modified;
            await context.SaveChangesAsync();
        }

        private string GetCurrentUserId()
        {
            return HttpContext.Current.User.Identity.GetUserId();
        }

        // Nice-to-have: improve this error handling
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
