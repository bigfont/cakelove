﻿// Generated by Xamasoft JSON Class Generator
// http://www.xamasoft.com/json-class-generator

using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace cakelove.Models
{
    [Table("ClassInfo")]
    public class ClassInfoBindingModel : HasAnIdentityUserFk, IEntityBase, IEntityHasImage
    {
        public int Id { get; set; }
        public string ClassName { get; set; }
        public string ClassDescription { get; set; }
        public string ClassType { get; set; }
        public int? FeePerStudent { get; set; }
        public string Currency { get; set; }
        public int? ClassSizeMin { get; set; }
        public int? ClassSizeMax { get; set; }
        public string SkillLevel { get; set; }
        public int? TotalTimeDayOne { get; set; }
        public int? TotalTimeDayTwo { get; set; }
        public string PreferredTimeDayOne { get; set; }
        public string PreferredTimeDayTwo { get; set; }
        public int? ExtraTimeSetup { get; set; }
        public int? ExtraTimeCleanup { get; set; }
        public string SuppliesWillRequireThese { get; set; }
        public string SuppliesWillProvideThese { get; set; }
        public string SuppliesWillSellThese { get; set; }
        public string WillNeedThisSpecialEquip { get; set; }
        public string VendorTable { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public bool? DoSpecialSupplies { get; set; }
        public bool? DoVendorTable { get; set; }
        public bool? HasTimePreference { get; set; }
        public bool? IsMultiDay { get; set; }
        public bool? IsSelling { get; set; }
        public bool? NeedsExtraCleanup { get; set; }
        public bool? NeedsExtraSetup { get; set; }        
        public string SuppliesOption { get; set; } // radio
        public bool? HasImage { get; set; }
        public string ImageRelativePath { get; set; }

    }

}
