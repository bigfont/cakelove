namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class useBool : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Biography", "HasImage", c => c.Boolean());
            AlterColumn("dbo.ClassInfo", "HasImage", c => c.Boolean());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ClassInfo", "HasImage", c => c.String());
            AlterColumn("dbo.Biography", "HasImage", c => c.String());
        }
    }
}
