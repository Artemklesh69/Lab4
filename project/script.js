const apiKey = '7aa359e4-2c36-48ec-a236-269a1a55886a'
const mainUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru'
const routesUrl = '/api/routes'
const guidesUrl = '/api/routes/'

let curentRout = '';
let curentGit = '';
let costGit = '';



function splitPlaces(text) { 
  // Создаем объект, где будет храниться количество каждого знака препинания
  let countPunctuation = {};

  // Знаки препинания
  let marksPunctuation = ['.', ',', ';', ':', '!', '?', '-', '(', ')', '[', ']', '{', '}', '\"', '\''];

  // Подсчитываем количество каждого знака препинания
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    
    if (marksPunctuation.includes(char)) {
      // Если знак препинания уже есть в объекте, увеличиваем его счетчик
      if (countPunctuation[char]) {
        countPunctuation[char]++;
      } else {  // В противном случае, добавляем его в объект со значением 1
        countPunctuation[char] = 1;
      }
    }
  }

  // Находим знак препинания, количество которого максимально
  let maxNumberCount = 0;
  let mostPunctuationMark;
  for (let punctuationMark in countPunctuation) {
    if (countPunctuation[punctuationMark] > maxNumberCount) {
      maxNumberCount = countPunctuation[punctuationMark];
      mostPunctuationMark = punctuationMark;
    }
  }

  // Разделяем слова по знаку препинания, которого найдено больше всего
  let words = text.split(mostPunctuationMark);

  return words;
}
function routeSearch() { // Поиск по названию маршурута
  const searchInputValue = this.value.toLowerCase();
  const rows = document.querySelectorAll('.tbody tr');  
  let routeExists = false;
  
  rows.forEach(row => {
  const routeName = row.querySelector('td:first-child').textContent.toLowerCase();
  
  

  if (routeName.includes(searchInputValue)) { 
    row.style.display = '';
    routeExists = true;
  } else {
    row.style.display = 'none';
  }
  });
  
  if (!routeExists) {
  const noRouteRow = document.createElement('tr');
  const noRouteCell = document.createElement('td');
  noRouteCell.textContent = 'Данного маршрута нет'; 
  noRouteCell.colSpan = '2';
  noRouteRow.appendChild(noRouteCell);
  document.querySelector('.tbody').appendChild(noRouteRow);
  }
  }
