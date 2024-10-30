// users.js
let users = JSON.parse(localStorage.getItem('users')) || [];
let roles = JSON.parse(localStorage.getItem('roles')) || [];

$(document).ready(function() {
   
    function renderUserTable() {
        $('#userTable').empty();
        users.forEach((user, index) => {
            $('#userTable').append(`
                <tr>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.role}</td>
                    <td class="table-actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">Sil</button>
                    </td>
                </tr>
            `);
        });
    }

    function populateRoles() {
        $('#role').empty();
        roles.forEach(role => {
            $('#role').append(`<option value="${role.name}">${role.name}</option>`);
        });
    }

    $('#addUserForm').submit(function(e) {
        e.preventDefault();
        let newUser = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            role: $('#role').val()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        $('#addUserModal').modal('hide');
        renderUserTable();
    });

    window.deleteUser = function(index) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        renderUserTable();
    }

    populateRoles();
    renderUserTable();
});
