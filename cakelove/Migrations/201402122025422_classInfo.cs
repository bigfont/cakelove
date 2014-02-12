namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class classInfo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ClassInfo",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClassName = c.String(),
                        ClassDescription = c.String(),
                        ClassType = c.String(),
                        FeePerStudent = c.Int(nullable: false),
                        Currency = c.String(),
                        ClassSizeMin = c.Int(nullable: false),
                        ClassSizeMax = c.Int(nullable: false),
                        SkillLevel = c.String(),
                        TotalTimeDayOne = c.Int(nullable: false),
                        TotalTimeDayTwo = c.Int(nullable: false),
                        PreferredTimeDayOne = c.String(),
                        PreferredTimeDayTwo = c.String(),
                        ExtraTimeSetup = c.Int(nullable: false),
                        ExtraTimeCleanup = c.Int(nullable: false),
                        SuppliesWillRequireThese = c.String(),
                        SuppliesWillProvideThese = c.String(),
                        SuppliesWillSellThese = c.String(),
                        WillNeedThisSpecialEquip = c.String(),
                        VendorTable = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ClassInfo");
        }
    }
}
