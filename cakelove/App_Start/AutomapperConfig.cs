using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using cakelove.Models;

namespace cakelove.App_Start
{
    public class AutomapperConfig
    {
        internal static void CreateMaps()
        {
            Mapper.CreateMap<ContactInfoBindingModel, ContactInfoViewModel>();
            Mapper.CreateMap<AddressBindingModel, AddressViewModel>();
            Mapper.CreateMap<TeachingExperienceBindingModel, TeachingExperienceViewModel>();
        }
    }
}