# JiraClone-to-doList

Hey Guys!!!!

I have created a Jira web app clone. If you dont know what it is ,it's basically a ticket generation based to -do list.

I have created this project using :-

1)HTML
2)CSS
3)Javascript

Some of the features of this app are:-

1) Creating a editable ticket.
2) Deleting a ticket and storing it in a recycle bin.
3) Assinging a color priority to each ticket.( pink->highest, blue, green, black->lowest );
4) Assinging a unique 6 digit alpha-numeric code to each ticket.
5) A dynamic search bar which can search tickets using either the content of the ticket or the unique id.
6) A dark mode button which when clicked changes the theme of the page.
7) A Sort button which Sorts the tickets in the decreasing order of priority.
8) A Lock button on each ticket which pins the ticket and does not allow user to edit it until it is opened.
9) A recycle Bin which stores deleted tickets. User can either permanently delete them or restore them.
10) The login details are stored in an encrypted manner which was done using CryptoJs library.
11) After a ticket is created you can change its priority by clicking on the priority colors and cycling through.
12) The filter bar on the left Side shows only the tickts of the priority selected. Click the selected priority again to remove the filter. 

13) Finally ,the whole app is encapsulated and cannot be accsed without logging in first.


To create a ticket-----Click on the Plus button and enter the task and select priority and press enter.
To delete a ticket-----Click on the X button and this activates the delete mode (Click on tickets to delete them).To stop the delete mode press on x again.

To restore a ticket------go to recycle bin and simply click on the ticket.
To permanently delete a ticket-----go to recycle bin ,activvate delete state,and click on the ticket.  