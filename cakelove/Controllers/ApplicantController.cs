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
            var viewModel = db.Users.Select<IdentityUser, ApplicantMasterViewModel>(u =>
                    new ApplicantMasterViewModel() { UserName = u.UserName });

            return viewModel.ToList();
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
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