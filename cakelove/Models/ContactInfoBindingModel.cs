using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;

namespace cakelove.Models
{
    [Table("Address")]
    public class AddressBindingModel : IBindingModel
    {
        public int Id { get; set; }

        public string Street { get; set; }

        public string City { get; set; }

        public string Province { get; set; }

        public string PostalCode { get; set; }

        public string Country { get; set; }
    }

    [Table("ContactInfo")]
    public class ContactInfoBindingModel : HasAnIdentityUserFk, IBindingModel
    {
        public ContactInfoBindingModel()
        {
            Address = new AddressBindingModel();
        }

        public int Id { get; set; }

        public string Name { get; set; }

        [ForeignKey("Address")]
        [Column("Address_Id")]
        public int AddressId { get; set; }

        public virtual AddressBindingModel Address { get; set; }

        public string PhoneDay { get; set; }

        public string PhoneCell { get; set; }

        public string BusinessName { get; set; }

        public string Email { get; set; }

        public string Website { get; set; }
    }
}