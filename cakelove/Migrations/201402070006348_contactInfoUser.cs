namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class contactInfoUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ContactInfo", "IdentityUser_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.ContactInfo", "IdentityUser_Id");
            AddForeignKey("dbo.ContactInfo", "IdentityUser_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ContactInfo", "IdentityUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.ContactInfo", new[] { "IdentityUser_Id" });
            DropColumn("dbo.ContactInfo", "IdentityUser_Id");
        }
    }
}
