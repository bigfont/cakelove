USE [cakelove_db]
GO
 
SELECT UserName, Count(*) as Freq
FROM Biography b
JOIN AspNetUsers u ON b.IdentityUser_Id = u.Id
GROUP BY UserName
HAVING Count(*) > 1
