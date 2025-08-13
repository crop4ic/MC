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
    
    // Имитация данных (в реальном приложении здесь был бы запрос к серверу)
    const sampleBuilds = [
        
    ];
    
    let builds = [...sampleBuilds];
    
    // Обработчик формы загрузки
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const buildName = document.getElementById('buildName').value;
            const version = document.getElementById('version').value;
            const modsCount = document.getElementById('modsCount').value || 0;
            const description = document.getElementById('description').value;
            const fileInput = document.getElementById('buildFile');
            
            // В реальном приложении здесь была бы загрузка файла на сервер
            // Для демонстрации просто добавим сборку в массив
            const newBuild = {
                id: builds.length + 1,
                name: buildName,
                version: version,
                modsCount: parseInt(modsCount),
                description: description,
                uploadDate: new Date().toISOString().split('T')[0],
                file: fileInput.files[0] ? fileInput.files[0].name : "new-build.zip"
            };
            
            builds.unshift(newBuild);
            renderBuilds(builds);
            
            // Очистка формы
            uploadForm.reset();
            
            // Прокрутка к каталогу
            document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
            
            // Показ уведомления
            alert('Сборка успешно загружена!');
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
        let filteredBuilds = [...sampleBuilds];
        
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
                <a href="#" class="download-btn" data-id="${build.id}">Скачать</a>
            `;
            
            buildsContainer.appendChild(buildCard);
        });
        
        // Обработчики для кнопок скачивания
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const buildId = parseInt(this.getAttribute('data-id'));
                const build = builds.find(b => b.id === buildId);
                
                if (build) {
                    // В реальном приложении здесь было бы скачивание файла
                    alert(`Начато скачивание сборки "${build.name}". В реальном приложении файл "${build.file}" был бы загружен.`);
                }
            });
        });
    }
    
    // Первоначальная загрузка сборок
    renderBuilds(builds);
});