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

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("hasBioImage")]
        public string HasBioImage { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}