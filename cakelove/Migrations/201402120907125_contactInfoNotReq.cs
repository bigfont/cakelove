namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class contactInfoNotReq : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ContactInfo", "BusinessName", c => c.String());
            AlterColumn("dbo.ContactInfo", "Website", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ContactInfo", "Website", c => c.String(nullable: false));
            AlterColumn("dbo.ContactInfo", "BusinessName", c => c.String(nullable: false));
        }
    }
}
