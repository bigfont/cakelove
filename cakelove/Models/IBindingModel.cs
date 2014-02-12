using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;

namespace cakelove.Models
{
    public interface IBindingModel
    {
        int Id { get; set; }        
    }
}