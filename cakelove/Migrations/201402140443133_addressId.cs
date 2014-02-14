namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addressId : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ContactInfo", "Address_Id", "dbo.Address");
            DropIndex("dbo.ContactInfo", new[] { "Address_Id" });
            AlterColumn("dbo.ContactInfo", "Address_Id", c => c.Int());
            CreateIndex("dbo.ContactInfo", "Address_Id");
            AddForeignKey("dbo.ContactInfo", "Address_Id", "dbo.Address", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ContactInfo", "Address_Id", "dbo.Address");
            DropIndex("dbo.ContactInfo", new[] { "Address_Id" });
            AlterColumn("dbo.ContactInfo", "Address_Id", c => c.Int(nullable: false));
            CreateIndex("dbo.ContactInfo", "Address_Id");
            AddForeignKey("dbo.ContactInfo", "Address_Id", "dbo.Address", "Id", cascadeDelete: true);
        }
    }
}
