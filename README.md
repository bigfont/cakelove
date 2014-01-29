# cakelove

A portal/page/site that potential instructors can go to in order to apply as an instructor at Cake Love.

# Functional Requirements

## Member Registration

- any user can register with their own user ID and password
- registered users become members

## Member to Applicant

- members accept a set of guidelines to becoming applicants
- members are shown guidelines on each login
- applicants are not shown guidelines on each login but can access them for printing

## Applicant Form

- applicants have access to an application form (form) that accepts
    - keyboard input (written information)
    - image uploads
    - video uploads
- the form must pass validation before applicants can sent it
    - required inputs (must haves)
    - standard textutual validation (e.g. email, phone, website, text length, range, numerical)
    - image file size (i.e. 1 MB unzipped, 10 MB zipped)
    - image resolution
    - image aspect-ratio (i.e. 1:1 for profile pictures)
    - image file type (i.e. JPG, JPEG, PNG)
- applicants can "save" the form and later login to create, read, update, delete info
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
- the applicant form page allows lets admin
    - create, read, update, delete info
    - download the form
    - print the form
    - download the images
    - download the video
 
 # Technical Requirements
 
 - 
 - 
 - 
 - 
 




