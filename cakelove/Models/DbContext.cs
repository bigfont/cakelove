using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace cakelove.Models
{
    public class DbContext : IdentityDbContext<IdentityUser>
    {

    }
}