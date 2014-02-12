namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class teachingExp : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TeachingExperience",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        YearsDecorating = c.String(),
                        YearsTeaching = c.String(),
                        PastConferences = c.String(),
                        AveNumStudentsPerClass = c.String(),
                        IdentityUser_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.IdentityUser_Id, cascadeDelete: true)
                .Index(t => t.IdentityUser_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TeachingExperience", "IdentityUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.TeachingExperience", new[] { "IdentityUser_Id" });
            DropTable("dbo.TeachingExperience");
        }
    }
}
