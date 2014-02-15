namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nullableBool : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ClassInfo", "DoSpecialSupplies", c => c.Boolean());
            AlterColumn("dbo.ClassInfo", "DoVendorTable", c => c.Boolean());
            AlterColumn("dbo.ClassInfo", "HasTimePreference", c => c.Boolean());
            AlterColumn("dbo.ClassInfo", "IsMultiDay", c => c.Boolean());
            AlterColumn("dbo.ClassInfo", "IsSelling", c => c.Boolean());
            AlterColumn("dbo.ClassInfo", "NeedsExtraCleanup", c => c.Boolean());
            AlterColumn("dbo.ClassInfo", "NeedsExtraSetup", c => c.Boolean());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ClassInfo", "NeedsExtraSetup", c => c.Boolean(nullable: false));
            AlterColumn("dbo.ClassInfo", "NeedsExtraCleanup", c => c.Boolean(nullable: false));
            AlterColumn("dbo.ClassInfo", "IsSelling", c => c.Boolean(nullable: false));
            AlterColumn("dbo.ClassInfo", "IsMultiDay", c => c.Boolean(nullable: false));
            AlterColumn("dbo.ClassInfo", "HasTimePreference", c => c.Boolean(nullable: false));
            AlterColumn("dbo.ClassInfo", "DoVendorTable", c => c.Boolean(nullable: false));
            AlterColumn("dbo.ClassInfo", "DoSpecialSupplies", c => c.Boolean(nullable: false));
        }
    }
}
