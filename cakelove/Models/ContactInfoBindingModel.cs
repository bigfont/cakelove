using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;

namespace cakelove.Models
{
    [Table("Address")]
    public class AddressBindingModel
    {
        public int Id { get; set; }

        [JsonProperty("street")]
        public string Street { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("province")]
        public string Province { get; set; }

        [JsonProperty("postalCode")]
        public string PostalCode { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }
    }

    [Table("ContactInfo")]
    public class ContactInfoBindingModel
    {
        public ContactInfoBindingModel()
        {
            Address = new AddressBindingModel();
        }

        public int Id { get; set; }

        [Required]
        [JsonProperty("name")]
        public string Name { get; set; }

        [Required]
        [JsonProperty("address")]
        public AddressBindingModel Address { get; set; }

        [Required]
        public IdentityUser IdentityUser { get; set; }

        [Required]
        [JsonProperty("phoneDay")]
        public string PhoneDay { get; set; }

        [Required]
        [JsonProperty("phoneCell")]
        public string PhoneCell { get; set; }

        [Required]
        [JsonProperty("businessName")]
        public string BusinessName { get; set; }

        [Required]
        [JsonProperty("email")]
        public string Email { get; set; }

        [Required]
        [JsonProperty("website")]
        public string Website { get; set; }
    }
}