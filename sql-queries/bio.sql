
SELECT Len(Text), *
FROM Biography 
WHERE IdentityUser_Id IN (
SELECT u.Id
FROM Biography b
JOIN AspNetUsers u on b.IdentityUser_Id = u.Id
GROUP BY u.Id
HAVING Count(*) > 1)