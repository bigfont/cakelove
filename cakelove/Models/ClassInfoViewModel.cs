﻿// Generated by Xamasoft JSON Class Generator
// http://www.xamasoft.com/json-class-generator

using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace cakelove.Models
{

    public class ClassInfoViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("className")]
        public string ClassName { get; set; }

        [JsonProperty("classDescription")]
        public string ClassDescription { get; set; }

        [JsonProperty("classType")]
        public string ClassType { get; set; }

        [JsonProperty("feePerStudent")]
        public int FeePerStudent { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("classSizeMin")]
        public int ClassSizeMin { get; set; }

        [JsonProperty("classSizeMax")]
        public int ClassSizeMax { get; set; }

        [JsonProperty("skillLevel")]
        public string SkillLevel { get; set; }

        [JsonProperty("totalTimeDayOne")]
        public int TotalTimeDayOne { get; set; }

        [JsonProperty("totalTimeDayTwo")]
        public int TotalTimeDayTwo { get; set; }

        [JsonProperty("preferredTimeDayOne")]
        public string PreferredTimeDayOne { get; set; }

        [JsonProperty("preferredTimeDayTwo")]
        public string PreferredTimeDayTwo { get; set; }

        [JsonProperty("extraTimeSetup")]
        public int ExtraTimeSetup { get; set; }

        [JsonProperty("extraTimeCleanup")]
        public int ExtraTimeCleanup { get; set; }

        [JsonProperty("suppliesWillRequireThese")]
        public string SuppliesWillRequireThese { get; set; }

        [JsonProperty("suppliesWillProvideThese")]
        public string SuppliesWillProvideThese { get; set; }

        [JsonProperty("suppliesWillSellThese")]
        public string SuppliesWillSellThese { get; set; }

        [JsonProperty("willNeedThisSpecialEquip")]
        public string WillNeedThisSpecialEquip { get; set; }

        [JsonProperty("vendorTable")]
        public string VendorTable { get; set; }
    }

}