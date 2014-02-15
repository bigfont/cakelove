namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class checkboxes : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ClassInfo", "DoSpecialSupplies", c => c.Boolean(nullable: false));
            AddColumn("dbo.ClassInfo", "DoVendorTable", c => c.Boolean(nullable: false));
            AddColumn("dbo.ClassInfo", "HasTimePreference", c => c.Boolean(nullable: false));
            AddColumn("dbo.ClassInfo", "IsMultiDay", c => c.Boolean(nullable: false));
            AddColumn("dbo.ClassInfo", "IsSelling", c => c.Boolean(nullable: false));
            AddColumn("dbo.ClassInfo", "NeedsExtraCleanup", c => c.Boolean(nullable: false));
            AddColumn("dbo.ClassInfo", "NeedsExtraSetup", c => c.Boolean(nullable: false));
            AddColumn("dbo.ClassInfo", "SuppliesOption", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ClassInfo", "SuppliesOption");
            DropColumn("dbo.ClassInfo", "NeedsExtraSetup");
            DropColumn("dbo.ClassInfo", "NeedsExtraCleanup");
            DropColumn("dbo.ClassInfo", "IsSelling");
            DropColumn("dbo.ClassInfo", "IsMultiDay");
            DropColumn("dbo.ClassInfo", "HasTimePreference");
            DropColumn("dbo.ClassInfo", "DoVendorTable");
            DropColumn("dbo.ClassInfo", "DoSpecialSupplies");
        }
    }
}
