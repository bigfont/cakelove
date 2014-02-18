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
using System.Net.Http.Headers;
using System.Drawing;
using System.Drawing.Drawing2D;

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

        private async void SaveModelImageToDatabase(DbContext db, DbSet<IEntityHasImage> dbSet, IEntityHasImage model, string rootRelativeImgSrc)
        {
            model.ImageRelativePath = rootRelativeImgSrc;
            model.HasImage = true;

            dbSet.Attach(model);
            await InsertOrUpdateAsync(db, model);
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

            string rootRelativeImgSrc = null;
            try
            {
                rootRelativeImgSrc = await SaveImage(Request, "bio");
                                
                var db = new MyDbContext();

                string currentUserId = GetCurrentUserId();
                var model =
                    db.Biography.FirstOrDefault(b => b.IdentityUser.Id.Equals(currentUserId)) ??
                    new BiographyBindingModel() { IdentityUserId = currentUserId };

                model.ImageRelativePath = rootRelativeImgSrc;
                model.HasImage = true;
                db.Biography.Attach(model);
                await InsertOrUpdateAsync(db, model);

                dynamic content = new { imageRelativePath = model.ImageRelativePath };
                httpActionResult = new JsonResult<dynamic>(content, new JsonSerializerSettings(), System.Text.Encoding.UTF8, this);

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

                var jsonResult
                    = new JsonResult<Dictionary<string, int>>(new Dictionary<string, int> { { "id", model.Id } }, new JsonSerializerSettings(), System.Text.Encoding.UTF8, this);
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
            await InsertOrUpdateAsync(db, applicationStatus);

            return httpActionResult;
        }

        [HttpGet]
        [System.Web.Http.Route("CurrentUserApplicationStatus")]
        public ApplicationStatusViewModel GetCurrentUserApplicationStatus()
        {
            var db = new MyDbContext();
            var userId = GetCurrentUserId();

            var bindingModel = db.ApplicationStatus.FirstOrDefault(a => a.IdentityUserId == userId) ?? new ApplicationStatusBindingModel();

            var viewModel = Mapper.Map<ApplicationStatusBindingModel, ApplicationStatusViewModel>(bindingModel);
            return viewModel;
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

            string rootRelativeImgSrc = null;

            try
            {                
                rootRelativeImgSrc = await SaveImage(Request, "class");

                var db = new MyDbContext();

                string currentUserId = GetCurrentUserId();
                var model =
                    db.ClassInfo.FirstOrDefault(b => b.IdentityUser.Id.Equals(currentUserId)) ??
                    new ClassInfoBindingModel() { IdentityUserId = currentUserId };

                model.ImageRelativePath = rootRelativeImgSrc;
                model.HasImage = true;
                db.ClassInfo.Attach(model);
                await InsertOrUpdateAsync(db, model);

                dynamic content = new { imageRelativePath = model.ImageRelativePath };
                httpActionResult = new JsonResult<dynamic>(content, new JsonSerializerSettings(), System.Text.Encoding.UTF8, this);
            }
            catch (System.Exception e)
            {
                httpActionResult = CreateHttpActionResultFromException(e);
            }

            return httpActionResult;
        }

        private void CreateDirIfNotExists(string dirAbsolutePath)
        {
            if (!Directory.Exists(dirAbsolutePath))
            {
                Directory.CreateDirectory(dirAbsolutePath);
            }
        }

        private string GetFileExtensionFromMultipartFileData(MultipartFileData file)
        {
            var mediaType = file.Headers.ContentType.MediaType;
            string fileExtension = null;
            switch (mediaType)
            {
                case "image/jpeg": fileExtension = ".jpg"; break;
                case "image/png": fileExtension = ".png"; break;
                default: break;
            }
            return fileExtension;
        }

        public Image MakeSquareImage(Image imageToResize, int widthAndHeightInPixels)
        {
            Size size = new Size(widthAndHeightInPixels, widthAndHeightInPixels);
            return ResizeImage(imageToResize, size);
        }

        public Image ResizeImage(Image imageToResize, Size size)
        {            
            Bitmap newImage = new Bitmap(size.Width, size.Height);
            using (Graphics gr = Graphics.FromImage(newImage))
            {
                gr.SmoothingMode = SmoothingMode.HighQuality;
                gr.InterpolationMode = InterpolationMode.HighQualityBicubic;
                gr.PixelOffsetMode = PixelOffsetMode.HighQuality;
                gr.DrawImage(imageToResize, new Rectangle(0, 0, size.Width, size.Height));
            }

            return newImage;
        }

        /// <returns>A root relative http style uri such as "/UserImages/somefile.jpg".</returns>
        private async Task<string> SaveImage(HttpRequestMessage request, string fileNameSuffix)
        {
            string root = HttpContext.Current.Server.MapPath("~/");

            string saveDirBaseName = "UserImages";
            string saveDirAbsolutePath = null;

            string saveFileBaseName = null;
            string saveFileAbsolutePath = null;
            string rootRelativeImgSrc = null;

            // upload the file; its name will be file.LocalFileName; we rename it below
            var provider = new MultipartFormDataStreamProvider(root);
            await request.Content.ReadAsMultipartAsync(provider);
            var imageId = provider.FormData["imageId"] ?? string.Empty;

            // create dir if not exists
            saveDirAbsolutePath = Path.Combine(root, saveDirBaseName);
            CreateDirIfNotExists(saveDirAbsolutePath);

            // Save
            foreach (MultipartFileData file in provider.FileData)
            {
                // resize the file
                Image imageToResize = Image.FromFile(file.LocalFileName);
                Image resizedImage = MakeSquareImage(imageToResize, 187);

                var fileExtension = GetFileExtensionFromMultipartFileData(file);
                if (fileExtension != null)
                {
                    saveFileBaseName = GetCurrentUserId() + "_" + fileNameSuffix + imageId + fileExtension;
                    saveFileAbsolutePath = Path.Combine(saveDirAbsolutePath, saveFileBaseName);
                    
                    if (File.Exists(saveFileAbsolutePath))
                    {
                        File.Delete(saveFileAbsolutePath);
                    }

                    resizedImage.Save(saveFileAbsolutePath);


                   // rename the uploaded file to the target name
                     // File.Move(file.LocalFileName, saveFileAbsolutePath);

                    // create a img.src path for the web
                    rootRelativeImgSrc = "/" + saveDirBaseName + "/" + saveFileBaseName;
                }
            }

            return rootRelativeImgSrc;
        }

        // Nice-to-have: Put this method into the IBindingModel or similar spot... model.SetState().
        // Maybe use the answer here: http://stackoverflow.com/questions/16195847/does-ef-upsert-has-to-be-done-manually
        private EntityState GetBindingModelState(IEntityBase model)
        {
            return model.Id == default(int) ? EntityState.Added : EntityState.Modified;
        }

        public async Task InsertOrUpdateAsync(DbContext context, IEntityBase entity)
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
