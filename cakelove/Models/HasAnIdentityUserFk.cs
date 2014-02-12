using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace cakelove.Models
{
    public class HasAnIdentityUserFk
    {
        [Required]
        [ForeignKey("IdentityUser")]
        [Column("IdentityUser_Id")]
        public string IdentityUserId { get; set; }

        public virtual IdentityUser IdentityUser { get; set; }        
    }
}