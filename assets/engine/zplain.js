/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

var Z = (function () {

	var zindex = {
			'base': {
				'index': null,
				'next': null,
				'children': null
			}
		};

	return {
		getZindex: function () {
			return zindex;
		},
		addZindex: function ( p ) {
			function addChild(next ) {
				var child = Math.random();

				zindex[p.z].children[child] = {
					'index': p.pz,
					'data': p,
					'next': next
				};

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
				};

				// Добавляем целевой приоритет в конец списка
				zindex[p.z].children.base.next = addChild(null);
			}

			// добавляем в индекс
			var currentPlain = zindex.base,
				previousPlain = zindex.base,
				stackIndex = 0,
				currentPriorityPlain,
				previousPriorityPlain;

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
							currentPriorityPlain = currentPlain.children.base;
							previousPriorityPlain = currentPlain.children.base;

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
										previousPriorityPlain.next = addChild(previousPriorityPlain.next);
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
					if (currentPlain.next === null) {

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

			Z.drawZindex(scene.playGround);
		},
		changeZindex: function ( p ) {
			// Оч. грубо — удалим приоритет из списка
			// плоскость можно не трогать — вдруг понадобится?

			// Затем измение значение плоскости в объекте
			var currentZindex = p.obj.z,
				currentPriorityZIndex = p.obj.priorityZindex,
				currentPriorityPlain = zindex[currentZindex].children.base;

			while (currentPriorityPlain.next !== zindex[currentZindex].children[currentPriorityZIndex]) {
				currentPriorityPlain = currentPriorityPlain.next;
			}
			currentPriorityPlain.next = currentPriorityPlain.next.next;

			delete zindex[currentZindex].children[currentPriorityZIndex];
			p.obj.z = p.z;

			Z.addZindex(p.obj);
		},
		drawZindex: function () {
			var currentPlain = zindex.base.next,
				currentPriorityPlain;

			// Оч. грубо — удалим все элементы и нарисуем из списка всё заново
			while (scene.playGround.children.length) {
				scene.playGround.removeChild(scene.playGround.children[0]);
			}

			while (currentPlain !== null) {
				currentPriorityPlain = currentPlain.children.base.next;

				while (currentPriorityPlain !== null) {
					scene.playGround.addChild( currentPriorityPlain.data.image );
					currentPriorityPlain = currentPriorityPlain.next;
				}

				currentPlain = currentPlain.next;
			}
		}
	};

}());