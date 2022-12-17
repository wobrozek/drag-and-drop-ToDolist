window.onload = () => {
	const btn = document.querySelector('.btn-add');
	const todo = document.querySelector('#todo');
	const btnClose = document.querySelector('.create-btn');
	const form = document.getElementById('createForm');
	const input = document.getElementById('createName');
	const popup = document.getElementById('create');
	const draggable = document.querySelectorAll('.draggable');
	const section = document.querySelectorAll('section');

	let dragItem = null;
	let touchedX = null;
	let touchedY = null;

	input.addEventListener('mousedown', (e) => {
		// fetch element to the list
	});

	btnClose.addEventListener('click', (e) => {
		e.preventDefault();
		popup.style.display = 'none';
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		// send data
		popup.style.display = 'none';
		if (input.value) {
			li = document.createElement('li');
			li.textContent = input.value;
			li.draggable = 'true';
			li.className = 'draggable';

			li.addEventListener('dragstart', dragStart);
			li.addEventListener('dragend', dragEnd);

			todo.append(li);
			input.value = '';
		}
	});

	btn.addEventListener('click', () => {
		popup.style.display = 'block';
	});

	draggable.forEach((element) => {
		element.addEventListener('dragstart', dragStart);
		element.addEventListener('dragend', dragEnd);

		element.addEventListener('touchstart', touchStart);
		element.addEventListener('touchmove', touchMove);
		element.addEventListener('touchEnd', touchEnd);
	});

	// mobile devices does't understand drop events
	function touchStart(e) {
		dragItem = this;

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
		console.log(e.changedTouches[0].pageX);
		let difrenceX = e.changedTouches[0].pageX - touchedX;
		let difrenceY = e.changedTouches[0].pageY - touchedY;
		touchedX = e.changedTouches[0].pageX;
		touchedY = e.changedTouches[0].pageY;

		this.style.left = this.offsetLeft + difrenceX + 'px';
		this.style.top = this.offsetTop + difrenceY + 'px';
	}

	function touchEnd() {}

	function dragStart() {
		dragItem = this;
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
		let ul = this.querySelector('ul');
		ul.append(dragItem);
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
