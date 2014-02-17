namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class applicationStatus : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ApplicationStatus",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        IsSubmitted = c.Boolean(),
                        CreatedDate = c.DateTime(),
                        LastModifiedDate = c.DateTime(),
                        IdentityUser_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.IdentityUser_Id, cascadeDelete: true)
                .Index(t => t.IdentityUser_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ApplicationStatus", "IdentityUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.ApplicationStatus", new[] { "IdentityUser_Id" });
            DropTable("dbo.ApplicationStatus");
        }
    }
}
