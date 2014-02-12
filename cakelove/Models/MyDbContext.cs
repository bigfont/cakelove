using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace cakelove.Models
{
    public class MyDbContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<ContactInfoBindingModel> ContactInfo { get; set; }
        public DbSet<AddressBindingModel> Address { get; set; }
        public DbSet<TeachingExperienceBindingModel> TeachingExperience { get; set; }
        public DbSet<ClassInfoBindingModel> ClassInfo { get; set; }
    }
}