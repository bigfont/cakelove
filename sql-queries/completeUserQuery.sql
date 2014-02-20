select 
	u.username, 
	ci.name as contact_name, 
	a.street as address_street, 
	b.text as biography_text,
	te.yearsdecorating as teachingexp_years,
	class.classname
from aspnetusers u
full join contactinfo ci on ci.identityuser_id = u.id
full join address a on a.id = ci.address_id
full join biography b on b.identityuser_id = u.id
full join teachingexperience te on te.identityuser_id = u.id
full join classinfo class on class.identityuser_id = u.id
order by username