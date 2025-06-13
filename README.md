BLOG PROJECT
BlogProject is a full-stack web application built using Node.js, Express, MongoDB, and EJS, designed to offer a simple yet effective blogging platform.

It allows users to create, edit, and view blog posts with support for rich text formatting using the Quill.js editor. Comments can be added to blog posts via modals, and updates are handled dynamically using HTMX, providing a smooth and modern user experience without page reloads.

The project is styled using Bootstrap 5 for responsive design, and custom CSS is applied for branding. The backend leverages Mongoose for MongoDB interaction, and blog images or other files are uploaded using express-fileupload.

Core Functionalities
View Blog Articles
• Lists all published blog posts.
• Each article links to a detailed view page.

 Add New Blog
• Accessible via a form (newpost.ejs)
• Uses Quill editor to enter rich HTML content.
• Tags are added as comma-separated values.

Edit Blog
• Opens a modal with pre-filled data.
• Uses Quill editor again for in-place rich editing.
• Submits changes back to the server.

Post Comments
• Each article has a modal to submit comments.
• Comments are displayed below the blog content.
• Uses HTMX to update the comment list dynamically without refreshing the whole page.

Uploads and Images
• uploads/ folder stores any attached content.
• Static assets like icons are inside public/images


[Blog_Project.pdf](https://github.com/user-attachments/files/20721391/Blog_Project.pdf)
