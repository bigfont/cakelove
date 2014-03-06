using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace cakelove.Models
{
    public class ApplicantDetailViewModel
    {
        public IEnumerable<ContactInfoViewModel> ContactInfo { get; set; }
        public IEnumerable<TeachingExperienceViewModel> TeachingExperience { get; set; }
        public IEnumerable<BiographyViewModel> Biography { get; set; }
        public IEnumerable<ClassInfoViewModel> ClassInfo { get; set; }
        public string UserName { get; set; }
    }
}