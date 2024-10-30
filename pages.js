// pages.js

$(document).ready(function() {
    let pages = JSON.parse(localStorage.getItem('pages')) || [];

    function renderPageList() {
        $('#pageList').empty();
        pages.forEach((page, index) => {
            $('#pageList').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${page.name}
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="editPage(${index})">Düzenle</button>
                        <button class="btn btn-danger btn-sm" onclick="deletePage(${index})">Sil</button>
                    </div>
                </li>
            `);
        });
    }

    $('#addPageForm').submit(function(e) {
        e.preventDefault();
        let newPage = {
            name: `Sayfa ${pages.length + 1}`,
            layout: $('#layoutSelect').val(),
            components: []
        };
        pages.push(newPage);
        localStorage.setItem('pages', JSON.stringify(pages));
        $('#addPageModal').modal('hide');
        renderPageList();
    });

    window.editPage = function(index) {
        // Sayfa düzenleme işlemleri burada yapılacak
        alert('Sayfa düzenleme ekranı açılacak.');
    }

    window.deletePage = function(index) {
        pages.splice(index, 1);
        localStorage.setItem('pages', JSON.stringify(pages));
        renderPageList();
    }

    renderPageList();
});
