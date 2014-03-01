
select DateDiff(day, [LastModifiedDate], GetDate()) as daysSince, u.username
from [dbo].[Biography] main
join aspnetusers u on u.id = main.identityuser_id
where [LastModifiedDate] is not null
order by daysSince

select DateDiff(day, [LastModifiedDate], GetDate()) as daysSince, u.username
from [dbo].[ClassInfo]  main
join aspnetusers u on u.id = main.identityuser_id
where [LastModifiedDate] is not null
order by daysSince

select DateDiff(day, [LastModifiedDate], GetDate()) as daysSince, u.username
from [dbo].[ContactInfo] main
join aspnetusers u on u.id = main.identityuser_id
where [LastModifiedDate] is not null
order by daysSince

select DateDiff(day, [LastModifiedDate], GetDate()) as daysSince, u.username
from [dbo].[TeachingExperience] main
join aspnetusers u on u.id = main.identityuser_id
where [LastModifiedDate] is not null
order by daysSince

select DateDiff(day, [LastModifiedDate], GetDate()) as daysSince, u.username
from applicationStatus main
join aspnetusers u on u.id = main.identityuser_id
where [LastModifiedDate] is not null
order by daysSince