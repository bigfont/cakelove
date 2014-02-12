namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class classInfoUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ClassInfo", "IdentityUser_Id", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.ClassInfo", "IdentityUser_Id");
            AddForeignKey("dbo.ClassInfo", "IdentityUser_Id", "dbo.AspNetUsers", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ClassInfo", "IdentityUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.ClassInfo", new[] { "IdentityUser_Id" });
            DropColumn("dbo.ClassInfo", "IdentityUser_Id");
        }
    }
}
