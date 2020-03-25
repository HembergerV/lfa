const modeloLista = require('../modelos/Mlista');
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
    var idlinea = url.parse(req.url,true).query.idlista;

    modeloLista.get_repuestos_lista(idlinea, (error, detalles) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las detalles: ${error}`, tipo: 0});

            }else{
                var listar = [];
								var subtotal = 0;

                listar[0] = [{fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Referencia', style: 'tableHeader' }, {fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Descripción', style: 'tableHeader' }, {fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Cant.', style: 'tableHeader' },{fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Precio Unitario', style: 'tableHeader' },{fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Precio Neto', style: 'tableHeader' }];

                for(var i = 0; i < detalles.length; i++){
										subtotal += detalles[i].precio * detalles[i].cantidad;
                    listar[i+1] = [{fontSize:8,border: [false, false, false, false],text:detalles[i].referencia},{fontSize:8,border: [false, false, false, false],text:detalles[i].descripcion},{fontSize:8,border: [false, false, false, false],text:detalles[i].cantidad},{fontSize:8,border: [false, false, false, false],text:formatNumber.new(detalles[i].precio)},{fontSize:8,border: [false, false, false, false],text:formatNumber.new(detalles[i].precio*detalles[i].cantidad)}]
                }
                var docDefinition = {
                    // background: function (page) {
                    //     if (page !== 2) {
                    //         return [
                    //             {
                    //                 image: 'public/images/logo.png',
                    //                 width: 450,
                    //                 opacity: 0.13,
                    //                 margin: [70, 250]
                    //             }
                    //         ];
                    //     }
                    // },
                    content: [{
                            columns: [
														{
																image: 'public/images/logo.png',
																width: 120,
														},
                            {
                                width: 400,
                                fontSize: 7,
                                margin: [120, 0, 0, 0],
                                text:[ { text: 'Dirección Fiscal ', fontSize: 8, bold: true }, '\nCALLE 28 ENTRE AV. 45 Y 46, EDIF. MIS TRES HIJOS, PISO PB, LOCAL 1,SECTOR BELLA VISTA II, ACARIGUA, PORTUGUESA, ZONA POSTAL 3301 \nCorreo Electrónico: ', { text: 'lafordautomotriz@gmail.com', fontSize: 8, bold: true }, '\nTelf.: (0255) 6235845; (0414) 3737824'
                                ],
                                alignment: 'right'
                            }

                            ]

                        },
                        {
                            columns:[
                            {
                                margin: [0, 20, 0, 15],
                                text: [ { text:'Nombre: ', fontSize: 10, margin: [0, 30, 0, 10],alignment:'left'},{ text:detalles[0].nombre, fontSize: 9, margin: [0, 30, 0, 10],alignment:'left'},{ text:'\nDescripción: ', fontSize: 10, margin: [0, 30, 0, 10],alignment:'left'},{ text:detalles[0].descripcion_lista, fontSize: 9, margin: [0, 30, 0, 10],alignment:'left'}]
                            },
                            {
                                margin: [0, 20, 0, 10],
                                text:'Fecha de impresión: '+fecha, fontSize: 10,alignment:'right'
                            }
                            ]
                        },



                        {
                            style: 'tableExample',
                            table: {
                                widths: ['auto', '*',30, 55,55],
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
												{
													absolutePosition: {x: 40, y: 600},

													columns:[
													{
														style: 'tableExample',
														alignment: "left",

														table: {
															widths: [76, 76, 76],

															body: [
																[

																	{
																		colSpan: 3,
																		fontSize: 8,
																		margin: [0, 5, 0, 15],
																		border: [false, false, false, false],
																		borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],
																		fillColor: '#ffffff',
																		text: 'NOTAS U OBSERVACIONES:\n\n\n\n\n'
																	},
																	'',
																	''
																]
															]
														},
														layout: {
															defaultBorder: false,
														}
													},
													{
														style: 'tableExample',
														alignment: "right",

														table: {
															widths: [76, 76, 76],
															body: [
																[

																	{
																		width: '*',
																		colSpan: 3,
																		fontSize: 8,
																		alignment: "left",

																		border: [true, true, true, true],
																		borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],
																		fillColor: '#ffffff',
																		columns:[
				                            {
				                                margin: [0, 5, 0, 15],
				                                text: [ { text:'SUB TOTAL: ', fontSize: 8, margin: [0, 0, 0, 10],alignment:'left'},{ text:'\nDESCUENTO 0%: ', fontSize: 8, margin: [0, 30, 0, 10],alignment:'left'},{ text:'\nMONTO NETO: ', fontSize: 8, margin: [0, 30, 0, 10],alignment:'left'}]
				                            },
				                            {
				                                margin: [0, 5, 0, 10],
				                                text: [ {text:formatNumber.new(subtotal), fontSize: 8,alignment:'right'},{text:'\n0,00', fontSize: 8,alignment:'right'},{text:'\n'+formatNumber.new(subtotal), fontSize: 8,alignment:'right'}]
				                            }
				                            ]
																	},

																]
															],

														},
														layout: {
															defaultBorder: false,
														}
													}
													]

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
