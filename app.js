document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:8080/users";

    // Function to fetch and display users
    function getUsers() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => populateUserTable(data))
            .catch(error => console.error("Error fetching users:", error));
    }

    // Function to populate the table with user data
    function populateUserTable(users) {
        const userTableBody = document.querySelector("#userTable tbody");
        userTableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.joinDate}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;

            userTableBody.appendChild(row);
        });
    }

    // Handle form submission for creating a user
    const createUserForm = document.getElementById("createUserForm");
    createUserForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const joinDate = document.getElementById("joinDate").value;

        const user = { username, email, joinDate };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.ok) {
                    getUsers();  
                    createUserForm.reset();
                } else {
                    alert("Error creating user");
                }
            })
            .catch(error => console.error("Error creating user:", error));
    });

    // Handle form submission for updating a user
    const updateUserForm = document.getElementById("updateUserForm");
    updateUserForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = document.getElementById("updateUserId").value;
        const username = document.getElementById("updateUsername").value;
        const email = document.getElementById("updateEmail").value;
        const joinDate = document.getElementById("updateJoinDate").value;

        const user = { username, email, joinDate };

        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.ok) {
                    getUsers();  
                    document.getElementById("updateUserSection").style.display = "none";
                    updateUserForm.reset();
                } else {
                    alert("Error updating user");
                }
            })
            .catch(error => console.error("Error updating user:", error));
    });

    // Handle user deletion
    window.deleteUser = function (id) {
        fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    getUsers();  
                } else {
                    alert("Error deleting user");
                }
            })
            .catch(error => console.error("Error deleting user:", error));
    };

    // Populate the update form with user data
    window.editUser = function (id) {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById("updateUserId").value = user.id;
                document.getElementById("updateUsername").value = user.username;
                document.getElementById("updateEmail").value = user.email;
                document.getElementById("updateJoinDate").value = user.joinDate;
                document.getElementById("updateUserSection").style.display = "block";
            })
            .catch(error => console.error("Error fetching user:", error));
    };

    // Initial call to populate the user table
    getUsers();
});
