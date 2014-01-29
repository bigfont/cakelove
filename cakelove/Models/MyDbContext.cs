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

    public class MyDbContextInitializer : DropCreateDatabaseAlways<MyDbContext>
    {
        protected override void Seed(MyDbContext context)
        {
            var userManager = new UserManager<MyIdentityUser>(new UserStore<MyIdentityUser>(context));
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));

            const string testUserName = "Test_User";
            const string testPassword = "Test_Password";
            const string testRole = "Test_Role";

            //Create Role Test and User Test
            roleManager.Create(new IdentityRole(testRole));
            userManager.CreateAsync(new MyIdentityUser() { UserName = testUserName }, testPassword);

            //Create Role Admin if it does not exist
            if (!roleManager.RoleExists(testUserName))
            {
                var roleResult = roleManager.Create(new IdentityRole(testUserName));
            }

            //Create User=Admin with password=123456
            var testUser = new MyIdentityUser { UserName = testUserName };
            var adminResult = userManager.Create(testUser, testPassword);

            //Add User Admin to Role Admin
            if (adminResult.Succeeded)
            {
                var result = userManager.AddToRole(testUser.Id, testUserName);
            }

            //All standards will
            base.Seed(context);
        }
    }
}