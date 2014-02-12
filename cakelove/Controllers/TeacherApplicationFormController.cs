﻿using System;
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
            var bindingModel = db.ContactInfo.Include(ci => ci.Address).FirstOrDefault(ci => ci.IdentityUserId == GetCurrentUserId()) ?? new ContactInfoBindingModel();
            var viewModel = Mapper.Map<ContactInfoBindingModel, ContactInfoViewModel>(bindingModel);
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
                dbContext.Entry(model).State = GetBindingModelState(model);

                dbContext.Address.Attach(model.Address);
                dbContext.Entry(model.Address).State = GetBindingModelState(model);

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

        [System.Web.Http.Route("TeachingExperience")]
        public TeachingExperienceViewModel GetTeachingExperience()
        {
            var db = new MyDbContext();
            var bindingModel = db.TeachingExperience.FirstOrDefault(ci => ci.IdentityUserId == GetCurrentUserId()) ?? new TeachingExperienceBindingModel();
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

        public ClassInfoViewModel GetClassInfo()
        { 
            var db = new MyDbContext();
            var bindingModel = db.ClassInfo.Where(ci => ci.IdentityUserId == GetCurrentUserId()).FirstOrDefault() ?? new ClassInfoBindingModel();
            var viewModel = Mapper.Map<ClassInfoBindingModel, ClassInfoViewModel>(bindingModel);
            return viewModel;
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
    }
}
