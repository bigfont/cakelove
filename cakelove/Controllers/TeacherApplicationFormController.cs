using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using cakelove.Models;

namespace cakelove.Controllers
{
    [Authorize]
    [RoutePrefix("api/TeacherApplicationForm")]
    public class TeacherApplicationFormController : ApiController
    {
        [Route("ContactInfo")]
        public ContactInfoViewModel GetContactInfo()
        {
            return new ContactInfoViewModel();
        }

        [Route("ContactInfo")]
        public  async Task<IHttpActionResult> ContactInfo(ContactInfoBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok();
        }
    }
}
