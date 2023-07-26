const dom = {
  selectbox: document.getElementById("selectbox"),
  selectboxList: document.querySelector(".selectbox__list"),
  rooms: document.getElementById("rooms"),
  settings: document.getElementById("settings"),
  settingsTabs: document.getElementById("settings__tabs"),
  settingsPanels: document.getElementById("settings__panel"),
  temperatureLine: document.getElementById("temperature-line"),
  temperatureRound: document.getElementById("temperature-round"),
  temperature: document.getElementById("temperature"),
  temperatureBtn: document.getElementById("temperature-btn"),
  temperatureSaveBtn: document.getElementById("save-temperature"),
  temperaturePowerBtn: document.getElementById("power"),
  sliders: {
    lights: document.getElementById("lights-slider"),
    humidity: document.getElementById("humidity-slider"),
  },
  switch: {
    lights: document.getElementById("lights-power"),
    humidity: document.getElementById("humidity-power"),
  },
};
const rooms = {
  all: "Все комнаты",
  livingroom: "Зал",
  bedroom: "Спальня",
  kitchen: "Кухня",
  bathroom: "Ванная",
  studio: "Кабинет",
  washingroom: "Уборная",
};
let activeRoom = "all";
let activeTab = "temperature";
const roomsData = {
  livingroom: {
    temperature: 22,
    temperatureOff: false,
    lights: 0,
    lightsOff: false,
    humidity: 40,
    humidityOff: false,
  },
  bedroom: {
    temperature: 22,
    temperatureOff: false,
    lights: 0,
    lightsOff: false,
    humidity: 40,
    humidityOff: false,
  },
  kitchen: {
    temperature: 22,
    temperatureOff: false,
    lights: 0,
    lightsOff: false,
    humidity: 40,
    humidityOff: false,
  },
  bathroom: {
    temperature: 22,
    temperatureOff: false,
    lights: 0,
    lightsOff: false,
    humidity: 40,
    humidityOff: false,
  },
  studio: {
    temperature: 22,
    temperatureOff: false,
    lights: 0,
    lightsOff: false,
    humidity: 40,
    humidityOff: false,
  },
  washingroom: {
    temperature: 22,
    temperatureOff: false,
    lights: 0,
    lightsOff: false,
    humidity: 40,
    humidityOff: false,
  },
};

//ВЫПАДАЮЩИЙ СПИСОК
dom.selectbox.querySelector(".selectbox__selected").onclick = (event) => {
  // toggle убирает класс, если он есть и добавляет, если его нет
  dom.selectbox.classList.toggle("open");
};

// закрытие списка при клике в другой области
document.body.onclick = (event) => {
  // === const target = event.target
  const { target } = event;
  if (
    !target.matches(".selectbox") &&
    !target.parentElement.matches(".selectbox") &&
    !target.parentElement.parentElement.matches(".selectbox")
  ) {
    dom.selectbox.classList.remove("open");
  }
};

dom.selectboxList.onclick = (event) => {
  const { target } = event;
  if (target.matches(".selectbox__item")) {
    const { room } = target.dataset;
    const selectedItem = dom.selectboxList.querySelector(".selected");
    selectedItem.classList.remove("selected");
    target.classList.add("selected");
    dom.selectbox.classList.remove("open");
    console.log(room);
    selectRoom(room);
  }
};

// ВЫБОР КОМНАТЫ
function selectRoom(room) {
  const selectedRoom = dom.rooms.querySelector(".selected");

  if (selectedRoom) {
    selectedRoom.classList.remove("selected");
  }
  if (room !== "all") {
    const newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`);
    const { temperature, lights, humidity, lightsOff, humidityOff } =
      roomsData[room];
    activeRoom = room;
    newSelectedRoom.classList.add("selected");
    renderScreen(false);
    dom.temperature.innerText = temperature;
    renderTemperature(temperature);
    setTemperaturePower();
    changeSettingsTab(activeTab);
    changeSlider(lights, dom.sliders.lights);
    changeSlider(humidity, dom.sliders.humidity);
    changeSwitch("lights", lightsOff);
    changeSwitch("humidity", humidityOff);
  } else {
    renderScreen(true);
  }
  const selectedSelectBox = dom.selectbox.querySelector(
    ".selectbox__item.selected"
  );
  selectedSelectBox.classList.remove("selected");
  const newSelectedItem = dom.selectbox.querySelector(`[data-room=${room}]`);
  newSelectedItem.classList.add("selected");
  const selectboxSelected = dom.selectbox.querySelector(
    ".selectbox__selected span"
  );
  selectboxSelected.innerText = rooms[room];
}

//КЛИК ПО ЭЛЕМЕНТУ КОМНАТЫ
dom.rooms.querySelectorAll(".room").forEach((room) => {
  room.onclick = (event) => {
    const roomValue = room.dataset.room;
    selectRoom(roomValue);
  };
});

// ОТОБРАЖЕНИЕ НУЖНОГО ЭКРАНА
function renderScreen(isRooms) {
  console.log(isRooms);
  setTimeout(() => {
    if (isRooms) {
      dom.rooms.style.display = "grid";
      dom.settings.style.display = "none";
    } else {
      dom.rooms.style.display = "none";
      dom.settings.style.display = "block";
    }
  }, 300);
}

// === ПАНЕЛЬ НАСТРОЕК КОМНАТЫ ===
// Отрисовка изменения температуры
function renderTemperature(temperature) {
  const min = 16;
  const max = 40;
  const percent = (max - min) / 100;
  const lineMin = 54;
  const lineMax = 276;
  const linePercent = (lineMax - lineMin) / 100;
  const roundMin = -240;
  const roundMax = 48;
  const roundPercent = (roundMax - roundMin) / 100;

  if (temperature >= min && temperature <= max) {
    const finishPercent = Math.round((temperature - min) / percent);
    const lineFinishPercent = lineMin + linePercent * finishPercent;
    const roundFinishPercent = roundMin + roundPercent * finishPercent;
    console.log(lineFinishPercent, roundFinishPercent);
    dom.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
    dom.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg)`;
    dom.temperature.innerText = temperature;
  }
}

