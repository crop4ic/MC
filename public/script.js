document.addEventListener('DOMContentLoaded', function() {
    // Анимация при запуске
    setTimeout(function() {
        const splashScreen = document.querySelector('.splash-screen');
        splashScreen.style.opacity = '0';
        
        setTimeout(function() {
            splashScreen.style.display = 'none';
            document.querySelector('.container').style.display = 'block';
        }, 500);
    }, 2500);
    
    // Загрузка сборок с сервера
    let builds = [];
    
    function loadBuilds() {
        fetch('/api/builds')
            .then(response => response.json())
            .then(data => {
                builds = data;
                renderBuilds(builds);
            })
            .catch(error => {
                console.error('Ошибка загрузки сборок:', error);
                document.getElementById('buildsContainer').innerHTML = 
                    '<p class="no-builds">Не удалось загрузить сборки. Пожалуйста, попробуйте позже.</p>';
            });
    }
    
    // Обработчик формы загрузки
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('name', document.getElementById('buildName').value);
            formData.append('version', document.getElementById('version').value);
            formData.append('modsCount', document.getElementById('modsCount').value || 0);
            formData.append('description', document.getElementById('description').value);
            formData.append('file', document.getElementById('buildFile').files[0]);
            
            fetch('/api/builds', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                loadBuilds(); // Перезагружаем список сборок
                uploadForm.reset();
                document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
                alert('Сборка успешно загружена!');
            })
            .catch(error => {
                console.error('Ошибка загрузки:', error);
                alert('Произошла ошибка при загрузке сборки');
            });
        });
    }
    
    // Фильтрация и сортировка
    const filterVersion = document.getElementById('filterVersion');
    const sortBy = document.getElementById('sortBy');
    
    if (filterVersion && sortBy) {
        filterVersion.addEventListener('change', applyFilters);
        sortBy.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        let filteredBuilds = [...builds];
        
        // Фильтрация по версии
        const versionFilter = filterVersion.value;
        if (versionFilter) {
            filteredBuilds = filteredBuilds.filter(build => build.version === versionFilter);
        }
        
        // Сортировка
        const sortOption = sortBy.value;
        switch (sortOption) {
            case 'newest':
                filteredBuilds.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
            case 'oldest':
                filteredBuilds.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
                break;
            case 'modsHigh':
                filteredBuilds.sort((a, b) => b.modsCount - a.modsCount);
                break;
            case 'modsLow':
                filteredBuilds.sort((a, b) => a.modsCount - b.modsCount);
                break;
        }
        
        renderBuilds(filteredBuilds);
    }
    
    // Отображение сборок
    function renderBuilds(buildsToRender) {
        const buildsContainer = document.getElementById('buildsContainer');
        
        if (!buildsContainer) return;
        
        if (buildsToRender.length === 0) {
            buildsContainer.innerHTML = '<p class="no-builds">Сборки не найдены. Попробуйте изменить параметры фильтрации.</p>';
            return;
        }
        
        buildsContainer.innerHTML = '';
        
        buildsToRender.forEach(build => {
            const buildCard = document.createElement('div');
            buildCard.className = 'build-card';
            
            buildCard.innerHTML = `
                <h3>${build.name}</h3>
                <div class="build-meta">
                    <span>Версия: ${build.version}</span>
                    ${build.modsCount > 0 ? `<span>Модов: ${build.modsCount}</span>` : ''}
                </div>
                <p class="build-description">${build.description}</p>
                <a href="/api/builds/${build.id}/download" class="download-btn" data-id="${build.id}">Скачать</a>
            `;
            
            buildsContainer.appendChild(buildCard);
        });
    }
    
    // Первоначальная загрузка сборок
    loadBuilds();
});