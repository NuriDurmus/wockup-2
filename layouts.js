var grid;
let layouts = JSON.parse(localStorage.getItem('layouts')) || [];

document.getElementById('layoutForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Kullanıcıdan layout adı alınır
    const layoutName = document.getElementById('layoutName').value;

    // Yerel depolama için mevcut layout sayısını kontrol et
    let layoutIndex = localStorage.getItem('layoutCount');
    layoutIndex = layoutIndex ? parseInt(layoutIndex) + 1 : 1;
    layouts.push({ name: layoutName, data: [{ h: 2 }] });
    // layoutIndex değerini ve layout adını kaydet

    // Toplam layout sayısını güncelle
    localStorage.setItem('layouts', JSON.stringify(layouts));

    // Kullanıcıya kaydedildiği bilgisi verilebilir
    alert(`Layout saved as "layout_${layoutIndex}"`);

    // Form temizlenir ve modal kapatılır
    document.getElementById('layoutForm').reset();
    $('#layoutModal').modal('hide');
    loadLayout();
    renderLayoutList();
});

$(document).ready(function () {
    if (!layouts || layouts.length == 0) {
        grid = GridStack.init({
            cellHeight: 80,
            verticalMargin: 10,
            float: true,
            resizable: {
                handles: 'e, se, s, sw, w, nw, ne, n'
            },
        }).load([{ h: 2 }]);

        grid.on('added removed change', function (e, items) {
            let str = '';
            items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
            console.log(e.type + ' ' + items.length + ' items:' + str);
        });
        return;
    }
    var selectedLayout = layouts[0];
    selectedLayout.data.forEach((n, i) => {
        n.content = '<button onClick="grid.removeWidget(this.parentNode.parentNode)">X</button><br>';
    });
    grid = GridStack.init({
        cellHeight: 80,
        verticalMargin: 10,
        float: true,
        resizable: {
            handles: 'e, se, s, sw, w, nw, ne, n'
        },
    }).load(selectedLayout.data);

    grid.on('added removed change', function (e, items) {
        let str = '';
        items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
        console.log(e.type + ' ' + items.length + ' items:' + str);
    });
  
    //   let list = [{h:2}];

   
    let count = 0;
    // // GridStack başlatma

  

    // Zone ekleme
    $('#addZoneBtn').click(function () {
        var node = {
            width: 4,
            height: 2,
            content: '<button onClick="grid.removeWidget(this.parentNode.parentNode)">X</button>',
        };
        grid.addWidget(node);
    });

    grid.on('added removed change', function (e, items) {
        let str = '';
        items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
        console.log(e.type + ' ' + items.length + ' items:' + str);
    });


    // Zone olaylarını bağlama
    function bindZoneEvents(el) {
        // Zone silme butonu
        el.find('.delete-btn').on('click', function () {
            if (confirm('Bu zone\'u silmek istediğinize emin misiniz?')) {
                grid.removeWidget(el);
            }
        });

        // Zone içindeki içerik alanını droppable yapma
        el.find('.grid-stack-item-content').droppable({
            accept: '.component-item',
            greedy: true,
            drop: function (event, ui) {
                var componentType = ui.draggable.data('type');
                var compElement = createComponentElement(componentType);
                $(this).append(compElement);
            }
        });
    }

    // Komponent elemanı oluşturma
    function createComponentElement(type) {
        var compContent = getComponentContent(type);
        var compElement = $(`<div class="component-element" data-type="${type}">
                ${compContent}
                <span class="delete-btn">&times;</span>
            </div>`);
        compElement.find('.delete-btn').click(function () {
            compElement.remove();
        });
        return compElement;
    }

    // Komponent içeriği oluşturma
    function getComponentContent(type) {
        switch (type) {
            case 'text':
                return `<p contenteditable="true">Metin Alanı</p>`;
            case 'image':
                return `<img src="https://via.placeholder.com/150" alt="Resim" style="max-width: 100%;">`;
            case 'button':
                return `<button class="btn btn-primary">Buton</button>`;
            default:
                return `<div>${type}</div>`;
        }
    }

    // Sağdaki komponent menüsünü açma/kapatma
    $('#componentMenuToggle button').click(function () {
        $('#componentMenu').toggleClass('open');
    });

    // Komponentleri sürüklenebilir hale getirme
    $('.component-item').draggable({
        helper: 'clone',
        revert: 'invalid',
        appendTo: 'body',
        zIndex: 10000
    });



    // Layout kaydetme
    $('#saveLayoutBtn').click(function () {
        var data = grid.save();
        data.forEach(function (value) { delete value.content })
        var layoutIndex = $(this).data('layoutIndex');
        if (layoutIndex !== undefined) {
            var gridData = grid.save();
            // Zone içindeki komponentleri gridData'ya ekleme
            gridData.forEach(function (node) {
                var zoneContent = node.el.find('.grid-stack-item-content');
                var components = [];
                zoneContent.find('.component-element').each(function () {
                    var compType = $(this).data('type');
                    var content = '';
                    if (compType === 'text') {
                        content = $(this).find('p').html();
                    } else if (compType === 'image') {
                        content = $(this).find('img').attr('src');
                    } else if (compType === 'button') {
                        content = $(this).find('button').text();
                    }
                    components.push({
                        type: compType,
                        content: content
                    });
                });
                node.components = components;
            });
            layouts[layoutIndex].gridData = data;
            localStorage.setItem('layouts', JSON.stringify(layouts));
            alert('Layout kaydedildi.');
        } else {
            alert('Lütfen önce bir layout yükleyin veya oluşturun.');
        }
    });

    // Layout listesi render
    function renderLayoutList() {
        $('#layoutList').empty();
        debugger;
        layouts.forEach((layout, index) => {
            $('#layoutList').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${layout.name}
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="loadLayout(${index})">Yükle</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteLayout(${index})">Sil</button>
                    </div>
                </li>
            `);
        });
    }



    // İlk başta layout listesi render ediliyor
    renderLayoutList();
});

// Mevcut layout'u yükleme
window.loadLayout = function (index) {
    grid.removeAll();
    var layout = layouts[index];
    if (layout.gridData) {
        grid.load(layout.gridData);
        grid.engine.nodes.forEach(function (node) {
            bindZoneEvents(node.el);
            // Zone içindeki komponentleri yeniden oluşturma
            var zoneContent = node.el.find('.grid-stack-item-content');
            // Zone'u droppable yapma
            zoneContent.droppable({
                accept: '.component-item',
                greedy: true,
                drop: function (event, ui) {
                    var componentType = ui.draggable.data('type');
                    var compElement = createComponentElement(componentType);
                    $(this).append(compElement);
                }
            });
        });
    }
    $('#saveLayoutBtn').data('layoutIndex', index);
}
// Layout silme
window.deleteLayout = function (index) {
    if (confirm('Bu layout\'u silmek istediğinize emin misiniz?')) {
        layouts.splice(index, 1);
        localStorage.setItem('layouts', JSON.stringify(layouts));
        renderLayoutList();
        grid.removeAll();
        $('#saveLayoutBtn').removeData('layoutIndex');
    }
}

function addWidget() {
    let n = {
        w: Math.round(1 + 3 * Math.random()),
        h: Math.round(1 + 3 * Math.random()),
        content: '<button onClick="grid.removeWidget(this.parentNode.parentNode)">X</button><br>' ,
      };
      grid.addWidget(n);
};