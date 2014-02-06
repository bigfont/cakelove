namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class contactInfo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Address",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Street = c.String(),
                        City = c.String(),
                        Province = c.String(),
                        PostalCode = c.String(),
                        Country = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ContactInfo",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        PhoneDay = c.String(nullable: false),
                        PhoneCell = c.String(nullable: false),
                        BusinessName = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        Website = c.String(nullable: false),
                        Address_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Address", t => t.Address_Id, cascadeDelete: true)
                .Index(t => t.Address_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ContactInfo", "Address_Id", "dbo.Address");
            DropIndex("dbo.ContactInfo", new[] { "Address_Id" });
            DropTable("dbo.ContactInfo");
            DropTable("dbo.Address");
        }
    }
}
