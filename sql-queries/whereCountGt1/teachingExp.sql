USE [cakelove_db]
GO
 
SELECT UserName, Count(*) as Freq
FROM TeachingExperience te
JOIN AspNetUsers u ON te.IdentityUser_Id = u.Id
GROUP BY UserName
HAVING Count(*) > 1
