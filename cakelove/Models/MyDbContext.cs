using System.Collections;
using System.Collections.Generic;
using System.Web.UI.WebControls;
using cakelove.Controllers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;

namespace cakelove.Models
{
    public class MyDbContext : IdentityDbContext<MyIdentityUser>
    {
       
    }

}