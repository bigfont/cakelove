using AutoMapper;
using cakelove.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace cakelove.Controllers
{
    public class ApplicantController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<ApplicantMasterViewModel> Get()
        {
            MyDbContext db = new MyDbContext();
            var viewModel = db.Users
                .GroupJoin(db.ApplicationStatus, u => u.Id, a => a.IdentityUserId, (u, a)
                => new { UserId = u.Id, UserName = u.UserName, IsSubmitted = a.FirstOrDefault().IsSubmitted })
                .GroupJoin(db.ContactInfo, z => z.UserId, ci => ci.IdentityUserId, (z, ci)
                => new ApplicantMasterViewModel { UserName = z.UserName, Name = ci.FirstOrDefault().Name, IsSubmitted = z.IsSubmitted })
                .Where(z => !z.UserName.Contains("test00"));

            return viewModel.ToList();
        }

        // GET api/<controller>/pete
        public ApplicantDetailViewModel Get(string id)
        {
            var db = new MyDbContext();
            var query = from u in db.Users
                        join ci in db.ContactInfo on u.Id equals ci.IdentityUserId into ciGroup
                        join te in db.TeachingExperience on u.Id equals te.IdentityUserId into teGroup
                        join b in db.Biography on u.Id equals b.IdentityUserId into bGroup
                        join cl in db.ClassInfo on u.Id equals cl.IdentityUserId into clGroup
                        where u.UserName == id
                        select new
                        {
                            UserName = u.UserName,
                            ContactInfo = ciGroup,
                            TeachingExperience = teGroup,
                            Biography = bGroup,
                            ClassInfo = clGroup
                        };

            var first = query.FirstOrDefault();
            
            var viewModel = new ApplicantDetailViewModel()
            {
                UserName = first.UserName,
                ContactInfo = Mapper.Map<IEnumerable<ContactInfoViewModel>>(first.ContactInfo),
                Biography = Mapper.Map<IEnumerable<BiographyViewModel>>(first.Biography)
                TeachingExperience = Mapper.Map<IEnumerable<TeachingExperienceViewModel>>(first.TeachingExperience),
                ClassInfo = Mapper.Map<IEnumerable<ClassInfoViewModel>>(first.ClassInfo)
            };

            return viewModel;
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}