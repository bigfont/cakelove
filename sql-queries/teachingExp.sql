
SELECT u.UserName, Len(b.PastConferences) as PastConferencesC, b.*
FROM TeachingExperience b
JOIN AspNetUsers u on b.IdentityUser_Id = u.Id
WHERE IdentityUser_Id IN (
SELECT u.Id
FROM TeachingExperience b
JOIN AspNetUsers u on b.IdentityUser_Id = u.Id
GROUP BY u.Id
HAVING Count(*) > 1)