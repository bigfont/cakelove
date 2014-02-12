namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class hasTaught : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TeachingExperience", "HasTaught", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.TeachingExperience", "HasTaught");
        }
    }
}
