const modeloProveedor = require('../modelos/Mproveedor');
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
    var estatus = url.parse(req.url,true).query.estatus;

    modeloProveedor.get_proveedor_estatus(estatus, (error, proveedores) => { // si se pudo obtener las proveedores
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las proveedores: ${error}`, tipo: 0});

            }else{
                var listar = [];
                listar[0] = [{fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'RIF', style: 'tableHeader' }, {fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Nombre', style: 'tableHeader' }, {fontSize:8,borderColor: ['#cdcfd1', '#cdcfd1', '#cdcfd1', '#cdcfd1'],text: 'Descripción', style: 'tableHeader' }];

                for(var i = 0; i < proveedores.length; i++){
                    listar[i+1] = [{fontSize:8,border: [false, false, false, false],text:proveedores[i].abreviatura+"-"+proveedores[i].rif},{fontSize:8,border: [false, false, false, false],text:proveedores[i].nombre},{fontSize:8,border: [false, false, false, false],text:proveedores[i].nota}]
                }
                var docDefinition = {
                    background: function (page) {
                        if (page !== 2) {
                            return [
                                {
                                    image: 'public/images/logo.png',
                                    width: 450,
                                    opacity: 0.13,
                                    margin: [70, 250]
                                }
                            ];
                        }
                    },
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
                                    text: 'Reporte Proveedores:', fontSize: 18, margin: [0, 30, 0, 10]
                                },
                                {
                                    text:'Fecha de impresión: '+fecha, fontSize: 10, margin: [0, 30, 0, 10],alignment:'right'
                                }
                            ]
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['auto', 120, 'auto'],
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
