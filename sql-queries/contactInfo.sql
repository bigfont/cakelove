USE [cakelove_db]
GO
 
SELECT u.UserName, ci.*, a.*
FROM ContactInfo ci
JOIN Address a ON a.Id = ci.Address_Id
JOIN AspNetUsers u ON ci.IdentityUser_Id = u.Id

