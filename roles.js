// roles.js

$(document).ready(function() {
    let roles = JSON.parse(localStorage.getItem('roles')) || [];

    function renderRoleTable() {
        $('#roleTable').empty();
        roles.forEach((role, index) => {
            $('#roleTable').append(`
                <tr>
                    <td>${role.name}</td>
                    <td class="table-actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteRole(${index})">Sil</button>
                    </td>
                </tr>
            `);
        });
    }

    $('#addRoleForm').submit(function(e) {
        e.preventDefault();
        let newRole = {
            name: $('#roleName').val()
        };
        roles.push(newRole);
        localStorage.setItem('roles', JSON.stringify(roles));
        $('#addRoleModal').modal('hide');
        renderRoleTable();
    });

    window.deleteRole = function(index) {
        roles.splice(index, 1);
        localStorage.setItem('roles', JSON.stringify(roles));
        renderRoleTable();
    }

    renderRoleTable();
});
