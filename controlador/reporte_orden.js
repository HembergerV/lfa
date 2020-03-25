const modeloVehiculo = require('../modelos/Mmodelo');
var url = require('url');
const Utilidad = require('../ayuda/utilidad');
var fecha = new Date();
var fecha = fecha.getDate()+"-"+fecha.getMonth()+1+"-"+fecha.getFullYear();

var fonts = {
	Roboto: {
		normal: 'reportes/fonts/arial.ttf',
		bold: 'reportes/fonts/ARIALNB.ttf',
		italics: 'reportes/fonts/ariali.ttf',
		bolditalics: 'reportes/fonts/arialbi.ttf'
	}
};
var PdfPrinter = require('../reportes/printer');
var printer = new PdfPrinter(fonts);

function reporte(req, res){
    var idorden = url.parse(req.url,true).query.idorden;
		modeloVehiculo.get_manoObra_orden(idorden,(error, manos) => { // si se pudo obtener las marcas
				if (error) { // si hubo error
						Utilidad.printError(res, {msg: `Error no se pudieron obtener las detalles: ${error}`, tipo: 0});

				}else{
    			modeloVehiculo.get_repuestos_orden(idorden,(error, detalles) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las detalles: ${error}`, tipo: 0});

            }else{
                var listar = [];
								var subtotal = 0;
								listar[0] = [{fontSize:8,borderColor: ['#000000', '#000000', '#000000', '#000000'],text: 'Descripción', style: 'tableHeader' }, {fontSize:8,borderColor: ['#000000', '#000000', '#000000', '#000000'],text: 'Cant.', style: 'tableHeader' },{fontSize:8,borderColor: ['#000000', '#000000', '#000000', '#000000'],text: 'Precio Unitario', style: 'tableHeader' },{fontSize:8,borderColor: ['#000000', '#000000', '#000000', '#000000'],text: 'Precio Neto', style: 'tableHeader' }];

                for(var i = 0; i < detalles.length; i++){
										subtotal += detalles[i].precio * detalles[i].cantidad;
                    listar[i+1] = [{fontSize:8,border: [true, true, true, true],text:detalles[i].descripcion},{fontSize:8,border: [true, true, true, true],text:detalles[i].cantidad},{fontSize:8,border: [true, true, true, true],text:formatNumber.new(detalles[i].precio)},{fontSize:8,border: [true, true, true, true],text:formatNumber.new(detalles[i].precio*detalles[i].cantidad)}]
                }

								listar.push([{fontSize:8,border: [true, true, true, true],text: ' '},{fontSize:8,border: [true, true, true, true],text: ' '},{fontSize:8,border: [true, true, true, true],text: ' '},{fontSize:8,border: [true, true, true, true],text: ' '}]);
								listar.push([{fontSize:8,border: [true, true, true, true],text: ' '},{fontSize:8,border: [true, true, true, true],text: ' '},{fontSize:8,border: [true, true, true, true],text: ' '},{fontSize:8,border: [true, true, true, true],text: ' '}]);
								var totalmanoobra = 0;
								for(var j = 0; j < manos.length; j++){
										totalmanoobra += manos[j].precio;
								}

								var iva = (subtotal * 1.16) - subtotal ;
								subtotal += totalmanoobra;

								var total = iva + subtotal;
								listar.push([{fillColor:'#717171',fontSize:8,border: [true, true, true, true],text: 'MANO DE OBRA POR CONCEPTO DE'},{fontSize:8,border: [true, true, true, true],text: '1'},{fontSize:8,border: [true, true, true, true],text: formatNumber.new(totalmanoobra)},{fontSize:8,border: [true, true, true, true],text:formatNumber.new(totalmanoobra)}]);

								for(var j = 0; j < manos.length; j++){
									listar.push([{fontSize:8,border: [true, true, true, true],text:manos[j].descripcion},{fontSize:8,border: [true, true, true, true],text:' '},{fontSize:8,border: [true, true, true, true],text:''},{fontSize:8,border: [true, true, true, true],text:''}]);
								}

								listar.push([{fillColor:'none',fontSize:10,border: [false, false, false, false],text: 'PRESUPUESTO VÁLIDO POR 5 DÍAS'},{fontSize:8,border: [true, true, true, true],text: 'Sub Total', alignment:'center', colSpan:2},{},{fontSize:9,border: [true, true, true, true],text: formatNumber.new(subtotal)}]);
								listar.push([{fillColor:'none',fontSize:8,border: [false, false, false, false],text: ' '},{fontSize:8,border: [true, true, true, true],text: 'IVA 16%', alignment:'center', colSpan:2},{},{fontSize:9,border: [true, true, true, true],text: formatNumber.new(iva)}]);
								listar.push([{fillColor:'none',fontSize:8,border: [false, false, false, false],text: ' '},{fontSize:8,border: [true, true, true, true],text: 'Total', alignment:'center', colSpan:2},{},{fontSize:9,border: [true, true, true, true],text:  formatNumber.new(total)}]);
                var docDefinition = {

                    content: [{
                            columns: [
                            {
                                image: 'public/images/enunciado.png',
                                width: 420,
																margin: [50, 0]

                            }

                            ]

                        },
                        {
                            columns:[
                            {
                                margin: [0, 0, 0, 15],
                                text: [ { text:'\nPresupuesto', fontSize: 16, margin: [0, 0, 0, 10],alignment:'center',bolditalics:true}]
                            }
                            ]
                        },
												{
                            columns:[
                            {
                                margin: [0, 0, 0, 0],
                                text:'Cliente: '+detalles[0].nombre_cliente, fontSize: 10,alignment:'left',
																bolditalics:true
                            },
														{
                                margin: [0, 0, 0, 0],
                                text:'Teléfono: '+detalles[0].telefono, fontSize: 10,alignment:'right',
																bolditalics:true
                            }
                            ]
                        },
												{
                            columns:[

                            {
                                margin: [0, 0, 0, 10],
                                text:'Marca: '+detalles[0].marca, fontSize: 10,alignment:'left',
																bolditalics:true,
																width: 80
                            },
														{
                                margin: [0, 0, 0, 10],
                                text:'Modelo: '+detalles[0].modelo, fontSize: 10,
																bolditalics:true,
																width: 220

                            },
														{
                                margin: [0, 0, 0, 10],
                                text:'Año: '+detalles[0].anio, fontSize: 10,
																bolditalics:true,
																width: 60

                            },
														{
                                margin: [0, 0, 0, 10],
                                text:'Color: '+detalles[0].color, fontSize: 10,
																bolditalics:true,
																width: 80

                            },
														{
                                margin: [0, 0, 0, 10],
                                text:'Placa: '+detalles[0].placa, fontSize: 10,alignment:'right',
																bolditalics:true,
																width: 80

                            }
													],

                        },


                        {
                            style: 'tableExample',
                            table: {
                                widths: ['*',30, 55,55],
                                headerRows: 1,
                                body: listar,

                            },
                            layout:{
                                fillColor: function (rowIndex, node, columnIndex) {
                                    return (rowIndex % 2 === 0) ? '#ffffff' :'#ffffff';
                                },
                                hLineWidth: function (i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 1 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                                },
                                hLineColor: function (i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                                },
                                vLineColor: function (i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                                }
                            }

                        },
                    ],
                    styles: 'tableExample',
                    defaultStyle: {
                        alignment: 'justify'
                    }}

                    var pdfDoc = printer.createPdfKitDocument(docDefinition);
                      // Stream contents to a file
                     pdfDoc.pipe(res).on('finish', function () {
                        console.log('Archivo creado satisfactoriamente ....');
                     });


                    pdfDoc.end()
            }
        })
			}
})

}

var formatNumber = {
    separador: ".", // separador para los miles
    sepDecimal: ',', // separador para los decimales
    formatear:function (num){
        num +='';

        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
            return this.simbol + splitLeft +splitRight;
    },
    new:function(num, simbol){
    this.simbol = simbol ||'';
        return this.formatear(num.toFixed(2));
    }
}


module.exports = {
    reporte
}
