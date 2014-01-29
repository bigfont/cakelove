using Microsoft.AspNet.Identity.EntityFramework;

namespace cakelove.Models
{
    public class InstructorApplication : IdentityUser
    {
        public ContactInfo ContactInfo { get; set; }
    }
}