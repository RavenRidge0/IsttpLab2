const uri = 'api/Genres';
let genresList = [];

function getGenres() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayGenres(data))
        .catch(error => console.error('Unable to get genres.', error));
}

function addGenre() {
    const addNameTextbox = document.getElementById('add-name');
    const addDescTextbox = document.getElementById('add-description');

    const genre = {
        name: addNameTextbox.value.trim(),
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
    .then(response => response.json())
    .then(() => {
        getGenres();
        addNameTextbox.value = '';
        addDescTextbox.value = '';
    })
    .catch(error => console.error('Unable to add genre.', error));
}

function deleteGenre(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
    .then(() => getGenres())
    .catch(error => console.error('Unable to delete genre.', error));
}

function displayEditForm(id) {
    const genre = genresList.find(g => g.id === id);
    if (!genre) return;
    
    document.getElementById('edit-id').value = genre.id;
    document.getElementById('edit-name').value = genre.name;
    document.getElementById('edit-description').value = genre.description || '';
    
    document.getElementById('editGenreSection').style.display = 'block';
    // Scroll to edit section smoothly
    document.getElementById('editGenreSection').scrollIntoView({ behavior: 'smooth' });
}

function updateGenre() {
    const genreId = document.getElementById('edit-id').value;
    const genre = {
        id: parseInt(genreId, 10),
        name: document.getElementById('edit-name').value.trim(),
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
    .then(() => getGenres())
    .catch(error => console.error('Unable to update genre.', error));

    closeInput();
    return false;
}

function closeInput() {
    document.getElementById('editGenreSection').style.display = 'none';
}

function _displayGenres(data) {
    const tBody = document.getElementById('genres');
    tBody.innerHTML = '';

    document.getElementById('counter').innerText = `${data.length} жанр(ів)`;

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
        editButton.setAttribute('onclick', `displayEditForm(${genre.id})`);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Видалити';
        deleteButton.className = 'btn btn-danger';
        deleteButton.setAttribute('onclick', `deleteGenre(${genre.id})`);

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        td3.appendChild(actionsDiv);
    });

    genresList = data;
}
