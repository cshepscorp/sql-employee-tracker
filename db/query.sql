-- display all employee data

SELECT employee.id, employee.first_name, employee.last_name, role.title,  department.name AS department, role.salary, CONCAT_WS(' ',manager.first_name,manager.last_name) AS manager
    FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department.id = role.department_id
LEFT JOIN employee manager ON employee.manager_id = manager.id;

