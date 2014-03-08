USE [cakelove_db]
GO

SELECT UserName
FROM Address a
JOIN ContactInfo ci on a.Id = ci.Address_Id
JOIN AspNetUsers u on ci.IdentityUser_Id = u.Id
GROUP BY UserName
HAVING Count(*) > 1

