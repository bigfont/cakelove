select * from (
select u.username, imagerelativepath, c.id, hasImage, lastmodifieddate
from classinfo c
join aspnetusers u on c.identityuser_id = u.id
union
select u.username, imagerelativepath, -1, hasImage, lastmodifieddate
from biography b
join aspnetusers u on b.identityuser_id = u.id) as t
where t.hasImage = 1 
or LEN(t.imagerelativepath) > 0
order by t.username, t.id