USE [cakelove_db]
GO

SELECT UserName, *
FROM [dbo].[ClassInfo] ci
JOIN AspNetUsers u ON u.Id = ci.IdentityUser_Id
ORDER BY u.UserName, ClassName
GO


