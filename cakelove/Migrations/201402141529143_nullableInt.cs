namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nullableInt : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ClassInfo", "FeePerStudent", c => c.Int());
            AlterColumn("dbo.ClassInfo", "ClassSizeMin", c => c.Int());
            AlterColumn("dbo.ClassInfo", "ClassSizeMax", c => c.Int());
            AlterColumn("dbo.ClassInfo", "TotalTimeDayOne", c => c.Int());
            AlterColumn("dbo.ClassInfo", "TotalTimeDayTwo", c => c.Int());
            AlterColumn("dbo.ClassInfo", "ExtraTimeSetup", c => c.Int());
            AlterColumn("dbo.ClassInfo", "ExtraTimeCleanup", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ClassInfo", "ExtraTimeCleanup", c => c.Int(nullable: false));
            AlterColumn("dbo.ClassInfo", "ExtraTimeSetup", c => c.Int(nullable: false));
            AlterColumn("dbo.ClassInfo", "TotalTimeDayTwo", c => c.Int(nullable: false));
            AlterColumn("dbo.ClassInfo", "TotalTimeDayOne", c => c.Int(nullable: false));
            AlterColumn("dbo.ClassInfo", "ClassSizeMax", c => c.Int(nullable: false));
            AlterColumn("dbo.ClassInfo", "ClassSizeMin", c => c.Int(nullable: false));
            AlterColumn("dbo.ClassInfo", "FeePerStudent", c => c.Int(nullable: false));
        }
    }
}
