using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;

namespace cakelove.Models
{
    public interface IEntityBase
    {
        int Id { get; set; }
        DateTime? CreatedDate { get; set; }
        DateTime? LastModifiedDate { get; set; }
    }
}