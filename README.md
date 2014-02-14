# cakelove

A portal/page/site that potential instructors can go to in order to apply as an instructor at Cake Love.

# Client Steering, 12 Feb 2014

- must have
- [nice to have]
- upload image for biography **Done.**
- upload image for class info **Done.**
- instruct users to make the images 2.5 inches, 75 dpi, 187 px, 1:1 aspect ratio **Done.**
- [validate image dimensions before upload]
- warn users if they are about to lose data (e.g. closing browser, navigating to diff website, logging off)
- add a "save all" button for the classes
- [add a "save all" button for the entire form]
- [complement "save all" with auto-save every 30 seconds or so]
- notify the user on save (e.g. like Google Docs / tick beside tab) **Done.**
- inform the user which classes he/she has saved (e.g. "saved" beside class name in navigation)
- validate only the type not the requirements for save
- validate both the type and the requirements for submit
- requirements include specified inputs **Done.**
- requirements also include the total class hours summing to 20
- unrequire the cell phone **Done.**

# Functional Requirements

## Member Registration

- any user can register with their own user ID and password. **Done.**
- registered users become members.  **Done.**
- registered users can log in and out for the life of the website. **Done.**

## Member to Applicant

- members accept a set of guidelines to become applicants. **Done**
- members are shown guidelines on each login.  **Done.**
- applicants are not shown guidelines on each login. **Done**
- but applicants *can* access the guidelines for printing. **Done**

## Applicant Form

- applicants have access to an application form (form) that accepts
    - keyboard input (written information) **Done**
    - image uploads **Done.**
    - video uploads
- the form must pass validation before applicants can submit it
    - required inputs (must haves) **Done.**
    - standard textual validation (e.g. email, phone, website, text length, range, numerical)
    - image file size (i.e. 1 MB unzipped, 10 MB zipped)
    - image resolution
    - image aspect-ratio (i.e. 1:1 for profile pictures)
    - image file type (i.e. JPG, JPEG, PNG)
- applicants can "save" the form. **Done.**
- applicants can later login to create, read, update, delete info. **Done.**
- applicants can "send" the form
    - this sends a notification email to the admin
    - afterward applicants can only login to read info

## Admin Dashboard

- assigned users can login as admin
- admin has access to an online dashboard
- the online dashboard is a list with headers
    - username
    - form status (in progress | completed)
- clicking a applicant name opens his/her form page
- the applicant form page lets admin
    - create, read, update, delete info
    - download the form
    - print the form
    - download the images
    - download the video

# Technical Requirements

- Use ASP.NET Entity Framework with code first migrations
- Use Windows Sql Azure for data storage


