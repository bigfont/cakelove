USE [cakelove_db]
GO
 
SELECT UserName, Count(*) as Freq
FROM ContactInfo ci
JOIN AspNetUsers u ON ci.IdentityUser_Id = u.Id
GROUP BY UserName
HAVING Count(*) > 1

