fs = require('fs');
PDFDocument = require('pdfkit')
doc = new PDFDocument
doc.pipe(fs.createWriteStream('./file.pdf'))
doc.font('./app/fonts/ipam.ttf').fontSize(25).text("日本語テスト",100,200)
doc.addPage().fontSize(25).text("日本語テスト",100,100)
doc.end()
console.log("hoge")
