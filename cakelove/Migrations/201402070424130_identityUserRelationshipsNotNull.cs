namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class identityUserRelationshipsNotNull : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ContactInfo", "IdentityUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.ContactInfo", new[] { "IdentityUser_Id" });
            AlterColumn("dbo.ContactInfo", "IdentityUser_Id", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.ContactInfo", "IdentityUser_Id");
            AddForeignKey("dbo.ContactInfo", "IdentityUser_Id", "dbo.AspNetUsers", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ContactInfo", "IdentityUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.ContactInfo", new[] { "IdentityUser_Id" });
            AlterColumn("dbo.ContactInfo", "IdentityUser_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.ContactInfo", "IdentityUser_Id");
            AddForeignKey("dbo.ContactInfo", "IdentityUser_Id", "dbo.AspNetUsers", "Id");
        }
    }
}
