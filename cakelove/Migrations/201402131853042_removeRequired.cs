namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removeRequired : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ContactInfo", "Name", c => c.String());
            AlterColumn("dbo.ContactInfo", "PhoneDay", c => c.String());
            AlterColumn("dbo.ContactInfo", "PhoneCell", c => c.String());
            AlterColumn("dbo.ContactInfo", "Email", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ContactInfo", "Email", c => c.String(nullable: false));
            AlterColumn("dbo.ContactInfo", "PhoneCell", c => c.String(nullable: false));
            AlterColumn("dbo.ContactInfo", "PhoneDay", c => c.String(nullable: false));
            AlterColumn("dbo.ContactInfo", "Name", c => c.String(nullable: false));
        }
    }
}
