var repaint = false,
	debugPanel,
	canvas,
	ctx;

var debugTraect = function debugTraect() {

	var _this = this;

	// Перерисовка служебного холста
	function render() {
		if (repaint) {
			utils.processPaths({
				callback: function() {
					paint();
					repaint = false;
				}
			});
		}

		requestAnimFrame(render);
	}

	// возвращает выбранный в списке путь или false
	function getCurrentPath() {
		var pathListItem = document.querySelectorAll('.debug__control-traects option'),
			currentPathId,
			currentPath = false;

		for (var i = 0; i < pathListItem.length; i++) {
			if (!!pathListItem[i].selected) {
				currentPathId = pathListItem[i].getAttribute('value');
				break;
			}
		}

		if (!!globals.paths[currentPathId]) {
			currentPath = globals.paths[currentPathId];
		}

		return currentPath;
	}

	function getCurrentObject() {
		var objectsListItem = document.querySelectorAll('.debug__control-objects-list option'),
			objectId,
			currentObject = false;

		for (var i = 0; i < objectsListItem.length; i++) {
			if (!!objectsListItem[i].selected) {
				objectId = objectsListItem[i].getAttribute('value');
				break;
			}
		}

		if (!!globals.objects[objectId]) {
			currentObject = globals.objects[objectId];
		}

		return currentObject;
	}

	function getCurrentAnimation() {
		var animationListItem = document.querySelectorAll('.debug__control-objects-anim option'),
			animationId = false;

		for (var i = 0; i < animationListItem.length; i++) {
			if (!!animationListItem[i].selected) {
				animationId = animationListItem[i].getAttribute('value');
				break;
			}
		}

		return animationId;
	}

	function checkForBreakpath() {
		var currentPath = getCurrentPath(),
			checkbox = document.querySelector('.debug__control-traects-break');

		if (currentPath) {
			checkbox.removeAttribute('disabled');

			if (currentPath.breakpath) {
				checkbox.checked = true;
			} else {
				checkbox.checked = false;
			}
		}
	}

	function setDetachButtonStatus() {
		var currentPath = getCurrentPath(),
			currentObject = getCurrentObject(),
			detachButton = document.querySelector('.debug__button_remove-object'),
			animationListItem = document.querySelectorAll('.debug__control-objects-anim option'),
			animationSpeedInput = document.querySelector('.debug__control-traects-speed');

		if ( (!!currentPath.objects) && (currentPath.objects[currentObject.id]) ) {
			detachButton.disabled = false;

			animationSpeedInput.value = 0;
			for (var i = 0; i < animationListItem.length; i++) {

				if (animationListItem[i].getAttribute('value') == currentPath.objects[currentObject.id].animation ) {
					animationListItem[i].selected = true;

					animationSpeedInput.value = currentPath.objects[currentObject.id].speed;
					break;
				}
			}
		} else {
			detachButton.disabled = true;
			animationSpeedInput.value = 0;
		}
	}

	function buildInterfaceFromPaths() {
		var newItem,
			tempPoint,
			pathList = document.querySelector('.debug__control-traects .debug__control-traects-list');

		for (var path in globals.paths) {
			newItem = document.createElement('option');

			newItem.textContent = globals.paths[path].name;
			newItem.setAttribute('value', globals.paths[path].name);
			newItem.selected = true;

			pathList.appendChild(newItem);

			checkForBreakpath();

			for (var dot = 0; dot < globals.paths[path].dots.length; dot++) {

				// создаем DOM-представление для новой точки

				if (globals.paths[path].dots[dot].prevHandle !== null) {

					tempPoint = document.createElement('div');
					tempPoint.className = 'debug__point-handle';
					tempPoint.style.top = globals.paths[path].dots[dot].prevHandle.y / globals.scale + 'px';
					tempPoint.style.left = globals.paths[path].dots[dot].prevHandle.x / globals.scale + 'px';
					globals.paths[path].dots[dot].prevHandle.dom = tempPoint;

					debugPanel.appendChild(tempPoint);
				}

				tempPoint = document.createElement('div');
				tempPoint.className = 'debug__point';
				tempPoint.style.top = globals.paths[path].dots[dot].mainHandle.y / globals.scale+ 'px';
				tempPoint.style.left = globals.paths[path].dots[dot].mainHandle.x / globals.scale + 'px';
				globals.paths[path].dots[dot].mainHandle.dom = tempPoint;

				debugPanel.appendChild(tempPoint);

				if (globals.paths[path].dots[dot].nextHandle !== null) {
					tempPoint = document.createElement('div');
					tempPoint.className = 'debug__point-handle';
					tempPoint.style.top = globals.paths[path].dots[dot].nextHandle.y / globals.scale + 'px';
					tempPoint.style.left = globals.paths[path].dots[dot].nextHandle.x / globals.scale + 'px';
					globals.paths[path].dots[dot].nextHandle.dom = tempPoint;

					debugPanel.appendChild(tempPoint);
				}
			}
			globals.paths[path].dots[0].mainHandle.dom.classList.add('debug__point_first');
		}

		repaint = true;
	}

	function readTraect() {
		buildInterfaceFromPaths();
	}

	function paint() {

		// Возвращает координаты точки на холсте,
		// взятые от координаты DOM-узла токи и нормированные на масштаб
		function getCoordsFromCss( dom ) {

			return {
				x: dom.style.left.replace('px', '') * globals.scale,
				y: dom.style.top.replace('px', '') * globals.scale
			}
		};

		// Ощищаем холст
		ctx.clearRect(0,0,canvas.width,canvas.height);

		// Выводим линии
		// Перебираем текущие узлы и получаем их координаты.
		// Узлы образуют траектории, отдельных траекторий может быть много
		for (path in globals.paths) {
			// IE и FF умирает от setStrokeColor
			if ( (document.querySelector('.debug__view_hidden') === null) && (document.querySelector('.debug__control-traects option[value="' + path + '"]').selected) ) {
				ctx.setStrokeColor('#383');
			} else {
				ctx.setStrokeColor('#000');
			}

			// Работаем с каждой траекторией в списке
			if (globals.paths[path].dots.length) {

				// Характеристики линии
				// смещение к началу рисования траектории
				ctx.lineWidth = "1";
				ctx.beginPath();
				ctx.moveTo( globals.paths[path].dots[0].mainHandle.x, globals.paths[path].dots[0].mainHandle.y );

				// Обновляем координаты точки из DOM
				globals.paths[path].dots[0].mainHandle.x = getCoordsFromCss( globals.paths[path].dots[0].mainHandle.dom ).x;
				globals.paths[path].dots[0].mainHandle.y = getCoordsFromCss( globals.paths[path].dots[0].mainHandle.dom ).y;
				globals.paths[path].dots[0].mainHandle.dom.classList.add('debug__point_first');

				// Если у первой точки есть рычаг
				if (globals.paths[path].dots[0].nextHandle !== null) {
					// Обновляем его координаты из DOM
					globals.paths[path].dots[0].nextHandle.x = getCoordsFromCss( globals.paths[path].dots[0].nextHandle.dom ).x;
					globals.paths[path].dots[0].nextHandle.y = getCoordsFromCss( globals.paths[path].dots[0].nextHandle.dom ).y;

					// рисуем
					ctx.lineTo(globals.paths[path].dots[0].nextHandle.x, globals.paths[path].dots[0].nextHandle.y);

					// Возвращаем перо к точке траектории
					ctx.moveTo( globals.paths[path].dots[0].mainHandle.x, globals.paths[path].dots[0].mainHandle.y );
				}

				// Нулевая вершина графа
				if (globals.paths[path].dots[0].graphId !== undefined) {
					ctx.strokeText( globals.paths[path].dots[0].graphId, globals.paths[path].dots[0].mainHandle.x, globals.paths[path].dots[0].mainHandle.y-10 );
				}

				// Отрисовка точек, начиная со второй
				// отдельно, потому что между двумя точками уже можно провести линию
				for (var i = 1; i < globals.paths[path].dots.length; i++) {
					// обновить координаты точки из DOM
					globals.paths[path].dots[i].mainHandle.x = getCoordsFromCss( globals.paths[path].dots[i].mainHandle.dom ).x;
					globals.paths[path].dots[i].mainHandle.y = getCoordsFromCss( globals.paths[path].dots[i].mainHandle.dom ).y;

					// Если следующий рычаг существует, обновить его координаты из DOM
					if (globals.paths[path].dots[i].nextHandle !== null) {
						globals.paths[path].dots[i].nextHandle.x = getCoordsFromCss( globals.paths[path].dots[i].nextHandle.dom ).x;
						globals.paths[path].dots[i].nextHandle.y = getCoordsFromCss( globals.paths[path].dots[i].nextHandle.dom ).y;
					}

					// Координаты управляющей точки предыдущего отрезка
					globals.paths[path].dots[i].prevHandle.x = getCoordsFromCss( globals.paths[path].dots[i].prevHandle.dom ).x;
					globals.paths[path].dots[i].prevHandle.y = getCoordsFromCss( globals.paths[path].dots[i].prevHandle.dom ).y;

					// Сама кривая
					//ctx.bezierCurveTo( paths[path].dots[i-1].nextHandle.x, paths[path].dots[i-1].nextHandle.y, paths[path].dots[i].prevHandle.x, paths[path].dots[i].prevHandle.y, paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y )
					ctx.moveTo(globals.paths[path].dots[i].mainHandle.x, globals.paths[path].dots[i].mainHandle.y);

					// Нарисовать рычаг предыдущего отрезка
					ctx.lineTo(globals.paths[path].dots[i].prevHandle.x, globals.paths[path].dots[i].prevHandle.y);

					// Если есть следующая точка, то есть рычаг следующего отрезка
					if (globals.paths[path].dots[i].nextHandle !== null) {

						// нарисовать его
						ctx.moveTo( globals.paths[path].dots[i].mainHandle.x, globals.paths[path].dots[i].mainHandle.y )
						ctx.lineTo(globals.paths[path].dots[i].nextHandle.x, globals.paths[path].dots[i].nextHandle.y);

						// вернуть перо в точку завершения отрисовки кривой
						ctx.moveTo( globals.paths[path].dots[i].mainHandle.x, globals.paths[path].dots[i].mainHandle.y )
					}

					// Отрисовка шагов
					for (var j = 0; j < globals.paths[path].steps.length; j++) {
						ctx.rect( globals.paths[path].steps[j].x, globals.paths[path].steps[j].y, 1, 1 );
					}

					// Активные области
					for (var j = 0; j < globals.paths[path].controlPath.length; j++) {
							// Визуализация
						ctx.rect( globals.paths[path].controlPath[ j ].rect.x, globals.paths[path].controlPath[ j ].rect.y, globals.paths[path].controlPath[ j ].rect.width, globals.paths[path].controlPath[ j ].rect.height );
						ctx.rect( globals.paths[path].steps[ globals.paths[path].controlPath[ j ].step ].x, globals.paths[path].steps[ globals.paths[path].controlPath[ j ].step ].y,  6, 6 );
					}

					// Вершины графа
					if (globals.paths[path].dots[i].graphId !== undefined) {
						ctx.strokeText( globals.paths[path].dots[i].graphId, globals.paths[path].dots[i].mainHandle.x, globals.paths[path].dots[i].mainHandle.y-10 );
					}


					// Проверка на плотность шагов
					/*console.clear();
					for (var j = 1; j < stepsArray.length; j++) {
						var d =  getDistance({
							x1: stepsArray[j-1].x,
							y1: stepsArray[j-1].y,
							x2: stepsArray[j].x,
							y2: stepsArray[j].y
						})

						if (d >= 1.4) {
							console.log(j);
						}
					}*/


				}

				// отрендерить все линии
				ctx.stroke();
			}
		}

	}

	// Добавляем в список траекторий новую, с заданным именем
	function addPath(p) {
		globals.paths[p.name] = {
			dots: [],
			steps: [],
			name: p.name
		}
	}

	// Добавляет точку на холст с заданными координатами
	//p.x
	//p.y
	function addPoint(p) {
		var pathList = document.querySelectorAll('.debug__control-traects option'),
			currentPathId,
			currentPath,
			preLastPathPoint,
			lastPathPoint,
			tempPoint,
			newPoint = {
				mainHandle: {
					x: p.x * globals.scale - scene.playGround.position.x,
					y: p.y * globals.scale - scene.playGround.position.y
				},
				prevHandle: null,
				nextHandle: null
			}

		if (!pathList.length) {
			var name = Math.random(),
				newItem = document.createElement('option');

			newItem.textContent = name;
			newItem.setAttribute('value', name);
			newItem.selected = true;

			document.querySelector('.debug__control-traects .debug__control-traects-list').appendChild(newItem);

			addPath({
				name: name
			});

			currentPathId = name;
		} else {
			// Поиск по списку созданных траекторий
			// активная та, что имеет свойство .selected
			// Как только находим её, забираем её идентификатор и выходим из списка
			for (var i = 0; i < pathList.length; i++) {
				if (!!pathList[i].selected) {
					currentPathId = pathList[i].getAttribute('value');
					break;
				}
			}

		}

		// Если вообще ничего не выделено, не добавляем точку
		if (!globals.paths[currentPathId]) return false;

		// Если в траектории уже есть точки,
		// значит добавление новой точки неявно повлечет создание кривой между ними,
		// значит нужно поработать с парой последних точек в траектории
		if ( globals.paths[currentPathId].dots.length ) {
			preLastPathPoint = globals.paths[currentPathId].dots[ globals.paths[currentPathId].dots.length-1 ];

			if (globals.paths[currentPathId].dots.length > 1) {
				delete(globals.paths[currentPathId].dots[ globals.paths[currentPathId].dots.length-1 ].graphId);
			}
		}

		// Добавили самую последнюю точку — только что созданную
		globals.paths[currentPathId].dots.push(newPoint);
		lastPathPoint = globals.paths[currentPathId].dots[ globals.paths[currentPathId].dots.length-1 ];

		// Если точек в пути теперь больше одной, создаем управляющие рычаги для кривой
		if (!!preLastPathPoint) {

			// (x1, y1) и (x2, y2) — координаты управлящих точек
			var addBezierPoint = utils.getAdditionalBezierPointsCoords({
				x1: preLastPathPoint.mainHandle.x / globals.scale,
				y1: preLastPathPoint.mainHandle.y / globals.scale,
				x2: lastPathPoint.mainHandle.x / globals.scale,
				y2: lastPathPoint.mainHandle.y / globals.scale
			})

			// Создаем DOM-представление для рычага предыдущей точки
			tempPoint = document.createElement('div');
			tempPoint.className = 'debug__point-handle';
			tempPoint.style.top = addBezierPoint.ay1 + 'px';
			tempPoint.style.left = addBezierPoint.ax1 + 'px';
			preLastPathPoint.nextHandle = {
				dom: tempPoint,
				x: addBezierPoint.ax1 * globals.scale,
				y: addBezierPoint.ay1 * globals.scale

			}

			debugPanel.appendChild(tempPoint);

			// Создаем DOM-представление для рычага новой точки
			tempPoint = document.createElement('div');
			tempPoint.className = 'debug__point-handle';
			tempPoint.style.top = addBezierPoint.ay2 + 'px';
			tempPoint.style.left = addBezierPoint.ax2 + 'px';
			lastPathPoint.prevHandle = {
				dom: tempPoint,
				x: addBezierPoint.ax2 * globals.scale,
				y: addBezierPoint.ay2 * globals.scale
			}

			debugPanel.appendChild(tempPoint);
		}

		// создаем DOM-представление для новой точки
		var tempPoint = document.createElement('div');
		tempPoint.className = 'debug__point';
		tempPoint.style.top = p.y - scene.playGround.position.y / globals.scale + 'px';
		tempPoint.style.left = p.x - scene.playGround.position.x / globals.scale + 'px';
		lastPathPoint.mainHandle.dom = tempPoint;

		debugPanel.appendChild(tempPoint);

		// Построить траектории
		utils.processPaths({
			callback: function() {

				// Построить граф
				graph.buildGraph({
					callback: function() {

						// нужна перерисовка сцены
						repaint = true;
					}
				});
			}
		});
	}

	function defineDOMVars() {
		debugPanel = document.querySelector('.debug');
		canvas = document.querySelector('.debug__view');
		dots = document.querySelectorAll('.debug__point');
		ctx = canvas.getContext('2d');

		canvas.setAttribute('width', debugPanel.clientWidth / document.getElementById('view').clientHeight * 800 );
		canvas.setAttribute('height', document.getElementById('view').getAttribute('height'));

		document.body.classList.add('_noscroll');
	}

	function attachEvents() {
		var currentTarget,
			debugWrap = document.querySelector('.debug__wrap');

		var pathList = document.querySelector('.debug__control-traects .debug__control-traects-list'),
			tempPoint = {
				x: 0,
				y: 0
			}

		debugPanel.addEventListener("mousedown", function(e) {
			e.stopPropagation();

			// Событие начала перетаскивания
			// Точка
			if ( e.target.classList.contains('debug__point') ) {
				tempPoint.x = e.pageX - scene.playGround.position.x / globals.scale;
				tempPoint.y = e.pageY - scene.playGround.position.y / globals.scale;

				e.target.isDragged = true;
				currentTarget = e.target;

				e.target.classList.add('debug__point_dragged');
			}

			// Контрольный рычаг
			if ( e.target.classList.contains('debug__point-handle' )) {
				e.target.isDragged = true;
				currentTarget = e.target;
			}
		})

		debugPanel.addEventListener("mouseup", function(e) {
			e.stopPropagation();

			// Событие завершение перетаскивания
			// обрабатывается одинаково точкой и рычагом
			if ( (e.target.classList.contains('debug__point')) || (e.target.classList.contains('debug__point-handle')) ) {
				e.target.isDragged = undefined;
				currentTarget = undefined;
				e.target.classList.remove('debug__point_dragged');
			}
		})

		debugPanel.addEventListener("mousemove", function(e) {

			// Событие факта перетаскивания
			if (currentTarget !== undefined) {
				currentTarget.style.top = e.pageY - scene.playGround.position.y / globals.scale  + 'px';
				currentTarget.style.left = e.pageX - scene.playGround.position.x / globals.scale + 'px';

				// Залипание точки
				if ( (e.target.classList.contains('debug__point')) && (e.target !== currentTarget) ) {
					currentTarget.style.top = e.target.style.top;
					currentTarget.style.left = e.target.style.left;
				}

				// При перетаскивании точки её рычаги переносятся аналогично
				if (currentTarget.classList.contains('debug__point')) {
					var d = {
						x: Number(currentTarget.style.left.replace('px', '')) - tempPoint.x,
						y: Number(currentTarget.style.top.replace('px', '')) - tempPoint.y,
					}
					tempPoint = {
						x: e.pageX - scene.playGround.position.x / globals.scale,
						y: e.pageY - scene.playGround.position.y / globals.scale
					}

					if ( (currentTarget.nextSibling !== null) && (currentTarget.nextSibling.className == 'debug__point-handle') ) {
						currentTarget.nextSibling.style.top = Number(currentTarget.nextSibling.style.top.replace('px', '')) + d.y + 'px';
						currentTarget.nextSibling.style.left = Number(currentTarget.nextSibling.style.left.replace('px', '')) + d.x + 'px';
					}

					if ( (currentTarget.previousSibling !== null) && (currentTarget.previousSibling.className == 'debug__point-handle') ) {
						currentTarget.previousSibling.style.top = Number(currentTarget.previousSibling.style.top.replace('px', '')) + d.y + 'px';
						currentTarget.previousSibling.style.left = Number(currentTarget.previousSibling.style.left.replace('px', '')) + d.x + 'px';
					}
				}

				// Построить траектории
				utils.processPaths({
					callback: function() {

						// Построить граф
						graph.buildGraph({
							callback: function() {

								// нужна перерисовка сцены
								repaint = true;
							}
						});
					}
				});
			}
		})

		debugPanel.addEventListener("dblclick", function(e) {
			if (e.target.classList.contains('debug__point') ) {
				e.stopPropagation();

				// TODO: удаление точки
				console.log('point dbl click');
			}

			// Даблклик по холсту создает новую точку
			if (e.target.classList.contains('debug__view') ) {
				e.stopPropagation();

				addPoint({
					x: e.pageX,
					y: e.pageY
				})
			}

			if (e.target.parentNode.className == 'debug__control-traects-list') {
				e.stopPropagation();

				var oldTraectName = e.target.getAttribute('value'),
					newTraectName = window.prompt('Новое имя траектории: ', oldTraectName);

				console.log(newTraectName);

				// Заменить имя и id в списке траекторий отладчика
				e.target.innerHTML = newTraectName;
				e.target.setAttribute('value', newTraectName);

				// Обновить глобальный список траекторий
				globals.paths[newTraectName] = globals.paths[oldTraectName]; //JSON.parse( JSON.stringify( globals.paths[oldTraectName] ) );
				globals.paths[newTraectName].name = newTraectName;
				delete globals.paths[oldTraectName];

				// Заменить id у всех объектов
				for (var obj in globals.objects) {
					if (globals.objects[obj].path == oldTraectName) {
						globals.objects[obj].path = newTraectName;
					}
				}

				// Перестроить траектории
				utils.processPaths({
					callback: function() {

						// Построить граф
						graph.buildGraph({
							callback: function() {
								//callback();
								pathfinder.start();
							}
						});

					}
				});
			}
		})

		debugPanel.addEventListener("click", function(e) {

			if (e.target.classList.contains('debug__control-traects-label') || e.target.classList.contains('debug__control-traects-break')) {
				e.stopPropagation();

				if (e.target.classList.contains('debug__control-traects-break')) {
					var currentPath = getCurrentPath();
					currentPath.breakpath = (currentPath.breakpath)
						? false
						: true

					checkForBreakpath();

					// Построить траектории
					utils.processPaths({
						callback: function() {

							// Построить граф
							graph.buildGraph({
								callback: function() {

									// нужна перерисовка сцены
									repaint = true;
								}
							});
						}
					});

				}
			}

			// переключить оверлей
			if (e.target.classList.contains('debug__button_toggle-overlay')) {
				e.stopPropagation();

				if ( canvas.classList.contains('debug__view_hidden') ) {
					canvas.classList.remove('debug__view_hidden');
				} else {
					canvas.classList.add('debug__view_hidden');
				}
			}

			// Добавление траектории
			if (e.target.classList.contains('debug__button_add')) {
				e.stopPropagation();

				var name = Math.random(),
					newItem = document.createElement('option');

				newItem.textContent = name;
				newItem.setAttribute('value', name);
				newItem.selected = true;

				pathList.appendChild(newItem);

				checkForBreakpath();

				addPath({
					name: name
				});
			}

			// Переключение траектории, выбор объектов, анимаций
			if (e.target.tagName == 'OPTION') {
				e.stopPropagation();

				if (e.target.parentNode.className == 'debug__control-traects-list') {
					checkForBreakpath();
					setDetachButtonStatus();
					repaint = true;
				}

				if (e.target.parentNode.className == 'debug__control-objects-list') {
					readObjectAnimations( e.target );
					setDetachButtonStatus();
				}

				if (e.target.parentNode.className == 'debug__control-objects-anim') {
					var currentObject = getCurrentObject(),
						animationName = e.target.getAttribute('value');

					if (currentObject !== false) {
						currentObject.animate({
							animation: animationName
						})
					}
				}


			}

			if (e.target.tagName == 'SELECT') {
				e.stopPropagation();
			}

			// Удаление траектории
			if (e.target.classList.contains('debug__button_remove')) {
				e.stopPropagation();

				var pathListItem = document.querySelectorAll('.debug__control-traects option'),
					currentPathId,
					currentPath = false;

				for (var i = 0; i < pathListItem.length; i++) {
					if (!!pathListItem[i].selected) {
						currentPathId = pathListItem[i].getAttribute('value');
						break;
					}
				}

				pathList.removeChild( pathListItem[i] );

				if (!!globals.paths[currentPathId]) {

					for (var i = 0; i < globals.paths[currentPathId].dots.length; i++) {

						if ( globals.paths[currentPathId].dots[i].mainHandle !== null  ) {
							debugPanel.removeChild( globals.paths[currentPathId].dots[i].mainHandle.dom );
						}

						if ( globals.paths[currentPathId].dots[i].prevHandle !== null ) {
							debugPanel.removeChild( globals.paths[currentPathId].dots[i].prevHandle.dom );
						}

						if ( globals.paths[currentPathId].dots[i].nextHandle !== null ) {
							debugPanel.removeChild( globals.paths[currentPathId].dots[i].nextHandle.dom );
						}
					}

					delete globals.paths[currentPathId];
				}

				repaint = true;
			}

			// Сохранение в файл
			if (e.target.classList.contains('debug__button_save')) {
				e.stopPropagation();

				// Создаем упрощенную версию пути без ссылок на DOM-узлы
				var smallPaths = {};

				for (var path in globals.paths) {
					smallPaths[path] = {
						name: path,
						dots: [],
						breakpath: globals.paths[path].breakpath || false,
					};

					for (var dot = 0; dot < globals.paths[path].dots.length; dot++) {
						var prevHandle = null,
							nextHandle = null;

						var mainHandle = {
							x: globals.paths[path].dots[dot].mainHandle.x,
							y: globals.paths[path].dots[dot].mainHandle.y
						}

						if (globals.paths[path].dots[dot].prevHandle !== null) {
							prevHandle = {
								x: globals.paths[path].dots[dot].prevHandle.x,
								y: globals.paths[path].dots[dot].prevHandle.y
							}
						}

						if (globals.paths[path].dots[dot].nextHandle !== null) {
							nextHandle = {
								x: globals.paths[path].dots[dot].nextHandle.x,
								y: globals.paths[path].dots[dot].nextHandle.y
							}
						}

						smallPaths[path].dots.push({
							mainHandle: mainHandle,
							nextHandle: nextHandle,
							prevHandle: prevHandle
						})
					}

					if ( (!!globals.paths[path].objects) && (Object.keys(globals.paths[path].objects).length) ) {
						smallPaths[path].objects = JSON.parse( JSON.stringify(globals.paths[path].objects) )
					}
				}

				// Создаем XHR
				var req = new XMLHttpRequest;
				var param = 'data=' + JSON.stringify(smallPaths);
				req.open("POST", '/tools/writeTraectToFile.php');
				req.onreadystatechange = function() {

					if ((req.status == 200) && (req.readyState==4)) {
						console.log(req.responseText)
					}
				};

				req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				req.send(param);
			}

			// Счетчик скорости анимации
			if (e.target.classList.contains('debug__control-traects-speed')) {
				e.stopPropagation();
			}

			// Привязка анимации объекта к траектории
			if (e.target.classList.contains('debug__button_remember-animation')) {
				e.stopPropagation();

				var currentPath = getCurrentPath(),
					currentObject = getCurrentObject(),
					currentAnimation = getCurrentAnimation();

				if (currentPath && currentObject && currentAnimation) {
					currentPath.objects = currentPath.objects || {};
					currentPath.objects[currentObject.id] = {
						animation: currentAnimation,
						speed: parseInt(document.querySelector('.debug__control-traects-speed').value)
					};
				}

				setDetachButtonStatus();

			}

			// Удаление объекта из привязки к пути
			if (e.target.classList.contains('debug__button_remove-object')) {
				e.stopPropagation();

				var currentPath = getCurrentPath(),
					currentObject = getCurrentObject()

				delete currentPath.objects[currentObject.id];

				if (!Object.keys( currentPath.objects ).length) {
					delete currentPath.objects;
				}

				setDetachButtonStatus();
			}

			// Управляющие точки
			if (e.target.classList.contains('debug__point') || e.target.classList.contains('debug__point-handle')) {
				e.stopPropagation();
			}

		})

		debugWrap.onscroll = function(e) {
			scene.playGround.position.x = (-1) * globals.scale * debugWrap.scrollLeft;
		}

	}

	function readObjectAnimations( option ) {
		var heroId = option.getAttribute('value'),
			animationList = document.querySelector('.debug__control-objects-anim');

		animationList.innerHTML = '';

		for (var animation in globals.objects[heroId].image.spineData.animations) {
			var newObject = document.createElement('option');
			newObject.innerHTML = globals.objects[heroId].image.spineData.animations[animation].name;
			newObject.setAttribute('value', globals.objects[heroId].image.spineData.animations[animation].name);

			animationList.appendChild(newObject);
		}
	}

	function readObjects() {
		var objectList = document.querySelector('.debug__control-objects-list');

		for (var object in globals.objects) {
			var newObject = document.createElement('option');
			newObject.innerHTML = globals.objects[object].id;
			newObject.setAttribute('value', globals.objects[object].id);

			objectList.appendChild(newObject);
		}

		var firstElement = document.querySelector('.debug__control-objects-list option');

		if (firstElement !== null) {
			firstElement.selected = true;;
			readObjectAnimations(firstElement);
		}
	}

	/* Init */;
	function resizeViewPort() {
		var attrWidth = document.getElementById('view').getAttribute('width');
		document.querySelector('.debug').style.width = ( 3828 / attrWidth ) * document.getElementById('view').clientWidth + 'px';
	}

	function startDebugger() {
		var attrWidth = document.getElementById('view').getAttribute('width');

		if (attrWidth == null) {
			setTimeout(function() {
				startDebugger();
			}, 1000)
			return false;
		}

		window.addEventListener('resize', function() {
			resizeViewPort();
		})
		resizeViewPort();

		defineDOMVars();
		readTraect();
		readObjects();
		attachEvents();
		render();
	}
	/* /Init */

	return {
		init: function() {
			startDebugger();
			return this;
		},

		addPath: function(p) {
			addPath(p);

			return this;
		},

		addPoint: function(p) {
			addPoint(p);

			return this;
		},

		paint: function() {
			paint();

			return this;
		}
	}
}()