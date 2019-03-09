'use strict'
const selectPlane = document.getElementById('acSelect'),
      showSeatMapBtn = document.getElementById('btnSeatMap'),
      setFullBtn = document.getElementById('btnSetFull'),
      setEmptyBtn = document.getElementById('btnSetEmpty'),
      title = document.getElementById('seatMapTitle'),
      seatMap = document.getElementById('seatMapDiv'),
      totalPax = document.getElementById('totalPax'),
      totalAdult = document.getElementById('totalAdult'),
      totalHalf = document.getElementById('totalHalf');

setFullBtn.setAttribute('disabled', 'disabled');
setEmptyBtn.setAttribute('disabled', 'disabled');
      
showSeatMapBtn.addEventListener('click', (event) => {
  event.preventDefault();
  totalPax.textContent = 0;
  totalAdult.textContent = 0;
  totalHalf.textContent = 0;
  
  fetch(`https://neto-api.herokuapp.com/plane/${selectPlane.value}`)
    .then(res => res.json())
    .then(createMap)
    .then(() => {
      const seats = document.querySelectorAll('.seat');
      Array.from(seats).forEach(seat => seat.addEventListener('click', selectSeat));
      setFullBtn.addEventListener('click', setFull);
      setEmptyBtn.addEventListener('click', setEmpty);
    });
});

function setFull(event) {
  event.preventDefault();
  const seats = document.querySelectorAll('.seat');
  totalPax.textContent = seats.length;
  totalAdult.textContent = seats.length;
  totalHalf.textContent = seats.length;
  
  Array.from(seats).forEach(seat => {
    if (event.altKey) {
      seat.classList.remove('adult');
      seat.classList.add('half');
      totalAdult.textContent = 0;
      totalHalf.textContent = seats.length;
    } else {
      seat.classList.remove('half');
      seat.classList.add('adult');
      totalAdult.textContent = seats.length;
      totalHalf.textContent = 0;
    }; 
  });
};

function setEmpty(event) {
  event.preventDefault();
  totalPax.textContent = 0;
  totalAdult.textContent = 0;
  totalHalf.textContent = 0;
  const seats = document.querySelectorAll('.seat');
  Array.from(seats).forEach(seat => {
    seat.classList.remove('adult');
    seat.classList.remove('half');
  });
};

function selectSeat(event) {
  if (event.altKey) {
    if (event.currentTarget.classList.contains('adult')) {
      event.currentTarget.classList.remove('adult');
      totalAdult.textContent = +totalAdult.textContent - 1;
      totalPax.textContent = +totalPax.textContent - 1;
    };
    
    if (event.currentTarget.classList.contains('half')) {
      event.currentTarget.classList.remove('half');
      totalPax.textContent = +totalPax.textContent - 1;
      totalHalf.textContent = +totalHalf.textContent - 1;
    } else {
      event.currentTarget.classList.add('half');
      totalPax.textContent = +totalPax.textContent + 1;
      totalHalf.textContent = +totalHalf.textContent + 1;
    };  
  } else {
    if (event.currentTarget.classList.contains('half')) {
      event.currentTarget.classList.remove('half');
      totalHalf.textContent = +totalHalf.textContent - 1;
      totalPax.textContent = +totalPax.textContent - 1;
    };
    
    if (event.currentTarget.classList.contains('adult')) {
      event.currentTarget.classList.remove('adult');
      totalPax.textContent = +totalPax.textContent - 1;
      totalAdult.textContent = +totalAdult.textContent - 1;
    } else {
      event.currentTarget.classList.add('adult');
      totalPax.textContent = +totalPax.textContent + 1;
      totalAdult.textContent = +totalAdult.textContent + 1;
    }; 
  };
};

function createMap(data) {
  Array.from(seatMap.children).forEach(child => seatMap.removeChild(child))

  title.textContent = `${data.title} (${data.passengers} пассажиров)`;
  data.scheme.forEach((seatsInRow, rowIndex) => {
    const row = el('div', {class: 'row seating-row text-center'}, [
      el('div', {class: 'col-xs-1 row-number'}, [
        el('h2', {class: ''}, (rowIndex + 1).toString())
      ])
    ]);
    
    for (let i = 0; i < 2; i++){
      const side = el('div', {class: 'col-xs-5'}, [])
      for (let j = 0; j < 3; j++) {
        let seat;
        // Если в ряду нет мест или в ряду 4 места и это место первое или последнее (A или F)
        if (seatsInRow === 0 || (seatsInRow === 4 && ((i === 0 && j === 0) || (i === 1 && j === 2)))) {
          seat = el('div', {class: 'col-xs-4 no-seat'}, [])
          side.appendChild(seat)
        } else {
          if (i === 0) {
            seat = el('div', {class: 'col-xs-4 seat'}, [
              el('span', {class: 'seat-label'}, data.letters6[j])
            ])
          } else {
            seat = el('div', {class: 'col-xs-4 seat'}, [
              el('span', {class: 'seat-label'}, data.letters6[3 + j])
            ]);
          }
          side.appendChild(seat);
        };
      };
      row.appendChild(side);
    }
    seatMap.appendChild(row);
  });
  
  setFullBtn.removeAttribute('disabled');
  setEmptyBtn.removeAttribute('disabled');
};

function el(tagName, attributes, children) {
  const element = document.createElement(tagName);
  
  if (typeof attributes === 'object') {
    Object.keys(attributes).forEach(i => element.setAttribute(i, attributes[i]));
  };
  
  if (typeof children === 'string') {
    element.textContent = children;
  } else if (children instanceof Array) {
    children.forEach(child => element.appendChild(child));
  }
  return element;
};
