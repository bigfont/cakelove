namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class contactPhone : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ContactInfo", "ContactPhone", c => c.String());
            DropColumn("dbo.ContactInfo", "PhoneDay");
            DropColumn("dbo.ContactInfo", "PhoneCell");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ContactInfo", "PhoneCell", c => c.String());
            AddColumn("dbo.ContactInfo", "PhoneDay", c => c.String());
            DropColumn("dbo.ContactInfo", "ContactPhone");
        }
    }
}