// Изменение температуры
function changeTemperature() {
  let mouseOver = false;
  let mouseDown = false;
  let position = 0;
  let range = 0;
  let change = 0;

  dom.temperatureBtn.onmouseover = () => {
    mouseOver = true;
    mouseDown = false;
  };
  dom.temperatureBtn.onmouseout = () => (mouseOver = false);
  dom.temperatureBtn.onmouseup = () => (mouseOver = false);
  dom.temperatureBtn.onmousedown = (e) => {
    mouseDown = true;
    position = e.offsetY;
    range = 0;
  };
  dom.temperatureBtn.onmousemove = (e) => {
    if (mouseOver && mouseDown) {
      range = e.offsetY - position;
      const newChange = Math.round(range / -10);
      if (newChange !== change) {
        let temperature = +dom.temperature.innerText;
        if (newChange < change) {
          temperature -= 1;
        } else {
          temperature += 1;
        }
        change = newChange;

        renderTemperature(temperature);
      }
    }
  };
}

changeTemperature();

//Сохранение температуры
dom.temperatureSaveBtn.onclick = () => {
  //"+" - преобразует строку в число
  const temperature = +dom.temperature.innerText;
  roomsData[activeRoom].temperature = temperature;
};

//отключение обогрева
dom.temperaturePowerBtn.onclick = () => {
  const power = dom.temperaturePowerBtn;
  power.classList.toggle("off");

  if (power.matches(".off")) {
    roomsData[activeRoom].temperatureOff = true;
  } else {
    roomsData[activeRoom].temperatureOff = false;
  }
};
//установка значения кнопки включения температуры
function setTemperaturePower() {
  if (roomsData[activeRoom].temperatureOff) {
    dom.temperaturePowerBtn.classList.add("off");
  } else {
    dom.temperaturePowerBtn.classList.remove("off");
  }
}

// ПЕРЕКЛЮЧЕНИЕ НАСТРОЕК
dom.settingsTabs.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    const optionType = tab.dataset.type;
    activeTab = optionType;
    changeSettingsTab(optionType);
  };
});

function changeSettingsTab(type) {
  const tabSelected = dom.settingsTabs.querySelector(".tab.selected");
  const panelSelected = dom.settingsPanels.querySelector(".selected");
  const tab = dom.settingsTabs.querySelector(`[data-type=${type}]`);
  const panel = dom.settingsPanels.querySelector(`[data-type=${type}]`);
  tabSelected.classList.remove("selected");
  panelSelected.classList.remove("selected");
  tab.classList.add("selected");
  panel.classList.add("selected");
}

// ФУНКЦИЯ ИЗМЕНЕНИЯ СЛАЙДЕРА
function changeSlider(percent, slider) {
  if (percent >= 0 && percent <= 100) {
    const { type } = slider.parentElement.parentElement.dataset;
    slider.querySelector("span").innerText = percent;
    slider.style.height = `${percent}%`;
    roomsData[activeRoom][type] = percent;
  }
}

//отслеживание изменения слайдера
function watchSlider(slider) {
  let mouseOver = false;
  let mouseDown = false;
  let position = 0;
  let range = 0;
  let change = 0;
  let parent = slider.parentElement;

  parent.onmouseover = () => {
    mouseOver = true;
    mouseDown = false;
  };
  parent.onmouseout = () => (mouseOver = false);
  parent.onmouseup = () => (mouseOver = false);
  parent.onmousedown = (e) => {
    mouseDown = true;
    position = e.offsetY;
    range = 0;
  };
  parent.onmousemove = (e) => {
    if (mouseOver && mouseDown) {
      range = e.offsetY - position;
      const newChange = Math.round(range / -0.1);
      if (newChange !== change) {
        let percent = +slider.querySelector("span").innerText;
        if (newChange < change) {
          percent -= 1;
        } else {
          percent += 1;
        }
        change = newChange;

        changeSlider(percent, slider);
      }
    }
  };
}

watchSlider(dom.sliders.lights);
watchSlider(dom.sliders.humidity);

function changeSwitch(activeTab, isOff) {
  if (isOff) {
    dom.switch[activeTab].classList.add("off");
  } else {
    dom.switch[activeTab].classList.remove("off");
  }
  roomsData[activeRoom][`${activeTab}Off`] = isOff;
  console.log(activeTab);
}

dom.switch.lights.onclick = () => {
  const isOff = !dom.switch.lights.matches(".off");
  changeSwitch(activeTab, isOff);
};
dom.switch.humidity.onclick = () => {
  const isOff = !dom.switch.humidity.matches(".off");
  changeSwitch(activeTab, isOff);
};
