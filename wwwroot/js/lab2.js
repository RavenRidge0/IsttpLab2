const uri = 'api/Genres';
let genresList = [];

function showToast(message, type = 'success') {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


function getGenres() {
    fetch(uri)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(data => _displayGenres(data))
        .catch(error => {
            console.error('Unable to get genres.', error);
            showToast('Не вдалося завантажити жанри. Перевірте підключення до API.', 'error');
        });
}

function addGenre() {
    const addNameTextbox = document.getElementById('add-name');
    const addDescTextbox = document.getElementById('add-description');

    const name = addNameTextbox.value.trim();
    if (!name) {
        showToast('Назва жанру не може бути порожньою!', 'error');
        return;
    }

    const genre = {
        name: name,
        description: addDescTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(genre)
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response.json();
    })
    .then(() => {
        getGenres();
        addNameTextbox.value = '';
        addDescTextbox.value = '';
        showToast(`Жанр "${name}" успішно додано!`);
    })
    .catch(error => {
        console.error('Unable to add genre.', error);
        showToast('Помилка при додаванні жанру.', 'error');
    });
}

function deleteGenre(id) {
    const genre = genresList.find(g => g.id === id);
    const name = genre ? genre.name : `#${id}`;

    if (!confirm(`Ви впевнені, що хочете видалити жанр "${name}"?`)) return;

    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        getGenres();
        showToast(`Жанр "${name}" успішно видалено!`);
    })
    .catch(error => {
        console.error('Unable to delete genre.', error);
        showToast('Помилка при видаленні жанру.', 'error');
    });
}

function displayEditForm(id) {
    const genre = genresList.find(g => g.id === id);
    if (!genre) return;

    document.getElementById('edit-id').value = genre.id;
    document.getElementById('edit-name').value = genre.name;
    document.getElementById('edit-description').value = genre.description || '';

    document.getElementById('editGenreSection').style.display = 'block';
    document.getElementById('editGenreSection').scrollIntoView({ behavior: 'smooth' });
}

function updateGenre() {
    const genreId = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();

    if (!name) {
        showToast('Назва жанру не може бути порожньою!', 'error');
        return;
    }

    const genre = {
        id: parseInt(genreId, 10),
        name: name,
        description: document.getElementById('edit-description').value.trim()
    };

    fetch(`${uri}/${genreId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(genre)
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        // ВИПРАВЛЕННЯ: закриваємо форму лише ПІСЛЯ успішного запиту
        closeInput();
        getGenres();
        showToast(`Жанр "${name}" успішно оновлено!`);
    })
    .catch(error => {
        console.error('Unable to update genre.', error);
        showToast('Помилка при оновленні жанру.', 'error');
    });
}

function closeInput() {
    document.getElementById('editGenreSection').style.display = 'none';
}


let isSortedAsc = false;

function searchGenres() {
    const searchText = document.getElementById('search-box').value.toLowerCase();
    const filteredData = genresList.filter(g => 
        g.name.toLowerCase().includes(searchText) || 
        (g.description && g.description.toLowerCase().includes(searchText))
    );
    _renderTable(filteredData);
}

function sortGenres() {
    isSortedAsc = !isSortedAsc;
    const sortedData = [...genresList].sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return isSortedAsc ? -1 : 1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return isSortedAsc ? 1 : -1;
        return 0;
    });
    _renderTable(sortedData);
    
    event.target.innerText = isSortedAsc ? "Сортувати Z-A" : "Сортувати A-Z";
}


function _displayGenres(data) {
    genresList = data;
    _renderTable(data);
}

function _renderTable(data) {
    const tBody = document.getElementById('genres');
    tBody.innerHTML = '';

    document.getElementById('counter').innerText = `${data.length} жанр(ів)`;

    if (data.length === 0) {
        const tr = tBody.insertRow();
        const td = tr.insertCell(0);
        td.colSpan = 3;
        td.className = 'empty-state';
        td.innerText = 'Не знайдено жодного жанру.';
        return;
    }

    data.forEach(genre => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNodeName = document.createTextNode(genre.name);
        td1.appendChild(textNodeName);

        let td2 = tr.insertCell(1);
        let textNodeDesc = document.createTextNode(genre.description || '-');
        td2.appendChild(textNodeDesc);

        let td3 = tr.insertCell(2);
        td3.className = 'actions-col';

        let actionsDiv = document.createElement('div');
        actionsDiv.className = 'action-buttons';

        let editButton = document.createElement('button');
        editButton.innerText = 'Редагувати';
        editButton.className = 'btn btn-edit';
        editButton.onclick = () => displayEditForm(genre.id);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Видалити';
        deleteButton.className = 'btn btn-danger';
        deleteButton.onclick = () => deleteGenre(genre.id);

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        td3.appendChild(actionsDiv);
    });
}
