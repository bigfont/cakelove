using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System;

namespace cakelove.Models
{
    [Table("ApplicationStatus")]
    public class ApplicationStatusBindingModel : HasAnIdentityUserFk, IEntityBase
    {
        public int Id { get; set; }
        
        public bool IsSubmitted { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}