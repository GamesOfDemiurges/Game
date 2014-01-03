var scene = function scene() {

	/* Private */
	var stage, // сцена
		renderer, // оператор рендеринга
		masterCanvas, // Физический канвас на вьюпорте
		playGround,
		x = 0, y = 0; // точки отсчета для сцены

	var repaintCanvas = function repaintCanvas() {
		if (Z.zchange) {
			Z.drawZindex(playGround);
		}

		requestAnimFrame(repaintCanvas);
		renderer.render(stage);
	}

	/* Public */

	return {

		// Инициализация сцены
		// Передается селектор физического канваса

		// p.canvasSelector
		init: function ( p ) {
			var _this = this;

			// Обертка над оператором рендера PIXI


			masterCanvas = document.getElementById(p.canvasId); // указатель на DOM
			stage = new PIXI.Stage(0xFFFFFF, true); // Корневая сцена

			renderer = new PIXI.CanvasRenderer(510/masterCanvas.clientHeight*masterCanvas.clientWidth, 510, masterCanvas, false); // Оператор рендеринга 900x510 native
			window.onresize = function () {
				renderer.resize(510/masterCanvas.clientHeight*masterCanvas.clientWidth, 510);
			}

			// Контейнер сцены
			// его будем двигать для смещения сцены относительно вьюпорта
			playGround = new PIXI.DisplayObjectContainer();
			playGround.position.x = x;
			playGround.position.y = y;

			// Добавили контейнер
			stage.addChild( playGround );

			// Запустили перерисовку холста
			repaintCanvas();

			_this.stage = stage;
			_this.playGround = playGround;
			_this.zindex = Z.zindex;

			return _this;
		},

		// На сцену в произвольный момент может быть добавлен один из существующих объектов
		// p.image
		addObj: function ( p ) {
			var _this = this;

			Z.addZindex( p );

			return _this;
		},

		// Смещение сцены (не путать со смещением объекта)
		// p.dx
		// p.dy
		move: function ( p ) {

		}
	}
}();

var Z = function() {

	var zindex = {
			'base': {
				'index': null,
				'next': null,
				'children': null
			}
		}

	return {
		zchange: false,
		getZindex: function () {
			return zindex;
		},
		addZindex: function ( p ) {
			var addChild = function addChild(next ) {
				var child = Math.random();

				zindex[p.z].children[child] = {
					'index': p.pz,
					'data': p,
					'next': next
				}

				p.priorityZindex = child; // отражает индекс приоритета в дереве Z-плоскостей

				return zindex[p.z].children[child];
			}

			// Если еще нет такой плоскости
			if (zindex[p.z] === undefined) {
				// создаем

				zindex[p.z] = {
					index: p.z,
					next: null,
					children: {
						'base': {
							'index': null,
							'data': null,
							'next': null
						}
					}
				}

				// Добавляем целевой приоритет в конец списка
				zindex[p.z].children['base'].next = addChild(null);
			}

			// добавляем в индекс
			var currentPlain = zindex['base'],
				previousPlain = zindex['base'],
				stackIndex = 0;

			while(currentPlain !== null) {

				// если текущая плоскость — не корневая
				if (currentPlain.index !== null) {
					stackIndex += Object.keys(currentPlain.children).length-1;

					// Индекс текущей плоскости меньше, чем целевой.
					// Можно перейти дальше
					if (currentPlain.index < p.z) {
						if (currentPlain.next !== null) {
							previousPlain = currentPlain; // сохранить предыдущую на всякий случай
							currentPlain = currentPlain.next; // продолжили обход
						} else {
							currentPlain.next = zindex[p.z];
							break;
						}
					} else {

						// Индекс текущей плоскости превышает целевой.
						// Это означает, что объекта с целевым индексом еще нет с списке
						// Нужно добавить — поправить две ссылки
						if (currentPlain.index > p.z) {
							zindex[p.z].next = previousPlain.next; // следующим объектом для нового элемета станет тот, который раньше был следущим для предыдущего
							previousPlain.next = zindex[p.z]; // новый элемент станет следующим для того, кто раньше был предыдущим
							break; // ссылки проставили, можно покидать список. Приоритет вывода мы установили, когда создавали плоскость
						} else {

							// В списке уже сушествует плоскость с таким индексом
							// Всё, что нужно сделать — проставить нужный приоритет вывода
							var currentPriorityPlain = currentPlain.children.base,
								previousPriorityPlain = currentPlain.children.base

							while (currentPriorityPlain !== null) {

								if (currentPriorityPlain.index !== null) {
									stackIndex++;

									// Пропускаем все приоритеты ниже и равные указанному
									if (currentPriorityPlain.index <= p.pz) {
										if (currentPriorityPlain.next !== null) {
											previousPriorityPlain = currentPriorityPlain;
											currentPriorityPlain = currentPriorityPlain.next;
										} else {
											// Добавляем целевой приоритет в конец списка
											currentPriorityPlain.next = addChild(null);
											// Выходим
											break;
										}
									} else {
										// Нашли первый приоритет, который больше целевого. Вставляем перед ним
										previousPriorityPlain.next = addChild(previousPriorityPlain.next)
										// Выходим
										break;
									}

								} else {
									if (currentPriorityPlain.next !== null) {
										previousPriorityPlain = currentPriorityPlain;
										currentPriorityPlain = currentPriorityPlain.next;
									} else {
										// Добавляем целевой приоритет в конец списка
										currentPriorityPlain.next = addChild(null);
										// Выходим
										break;
									}
								}
							}

							break;
						}
					}
				} else {

					// Плоскость — корневая
					if (currentPlain.next == null) {

						// Кроме корневой плоскости в списке ничего нет.
						currentPlain.next = zindex[p.z]; // добавили новую плоскость следующей за корневой
						break; // вышли из цикла
					} else {

						// Кроме корневой плоскости в списке что-то есть
						currentPlain = currentPlain.next; // начали обход
					}
				}
			}
			p.stackZindex = stackIndex; // отражает позицию в стеке на отрисовку

			Z.zchange = true;
		},
		changeZindex: function ( p ) {
			// Оч. грубо — удалим приоритет из списка
			// плоскость можно не трогать — вдруг понадобится?

			// Затем измение значение плоскости в объекте
			var currentStackIndex = p.obj.stackZindex,
				currentZindex = p.obj.z,
				currentPriorityZIndex = p.obj.priorityZindex,
				objectPriorityIndex = p.obj.pz,
				currentPriorityPlain = zindex[currentZindex].children.base;

			while (currentPriorityPlain.next !== zindex[currentZindex].children[currentPriorityZIndex]) {
				currentPriorityPlain = currentPriorityPlain.next;
			}
			currentPriorityPlain.next = currentPriorityPlain.next.next;

			delete zindex[currentZindex].children[currentPriorityZIndex];
			p.obj.z = p.z;

			Z.addZindex(p.obj);
		},
		drawZindex: function (playGround) {
			var currentPlain = zindex.base.next;

			// Оч. грубо — удалим все элементы и нарисуем из списка всё заново
			while (playGround.children.length) {
				playGround.removeChild(playGround.children[0]);
			}

			while (currentPlain !== null) {
				var currentPriorityPlain = currentPlain.children.base.next;

				while (currentPriorityPlain !== null) {
					playGround.addChild( currentPriorityPlain.data.image );
					currentPriorityPlain = currentPriorityPlain.next;
				}

				currentPlain = currentPlain.next;
			}
			Z.zchange = false;
		}
	}

}();
