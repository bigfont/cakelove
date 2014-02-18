namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class classAndBioImage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Biography", "HasImage", c => c.String());
            AddColumn("dbo.Biography", "ImageRelativePath", c => c.String());
            DropColumn("dbo.Biography", "HasBioImage");
            DropColumn("dbo.Biography", "BioImageRelativePath");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Biography", "BioImageRelativePath", c => c.String());
            AddColumn("dbo.Biography", "HasBioImage", c => c.String());
            DropColumn("dbo.Biography", "ImageRelativePath");
            DropColumn("dbo.Biography", "HasImage");
        }
    }
}
