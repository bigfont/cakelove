namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class bioImage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Biography", "BioImageRelativePath", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Biography", "BioImageRelativePath");
        }
    }
}
