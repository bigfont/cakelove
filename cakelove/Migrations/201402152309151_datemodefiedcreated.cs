namespace cakelove.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class datemodefiedcreated : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Address", "CreatedDate", c => c.DateTime());
            AddColumn("dbo.Address", "LastModifiedDate", c => c.DateTime());
            AddColumn("dbo.Biography", "CreatedDate", c => c.DateTime());
            AddColumn("dbo.Biography", "LastModifiedDate", c => c.DateTime());
            AddColumn("dbo.ClassInfo", "CreatedDate", c => c.DateTime());
            AddColumn("dbo.ClassInfo", "LastModifiedDate", c => c.DateTime());
            AddColumn("dbo.ContactInfo", "CreatedDate", c => c.DateTime());
            AddColumn("dbo.ContactInfo", "LastModifiedDate", c => c.DateTime());
            AddColumn("dbo.TeachingExperience", "CreatedDate", c => c.DateTime());
            AddColumn("dbo.TeachingExperience", "LastModifiedDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.TeachingExperience", "LastModifiedDate");
            DropColumn("dbo.TeachingExperience", "CreatedDate");
            DropColumn("dbo.ContactInfo", "LastModifiedDate");
            DropColumn("dbo.ContactInfo", "CreatedDate");
            DropColumn("dbo.ClassInfo", "LastModifiedDate");
            DropColumn("dbo.ClassInfo", "CreatedDate");
            DropColumn("dbo.Biography", "LastModifiedDate");
            DropColumn("dbo.Biography", "CreatedDate");
            DropColumn("dbo.Address", "LastModifiedDate");
            DropColumn("dbo.Address", "CreatedDate");
        }
    }
}
