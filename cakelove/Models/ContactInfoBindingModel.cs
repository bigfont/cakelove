using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System;

namespace cakelove.Models
{
    [Table("Address")]
    public class AddressBindingModel : IEntityBase
    {
        public int Id { get; set; }

        public string Street { get; set; }

        public string City { get; set; }

        public string Province { get; set; }

        public string PostalCode { get; set; }

        public string Country { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }

    [Table("ContactInfo")]
    public class ContactInfoBindingModel : HasAnIdentityUserFk, IEntityBase
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }

        public virtual AddressBindingModel Address { get; set; }

        public string ContactPhone { get; set; }

        public string BusinessName { get; set; }

        public string Email { get; set; }

        public string Website { get; set; }
    }
}