using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System;

namespace cakelove.Models
{
    [Table("Biography")]
    public class BiographyBindingModel : HasAnIdentityUserFk, IEntityBase
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public string HasImage { get; set; }

        public string ImageRelativePath { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}