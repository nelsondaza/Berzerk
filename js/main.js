$(function(){

	function crearLaberinto( ) {

		// 0: Vacio
		// 1: Pared
		// 2: Enemigo
		// 3: Enemigo Otto

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

		var totalFilas = 24;
		var totalCols = totalFilas;
		var tam = 100 / totalCols;  // Porcentaje que ocupa cada fila o columna
		var probabilidadMuro = 0.15;    // Probailidad de que un elemento interno sea muro
		var door = totalFilas / 5;  // Parte del muro que será puerta

		var doorCols = ( totalCols / 2 - door / 2 );    // Donde inicia la puerta en las columnas
		var doorFilas = ( totalFilas / 2 - door / 2 );  // Donde inicia la puerta en las filas


		var $laberinto = $('.laberinto');
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

	}

	crearLaberinto( );
	$('.controls .holder div.reset').click(function(){
		crearLaberinto();
	});

});