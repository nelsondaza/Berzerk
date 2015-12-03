$(function(){

	var $laberinto = $('.laberinto');

	var totalFilas = 24;
	var totalCols = totalFilas;
	var tam = 100 / totalCols;  // Porcentaje que ocupa cada fila o columna

	// Tipo de dato: Jugador
	var jugador = {
		// Última puerta que usó el jugador
		ultimaPuerta: 2,
		// Elemento HTML
		$el: null,
		choque: function( elem ) {
			var elemPos = {
				x: elem.css('left'),
				y: elem.css('top'),
				w: elem.css('width'),
				h: elem.css('height')
			};
			var playerPos = {
				x: player.css('left'),
				y: player.css('top'),
				w: player.css('width'),
				h: player.css('height')
			};

			return !!(
				elemPos.x >= playerPos.x - elemPos.w
				&& elemPos.x <= playerPos.x + playerPos.w
				&& elemPos.y >= playerPos.y - elemPos.h
				&& elemPos.y <= playerPos.y + playerPos.h
			);

		},
		direccion: 0,
		nIntervalo: 0,
		moverArriba: function( ) {
			this.direccion = 1;
			this.animar();
		},
		moverDerecha: function( ) {
			this.direccion = 2;
			this.animar();
		},
		moverAbajo: function( ) {
			this.direccion = 3;
			this.animar();
		},
		moverIzquierda: function( ) {
			this.direccion = 4;
			this.animar();
		},
		detener:function( ) {
			this.direccion = 0;
			clearTimeout( this.nIntervalo );
		},
		animar:function(){
			var self = this;

			clearTimeout( this.nIntervalo );
			if( this.direccion == 1 ) {
				this.$el.css({
					top: parseFloat( this.$el.css('top') ) - 1
				});
			}
			else if( this.direccion == 2 ) {
				this.$el.css({
					left: parseFloat( this.$el.css('left') ) + 1
				});
			}
			else if( this.direccion == 3 ) {
				this.$el.css({
					top: parseFloat( this.$el.css('top') ) + 1
				});
			}
			else if( this.direccion == 4 ) {
				this.$el.css({
					left: parseFloat( this.$el.css('left') ) - 1
				});
			}

			this.nIntervalo = setTimeout(function(){
				self.animar();
			},200)

		}
	};

	function crearLaberinto( ) {

		// 0: Vacio
		// 1: Pared
		// 2: Jugador
		// 3: Enemigo
		// 4: Enemigo Otto

		var laberinto = [ // Ejemplo
			[0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,0,0,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,2,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,3,0,0,0,0,0,0,0],
			[0,2,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]
		];

		var probabilidadMuro = 0.15;    // Probailidad de que un elemento interno sea muro
		var door = totalFilas / 5;  // Parte del muro que será puerta

		var doorCols = ( totalCols / 2 - door / 2 );    // Donde inicia la puerta en las columnas
		var doorFilas = ( totalFilas / 2 - door / 2 );  // Donde inicia la puerta en las filas

		$laberinto.empty();
		laberinto = [];

		for( var filas = 0; filas < totalFilas; filas ++ ) {
			laberinto.push([]);
			for( var cols = 0; cols < totalCols; cols ++ ) {

				laberinto[filas].push(0);

				if( cols == 0 || filas == 0 || cols == totalCols - 1 || filas == totalFilas - 1 ) {
					// El border externo no tiene muros
					laberinto[filas][cols] = 0;
				}
				else if( cols == 1 || filas == 1 || cols == totalCols - 2 || filas == totalFilas - 2 ) {
					// El muro que rodea y sus puertas
					var isDoor = ( filas >= doorFilas && filas <= doorFilas + door ) || ( cols >= doorCols && cols <= doorCols + door );
					laberinto[filas][cols] = ( isDoor ? 0 : 1 );
				}
				else if( cols > 2 && filas > 2 && cols < totalCols - 3 && filas < totalFilas - 3  ) {
					// El los elementos internos y su probabilidad de ser muro o no
					var prob = Math.random();
					if( prob <= probabilidadMuro ) {
						laberinto[filas][cols] = 1;
					}
				}

				var $celda = $('<div/>');
				$celda.addClass( ( laberinto[filas][cols] == 1 ? 'muro' : 'vacia' ) );
				$celda.addClass('c' + filas + '-' + cols);
				$celda.css({
					width: ( tam ) + '%',
					height: ( tam ) + '%',
					top: ( filas * tam ) + '%',
					left: ( cols * tam ) + '%'
				});

				$laberinto.append($celda);
			}
		}

		crearJugador();
	}

	crearLaberinto( );

	/**
	 * 1: superior
	 * 2: derecha
	 * 3: inferior
	 * 4: izquierda
	 * @type {number}
	 */

	function crearJugador() {
		jugador.$el = $('<img/>').prop('src','img/man.png').css({
			width:(tam / 2)+'%',
			height:'auto',
			position:'absolute'
		});
		if( jugador.ultimaPuerta == 3 ) {
			jugador.$el.css({
				left: (50 - tam / 2)+'%',
				top: (tam * 2)+'%'
			});
		}
		else if( jugador.ultimaPuerta == 4 ) {
			console.debug({
				left: (100 - tam * 2 - tam / 4)+'%',
				top: (50 - tam / 2)+'%'
			});
			jugador.$el.css({
				left: (100 - tam * 2 - tam / 4)+'%',
				top: (50 - tam / 2)+'%'
			});
		}
		else if( jugador.ultimaPuerta == 1 ) {
			jugador.$el.css({
				left: (50 - tam / 2 - tam / 4)+'%',
				top: (100 - tam * 2)+'%'
			});
		}
		else if( jugador.ultimaPuerta == 2 ) {
			jugador.$el.css({
				left: (tam * 2 - tam / 4)+'%',
				top: (50 - tam / 2)+'%'
			});
		}

		$laberinto.append(jugador.$el);
	}

	// Mover jugador
	$(document.body).keydown(function (e) {
		var keyCode = e.keyCode || e.which,
			arrow = {left: 37, up: 38, right: 39, down: 40 };

		switch (keyCode) {
			case arrow.left:
				jugador.moverIzquierda();
				break;
			case arrow.up:
				jugador.moverArriba();
				break;
			case arrow.right:
				jugador.moverDerecha();
				break;
			case arrow.down:
				jugador.moverAbajo();
				break;
		}
	});
	$(document.body).keyup(function (e) {
		var keyCode = e.keyCode || e.which,
			arrow = {left: 37, up: 38, right: 39, down: 40 };

		switch (keyCode) {
			case arrow.left:
			case arrow.up:
			case arrow.right:
			case arrow.down:
				jugador.detener();
				break;
		}
	});


	$('.controls .holder div.reset').click(function(){
		if( confirm("¿Confirma que quiere reiniciar el juego?") )
			crearLaberinto();
	});




});