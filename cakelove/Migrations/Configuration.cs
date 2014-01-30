namespace cakelove.Migrations
{
    using System.Data.Entity.Migrations;


    internal sealed class Configuration : DbMigrationsConfiguration<cakelove.Models.MyDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;            
        }

        protected override void Seed(cakelove.Models.MyDbContext context)
        {
            
        }
    }
}

