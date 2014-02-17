using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System;

namespace cakelove.Models
{
    public class MyDbContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<ContactInfoBindingModel> ContactInfo { get; set; }
        public DbSet<AddressBindingModel> Address { get; set; }
        public DbSet<TeachingExperienceBindingModel> TeachingExperience { get; set; }
        public DbSet<ClassInfoBindingModel> ClassInfo { get; set; }
        public DbSet<BiographyBindingModel> Biography { get; set; }
        public DbSet<ApplicationStatusBindingModel> ApplicationStatus { get; set; }

        public override int SaveChanges()
        {
            ObjectContext context = ((IObjectContextAdapter)this).ObjectContext;

            //Find all Entities that are Added/Modified that inherit from my EntityBase
            IEnumerable<ObjectStateEntry> objectStateEntries =
                from e in context.ObjectStateManager.GetObjectStateEntries(EntityState.Added | EntityState.Modified)
                where
                    e.IsRelationship == false &&
                    e.Entity != null &&
                    typeof(IEntityBase).IsAssignableFrom(e.Entity.GetType())
                select e;

            var currentTime = DateTime.Now;

            foreach (var entry in objectStateEntries)
            {
                var entityBase = entry.Entity as IEntityBase;

                if (entry.State == EntityState.Added)
                {
                    entityBase.CreatedDate = currentTime;
                }

                entityBase.LastModifiedDate = currentTime;
            }

            return base.SaveChanges();
        }
    }
}