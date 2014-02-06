using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

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
        public int Id { get; set; }
        public ContactInfoBindingModel()
        {
            Address = new AddressBindingModel();
        }

        [Required]
        [JsonProperty("name")]
        public string Name { get; set; }
        [Required]

        [JsonProperty("address")]
        public AddressBindingModel Address { get; set; }
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
