namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class hasClassImage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ClassInfo", "HasClassImage", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ClassInfo", "HasClassImage");
        }
    }
}
