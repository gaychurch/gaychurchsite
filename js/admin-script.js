document.addEventListener('DOMContentLoaded', () => {
    const mangaDataUrl = '/data/manga-data.json';

    const mangaForm = document.getElementById('manga-form');
    const chapterForm = document.getElementById('chapter-form');
    const updatedJsonTextarea = document.getElementById('updated-json-data');
    const mangaSelect = document.getElementById('manga-select');

    let currentMangaData = [];

    // 1. Завантаження даних манги при завантаженні сторінки
    function loadMangaData() {
        fetch(mangaDataUrl)
            .then(response => response.json())
            .then(data => {
                currentMangaData = data;
                displayUpdatedJson();
                populateMangaSelectOptions();
            })
            .catch(error => {
                console.error('Error loading manga data:', error);
                updatedJsonTextarea.value = 'Error loading manga data. Check console.';
            });
    }

    // 2. Функція для відображення JSON даних в textarea
    function displayUpdatedJson() {
        const jsonString = JSON.stringify(currentMangaData, null, 2);
        updatedJsonTextarea.value = jsonString;
    }

    // 3. Обробка відправки форми додавання манги
    mangaForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const coverImage = document.getElementById('coverImage').value;
        const synopsis = document.getElementById('synopsis').value;
        const rating = parseFloat(document.getElementById('rating').value);
        const genre = document.getElementById('genre').value.split(',').map(item => item.trim());
        const chapterList = document.getElementById('chapterList').value.split(',').map(item => item.trim());
        const nowReading = document.getElementById('nowReading').checked;
        const featured = document.getElementById('featured').checked;

        const newManga = {
            Title: title,
            Author: author,
            CoverImage: coverImage,
            Synopsis: synopsis,
            Rating: isNaN(rating) ? 0 : rating,
            Genre: genre,
            ChapterList: chapterList,
            NowReading: nowReading,
            Featured: featured
        };

        currentMangaData.push(newManga);
        displayUpdatedJson();
        mangaForm.reset();
        populateMangaSelectOptions();
    });

    // 4. Заповнення select опцій манги для форми додавання розділу
    function populateMangaSelectOptions() {
        mangaSelect.innerHTML = '';
        currentMangaData.forEach((manga, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = manga.Title;
            mangaSelect.appendChild(option);
        });
    }

    // 5. Обробка відправки форми додавання розділу
    chapterForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const mangaIndex = mangaSelect.value;
        const chapterTitle = document.getElementById('chapter-title').value;
        const chapterContentText = document.getElementById('chapter-content').value; // Отримуємо контент розділу з textarea

        if (mangaIndex !== null && chapterTitle) {
            const selectedManga = currentMangaData[mangaIndex];
            if (selectedManga) {
                const newChapter = {
                    title: chapterTitle,
                    content: chapterContentText.trim().split('\n') // Розділяємо контент на масив рядків (для зображень манги або рядків роману)
                };
                selectedManga.ChapterList.push(newChapter); // Додаємо об'єкт розділу до ChapterList
                displayUpdatedJson();
                chapterForm.reset();
            }
        }
    });

    loadMangaData();
});