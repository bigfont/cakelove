USE [cakelove_db]
GO

SELECT UserName, Name
  FROM [dbo].[AspNetUserRoles] ur
  JOIN [dbo].[AspNetUsers] u ON ur.UserId = u.Id
  JOIN [dbo].[AspNetRoles] r ON r.Id = ur.RoleId
  ORDER BY UserName
GO


