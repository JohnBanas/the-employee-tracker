# Employee-Tracker

## Description

Using the `CLI` with `Node.js`, `MySQL`, `Inquirer.js`, `Express` information is gathered from the person to view various parts of their business. The `Console.table` npm package displays the saved information to you on the `CLI` as well!  

![badge](https://img.shields.io/badge/license-MITLicense-brightorange)

You can access more badges and their purposes at [shields.io](https://shields.io)

## Table_Of_Contents
  * [Installation](#installation)
  * [Usage](#usage)
  * [Questions](#questions)
  * [License](#license)
    
    
## Installation
    
  _Follow these steps to properly install this application:_

  You will need to `npm install` once you have the cloned repo to gain access to `Express`, `Inquirer`, `MySQL2`. Also you will need to have a `MySQL` server on your computer to create the database `Business` and the tables within, `employee`,`roles`, and `department`.  
      
## Usage
  ### Usage_Table_Of_Contents
  * [View Departments](#View_Departments)
  * [View Roles](#View_Roles)
  * [View Employees](#View_Employees)
  * [Add A New Department](#New_Department)
  * [Add A New Role To Department](#New_Role)
  * [Add A New Employee](#New_Employee)
  * [Change A Employee's Role](#Change_Role)
  * [Change A Employee's Manager](#Change_Manager) 
  * [View A Manager's Employees](#View_Employee_By_Manager)
  * [View A Department's Employees](#View_Employee_By_Department)
  * [View A Complete Video Walkthrough](#Video_Walkthrough)

  <p>&nbsp</p>

  _Instructions for use:_ 

  <p>&nbsp</p>


  Once you have cloned the repository, create a `MySQL` server, and run `npm install` in your `CLI`. Afterwards you simply type `node app` in the `CLI` and the application is automated after that for all functionality. If you need to exit, simply select `I am all done for now, thank you.` and the program will terminate. You can also hard quit at any point with ` CTRL+C ` but this will not save any data if you are in the middle of a prompt and is not a recommended method of quitting `CLI`.

  Here is a step by step process with supporting video documentation.

  <p>&nbsp</p>

  ### View_Departments

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  First, enter the command line interface and type `node app`. You can then see a list of options. There is some mock information for employees, departments, and roles already implemented, but feel free to delete any and all information. Even if you don't know how to interact with `MySQL` syntax, that's no problem, as the application code has been set up to allow you to manually delete employees, departments, and roles from the `CLI`. Let's take a look at the first option, `View all the departments in my business.` This will display the department names and their id numbers.

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_one.gif)

  <p>&nbsp</p>

  ### View_Roles

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  You have several functions that can be done from the command line, such as `View all the roles in the departments.` This will display the roles within the different departments as well as the departments themselves. You are also given this role's work id number and a salary for the position.

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_two.gif)

  <p>&nbsp</p>

  ### View_Employees

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  You can choose to `View all my employees.` This will display the current employees' work id number, first name, last name, role within their department, their salary, their department, and their current manager.

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_three.gif)

  <p>&nbsp</p>

  ### New_Department

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  In addition to viewing your created data in the database's tables, you can also manipulate data as well. A good example of this, adding a department by selecting `I would like to add a new department.` In this example we add `Media Marketing` to the department database. After entering the command we are presented the departments and their ids. We see that `Media Marketing` has been added! It has an id of 10 you may have noticed, there is an `AUTO INCREMENT` code in the `/db/schema.sql` that creates unique ids for each row of each table, even if you delete data. Neato!

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_four.gif)

  <p>&nbsp</p>

  ### New_Role

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  Next we will add a new role to our department with `Add a new role please.` In the example we select the new job title of `Head Honcho`. We are then presented the option of setting a annual salary which we set to 45,000 dollars. You are then presented with the id numbers and the department names. Type the id number of the department you would like the role to belong to. We choose id number `10` for `Media Marketing` which we added earlier to the department category. The the `console.table` npm package displays the role's id number, the new role title, the annual salary, and the selected department the role belongs to. Presto, new role-oh!

  _Side note: There are many ways to display data in inquirer, the department could also be selected from a list of choices, which we do with other functions in this application. If you would like to change this function you can do so by taking the same coding methods from the `view employee by` functions. For more information on how to do so please feel free to reach out to me via the [Questions](#questions) section._ 

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_five.gif)

  <p>&nbsp</p>

  ### New_Employee

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  What would a workplace be without the workers? An empty room! That's why we create the ability to add employees to our data base. Once `How about we create a new employee?` option is selected, we are prompted to enter the employee's information. In this example we choose a first name of `Jo` and a last name of `Merriweather`. We then need to give Jo Merriweather a new job title, how about the one we just created? So we select `Head Honcho` from our choices list. (_yet another way to display data in inquirer_) After this we need to give Jo the proper structure and guidance, so let's assign a manager. `Jackie Awesome` is a seasoned veteran with tons of experience with the company so she will be helping him get situated. You could select any of the employees to be the manager though! Also there is a `No Manager` option which will set the value to null. Jo's salary comes with the role selection so he is all set. The `console.table` let's us see that he is in fact added to the employees! 

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_six.gif)

  <p>&nbsp</p>

  ### Change_Role

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  Occasionally people get promotions, or do different jobs entirely, within the same company. Changing an employee's job role within a department or a new department is easy! Simply select `May I change an employee role, please?`. In this example Jo Merriweather is moving out from Head Honcho and starting his new role as a `Gladiator`. Once making a new role selection the employee list is printed to see the changes. Notice that all other fields are unaffected, except salary. Since each role has it's own salary, this change is made automatically! Way to go Jo!

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_seven.gif)

  <p>&nbsp</p>

  ### Change_Manager

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  Jo Merriweather's new role of Gladiator has given the opportunity for him to learn a new skill set, and under new guidance! There are many reasons to change management, but luckily one simple way to change a employee manager in this app! Simply select `Let's update a employee's manager.` In the example we select `Jo Merriweather` as the employee to recieve a new manager, and assign a fellow Joe,  `Joe Actual`. Once again we see from the `console.table` that Jo's new manager is entered into his data. Huzzah!

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_eight.gif)

  <p>&nbsp</p>

  ### View_Employee_By_Manager

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  We have already seen that you can view all employees, but there are other ways to view employees with a bit more specificity. One such is example is viewing all employees under a specific manager. This is accessed through `View employees by their manager.` We selected `Jackie Awesome` who was Jo's old boss, but since he was her only employee, now that we changed his manager, she shows no employees. `Joseph Allstate` however, is Jo's boss `Joe Actual`'s boss! Wowie wow wow, what a world!

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_nine.gif)

  <p>&nbsp</p>

  ### View_Employee_By_Department

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  If you would like to view employees by department that option is avaialable as well. The selection of `View employees by their departments.` will take care of this task nicely. Let's create a scenario, we want to see the employees that work in the `Engineering` but we aren't concerned with their budget at the moment. However we DO want to know the employees AND budget for the `Financial Services` department. Luckily, our application gives us the option to not only see the employees of a department, but to choose whether or not we would like to see the budget as well. Let's take a look at the example video to see this in action.

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_ten.gif)

  <p>&nbsp</p>

  ### Delete_Data

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>

  Things have really been shaking up since Jo has joined the company. The CEO is retiring and diversifying his job to the management team. We no longer need his department so we need to delete it from our system. The `Head Honcho` role has never found a replacement that could fill the shoes of Jo Merriweather, so they are losing the role all together. Jo has done so well, that he is getting ready to start his own company so he will be leaving after working his notice period, we need to delete his employee file from the database as well. In the example video we tackle all these deletions, department, role, and employee by selecting `If you need to delete an employee, a department, or a job title, select this option.`. 

  <p>&nbsp</p>

  _Aside: The example video also shows the command selection `I am all done for now, thank you.` This is the exit from the program as all other selections will bring you back to the main menu unless you hard quit the CLI with `CTRL+C`._

  <p>&nbsp</p>

  ![gif that shows how to use inquirer to access databases via CLI](assets/images/employee_tracker_eleven.gif)
  
  <p>&nbsp</p>

  ### Video_Walkthrough

  <p>&nbsp</p>

  Complete [video walkthrough](https://www.awesomescreenshot.com/video/3622629?key=831b9adf074dc6bb612b8e76a8c2bbba)

  <p>&nbsp</p>

  **Thank you for exploring this application.** 

  <p>&nbsp</p>
  
  **Thank you for your time.** 
  
  <p>&nbsp</p>
  
  **I hope you have a great day.**

  <p>&nbsp</p>

  [Top of Page](#employee-tracker)

  <p>&nbsp</p>

  [Usage Table of Contents](#Usage_Table_Of_Contents)

  <p>&nbsp</p>
      
## Questions
      
  _For further questions:_

  Feel free to reach out via email with any recommendations, or simply to share your experience.

  <p>&nbsp</p>
  
  _Contact Info:_

  GitHub: [JOHNBANAS](https://github.com/JOHNBANAS)

  Email: [jbanas9124@gmail.com](mailto:jbanas9124@gmail.com)

  <p>&nbsp</p>
    
## License

      
  _This application has the MIT license_
      
  For more information please view the [license description](https://choosealicense.com/licenses/mit/).
  
  