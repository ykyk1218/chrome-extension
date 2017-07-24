const pdfmake = require('pdfmake/build/pdfmake.js');
const vfs_fonts = require('pdfmake/build/vfs_fonts.js');
pdfmake.vfs = vfs_fonts.pdfMake.vfs;

pdfmake.fonts = {
  Roboto: {
    normal: "ipam.ttf",
    bold: "ipam.ttf",
    italics: "ipam.ttf",
    bolditalics: "ipam.ttf"
  }
}
const docDefinition = { 
  content: '日本語テスト',
  defaultStyle: {
    font: 'Roboto'
  }
};
pdfmake.createPdf(docDefinition).download();
