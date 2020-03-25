const modeloVehiculo = require('../modelos/Mmodelo');
var url = require('url');
const Utilidad = require('../ayuda/utilidad');
var fecha = new Date();
var fecha = fecha.getDate()+"-0"+(fecha.getMonth()+1)+"-"+fecha.getFullYear();

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
		var fechadesde = url.parse(req.url,true).query.fechadesde;
		var fechahasta = url.parse(req.url,true).query.fechahasta;
		fechadesde = new Date(fechadesde);
		fechahasta = new Date(fechahasta);
		fechadesde = fechadesde.getFullYear()+"-"+fechadesde.getDate()+"-"+(fechadesde.getMonth()+1);
		fechahasta = fechahasta.getFullYear()+"-"+fechahasta.getDate()+"-"+(fechahasta.getMonth()+2);

    modeloVehiculo.get_vehiculo_recibido(fechadesde, fechahasta, (error, vehiculos) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los vehiculos: ${error}`, tipo: 0});

            }else{

                var listar = [];
                listar[0] = [{fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Placa', style: 'tableHeader' }, {fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Cliente', style: 'tableHeader' }, {fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Vehículo', style: 'tableHeader' },{fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Teléfono', style: 'tableHeader' },{fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Fecha recepción', style: 'tableHeader' }];

                for(var i = 0; i < vehiculos.length; i++){
										vehiculos[i].fecha = new Date(vehiculos[i].fecha)
                    listar[i+1] = [{fontSize:8,border: [false, false, false, false],text:vehiculos[i].placa},{fontSize:8,border: [false, false, false, false],text:vehiculos[i].nombre},{fontSize:8,border: [false, false, false, false],text:vehiculos[i].modelo+" "+vehiculos[i].color+" "+vehiculos[i].anio},{fontSize:8,border: [false, false, false, false],text:vehiculos[i].telefono},{alignment:"right",fontSize:8,border: [false, false, false, false],text:vehiculos[i].fecha.getDate()+"-0"+(vehiculos[i].fecha.getMonth()+1)+"-"+vehiculos[i].fecha.getFullYear()}]
                }
                var docDefinition = {
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
                                    text: 'Reporte vehículos recibidos:', fontSize: 18, margin: [0, 30, 0, 10]
                                },
                                {
                                    text:'Fecha de impresión: 0'+fecha, fontSize: 10, margin: [0, 30, 0, 10],alignment:'right'
                                }
                            ]
                        },
												{
														columns:[
																{
																		text: 'Fecha desde: '+url.parse(req.url,true).query.fechadesde, fontSize: 10, margin: [0, 1, 0, 10]
																},
																{
																		text:'Fecha hasta: '+url.parse(req.url,true).query.fechahasta, fontSize: 10, margin: [0, 1, 0, 10],alignment:'right'
																}
														]
												},
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['auto', 'auto', '*', 'auto','auto'],
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
                            }


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
module.exports = {
    reporte
}
