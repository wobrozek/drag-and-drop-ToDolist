window.onload = () => {
	const btn = document.querySelector('.btn-add');
	const todo = document.querySelector('#todo');
	const done = document.querySelector('#done');
	const hinitUX = document.querySelector('.create-list');
	const btnClose = document.querySelector('.create-btn');
	const form = document.getElementById('createForm');
	const input = document.getElementById('createName');
	const popup = document.getElementById('create');
	const draggable = document.querySelectorAll('.draggable');
	const section = document.querySelectorAll('section');

	let todoArray = [];
	let doneArray = [];
	let hinitArray = [];

	let dragItem = null;
	let touchedX = null;
	let touchedY = null;

	GET('http://localhost/todolist/hint.php?q=hinit', hinitAppend);
	GET('http://localhost/todolist/hint.php?q=done', doneAppend);
	GET('http://localhost/todolist/hint.php?q=todo', todoAppend);

	input.addEventListener('click', (e) => {
		hinitUX.style.display = 'block';
	});

	function hinitAppend(elements) {
		hinitArray = elements;
		elements.forEach((element) => {
			let li = document.createElement('li');
			li.textContent = element;

			li.addEventListener('click', hinitClick);
			hinitUX.appendChild(li);
		});
	}

	function todoAppend(elements) {
		todoArray = elements;
		elements.forEach((element) => {
			createDraggableLi(todo, element);
		});
	}

	function doneAppend(elements) {
		doneArray = elements;
		elements.forEach((element) => {
			let li = document.createElement('li');
			li.textContent = element;
			done.append(li);
		});
	}

	function createDraggableLi(container, value) {
		let li = document.createElement('li');
		li.textContent = value;
		li.draggable = 'true';
		li.className = 'draggable';

		li.addEventListener('dragstart', dragStart);
		li.addEventListener('dragend', dragEnd);

		li.addEventListener('touchstart', touchStart);
		li.addEventListener('touchmove', touchMove);
		li.addEventListener('touchend', touchEnd);

		container.append(li);
	}

	function hinitClick() {
		input.value = this.textContent;
		hinitUX.style.display = 'none';
	}

	btnClose.addEventListener('click', (e) => {
		e.preventDefault();
		popup.style.display = 'none';
		hinitUX.style.display = 'none';
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		popup.style.display = 'none';
		hinitUX.style.display = 'none';

		if (!input.value) return;

		//send data by conector.js
		hinitArray.push(input.value);
		todoArray.push(input.value);
		POST('http://localhost/todolist/hint.php?q=hinit', hinitArray);
		POST('http://localhost/todolist/hint.php?q=todo', todoArray);

		createDraggableLi(todo, input.value);
		input.value = '';
	});

	btn.addEventListener('click', () => {
		popup.style.display = 'block';
	});

	// mobile devices does't understand drop events
	function touchStart(e) {
		dragItem = this;
		dragItem.dataset.done = false;

		touchedX = e.changedTouches[0].pageX;
		touchedY = e.changedTouches[0].pageY;

		this.style.left = this.offsetLeft + 'px';
		this.style.top = this.offsetTop + 'px';

		// add element hight becouse in position fixed element must have static size

		this.style.width = this.offsetWidth + 'px';
		this.style.height = this.offsetHeight + 'px';

		this.style.position = 'fixed';
	}

	function touchMove(e) {
		e.preventDefault();
		let difrenceX = e.changedTouches[0].pageX - touchedX;
		let difrenceY = e.changedTouches[0].pageY - touchedY;
		touchedX = e.changedTouches[0].pageX;
		touchedY = e.changedTouches[0].pageY;

		this.style.left = this.offsetLeft + difrenceX + 'px';
		this.style.top = this.offsetTop + difrenceY + 'px';
	}

	function touchEnd(e) {
		touchX = e.changedTouches[0].pageX;
		touchY = e.changedTouches[0].pageY;
		dragItem.style.position = 'initial';
		section.forEach((element) => {
			let rect = element.getBoundingClientRect();

			if (
				rect.left < touchX &&
				rect.left + rect.width > touchX &&
				rect.top < touchedY &&
				rect.top + rect.height > touchedY
			) {
				// add element to the list
				addToList.call(element);
			}
		});
	}

	function addToList() {
		let ul = this.querySelector('ul');
		dragItem.dataset.id = String(Date.now());
		let id = dragItem.dataset.id;

		ul.append(dragItem);

		if (ul.id == 'done') {
			dragItem.dataset.done = true;
			setTimeout(() => {
				removeDragable(id);
			}, 3000);
		}
	}

	function removeDragable(dragId) {
		let dragItem = document.querySelector(`li[data-id="${dragId}"]`);

		if (!dragItem.done) return;

		let text = dragItem.textContent;

		todoArray = todoArray.filter((element) => {
			if (element != text) {
				return element;
			}
		});
		doneArray.push(text);

		POST('http://localhost/todolist/hint.php?q=todo', todoArray);
		POST('http://localhost/todolist/hint.php?q=done', doneArray);

		dragItem.classList.remove('draggable');
		dragItem.setAttribute('draggable', false);

		dragItem.removeEventListener('dragstart', dragStart);
		dragItem.removeEventListener('dragend', dragEnd);

		dragItem.removeEventListener('touchstart', touchStart);
		dragItem.removeEventListener('touchmove', touchMove);
		dragItem.removeEventListener('touchend', touchEnd);
	}

	function dragStart() {
		dragItem = this;
		dragItem.dataset.done = false;
		setTimeout(() => (this.style.display = 'none'), 0);
	}

	function dragEnd() {
		setTimeout(() => (this.style.display = 'block'), 0);
		dragItem = null;
	}

	section.forEach((element) => {
		element.addEventListener('drop', drop);
		element.addEventListener('dragenter', dragEnter);
		element.addEventListener('dragleave', dragLeave);
		element.addEventListener('dragover', dragOver);
	});

	function drop() {
		if (dragItem) addToList.call(this);
	}

	function dragEnter(e) {
		e.preventDefault();
	}

	function dragLeave(e) {
		e.preventDefault();
		this.style.border = '1px dashed #000';
	}

	function dragOver(e) {
		this.style.border = '1px solid #000';
		e.preventDefault();
	}
};