function placesSelect() { // Поиск по достопримечательностям 
  const selectedPlaces = this.value.toLowerCase(); // Получаем выбранную пользователем  
  const rows = document.querySelectorAll('.tbody tr'); 
  
  rows.forEach(row => {
    const routePlaces = row.querySelector('td:nth-child(3)').textContent.toLowerCase(); // Получаем значения из третьего столбца
  
    if (routePlaces.includes(selectedPlaces)) { // Сравниваем 
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function filterButton() {  
  const filterButton = document.createElement('button');
  filterButton.textContent = 'Применить фильтр';
  filterButton.className = 'btn btn-primary';
  filterButton.id = 'searchButton'

  filterButton.addEventListener('click', handleFilters);
  
  const container = document.getElementById('container');
  container.appendChild(filterButton);
  }
  
  function handleFilters() {
    guideExperienceSelect();
   guideLanguageSelect();
  }
function guideLanguageSelect() { // Поиск по языкам 
  const selectedPlaces = this.value.toLowerCase();
  const rows = document.querySelectorAll('.git tr');

  rows.forEach(row => {
    const routePlaces = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

    if (routePlaces.includes(selectedPlaces)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function guideExperienceSelect() { // Опыт гидов 
  const minExperience = document.getElementById('minExperience').value;
  const maxExperience = document.getElementById('maxExperience').value;

  const tableRows = document.querySelectorAll('.git tr'); // Ищем тег с классои гит 
  tableRows.forEach(row => {
    const experience = parseInt(row.querySelector('td:nth-child(4)').textContent);

    if ((minExperience === '' || experience >= parseInt(minExperience)) &&  
        (maxExperience === '' || experience <= parseInt(maxExperience))) {
      row.style.display = ''; 
    } else {
      row.style.display = 'none';
    }
  });
}

function buttonGuideClick(event) { // Выгрузка гидов 
  const routeId = event.target.dataset.routeId;
  const xhr = new XMLHttpRequest();
  const url = new URL(`${mainUrl}${guidesUrl}${routeId}/guides`);
  url.searchParams.append('api_key', apiKey);

  xhr.open('get', url);
  xhr.send();
  xhr.onload = function() {
    const results = JSON.parse(xhr.response);
    const tr = document.querySelector('.git');
    tr.innerHTML = '';
    
    
    curentRout = event.target.closest('tr').querySelector('td:first-child').textContent;// Динамическое появление названия маршурута 
    document.getElementById('routeName').textContent = curentRout; 
    
    
    
    
    for (const res of results) { // Заполняем языками 
      const select = document.querySelector('.form');
      const option = document.createElement('option');
      option.textContent = res.language;
      select.append(option);
      console.log(res.language)
      
        tr.innerHTML += `<tr id = ${res.id} class = "trow">
        
        <td><img src="guide.jpg" alt="картинка" width="75" height="75"></td>
        <td class="namegit">${res.name}</td>
        <td>${res.language}</td>
        <td>${res.workExperience}</td>
        <td class ="costgit">${res.pricePerHour}</td>
        <td><button class="butto" data-gid-id="${res.id}" data-route-name="${routeName}" data-bs-toggle="modal" data-bs-target="#exampleModal">Оформить заявку</button></td>
      </tr>`;
    }
    console.log()
    const selectObject = document.querySelector('.form'); // Селекторы выбор 
    selectObject.addEventListener('change', guideLanguageSelect); //Языки 
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', guideExperienceSelect);// Опыт 
    
    const buttons = document.getElementsByClassName('butto');
    for (const button of buttons) {
      button.addEventListener('click', handleSubmit);  
      
      
    }
  };
  
  
}

function handleSubmit(event) { // Модальное окно 
  const gidId = event.target.dataset.gidId;
  const routeName = event.target.dataset.routeName;
  console.log(routeName);
  
  // Получаем элементы полей ввода модального окна
  curentGit = event.target.closest('.trow').querySelector('.namegit').textContent;
  costGit = event.target.closest('.trow').querySelector('.costgit').textContent;
  const modalRouteNameInput = document.getElementById('modal-route-name'); // Посылаем данные 
  const modalGuideNameInput = document.getElementById('modal-guide-name');
  const tourDateInput = document.getElementById('tour-date'); // Дата введённая пользователем 
  
  
  modalRouteNameInput.value = curentRout; 
  modalGuideNameInput.value = curentGit; 
  
  tourDateInput.addEventListener('change', function() {
    const selectedDate = new Date(tourDateInput.value);
    selectedDate.setHours(0, 0, 0, 0); // Сбросить часы, минуты, секунды и миллисекунды
    const dayOfWeek = selectedDate.getDay();
    
    const selectedTime = selectedDate.getHours(); // Время введенное пользователем 
    
    const selectElement = document.getElementById("tour-duration"); // Длительность поездки  
    const hoursNumber = selectElement.value;
    
    let timeCost = 0;
    if (selectedTime >= 9 && selectedTime < 12) {
      // Утро
      timeCost = 400;
    } else if (selectedTime >= 20 && selectedTime < 23) {
      // День
      timeCost = 1000;
    } else {
      // Остальное
      timeCost = 0;
    }
    let isThisDayOff;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Выходные 
    isThisDayOff = 1.5;
    } else {
    // Будние
    isThisDayOff = 1;
    }
    console.log(selectedDate);
    

    
    
    
    
    console.log(timeCost);
    
    console.log(hoursNumber);
    const numberOfVisitors = '';
    console.log(isThisDayOff);
    const totalPriceInput = document.getElementById('total-cost');
    // Расчет итоговой суммы по формуле
    const totalPrice = costGit * hoursNumber * isThisDayOff + timeCost + numberOfVisitors;
    console.log(costGit * isThisDayOff *hoursNumber);
    
    // Установка итоговой суммы в элемент модального окна

    totalPriceInput.value = totalPrice;

    //const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    //modal.show();
    
  });
    
  
}
 function showNotification() { // Отправление заявки и всплывающее уведомление 
  
  var modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();
  setTimeout(function() {
    location.reload(); 
  }, 2000); 
  var notification = document.getElementById('notification');  
  notification.style.display = 'block';
} 

function getData() { // Выгрузка маршрутов с другого источника 
  const xhr = new XMLHttpRequest();
  const url = new URL(routesUrl, mainUrl);
  url.searchParams.set('api_key', apiKey);
  xhr.open('get', url);
  xhr.send();
  xhr.onload = function() {
    const results = JSON.parse(xhr.response);
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = ''; // Очищаем содержимое
    for (const result of results) { // Убрали ограничение на первые пять маршрутов
      const select = document.querySelector('.form-select'); // Заполняем достопримечательностями 
      for (const elem of splitPlaces(result.mainObject)) {
        const option = document.createElement('option');
        option.textContent = elem;
        select.append(option);
      }
      const tr = document.createElement('tr'); // Выгрузка маршрутов 
      tr.id = result.id;
      tr.innerHTML += `<tr id=${result.id}>
        <td>${result.name}</td>
        <td>${result.description}</td>
        <td>${result.mainObject}</td>
        <td><button class="select-button" data-route-id="${result.id}"> Выбрать </button></td>
      </tr>`;
      tbody.appendChild(tr);
    }
    const buttons = document.getElementsByClassName('select-button'); // Загрузка гидов
    for (const button of buttons) {
      button.addEventListener('click', buttonGuideClick);
    }
  };
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', routeSearch); // Поиск по названиям 
  const selectObject = document.querySelector('.form-select');
  selectObject.addEventListener('change', placesSelect); // Поиск по достопримечательностям 
}



window.addEventListener('load', () => {
  getData();
});




window.addEventListener('DOMContentLoaded', filterButton);
window.addEventListener('DOMContentLoaded', renderPagination);
window.addEventListener('DOMContentLoaded', handleFilters);
