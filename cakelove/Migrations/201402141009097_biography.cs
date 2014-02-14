namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class biography : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Biography",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        HasBioImage = c.String(),
                        IdentityUser_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.IdentityUser_Id, cascadeDelete: true)
                .Index(t => t.IdentityUser_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Biography", "IdentityUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Biography", new[] { "IdentityUser_Id" });
            DropTable("dbo.Biography");
        }
    }
}
