(function() {

  const pdfmake = require('pdfmake/build/pdfmake.js');
  const vfs_fonts = require('pdfmake/build/vfs_fonts.js');
  pdfmake.vfs = vfs_fonts.pdfMake.vfs;
  
  pdfmake.fonts = {
    ipam: {
      normal: "ipam.ttf",
      bold: "ipam.ttf",
      italics: "ipam.ttf",
      bolditalics: "ipam.ttf"
    }
  }

  console.log("HogeHoge")
  if(document.getElementsByClassName("is-slide")) {
    //ページがslideモードの場合
    console.log("スライドモード")
    const slideTitle = document.getElementsByClassName("ArticleMainHeader__title")[0].textContent
    console.log("スライドタイトル:" + slideTitle)

    const slideSection = document.getElementById("item-13a253a081d329d23292")
    const slideSectionChildren = slideSection.childNodes
    const content = []
    slideSectionChildren.forEach((v, k, listObj)=>{
      if(v.tagName == "H2") {
        content.push({text: v.textContent, fontSize: 25, margin: [0,0,0,10]})

      }else if(v.tagName == "P"){
        v.childNodes.forEach((p_v, p_k)=>{
          if(p_v.tagName == "A") {
          	if(p_v.children.length > 0 && p_v.children[0].tagName == "IMG") {
              //imgタグ
              const img = p_v.children[0]
              console.log(img.src)
              var req = new XMLHttpRequest();
              req.open('POST', 'https://hxgddvr96i.execute-api.ap-northeast-1.amazonaws.com/prod/encodeImage', false);
              req.setRequestHeader('content-type','application/json')
              req.send(JSON.stringify({url: img.src}))
              if(req.status == 200) {
                console.log(req.responseText)
                content.push({image: req.responseText})
                //content.push({image: ""})
              }
						}else{
							//url
						}
          } 
				})
        content.push({text: v.textContent, fontSize: 16, margin: [0,5]})

      }else if(v.tagName == "HR"){
        content.push({text: "", pageBreak: 'before'})
      }else if (v.tagName == "IMG"){
        console.log("imgタグ")
      }
    })
    const docDefinition = { 
      content: content,
      defaultStyle: {
        font: 'ipam'
      }
    };
    pdfmake.createPdf(docDefinition).download();
    //const slides = document.querySelector("section>hr")
  }

  function imageToBase64(img, mime_type) {
      // New Canvas
      var canvas = document.createElement('canvas');
     	console.log(canvas)
      canvas.width  = img.width;
      canvas.height = img.height;
      // Draw Image
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // To Base64
      return canvas.toDataURL(mime_type);
  }
  

}())
