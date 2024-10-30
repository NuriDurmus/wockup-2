// index.js

$(document).ready(function() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let roles = JSON.parse(localStorage.getItem('roles')) || [];

    function renderUserList() {
        $('#userList').empty();
        users.forEach((user, index) => {
            $('#userList').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${user.firstName} ${user.lastName} - ${user.role}
                    <button class="btn btn-primary btn-sm" onclick="goToFirstPage(${index})">Seç</button>
                </li>
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
        renderUserList();
    });

    window.goToFirstPage = function(index) {
        localStorage.setItem('currentUser', JSON.stringify(users[index]));
        window.location.href = 'pages.html';
    }

    populateRoles();
    renderUserList();
});
